'use client';

import { useState } from 'react';
import { GovernanceAuditForm } from './GovernanceAuditForm';
import { GovernanceAuditResults } from './GovernanceAuditResults';
import { CalendlyBooking } from './CalendlyBooking';
import { generateGovernanceAuditPDF } from '@/lib/governance-audit-pdf';
import { type GovernanceQuizResponse, type Answer } from '@/lib/governance-audit';

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

// What entering an email unlocks — framed as the deliverable, not a "signup".
const UNLOCK_ITEMS = [
  'Your Governance Maturity Index — your score across all 6 dimensions',
  'Your 3–5 most critical gaps, mapped to EU AI Act, DORA, SEC & Munir',
  'A prioritised 90-day → 12-month remediation roadmap',
  'Peer benchmarking against your industry',
  'A board-ready PDF you can take straight to your next meeting',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function GovernanceAuditFlow({ initialEmail }: { initialEmail?: string } = {}) {
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [email, setEmail] = useState(initialEmail ?? '');
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

  // Quiz finished — if email was already captured upstream, score immediately;
  // otherwise show the unlock gate (email AFTER effort).
  const handleQuizComplete = (finalAnswers: Answer[]) => {
    setAnswers(finalAnswers);
    setError('');
    if (initialEmail && EMAIL_REGEX.test(initialEmail.trim())) {
      submitToApi(finalAnswers, initialEmail);
    }
  };

  // Email submitted at the gate
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid work email address.');
      return;
    }
    if (!answers) return;
    await submitToApi(answers, email);
  };

  const handleDownloadReport = async () => {
    if (!results) return;
    try {
      setIsDownloading(true);
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

  // ── Full results ──────────────────────────────────────────────────────────
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

  // ── Unlock gate (shown AFTER the quiz is complete) ─────────────────────────
  if (answers) {
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
              Assessment complete
            </p>
          </div>

          <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 500, color: '#F4F1EA', lineHeight: 1.15, marginBottom: '0.85rem' }}>
            Your Governance Maturity Index is ready.
          </h2>
          <p style={{ ...syne, fontSize: '0.95rem', color: 'rgba(244,241,234,0.6)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Enter your work email to reveal your results and receive your board-ready PDF.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem' }}>
            {UNLOCK_ITEMS.map((item) => (
              <li key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '0.7rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M20 6L9 17l-5-5" stroke="#C9A66B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ ...syne, fontSize: '0.9rem', color: 'rgba(244,241,234,0.75)', lineHeight: 1.5 }}>{item}</span>
              </li>
            ))}
          </ul>

          <form onSubmit={handleUnlock}>
            <label htmlFor="unlock-email" style={{ ...syne, display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(244,241,234,0.6)', marginBottom: '8px' }}>
              Work email
            </label>
            <input
              id="unlock-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@company.com"
              disabled={isLoading}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#0A1628', border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '6px', color: '#F4F1EA', ...syne, fontSize: '14px',
                padding: '12px 14px', marginBottom: '1rem', outline: 'none',
              }}
            />
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '14px' }}>
              {isLoading ? 'Generating your report…' : <>Reveal my results <span className="arrow">→</span></>}
            </button>
          </form>

          {error && (
            <p style={{ ...syne, fontSize: '12px', color: '#ff6b6b', marginTop: '0.85rem' }}>{error}</p>
          )}

          <p style={{ ...syne, fontSize: '11px', color: 'rgba(244,241,234,0.4)', marginTop: '1rem', lineHeight: 1.5 }}>
            Your data is never stored for marketing or sold. One assessment per email.
          </p>
        </div>
      </div>
    );
  }

  // ── Quiz (no upfront email) ────────────────────────────────────────────────
  return <GovernanceAuditForm onComplete={handleQuizComplete} />;
}
