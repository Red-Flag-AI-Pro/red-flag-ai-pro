'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { track } from '@vercel/analytics';
import { type GovernanceQuizResponse, type Answer } from '@/lib/governance-audit';

const GovernanceAuditForm = dynamic(
  () => import('./GovernanceAuditForm').then((m) => m.GovernanceAuditForm),
  { ssr: false }
);
const GovernanceAuditResults = dynamic(
  () => import('./GovernanceAuditResults').then((m) => m.GovernanceAuditResults),
  { ssr: false }
);
const CalendlyBooking = dynamic(
  () => import('./CalendlyBooking').then((m) => m.CalendlyBooking),
  { ssr: false }
);

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const START_ITEMS = [
  'Your Governance Maturity Index, scored across all 6 dimensions',
  'Your 3 to 5 most critical gaps, mapped to EU AI Act, DORA, SEC & Munir',
  'A prioritised 90 day to 12 month remediation roadmap',
  'A board ready PDF you can take straight to your next meeting',
];

export function GovernanceAuditFlow({ initialEmail }: { initialEmail?: string } = {}) {
  const [capturedEmail, setCapturedEmail] = useState(initialEmail ?? '');
  const [startEmailInput, setStartEmailInput] = useState('');
  const [startError, setStartError] = useState('');
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GovernanceQuizResponse | null>(null);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

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
      track('governance_quiz_completed', {
        score: result.overallScore,
        riskLevel: result.riskLevel,
        fullAccess: result.fullAccess,
        managed: result.managed,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(startEmailInput.trim())) {
      setStartError('Please enter a valid work email address.');
      return;
    }
    setStartError('');
    setCapturedEmail(startEmailInput.trim());
  };

  const handleQuizComplete = (finalAnswers: Answer[]) => {
    setAnswers(finalAnswers);
    setError('');
    submitToApi(finalAnswers, capturedEmail);
  };

  const handleDownloadReport = async () => {
    if (!results || !results.fullAccess) return;
    try {
      setIsDownloading(true);
      const { generateGovernanceAuditPDF } = await import('@/lib/governance-audit-pdf');
      const pdfBytes = await generateGovernanceAuditPDF(results);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `governance-assessment-${results.email}-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      try {
        await fetch('/api/governance-audit/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ response: results }),
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
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
  const handleUnlock = () => {
    window.location.href = '/pricing';
  };

  // ── Full results (email was already captured before the quiz started) ─────
  if (results) {
    return (
      <>
        <GovernanceAuditResults
          response={results}
          onDownloadReport={handleDownloadReport}
          onScheduleCall={handleScheduleCall}
          onExploreFeatures={handleExploreFeatures}
          onUnlock={handleUnlock}
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

  // ── Quiz (only once an email has been captured) ────────────────────────────
  if (capturedEmail) {
    return (
      <>
        <GovernanceAuditForm onComplete={handleQuizComplete} />
        {error && (
          <p style={{ ...syne, fontSize: '13px', color: '#ff6b6b', textAlign: 'center', marginTop: '1rem' }}>{error}</p>
        )}
      </>
    );
  }

  // ── Email gate (shown BEFORE the quiz starts) ───────────────────────────────
  return (
    <div className="max-w-lg mx-auto">
      <div
        style={{
          background: 'var(--navy-raised, #102943)',
          border: '1px solid rgba(229,72,77,0.25)',
          borderRadius: '12px',
          padding: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <span style={{ width: '28px', height: '2px', background: '#E5484D' }} />
          <p style={{ ...syne, fontSize: '11px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.6)' }}>
            Start your assessment
          </p>
        </div>

        <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 500, color: '#F4F1EA', lineHeight: 1.15, marginBottom: '0.85rem' }}>
          Enter your work email to begin.
        </h2>
        <p style={{ ...syne, fontSize: '0.95rem', color: 'rgba(244,241,234,0.6)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Takes 5 minutes. You&apos;ll get:
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem' }}>
          {START_ITEMS.map((item) => (
            <li key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '0.7rem' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M20 6L9 17l-5-5" stroke="#C9A66B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ ...syne, fontSize: '0.9rem', color: 'rgba(244,241,234,0.75)', lineHeight: 1.5 }}>{item}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={handleStartSubmit}>
          <label htmlFor="start-email" style={{ ...syne, display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(244,241,234,0.6)', marginBottom: '8px' }}>
            Work email
          </label>
          <input
            id="start-email"
            type="email"
            value={startEmailInput}
            onChange={(e) => { setStartEmailInput(e.target.value); setStartError(''); }}
            placeholder="you@company.com"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#0A1628', border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '6px', color: '#F4F1EA', ...syne, fontSize: '14px',
              padding: '12px 14px', marginBottom: '1rem', outline: 'none',
            }}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '14px' }}>
            Start assessment <span className="arrow">→</span>
          </button>
        </form>

        {startError && (
          <p style={{ ...syne, fontSize: '12px', color: '#ff6b6b', marginTop: '0.85rem' }}>{startError}</p>
        )}

        <p style={{ ...syne, fontSize: '11px', color: 'rgba(244,241,234,0.4)', marginTop: '1rem', lineHeight: 1.5 }}>
          Your data is never stored for marketing or sold. One assessment per email.
        </p>
      </div>
    </div>
  );
}
