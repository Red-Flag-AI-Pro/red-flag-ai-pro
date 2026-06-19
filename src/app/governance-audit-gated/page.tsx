'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { GovernanceAuditFlow } from '@/components/governance-audit/GovernanceAuditFlow';

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

export default function GovernanceAuditGatedPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setSubmitted(true);
    setIsLoading(false);
  };

  // If email submitted, show the quiz
  if (submitted) {
    return (
      <div style={{ background: '#0A1628', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ ...syne, fontSize: '12px', fontWeight: 700, color: '#ef4444', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Assessment</p>
            <p style={{ ...syne, fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>Email: {email}</p>
            <GovernanceAuditFlow />
          </div>
        </div>
      </div>
    );
  }

  // Email gate (landing page)
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>
      <Navbar />

      {/* HERO — HIGH URGENCY, FEAR, LOSS AVERSION */}
      <section style={{
        padding: '10rem 1.5rem 6rem',
        background: 'linear-gradient(180deg, #0A1628 0%, #0D1B2E 100%)',
        borderBottom: '2px solid rgba(239,68,68,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Red pulsing glow */}
        <div style={{
          position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)',
          width: '1000px', height: '700px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(229,72,77,0.10) 0%, transparent 60%)',
          animation: 'pulse 3s ease-in-out infinite'
        }} />

        <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Urgency badge */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '9999px',
            padding: '8px 16px',
            marginBottom: '2rem'
          }}>
            <p style={{ ...syne, fontSize: '11px', fontWeight: 700, color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>⚠️ Regulatory enforcement active NOW</p>
          </div>

          {/* Main headline — FEAR */}
          <h1 style={{
            ...syne,
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            background: 'linear-gradient(160deg, #ffffff 0%, #e2e8f0 30%, #ff4444 70%, #E5484D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Can you prove AI governance happened?
          </h1>

          {/* Subheadline — LOSS AVERSION */}
          <p style={{
            ...syne,
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            maxWidth: '700px',
            margin: '0 auto 2.5rem'
          }}>
            Most organizations can't. And regulators are asking now.
          </p>

          {/* THREE PAIN POINTS — RED & BOLD */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {[
              { icon: '⚖️', text: 'Munir v SSHD:\nGovernance you can\'t prove = liability' },
              { icon: '📅', text: 'EU AI Act:\nEnforcement starts August 2, 2026' },
              { icon: '💰', text: 'FTC Penalties:\n$53,088 per violation (April 2026+)' },
            ].map((item) => (
              <div key={item.text} style={{
                background: 'rgba(229,72,77,0.1)',
                border: '2px solid rgba(239,68,68,0.4)',
                borderRadius: '12px',
                padding: '2rem',
              }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{item.icon}</p>
                <p style={{ ...syne, fontSize: '13px', fontWeight: 700, color: '#ff6b6b', lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* SOCIAL PROOF — "You're not alone but you're exposed" */}
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <p style={{ ...syne, fontSize: '12px', color: '#ef4444', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>THE REALITY</p>
            <p style={{ ...syne, fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>83% of organizations use AI. Only 25% have adequate governance.</p>
            <p style={{ ...syne, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>72% are increasing GRC spending. 78% are unprepared for EU AI Act.</p>
          </div>
        </div>
      </section>

      {/* EMAIL GATE — FRICTION + URGENCY */}
      <section style={{
        padding: '6rem 1.5rem',
        background: '#0A1628',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{
            ...syne,
            fontSize: 'clamp(1.8rem, 5vw, 2.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            color: 'white',
            textAlign: 'center'
          }}>
            Know where you stand in 5 minutes.
          </h2>

          <p style={{
            ...syne,
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            marginBottom: '2.5rem',
            lineHeight: 1.7
          }}>
            Our AI Governance Maturity Assessment scores you across 6 critical dimensions. See your gaps. Get your strategic roadmap. Then decide how to close them.
          </p>

          {/* EMAIL FORM */}
          <form onSubmit={handleEmailSubmit} style={{ marginBottom: '2rem' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '2px solid rgba(239,68,68,0.4)',
                background: 'rgba(15,5,5,0.6)',
                color: 'white',
                ...syne,
                fontSize: '14px',
                marginBottom: '1rem',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                ...syne,
                fontSize: '1rem',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Starting assessment...' : 'Start assessment'}
            </button>
          </form>

          {error && (
            <p style={{ ...syne, fontSize: '12px', color: '#ff6b6b', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <p style={{
            ...syne,
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            textAlign: 'center'
          }}>
            No credit card required. No account needed. Results delivered instantly.
          </p>
        </div>
      </section>

      {/* WHY NOW — SCARCITY + DEADLINE PRESSURE */}
      <section style={{
        padding: '6rem 1.5rem',
        background: 'linear-gradient(180deg, #0D1B2E 0%, #0A1628 100%)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            ...syne,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#ef4444',
            marginBottom: '1.5rem'
          }}>Why right now?</p>

          <h2 style={{
            ...syne,
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '3rem',
            color: 'white'
          }}>
            Regulatory deadlines aren't optional.
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                days: '45 days',
                deadline: 'August 2, 2026',
                desc: 'EU AI Act enforcement begins. AI-generated content must be disclosed.'
              },
              {
                days: '6+ months',
                deadline: '2026 SEC Exams',
                desc: 'Financial regulators test: Can you prove governance? Can you monitor?'
              },
              {
                days: 'Now',
                deadline: 'FTC Enforcement',
                desc: '$53,088 per violation. Unsubstantiated AI claims in marketing targeted.'
              },
            ].map((item) => (
              <div key={item.deadline} style={{
                background: 'rgba(15, 5, 5, 0.8)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <p style={{ ...syne, fontSize: '2rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.5rem' }}>{item.days}</p>
                <p style={{ ...syne, fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>{item.deadline}</p>
                <p style={{ ...syne, fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section style={{
        padding: '4rem 1.5rem',
        background: '#0D1B2E',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{
            ...syne,
            fontSize: '12px',
            fontWeight: 700,
            color: '#ef4444',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Built by Red Flag AI Pro</p>
          <p style={{
            ...syne,
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7
          }}>
            The same team that built the world's only multi-jurisdiction AI compliance scanner. Trusted by 10,000+ users. Zero data breaches. Zero compromises on privacy.
          </p>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
