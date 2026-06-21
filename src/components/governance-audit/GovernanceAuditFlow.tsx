'use client';

import { useState } from 'react';
import { GovernanceAuditForm } from './GovernanceAuditForm';
import { GovernanceAuditResults } from './GovernanceAuditResults';
import { CalendlyBooking } from './CalendlyBooking';
import { generateGovernanceAuditPDF } from '@/lib/governance-audit-pdf';
import { type GovernanceQuizResponse, type Answer } from '@/lib/governance-audit';

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export function GovernanceAuditFlow({ initialEmail }: { initialEmail?: string } = {}) {
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GovernanceQuizResponse | null>(null);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  // Score (server-side) and reveal the full report
  const submitToApi = async (finalAnswers: Answer[], emailToUse: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/governance-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse.trim(), answers: finalAnswers }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setError(
            "You've already completed this assessment. Check your email for your report."
          );
          return;
        }
        throw new Error('Failed to generate your report. Please try again.');
      }

      const result = (await response.json()) as GovernanceQuizResponse;
      setResults(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Quiz finished — score and show results immediately, no email wall.
  // The detailed gap analysis / PDF report stays gated inside GovernanceAuditResults.
  const handleQuizComplete = (finalAnswers: Answer[]) => {
    setAnswers(finalAnswers);
    setError('');
    submitToApi(finalAnswers, initialEmail ?? '');
  };

  const handleDownloadReport = async () => {
    if (!results) return;
    // ResultsGate captures the email into localStorage once unlocked — pick it up
    // here so the PDF/send-email still reach the person who unlocked the results.
    const unlockedEmail =
      (typeof window !== 'undefined' && window.localStorage.getItem('rfap_tool_lead_governance-audit')) || results.email;
    const reportData = { ...results, email: unlockedEmail };
    try {
      setIsDownloading(true);
      const pdfBytes = await generateGovernanceAuditPDF(reportData);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `governance-assessment-${unlockedEmail || 'report'}-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      if (unlockedEmail) {
        try {
          await fetch('/api/governance-audit/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response: reportData }),
          });
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
        }
      }
    } catch (err) {
      console.error('Failed to download report:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleScheduleCall = () => setShowCalendly(true);
  const handleExploreFeatures = () => {
    window.location.href = '/pricing';
  };

  // ── Results — score shown immediately; detailed gaps + PDF gated below ─────
  if (results) {
    return (
      <>
        <GovernanceAuditResults
          response={results}
          onDownloadReport={handleDownloadReport}
          onScheduleCall={handleScheduleCall}
          onExploreFeatures={handleExploreFeatures}
        />
        {showCalendly && (
          <CalendlyBooking
            email={results.email}
            onSuccess={() => setShowCalendly(false)}
          />
        )}
      </>
    );
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <p style={{ ...syne, fontSize: '0.95rem', color: 'rgba(244,241,234,0.6)' }}>Scoring your assessment…</p>
      </div>
    );
  }

  // ── Quiz (no upfront email) ────────────────────────────────────────────────
  return (
    <>
      <GovernanceAuditForm onComplete={handleQuizComplete} />
      {error && (
        <p style={{ ...syne, fontSize: '13px', color: '#ff6b6b', textAlign: 'center', marginTop: '1rem' }}>{error}</p>
      )}
    </>
  );
}
