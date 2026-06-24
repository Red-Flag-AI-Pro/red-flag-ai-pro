import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { REGULATORY_MAPPING_LAST_REVIEWED } from "@/lib/constants";
import React from "react";

export const metadata: Metadata = {
  title: "Governance Pricing: Red Flag AI Pro",
  description: "Free AI governance assessment. Scanner £149/mo for compliance scanning, Pro £499/mo for ongoing monitoring, Growth £1,200/mo for teams, Sentinel custom pricing for managed governance, compliance evidence, and board readiness. CFO + compliance teams.",
  alternates: { canonical: "https://www.redflagaipro.com/pricing" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const SCANNER_FEATURES = [
  "Full compliance scanner: 9 jurisdictions, all 30 risk categories",
  "5 scans per month",
  "PDF reports",
  "Scan history",
  "Email support",
];

const PRO_FEATURES = [
  "Full compliance scanner: 9 jurisdictions, all 30 risk categories",
  "Includes the free governance assessment",
  "Ongoing governance monitoring (monthly)",
  "Vendor AI risk tracking & assessments",
  "Monthly compliance dashboard",
  "Policy to practice gap detection",
  "Unlimited PDF reports",
  "Governance evidence package (audit ready)",
  "Quarterly improvement roadmaps",
  "Email support",
  "14 day money back guarantee",
];

const GROWTH_FEATURES = [
  "Everything in Pro",
  "Full compliance scanner: 9 jurisdictions, all 30 risk categories, 30 scans/month",
  "Multiple team seats",
  "API & webhook access",
  "White label PDF reports",
  "Priority email support",
];

const SENTINEL_FEATURES = [
  "Everything in Growth",
  "Full compliance scanner: 9 jurisdictions, all 30 risk categories",
  "Managed governance implementation (we work it with you)",
  "Automated audit logging & forensic proof",
  "Ongoing governance & vendor monitoring reviews",
  "Financial impact modeling (compliance cost calculator)",
  "Governance enforcement support & guardrail design",
  "Board ready reporting, built with your team",
  "Regulatory readiness review",
  "Multi team governance workflows",
  "API access to your scan & assessment data",
  "Dedicated governance advisor (quarterly calls)",
  "White label reports for client facing",
  "Priority support",
];

export default function PricingPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* PAIN SECTION — THE PROBLEM */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "linear-gradient(180deg, #0A1628 0%, #102943 100%)",
        borderBottom: "1px solid rgba(239,68,68,0.15)",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>The Problem</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.5rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.5rem", color: "white" }}>
              You can't prove governance happened.
              <br />
              <span style={{ background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>That's the problem.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
            {[
              {
                icon: "",
                title: "Munir v SSHD",
                desc: "Tribunal sanctioned a firm for filing AI hallucinated case citations. Delegating to AI doesn't remove the duty to verify and supervise.",
              },
              {
                icon: "",
                title: "EU AI Act (Aug 2, 2026)",
                desc: "Mandatory disclosure of AI generated content + governance evidence. 45 days away.",
              },
              {
                icon: "",
                title: "SEC 2026 Exams",
                desc: "Financial regulators now testing: Can you prove governance? Can you prove monitoring?",
              },
              {
                icon: "",
                title: "FTC Enforcement ($53K per violation)",
                desc: "Unsubstantiated AI claims in marketing. April 2026 onwards: consent orders, not warnings.",
              },
              {
                icon: "",
                title: "Policy vs. Practice Gap",
                desc: "Your team has written policies. But desk behavior ≠ policy. No one's checking.",
              },
              {
                icon: "",
                title: "Ownership Gap",
                desc: "Who decides about AI? Who owns the output when it drifts? No single answer = no control.",
              },
            ].map((item) => (
              <div key={item.title} style={{
                background: "rgba(16,41,67,0.6)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}>
                <div style={{ width: "28px", height: "2px", background: "#E5484D", marginBottom: "1rem" }} />
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "3rem",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px",
            padding: "2rem",
            textAlign: "center",
          }}>
            <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>THE REALITY</p>
            <p style={{ ...syne, fontSize: "1.2rem", fontWeight: 700, color: "white", lineHeight: 1.6 }}>
              One unchecked ad with an undisclosed claim can trigger a fine before legal ever sees it. A regulator finding you can't prove governance afterward: enterprise reputation destroyed. Your insurance won't cover either.
            </p>
            <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "1rem" }}>You need both checked TODAY, not when the regulator calls.</p>
          </div>
        </div>
      </section>

      {/* HERO */}
      <section style={{
        padding: "6rem 1.5rem 4rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "500px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(229,72,77,0.08) 0%, transparent 65%)"
        }} />
        <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>Scanner + Governance, one price</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2.3rem, 6vw, 3.6rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: "1rem", color: "#F4F1EA" }}>
            Catch what you said.<br /><span style={{ fontStyle: "italic", color: "#E5484D" }}>Then prove what you did.</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Every plan includes the full compliance scanner for your marketing copy, plus a 5-minute free assessment that shows your governance maturity, gaps, and 90-day roadmap.
          </p>
        </div>
      </section>

      {/* FREE ASSESSMENT BANNER */}
      <section style={{ padding: "0 1.5rem", marginTop: "-2rem", position: "relative", zIndex: 2 }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          background: "rgba(229,72,77,0.08)",
          border: "1px solid rgba(229,72,77,0.3)",
          borderRadius: "12px",
          padding: "2rem",
          textAlign: "center",
        }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "0.75rem" }}>Start here, free</p>
          <p style={{ ...syne, fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
            Every plan below starts with a free governance assessment.
          </p>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            Six dimension breakdown, your top critical gaps, peer benchmarking, and a 90 day to 12 month roadmap, delivered as a board ready PDF. One assessment per email, no credit card required.
          </p>
          <Link href="/governance-audit" style={{
            display: "inline-block",
            background: "rgba(239,68,68,0.2)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.4)",
            ...syne, fontSize: "0.875rem", fontWeight: 700,
            padding: "12px 24px", borderRadius: "9999px",
            textDecoration: "none",
          }}>
            Start free assessment (5 min)
          </Link>
        </div>
      </section>

      {/* PLANS */}
      <section style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2px" }}>

            {/* SCANNER */}
            <div style={{
              background: "#0D1B2E",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "2.5rem",
              position: "relative"
            }}>
              <div style={{ minHeight: "7.5rem" }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "1rem", marginTop: "1rem" }}>Scanner</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", lineHeight: 1.6 }}>Just the compliance scanner, for solo creators and small teams who need it checked, not monitored.</p>
              </div>
              <div style={{ minHeight: "4.6rem" }}>
                <p className="font-display" style={{ fontSize: "3rem", fontWeight: 500, color: "white", lineHeight: 1 }}>
                  £149<span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)" }}>/mo</span>
                </p>
              </div>
              <Link href="/signup?plan=scanner" style={{
                display: "block", textAlign: "center",
                background: "transparent",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.25)",
                ...syne, fontSize: "0.875rem", fontWeight: 700,
                padding: "12px 24px", borderRadius: "9999px",
                textDecoration: "none", marginTop: "1.5rem"
              }}>
                Start Scanner
              </Link>
              <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "0.75rem" }}>
                No call required.
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "2rem", paddingTop: "2rem" }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1rem" }}>What you get</p>
                {SCANNER_FEATURES.map((f) => (
                  <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "0.75rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0, marginTop: "2px" }}>✓</span>
                    <span style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PRO */}
            <div style={{
              background: "#0D1B2E",
              border: "2px solid rgba(239,68,68,0.5)",
              padding: "2.5rem",
              position: "relative",
              boxShadow: "0 0 40px rgba(239,68,68,0.15)"
            }}>
              <div style={{
                position: "absolute", top: "-1px", left: "2rem",
                background: "#ef4444",
                ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "white",
                padding: "4px 12px"
              }}>Recommended</div>

              <div style={{ minHeight: "7.5rem" }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem", marginTop: "1rem" }}>Pro</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", lineHeight: 1.6 }}>Ongoing proof that governance is actually happening, and you don&apos;t re-buy a new tool every time a new law lands.</p>
              </div>
              <div style={{ minHeight: "4.6rem" }}>
                <p className="font-display" style={{ fontSize: "3rem", fontWeight: 500, color: "white", lineHeight: 1 }}>
                  £499<span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)" }}>/mo</span>
                </p>
                <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>or £4,990/year (2 months free)</p>
              </div>
              <Link href="/signup?plan=pro" style={{
                display: "block", textAlign: "center",
                background: "#ef4444",
                color: "white",
                ...syne, fontSize: "0.875rem", fontWeight: 700,
                padding: "12px 24px", borderRadius: "9999px",
                textDecoration: "none", marginTop: "1.5rem"
              }}>
                Start Pro
              </Link>
              <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "0.75rem" }}>
                14 day money back guarantee. No call required.
              </p>
              <div style={{ borderTop: "1px solid rgba(239,68,68,0.3)", marginTop: "2rem", paddingTop: "2rem" }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1rem" }}>What you get</p>
                {PRO_FEATURES.map((f) => (
                  <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "0.75rem" }}>
                    <span style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }}>✓</span>
                    <span style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GROWTH */}
            <div style={{
              background: "#102943",
              border: "1px solid rgba(201,166,107,0.35)",
              padding: "2.5rem",
              position: "relative"
            }}>
              <div style={{ minHeight: "7.5rem" }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "1rem", marginTop: "1rem" }}>Growth</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", lineHeight: 1.6 }}>For teams of 3 or more who've outgrown a single seat.</p>
              </div>
              <div style={{ minHeight: "4.6rem" }}>
                <p className="font-display" style={{ fontSize: "3rem", fontWeight: 500, color: "white", lineHeight: 1 }}>
                  £1,200<span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)" }}>/mo</span>
                </p>
              </div>
              <Link href="/signup?plan=enterprise" style={{
                display: "block", textAlign: "center",
                background: "transparent",
                color: "white",
                border: "1.5px solid #C9A66B",
                ...syne, fontSize: "0.875rem", fontWeight: 700,
                padding: "12px 24px", borderRadius: "9999px",
                textDecoration: "none", marginTop: "1.5rem"
              }}>
                Start Growth
              </Link>
              <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "0.75rem" }}>
                or <a href="https://calendly.com/redflagaipro/30min" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>book a call</a> first
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "2rem", paddingTop: "2rem" }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1rem" }}>What you get</p>
                {GROWTH_FEATURES.map((f) => (
                  <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "0.75rem" }}>
                    <span style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }}>✓</span>
                    <span style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SENTINEL */}
            <div style={{
              background: "linear-gradient(160deg, #f0f0f8 0%, #d8d8ec 35%, #bfbfd8 65%, #d4d4e8 100%)",
              padding: "2.5rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 12px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.9)"
            }}>
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, transparent 50%, rgba(255,255,255,0.25) 100%)",
                opacity: 0.15
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ minHeight: "7.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem", marginTop: "1rem" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#E5484D", animation: "pulseRed 2s ease-in-out infinite" }} />
                    <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#666" }}>Enterprise</p>
                  </div>
                  <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#333", marginBottom: "0.75rem" }}>Sentinel</p>
                  <p style={{ ...syne, fontSize: "13px", color: "#555", marginBottom: "1.5rem", lineHeight: 1.6 }}>We implement governance for you. You get compliance ready proof, forever.</p>
                </div>
                <div style={{ minHeight: "4.6rem" }}>
                  <p className="font-display" style={{ fontSize: "2.2rem", fontWeight: 500, color: "#0F2138", lineHeight: 1 }}>
                    Custom pricing
                  </p>
                  <p style={{ ...syne, fontSize: "11px", color: "#777", marginTop: "0.5rem" }}>Scoped to your team size and governance needs</p>
                </div>
                <a href="https://calendly.com/redflagaipro/30min" target="_blank" rel="noopener noreferrer" style={{
                  display: "block", textAlign: "center",
                  background: "linear-gradient(135deg, #1a1a2e 0%, #0E1C30 100%)",
                  color: "#e0e0f0",
                  ...syne, fontSize: "0.875rem", fontWeight: 700,
                  padding: "12px 24px", borderRadius: "9999px",
                  textDecoration: "none", marginTop: "1.5rem"
                }}>
                  Talk to sales
                </a>
                <p style={{ ...syne, fontSize: "11px", color: "#555", textAlign: "center", marginTop: "0.75rem", fontWeight: 700 }}>
                  or email support@redflagaipro.com
                </p>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: "2rem", paddingTop: "2rem" }}>
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginBottom: "1rem" }}>What you get</p>
                  {SENTINEL_FEATURES.map((f) => (
                    <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "0.75rem" }}>
                      <span style={{ color: "#E5484D", flexShrink: 0, marginTop: "2px" }}>✓</span>
                      <span style={{ ...syne, fontSize: "12px", color: "rgba(0,0,0,0.65)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Comparison table */}
          <div style={{
            marginTop: "3rem",
            background: "#0D1B2E",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "12px",
            overflow: "hidden"
          }}>
            <div style={{ padding: "2rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white" }}>Which is right for you?</p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <th style={{ ...syne, padding: "1.5rem", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Need</th>
                    <th style={{ ...syne, padding: "1.5rem", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Scanner</th>
                    <th style={{ ...syne, padding: "1.5rem", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Pro</th>
                    <th style={{ ...syne, padding: "1.5rem", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Growth</th>
                    <th style={{ ...syne, padding: "1.5rem", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Sentinel</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { need: "Compliance scanner (9 jurisdictions, 30 categories)", scanner: "✓", pro: "✓", growth: "✓", sentinel: "✓" },
                    { need: "See governance gaps", scanner: "✗", pro: "✓", growth: "✓", sentinel: "✓" },
                    { need: "Monitor governance ongoing", scanner: "✗", pro: "✓", growth: "✓", sentinel: "✓" },
                    { need: "Automated compliance proof", scanner: "✗", pro: "✓", growth: "✓", sentinel: "✓" },
                    { need: "Multiple team seats", scanner: "✗", pro: "✗", growth: "✓", sentinel: "✓" },
                    { need: "API & webhook access", scanner: "✗", pro: "✗", growth: "✓", sentinel: "✓" },
                    { need: "Financial impact modeling", scanner: "✗", pro: "✗", growth: "✗", sentinel: "✓" },
                    { need: "Board ready reporting", scanner: "✗", pro: "✗", growth: "✗", sentinel: "✓" },
                    { need: "Managed implementation", scanner: "✗", pro: "✗", growth: "✗", sentinel: "✓" },
                    { need: "Regulatory readiness review", scanner: "✗", pro: "✗", growth: "✗", sentinel: "✓" },
                  ].map((row) => (
                    <tr key={row.need} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                      <td style={{ ...syne, padding: "1rem 1.5rem", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{row.need}</td>
                      <td style={{ ...syne, padding: "1rem 1.5rem", fontSize: "13px", textAlign: "center", color: row.scanner === "✓" ? "#4ade80" : "rgba(255,255,255,0.3)" }}>{row.scanner}</td>
                      <td style={{ ...syne, padding: "1rem 1.5rem", fontSize: "13px", textAlign: "center", color: row.pro === "✓" ? "#4ade80" : "rgba(255,255,255,0.3)" }}>{row.pro}</td>
                      <td style={{ ...syne, padding: "1rem 1.5rem", fontSize: "13px", textAlign: "center", color: row.growth === "✓" ? "#ef4444" : "rgba(255,255,255,0.3)" }}>{row.growth}</td>
                      <td style={{ ...syne, padding: "1rem 1.5rem", fontSize: "13px", textAlign: "center", color: row.sentinel === "✓" ? "#E5484D" : "rgba(255,255,255,0.3)" }}>{row.sentinel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "2.5rem" }}>
            Pro tier: 14 day money back guarantee. Sentinel: custom contract. All plans include priority email support.
          </p>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.15)", textAlign: "center", marginTop: "0.5rem" }}>
            Regulatory mapping last reviewed: {REGULATORY_MAPPING_LAST_REVIEWED}
          </p>
        </div>
      </section>

      {/* HOW WE COMPARE */}
      <section style={{ padding: "6rem 1.5rem", background: "#0A1628", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(244,241,234,0.5)", marginBottom: "1rem" }}>How we compare</p>
            <h2 className="font-display" style={{ fontSize: "clamp(1.7rem, 4vw, 2.6rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.02em", lineHeight: 1.12 }}>
              The same outcome,<br /><span style={{ fontStyle: "italic", color: "#E5484D" }}>a fraction of the cost.</span>
            </h2>
          </div>

          <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#0D1B2E" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th style={{ ...syne, padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Platform</th>
                  <th style={{ ...syne, padding: "1.25rem 1.5rem", textAlign: "right", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Typical annual cost</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Legacy enterprise GRC (ServiceNow, AuditBoard, MetricStream)", cost: "£200,000 to £790,000+", highlight: false },
                  { name: "OneTrust AI Governance / IBM OpenPages", cost: "£40,000 to £160,000", highlight: false },
                  { name: "Credo AI", cost: "£24,000 to £120,000", highlight: false },
                  { name: "Red Flag AI Pro (Sentinel)", cost: "£60,000", highlight: true },
                  { name: "Red Flag AI Pro (Growth)", cost: "£14,400", highlight: true },
                  { name: "Red Flag AI Pro (Pro)", cost: "£5,988", highlight: true },
                  { name: "Red Flag AI Pro (Scanner)", cost: "£1,788", highlight: true },
                  { name: "Red Flag AI Pro (Assessment)", cost: "Free", highlight: true },
                ].map((row) => (
                  <tr key={row.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: row.highlight ? "rgba(229,72,77,0.06)" : "transparent" }}>
                    <td style={{ ...syne, padding: "1rem 1.5rem", fontSize: "13px", color: row.highlight ? "#F4F1EA" : "rgba(255,255,255,0.55)", fontWeight: row.highlight ? 700 : 400 }}>{row.name}</td>
                    <td style={{ ...syne, padding: "1rem 1.5rem", fontSize: "13px", textAlign: "right", color: row.highlight ? "#ff9b9e" : "rgba(255,255,255,0.5)", fontWeight: row.highlight ? 700 : 400 }}>{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: "1.5rem" }}>
            Competitor figures from published 2026 market research (Credo AI, OneTrust, legacy GRC vendor pricing reports). Most platforms quote custom enterprise pricing. Figures shown are typical ranges, not list prices.
          </p>
        </div>
      </section>

      {/* BUILD VS BUY */}
      <section style={{ padding: "6rem 1.5rem", background: "#0C1929", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(244,241,234,0.5)", marginBottom: "1rem" }}>Build vs. Buy</p>
            <h2 className="font-display" style={{ fontSize: "clamp(1.7rem, 4vw, 2.6rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.02em", lineHeight: 1.12 }}>
              Building this in house costs<br /><span style={{ fontStyle: "italic", color: "#E5484D" }}>far more than it looks.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ background: "#0D1B2E", padding: "2.25rem" }}>
              <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,241,234,0.4)", marginBottom: "1rem" }}>Build it yourself</p>
              <p className="font-mono-fig" style={{ fontSize: "2rem", fontWeight: 500, color: "rgba(244,241,234,0.85)", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "0.4rem" }}>£350k to £500k<span style={{ fontSize: "0.9rem", color: "rgba(244,241,234,0.4)" }}> /yr</span></p>
              <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.4)", marginBottom: "1.5rem" }}>fully loaded, conservative estimate</p>
              {[
                "Engineers to build assessment, evidence & audit log pipelines",
                "Ongoing rework as the EU AI Act, DORA & SEC rules evolve",
                "6+ months before your first board ready report",
                "Your compliance team's time: the scarcest resource you have",
              ].map((t) => (
                <div key={t} style={{ display: "flex", gap: "10px", marginBottom: "0.7rem" }}>
                  <span style={{ color: "rgba(244,241,234,0.3)", flexShrink: 0 }}>✕</span>
                  <span style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#102943", padding: "2.25rem", borderLeft: "2px solid #E5484D" }}>
              <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>Red Flag</p>
              <p className="font-mono-fig" style={{ fontSize: "2rem", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "0.4rem" }}>From £149<span style={{ fontSize: "0.9rem", color: "rgba(244,241,234,0.45)" }}> /mo</span></p>
              <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.45)", marginBottom: "1.5rem" }}>free to assess · live this afternoon</p>
              {[
                "Audit ready evidence out of the box, nothing to build",
                "Maintained against regulatory change, automatically",
                "Your first board ready report in 5 minutes",
                "No engineering, no maintenance, no internal headcount",
              ].map((t) => (
                <div key={t} style={{ display: "flex", gap: "10px", marginBottom: "0.7rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: "2px" }}>
                    <path d="M20 6L9 17l-5-5" stroke="#C9A66B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.75)", lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.45)", textAlign: "center", marginTop: "2rem" }}>
            Same outcome. A fraction of the cost. Available before your next board meeting.
          </p>
        </div>
      </section>

      {/* WHY SENTINEL CTA */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "linear-gradient(180deg, #0D1B2E 0%, #0A1628 100%)",
        borderTop: "1px solid rgba(239,68,68,0.15)"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>Why CFOs choose Sentinel</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2rem", color: "white" }}>
            Governance that <span style={{ background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>regulators accept.</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
            {[
              {
                title: "Forensic Proof",
                desc: "Automated audit logs + output tracking. When regulators ask 'prove it happened,' you have the answer.",
              },
              {
                title: "Implementation Partner",
                desc: "We don't just identify gaps. We build the infrastructure. You're not managing consultants; we're doing it.",
              },
              {
                title: "Board Reporting",
                desc: "Quarterly governance decks + financial impact modeling. Board sees risk declining, compliance improving.",
              },
              {
                title: "Regulatory Readiness",
                desc: "Evidence package mapped to EU AI Act, SEC, GDPR, Munir. Ready for audit, inspection, or enforcement action.",
              },
            ].map((item) => (
              <div key={item.title} style={{
                background: "rgba(16,41,67,0.5)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "12px",
                padding: "2rem",
                textAlign: "left"
              }}>
                <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "3rem",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px",
            padding: "2rem"
          }}>
            <p style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>Ready to know where you stand?</p>
            <p style={{ ...syne, fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "1rem" }}>Take the free 5-minute governance assessment. No email required for the first 2 questions.</p>
            <Link href="/governance-audit" style={{
              display: "inline-block",
              background: "#ef4444",
              color: "white",
              ...syne, fontSize: "0.875rem", fontWeight: 700,
              padding: "12px 32px", borderRadius: "9999px",
              textDecoration: "none"
            }}>
              Start assessment
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulseRed {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <Footer />
    </div>
  );
}
