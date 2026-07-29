import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GovernanceAuditFlow } from '@/components/governance-audit/GovernanceAuditFlow';
import { TrustBar } from '@/components/marketing/TrustBar';
import { ProveItWidget } from '@/components/marketing/ProveItWidget';
import { JurisdictionStrip } from '@/components/marketing/JurisdictionStrip';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'AI Governance Maturity Assessment',
  description:
    'Score your AI governance across 6 critical dimensions. Get your maturity score, identify governance gaps, and access an audit ready evidence framework.',
  alternates: {
    canonical: 'https://www.redflagaipro.com/governance-audit',
  },
};

export default function GovernanceAuditPage() {
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ── boardroom photo graded to navy, same system as /law-firms and /sentinel */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(5rem, 12vw, 8rem) 1.5rem clamp(4rem, 9vw, 6rem)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'url(/images/governance/boardroom.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 60%',
          filter: 'saturate(0.5) contrast(1.05) brightness(0.85)',
        }} />
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(10,22,40,0.55)', mixBlendMode: 'multiply',
        }} />
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(10,22,40,0.7) 0%, rgba(10,22,40,0.4) 40%, rgba(10,22,40,0.6) 75%, #0A1628 100%)',
        }} />

        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1.75rem' }}>
            <span style={{ width: '28px', height: '1px', background: 'rgba(229,72,77,0.6)' }} />
            <p style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.65)' }}>
              The governance assessment
            </p>
            <span style={{ width: '28px', height: '1px', background: 'rgba(229,72,77,0.6)' }} />
          </div>

          <h1 className="font-display" style={{
            fontSize: 'clamp(2rem, 5vw, 3.1rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: '#F4F1EA',
            maxWidth: '820px',
            margin: '0 auto 1.5rem',
            textShadow: '0 2px 40px rgba(6,14,26,0.95), 0 2px 10px rgba(6,14,26,0.9)',
          }}>
            Your <span style={{ fontStyle: 'italic', color: '#E5484D' }}>Governance Maturity Index</span>, scored across 6 dimensions, with audit ready evidence, in 2 minutes.
          </h1>

          <p style={{
            fontFamily: "'Syne', system-ui, sans-serif",
            color: 'rgba(244,241,234,0.88)',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            maxWidth: '620px',
            margin: '0 auto',
            fontWeight: 500,
            textShadow: '0 1px 3px rgba(6,14,26,0.95), 0 2px 18px rgba(6,14,26,0.9)',
          }}>
            When the board, the insurer or the regulator asks how AI is governed, the answer needs a score, a gap and a record. Find your biggest governance gap before an auditor does. Free, 12 questions, under 2 minutes.
          </p>
        </div>
      </section>

      <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <TrustBar />
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div style={{
            background: '#0D1B2E',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
          }} className="space-y-2">
            <div style={{ width: '28px', height: '2px', background: '#E5484D', marginBottom: '0.25rem' }} />
            <h3 style={{
              fontFamily: "'Syne', system-ui, sans-serif",
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'white',
            }}>
              12 Questions
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.5,
            }}>
              Comprehensive assessment across strategy, tools, policy, monitoring, vendors, and regulatory readiness
            </p>
          </div>

          <div style={{
            background: '#0D1B2E',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
          }} className="space-y-2">
            <div style={{ width: '28px', height: '2px', background: '#E5484D', marginBottom: '0.25rem' }} />
            <h3 style={{
              fontFamily: "'Syne', system-ui, sans-serif",
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'white',
            }}>
              2 Minutes
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.5,
            }}>
              Instant results with 0-100 governance maturity score and peer benchmarking
            </p>
          </div>

          <div style={{
            background: '#0D1B2E',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
          }} className="space-y-2">
            <div style={{ width: '28px', height: '2px', background: '#E5484D', marginBottom: '0.25rem' }} />
            <h3 style={{
              fontFamily: "'Syne', system-ui, sans-serif",
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'white',
            }}>
              Evidence Package
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.5,
            }}>
              Automatically generated audit ready framework for regulators (assessment plus risk register plus roadmap)
            </p>
          </div>
        </div>

        {/* Quiz Flow Component */}
        <Suspense fallback={null}>
          <GovernanceAuditFlow />
        </Suspense>
      </div>
      </div>

      <ProveItWidget />
      <JurisdictionStrip />

      {/* ── THE SEALED RECORD ── seal photo panel + copy, same pattern as the other vertical pages */}
      <section style={{ padding: '6rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(180deg, #0A1628 0%, #0C1929 100%)' }}>
        <div style={{
          maxWidth: '1050px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem', alignItems: 'center',
        }}>
          {/* Photo panel: red wax seal, graded to navy */}
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', minHeight: '380px' }}>
            <div aria-hidden style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(/images/governance/seal.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'saturate(0.85) contrast(1.05) brightness(0.9)',
            }} />
            <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,46,0.35)', mixBlendMode: 'multiply' }} />
            <div aria-hidden style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(10,22,40,0.1) 0%, rgba(10,22,40,0.7) 100%)',
            }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.75rem' }}>
              <p style={{ fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: 'clamp(14px, 2.4vw, 17px)', fontWeight: 500, color: 'rgba(244,241,234,0.95)', letterSpacing: '0.08em', lineHeight: 1.7, textShadow: '0 1px 8px rgba(6,14,26,0.9)' }}>
                assessment scored · gap identified
                <br />
                evidence generated · sealed on request
              </p>
            </div>
          </div>

          {/* Copy panel */}
          <div>
            <p style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E5484D', marginBottom: '1rem' }}>
              A score is a start. A record is a defence.
            </p>
            <h2 style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '2rem' }}>
              The assessment finds the gap.
              <br />
              The record proves you closed it.
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {[
                { h: 'Six dimensions, scored in plain numbers.', b: 'Strategy, tools and data, policy, monitoring, vendor risk and regulatory readiness. A 0 to 100 maturity score, benchmarked, with your single biggest gap named.' },
                { h: 'An evidence package, not just a result.', b: 'Every assessment generates an audit ready framework: the scored assessment, a risk register and a 90 day roadmap, built to be handed to a board, an insurer or a regulator.' },
                { h: 'Sealed when it matters.', b: 'On the paid tiers, high value governance records carry an independent RFC 3161 timestamp and a tamper evident chain, so the date on the record is a fact a third party attests to, not a claim.' },
              ].map((e) => (
                <div key={e.h} style={{ borderLeft: '2px solid rgba(229,72,77,0.4)', paddingLeft: '1.25rem' }}>
                  <h3 style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>{e.h}</h3>
                  <p style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.7 }}>{e.b}</p>
                </div>
              ))}
            </div>

            <a href="/verify" style={{ display: 'inline-block', marginTop: '2rem', fontFamily: "'Syne', system-ui, sans-serif", fontSize: '13px', fontWeight: 700, color: '#E5484D', textDecoration: 'underline' }}>
              Verify a real audit record yourself, no account needed →
            </a>
          </div>
        </div>
      </section>

      {/* ── ARCHIVE BAND ── one line over the records, same pattern as the other closing bands */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '9rem 1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'url(/images/governance/archive.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.5) contrast(1.05) brightness(0.85)',
        }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'rgba(10,22,40,0.55)', mixBlendMode: 'multiply' }} />
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, #0A1628 0%, rgba(10,22,40,0.35) 30%, rgba(10,22,40,0.45) 70%, #0A1628 100%)',
        }} />
        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 500,
            letterSpacing: '-0.02em', lineHeight: 1.25, color: '#F4F1EA',
            textShadow: '0 2px 40px rgba(6,14,26,0.95), 0 2px 10px rgba(6,14,26,0.9)',
          }}>
            A record made afterwards is an explanation.
            <br />
            <span style={{ fontStyle: 'italic', color: '#E5484D' }}>A record made before is evidence.</span>
          </h2>
        </div>
      </section>

      <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Footer */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '2rem',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.3)',
          }}>
            No spam. One governance assessment per email. Results delivered instantly.
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '0.75rem',
          }}>
            Here for the marketing copy side instead? <a href="/compliance-assessment" style={{ color: '#E5484D', textDecoration: 'underline' }}>Run a free compliance check</a>.
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
