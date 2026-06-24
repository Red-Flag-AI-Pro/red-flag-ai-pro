'use client';

import { useState } from 'react';
import Link from 'next/link';

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

// Three questions a CFO/CCO cannot comfortably answer — designed to make the
// governance gap *felt* in seconds. This is the site's interactive talking point.
const QUESTIONS = [
  'If a regulator asked today, could you show who signed off on each AI tool you use?',
  'Can you produce a timestamped record of your last AI governance review?',
  'Do you know every AI tool your team is putting company data into right now?',
];

const VERDICTS = [
  { label: 'Critically exposed', color: '#E5484D', note: "On paper you have a policy. In practice, you can't prove governance happened. That's the liability." },
  { label: 'Exposed', color: '#E5484D', note: 'Most of your governance is undocumented. When the question comes, "we have a policy" is not an answer.' },
  { label: 'Partially defensible', color: '#C9A66B', note: 'Better than most, but the gaps are exactly where regulators and liability live.' },
  { label: 'Confident?', color: '#C9A66B', note: "Then prove it across all 30 checks, not 3. Most teams who feel ready score lower than they expect." },
];

export function ProveItWidget() {
  const [answers, setAnswers] = useState<(boolean | null)[]>([null, null, null]);

  const set = (i: number, val: boolean) =>
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? val : a)));

  const answeredCount = answers.filter((a) => a !== null).length;
  const yesCount = answers.filter((a) => a === true).length;
  const allAnswered = answeredCount === 3;
  const fillPct = allAnswered ? (yesCount / 3) * 100 : (answeredCount / 3) * 18;
  const verdict = VERDICTS[yesCount];
  const meterColor = allAnswered ? verdict.color : 'rgba(229,72,77,0.6)';

  return (
    <section style={{ padding: '6rem 1.5rem', background: '#0A1628', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <span style={{ width: '24px', height: '1px', background: 'rgba(229,72,77,0.6)' }} />
          <p style={{ ...syne, fontSize: '11px', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.55)' }}>The Compliance Assessment</p>
          <span style={{ width: '24px', height: '1px', background: 'rgba(229,72,77,0.6)' }} />
        </div>

        <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, color: '#F4F1EA', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '0.85rem' }}>
          Can you <span style={{ fontStyle: 'italic', color: '#E5484D' }}>prove it?</span>
        </h2>
        <p style={{ ...syne, fontSize: '0.98rem', color: 'rgba(244,241,234,0.6)', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          Three questions every regulator now asks. Answer honestly, watch your exposure.
        </p>

        {/* Exposure meter */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div
              className="prove-meter-fill"
              style={{
                position: 'absolute', inset: 0, transformOrigin: 'left',
                transform: `scaleX(${fillPct / 100})`,
                background: meterColor,
                transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), background-color 0.4s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ ...mono, fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(244,241,234,0.4)' }}>EXPOSED</span>
            <span style={{ ...mono, fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(244,241,234,0.4)' }}>DEFENSIBLE</span>
          </div>
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '2rem' }}>
          {QUESTIONS.map((q, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
              background: 'var(--navy-raised, #102943)',
              border: `1px solid ${answers[i] === false ? 'rgba(229,72,77,0.4)' : answers[i] === true ? 'rgba(201,166,107,0.4)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: '8px', padding: '1rem 1.25rem', transition: 'border-color 0.3s ease',
            }}>
              <p style={{ ...syne, fontSize: '0.92rem', color: 'rgba(244,241,234,0.85)', lineHeight: 1.45, flex: 1 }}>
                <span className="font-mono-fig" style={{ color: 'rgba(229,72,77,0.7)', marginRight: '10px', fontSize: '0.8rem' }}>{String(i + 1).padStart(2, '0')}</span>
                {q}
              </p>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {([['Yes', true], ['No', false]] as const).map(([label, val]) => {
                  const active = answers[i] === val;
                  return (
                    <button
                      key={label}
                      onClick={() => set(i, val)}
                      aria-pressed={active}
                      style={{
                        ...syne, fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        padding: '7px 16px', borderRadius: '6px',
                        background: active ? (val ? 'rgba(201,166,107,0.18)' : 'rgba(229,72,77,0.18)') : 'transparent',
                        color: active ? (val ? '#C9A66B' : '#E5484D') : 'rgba(244,241,234,0.55)',
                        border: `1px solid ${active ? (val ? 'rgba(201,166,107,0.5)' : 'rgba(229,72,77,0.5)') : 'rgba(255,255,255,0.14)'}`,
                        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <div
          aria-live="polite"
          style={{
            maxHeight: allAnswered ? '260px' : '0px',
            opacity: allAnswered ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease',
          }}
        >
          <div style={{
            background: 'var(--navy-raised, #102943)',
            border: `1px solid ${verdict ? verdict.color : 'rgba(255,255,255,0.1)'}40`,
            borderRadius: '10px', padding: '1.75rem', marginTop: '0.5rem',
          }}>
            <p style={{ ...syne, fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: verdict?.color, marginBottom: '0.6rem' }}>
              {verdict?.label}
            </p>
            <p style={{ ...syne, fontSize: '1.02rem', color: '#F4F1EA', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              {verdict?.note}
            </p>
            <Link href="/governance-audit" className="btn-primary" style={{ fontSize: '0.95rem', padding: '13px 28px' }}>
              Get your Governance Maturity Index <span className="arrow">→</span>
            </Link>
            <p style={{ ...syne, fontSize: '11px', color: 'rgba(244,241,234,0.4)', marginTop: '1rem' }}>
              That was 3 questions. The full Index is 30, across 6 dimensions, in 5 minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
