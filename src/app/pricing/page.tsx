import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import React from "react";

export const metadata: Metadata = {
  title: "Pricing — Red Flag AI Pro",
  description: "Pro from £39/month. Growth £199/month. Sentinel £999/month for agencies — URL scanning, VSL scanning, site audit, team seats, API access and white-label reports.",
  alternates: { canonical: "https://www.redflagaipro.com/pricing" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const PRO_FEATURES = [
  "20 scans per month",
  "16 risk categories",
  "Paste text and upload .txt",
  "Plain English flags + rewrite suggestions",
  "0–100 compliance score",
  "Full scan history",
  "Public shareable scan links",
  "CSV export",
  "Email support",
];

const GROWTH_FEATURES = [
  "Everything in Pro",
  "Unlimited scans",
  "VSL script scanning",
  "Video scan summaries",
  "Site audit — up to 10 pages",
  "Client workspaces",
  "URL monitoring — 5 URLs",
  "Weekly email digest",
  "Compliance changelog",
  "Score trend history per client",
  "PDF compliance reports",
  "Priority support",
];

const SENTINEL_FEATURES = [
  "Everything in Growth",
  "All 26 risk categories",
  "FCA financial promotions",
  "Greenwashing scanner",
  "Video scan summaries",
  "YouTube VSL transcript scanning",
  "Audio transcription via Whisper",
  "Site audit — up to 50 pages",
  "Unlimited URL monitoring",
  "Weekly email digest",
  "Auto-reports to client contacts",
  "Compliance changelog",
  "Multi-user team seats",
  "White-label PDF reports",
  "Public REST API + API keys",
  "Zapier / webhook integration",
  "Chrome extension",
  "Embeddable compliance badge",
  "Dedicated onboarding",
];

export default function PricingPage() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        padding: "8rem 1.5rem 6rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "500px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(204,0,0,0.15) 0%, transparent 65%)"
        }} />
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span className="flag-wave" style={{ display: "inline-block" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>Pricing</p>
          </div>
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1rem" }}>
            Compliance infrastructure.<br />Choose your level.
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            Try one scan free on the homepage — no account needed.{" "}
            <Link href="/#demo" style={{ color: "#ef4444", textDecoration: "none", fontWeight: 600 }}>Run a free scan →</Link>
          </p>
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <div style={{
        background: "#0f0505",
        borderBottom: "1px solid rgba(239,68,68,0.15)",
        padding: "1.5rem"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
          <span className="flag-wave" style={{ display: "inline-block", flexShrink: 0, marginTop: "3px" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
            </svg>
          </span>
          <div>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
              I&apos;ve been on both sides of this. I&apos;ve bought courses that promised everything and delivered nothing, misled by income claims I now know were illegal. And I&apos;ve built funnels alone, no legal budget, hoping my own copy was okay — not knowing it probably wasn&apos;t.{" "}
              <span style={{ color: "#ef4444", fontWeight: 700 }}>This wasn&apos;t built for profit. It was built from pain. That&apos;s why we outperform and undercharge.</span>
            </p>
            <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "0.5rem" }}>— James, Founder</p>
          </div>
        </div>
      </div>

      {/* PLANS */}
      <section style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2px" }}>

            {/* PRO */}
            <div style={{
              background: "#0f0505",
              border: "1px solid rgba(239,68,68,0.3)",
              padding: "2.5rem",
              position: "relative"
            }}>
              <div style={{
                position: "absolute", top: "-1px", left: "2rem",
                background: "#fbbf24",
                ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#78350f",
                padding: "4px 12px"
              }}>Most popular</div>

              <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem", marginTop: "1rem" }}>Pro</p>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", lineHeight: 1.6 }}>Solopreneurs, funnel builders and buyers checking copy before they spend.</p>
              <p style={{ ...mono, fontSize: "3rem", fontWeight: 700, color: "white", letterSpacing: "-0.04em", lineHeight: 1 }}>
                £39<span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.3)" }}>/mo</span>
              </p>
              <Link href="/signup?plan=pro" style={{
                display: "block", textAlign: "center",
                background: "white", color: "#cc0000",
                ...syne, fontSize: "0.875rem", fontWeight: 700,
                padding: "12px 24px", borderRadius: "9999px",
                textDecoration: "none", marginTop: "1.5rem"
              }}>
                Get started
              </Link>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "2rem", paddingTop: "2rem" }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1rem" }}>What&apos;s included</p>
                {PRO_FEATURES.map((f) => (
                  <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "0.75rem" }}>
                    <span style={{ color: "#ef4444", flexShrink: 0 }}>✓</span>
                    <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GROWTH */}
            <div style={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "2.5rem"
            }}>
              <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>Growth</p>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", lineHeight: 1.6 }}>Agencies managing client copy and high-volume creators who scan daily.</p>
              <p style={{ ...mono, fontSize: "3rem", fontWeight: 700, color: "white", letterSpacing: "-0.04em", lineHeight: 1 }}>
                £199<span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.3)" }}>/mo</span>
              </p>
              <Link href="/signup?plan=enterprise" style={{
                display: "block", textAlign: "center",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.7)",
                ...syne, fontSize: "0.875rem", fontWeight: 700,
                padding: "12px 24px", borderRadius: "9999px",
                textDecoration: "none", marginTop: "1.5rem"
              }}>
                Get started
              </Link>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "2rem", paddingTop: "2rem" }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1rem" }}>What&apos;s included</p>
                {GROWTH_FEATURES.map((f) => (
                  <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "0.75rem" }}>
                    <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span>
                    <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SENTINEL */}
            <div style={{
              background: "linear-gradient(160deg, #f0f0f8 0%, #d8d8ec 35%, #bfbfd8 65%, #d4d4e8 100%)",
              padding: "2.5rem",
              position: "relative", overflow: "hidden",
              boxShadow: "0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.9)"
            }}>
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, transparent 50%, rgba(255,255,255,0.25) 100%)",
                opacity: 0.15
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#cc0000", animation: "pulseRed 2s ease-in-out infinite" }} />
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#666" }}>Agency plan</p>
                </div>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#333", marginBottom: "0.75rem" }}>Sentinel</p>
                <p style={{ ...syne, fontSize: "13px", color: "#555", marginBottom: "1.5rem", lineHeight: 1.6 }}>Agencies and regulated businesses where compliance is not optional.</p>
                <p style={{ ...mono, fontSize: "3rem", fontWeight: 700, color: "#111", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  £999<span style={{ fontSize: "1rem", color: "#666" }}>/mo</span>
                </p>
                <Link href="/sentinel" style={{
                  display: "block", textAlign: "center",
                  background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)",
                  color: "#e0e0f0",
                  ...syne, fontSize: "0.875rem", fontWeight: 700,
                  padding: "12px 24px", borderRadius: "9999px",
                  textDecoration: "none", marginTop: "1.5rem"
                }}>
                  Learn more
                </Link>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: "2rem", paddingTop: "2rem" }}>
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginBottom: "1rem" }}>What&apos;s included</p>
                  {SENTINEL_FEATURES.map((f) => (
                    <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "0.75rem" }}>
                      <span style={{ color: "#cc0000", flexShrink: 0 }}>✓</span>
                      <span style={{ ...syne, fontSize: "13px", color: "rgba(0,0,0,0.65)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Stats strip */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            marginTop: "2px"
          }}>
            {[
              { value: "24", label: "Risk categories on Sentinel" },
              { value: "5", label: "Jurisdictions — FTC, GDPR, ASA, FCA, ACCC, CASL" },
              { value: "60s", label: "From paste to compliance score" },
            ].map((s, i) => (
              <div key={s.label} style={{
                padding: "2rem 1.5rem",
                textAlign: "center",
                background: "#0a0a0a",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none"
              }}>
                <p style={{ ...mono, fontSize: "2rem", fontWeight: 700, color: "white", letterSpacing: "-0.03em" }}>{s.value}</p>
                <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "2rem" }}>
            All plans include a 14-day money-back guarantee. Cancel anytime. No contracts.{" "}
            <Link href="/docs" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>API docs →</Link>
          </p>

          {/* Audit upsell */}
          <div style={{
            marginTop: "3rem",
            background: "linear-gradient(135deg, #0f0a00 0%, #0a0a0a 100%)",
            border: "1px solid rgba(251,191,36,0.15)",
            borderRadius: "12px",
            padding: "2rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(251,191,36,0.7)", marginBottom: "0.75rem" }}>Rather have someone do it for you?</p>
            <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>Done-For-You Compliance Audit — £97</p>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.25rem", maxWidth: "480px", margin: "0 auto 1.25rem" }}>
              I personally scan your full site and funnel, record a video walkthrough of every flag, and deliver a PDF report with a reviewed badge. One-time. 48 hours.
            </p>
            <Link href="/audit" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.3)",
              color: "rgba(251,191,36,0.9)",
              ...syne, fontSize: "0.85rem", fontWeight: 700,
              padding: "10px 24px", borderRadius: "9999px",
              textDecoration: "none", letterSpacing: "0.02em"
            }}>
              Find out more →
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
