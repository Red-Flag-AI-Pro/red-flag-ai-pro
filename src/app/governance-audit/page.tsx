import type { Metadata } from 'next';
import { GovernanceAuditFlow } from '@/components/governance-audit/GovernanceAuditFlow';
import { TrustBar } from '@/components/marketing/TrustBar';

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
    <div style={{ background: '#0A1628', minHeight: '100vh' }} className="py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <p style={{
              fontFamily: "'Syne', system-ui, sans-serif",
              color: 'rgba(255,255,255,0.5)',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto',
            }}>
              Regulators want proof of AI governance.<br />
              You can't show it yet.
            </p>
          </div>

          <h1 className="font-display" style={{
            fontSize: 'clamp(2rem, 5vw, 3.1rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: '#F4F1EA',
            maxWidth: '820px',
            margin: '0 auto',
          }}>
            Your <span style={{ fontStyle: 'italic', color: '#E5484D' }}>Governance Maturity Index</span>, scored across 6 dimensions, with audit ready evidence, in 5 minutes.
          </h1>

          <p style={{
            fontFamily: "'Syne', system-ui, sans-serif",
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto',
            fontWeight: 500,
          }}>
            Rest assured. Validated. Ready.
          </p>
        </div>

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
              23 Questions
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
              5 Minutes
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
        <GovernanceAuditFlow />

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
        </div>
      </div>
    </div>
  );
}
