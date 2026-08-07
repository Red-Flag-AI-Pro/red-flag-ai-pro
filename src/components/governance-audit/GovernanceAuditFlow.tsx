'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { track } from '@vercel/analytics';
import { type GovernanceQuizResponse, type Answer } from '@/lib/governance-audit';

// The form is the reason anyone lands on this page, so it is imported
// directly and server rendered. It was previously behind dynamic({ssr:false}),
// which meant the primary content could not paint until the browser had
// downloaded the bundle, hydrated, and then fetched a second chunk. Server
// response was 0.23s and first paint was 3.22s, and that waterfall was the
// gap. It uses no browser only APIs, so there is nothing to defer.
import { GovernanceAuditForm } from './GovernanceAuditForm';

// Results genuinely can stay deferred. Nobody sees them until after the form
// is submitted, so keeping that chunk out of the initial download is free.
const GovernanceAuditResults = dynamic(
  () => import('./GovernanceAuditResults').then((m) => m.GovernanceAuditResults),
  { ssr: false }
);
const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function GovernanceAuditFlow() {
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GovernanceQuizResponse | null>(null);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const [captureEmailInput, setCaptureEmailInput] = useState('');
  const [captureError, setCaptureError] = useState('');
  const [captureSubmitting, setCaptureSubmitting] = useState(false);
  const [captureDone, setCaptureDone] = useState(false);

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
            "You've already completed this assessment with this email. Your results were shown on screen at the time. If you want a fresh run or a deeper look, email support@redflagaipro.com."
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
        emailGiven: Boolean(emailToUse.trim()),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // First completion — free, no email required. See the score immediately.
  const handleQuizComplete = (finalAnswers: Answer[]) => {
    setAnswers(finalAnswers);
    setError('');
    submitToApi(finalAnswers, '');
  };

  // Optional, after the score is already visible — not a gate, an offer.
  const handleCaptureEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(captureEmailInput.trim())) {
      setCaptureError('Please enter a valid email address.');
      return;
    }
    if (!answers) return;
    setCaptureError('');
    setCaptureSubmitting(true);
    try {
      const response = await fetch('/api/governance-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: captureEmailInput.trim(), answers }),
      });
      if (!response.ok) {
        if (response.status === 409) {
          setCaptureError('That email has already claimed a free assessment.');
        } else {
          setCaptureError('Something went wrong sending that. Try again in a moment.');
        }
        return;
      }
      const result = (await response.json()) as GovernanceQuizResponse;
      setResults(result);
      setCaptureDone(true);
    } catch {
      setCaptureError('Something went wrong sending that. Try again in a moment.');
    } finally {
      setCaptureSubmitting(false);
    }
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

  // Calendly retired (zero bookings, trial ending). The consultation path now
  // converges on the founder-reply request form on /sentinel.
  const handleScheduleCall = () => {
    window.location.href = '/sentinel#request';
  };
  const handleExploreFeatures = () => {
    window.location.href = '/pricing';
  };
  const handleUnlock = () => {
    window.location.href = '/signup?plan=enterprise&track=governance';
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <p style={{ ...syne, fontSize: '0.95rem', color: 'rgba(244,241,234,0.6)' }}>Scoring your assessment…</p>
      </div>
    );
  }

  // ── Results (shown free, no email was needed to get here) ──────────────────
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
        {!results.email && (
          <div className="max-w-lg mx-auto" style={{ marginTop: '2rem' }}>
            <div style={{
              background: 'var(--navy-raised, #102943)',
              border: '1px solid rgba(229,72,77,0.2)',
              borderRadius: '12px',
              padding: '2rem',
            }}>
              {captureDone ? (
                <p style={{ ...syne, fontSize: '0.9rem', color: 'rgba(244,241,234,0.75)', textAlign: 'center' }}>
                  Sent. Check your inbox for a copy of this result.
                </p>
              ) : (
                <>
                  <p style={{ ...syne, fontSize: '0.9rem', fontWeight: 700, color: '#F4F1EA', marginBottom: '0.5rem' }}>
                    Want this emailed to you?
                  </p>
                  <p style={{ ...syne, fontSize: '0.85rem', color: 'rgba(244,241,234,0.5)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    Not required, your score above is already yours. Leave an email and we&apos;ll send a copy, plus occasional relevant updates. Unsubscribe anytime.
                  </p>
                  <form onSubmit={handleCaptureEmail} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                      type="email"
                      value={captureEmailInput}
                      onChange={(e) => { setCaptureEmailInput(e.target.value); setCaptureError(''); }}
                      placeholder="you@company.com"
                      style={{
                        flex: '1 1 200px', boxSizing: 'border-box',
                        background: '#0A1628', border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: '6px', color: '#F4F1EA', ...syne, fontSize: '14px',
                        padding: '12px 14px', outline: 'none',
                      }}
                    />
                    <button type="submit" disabled={captureSubmitting} className="btn-primary" style={{ padding: '12px 22px', fontSize: '0.85rem' }}>
                      {captureSubmitting ? 'Sending…' : 'Email it to me'}
                    </button>
                  </form>
                  {captureError && (
                    <p style={{ ...syne, fontSize: '12px', color: '#ff6b6b', marginTop: '0.75rem' }}>{captureError}</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // ── Quiz, open immediately, no email required to start ──────────────────────
  return (
    <>
      <GovernanceAuditForm onComplete={handleQuizComplete} />
      {error && (
        <p style={{ ...syne, fontSize: '13px', color: '#ff6b6b', textAlign: 'center', marginTop: '1rem' }}>{error}</p>
      )}
    </>
  );
}
