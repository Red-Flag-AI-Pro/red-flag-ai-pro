import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import React from "react";

export const metadata: Metadata = {
  title: "Red Flag AI Pro vs Competitors — Marketing Compliance Tool Comparison",
  description: "How Red Flag AI Pro compares to Red Marker, Blee, and manual compliance consultants. Feature comparison, pricing and honest assessment of what each tool actually does.",
  alternates: { canonical: "https://www.redflagaipro.com/compare" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const COMPARISON = [
  { feature: "Price per month", rfp: "Free – £5000+", redmarker: "£2,000 – £10,000", consultant: "£500 – £3,000" },
  { feature: "Setup time", rfp: "Same day", redmarker: "Weeks", consultant: "Days" },
  { feature: "Scan speed", rfp: "60 seconds", redmarker: "Hours to days", consultant: "48–72 hours" },
  { feature: "Free scan available", rfp: "✓ No signup", redmarker: "✗", consultant: "✗" },
  { feature: "URL page scanning", rfp: "✓ Growth & Sentinel", redmarker: "Limited", consultant: "Manual" },
  { feature: "YouTube VSL scanning", rfp: "✓ Sentinel only", redmarker: "✗", consultant: "Manual" },
  { feature: "Audio transcription", rfp: "✓ Sentinel only", redmarker: "✗", consultant: "Manual" },
  { feature: "Full site audit", rfp: "✓ Sentinel only", redmarker: "✗", consultant: "Extra charge" },
  { feature: "Weekly auto-monitoring", rfp: "✓ Sentinel only", redmarker: "✗", consultant: "✗" },
  { feature: "FCA financial promotions", rfp: "✓ Sentinel only", redmarker: "Enterprise only", consultant: "Specialist only" },
  { feature: "Greenwashing scanner", rfp: "✓ Sentinel only", redmarker: "Limited", consultant: "Specialist only" },
  { feature: "EU AI Act compliance", rfp: "✓ All plans", redmarker: "Partial", consultant: "Variable" },
  { feature: "Multi-jurisdiction", rfp: "✓ All plans", redmarker: "Sometimes", consultant: "Variable" },
  { feature: "Team seats", rfp: "✓ Sentinel only", redmarker: "✓", consultant: "N/A" },
  { feature: "White-label reports", rfp: "✓ Sentinel only", redmarker: "✗", consultant: "✗" },
  { feature: "REST API + webhooks", rfp: "✓ Sentinel only", redmarker: "✗", consultant: "✗" },
  { feature: "Chrome extension", rfp: "✓ Sentinel only", redmarker: "✗", consultant: "✗" },
  { feature: "Video scan summaries", rfp: "✓ Growth & Sentinel", redmarker: "✗", consultant: "✗" },
  { feature: "Signed PDF certificates", rfp: "✓ Sentinel only", redmarker: "✓", consultant: "✓" },
  { feature: "Risk categories covered", rfp: "24 — Sentinel / 16 — Pro", redmarker: "8–12", consultant: "Variable" },
];

export default function ComparePage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
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
          width: "700px", height: "400px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(229,72,77,0.12) 0%, transparent 65%)"
        }} />
        <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span className="flag-wave" style={{ display: "inline-block" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>Comparison</p>
          </div>
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Red Flag AI Pro<br />vs the alternatives
          </h1>
          <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Enterprise compliance tools charge £2,000–£10,000 a month and take weeks to onboard. Manual consultants charge by the hour and take days. Here is the honest comparison.
          </p>
        </div>
      </section>

      {/* TABLE */}
      <section style={{ padding: "5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.08)" }}>
                <th style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textAlign: "left", padding: "1rem 1rem 1rem 0", width: "35%" }}>Feature</th>
                <th style={{ padding: "1rem", textAlign: "center", background: "rgba(229,72,77,0.05)", borderLeft: "1px solid rgba(239,68,68,0.15)", borderRight: "1px solid rgba(239,68,68,0.15)" }}>
                  <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#ef4444" }}>Red Flag AI Pro</p>
                  <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Free–£5000+/mo</p>
                </th>
                <th style={{ padding: "1rem", textAlign: "center" }}>
                  <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>Red Marker / Blee</p>
                  <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "2px" }}>£2,000–£10,000/mo</p>
                </th>
                <th style={{ padding: "1rem", textAlign: "center" }}>
                  <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>Compliance consultant</p>
                  <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "2px" }}>£500–£3,000/mo</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.feature} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                  <td style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", padding: "0.875rem 1rem 0.875rem 0" }}>{row.feature}</td>
                  <td style={{
                    padding: "0.875rem 1rem", textAlign: "center",
                    background: "rgba(229,72,77,0.03)",
                    borderLeft: "1px solid rgba(239,68,68,0.08)",
                    borderRight: "1px solid rgba(239,68,68,0.08)"
                  }}>
                    <span style={{
                      ...syne, fontSize: "13px", fontWeight: 600,
                      color: row.rfp.startsWith("✓") ? "#4ade80" : row.rfp === "✗" ? "#ef4444" : "white"
                    }}>{row.rfp}</span>
                  </td>
                  <td style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)", padding: "0.875rem 1rem", textAlign: "center" }}>{row.redmarker}</td>
                  <td style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)", padding: "0.875rem 1rem", textAlign: "center" }}>{row.consultant}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1.5rem", textAlign: "center" }}>
            Competitor pricing based on publicly available information and industry estimates. May 2026.
          </p>
        </div>
      </section>

      {/* WHY CHEAPER */}
      <section style={{ padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0C1929" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "3rem", textAlign: "center" }}>Why cheaper</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
            {[
              { title: "Software, not consultants", body: "Enterprise tools charge for account managers, onboarding specialists and support teams. We built software that does the work. No overhead means lower prices." },
              { title: "Built for speed", body: "60 seconds to scan, same day to set up. No onboarding calls, no implementation projects, no change management. You log in and it works." },
              { title: "Built from experience", body: "This was built by someone who needed it and couldn't afford the alternative. The pricing reflects that. It always will." },
            ].map((item, i) => (
              <div key={item.title} style={{
                background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(239,68,68,0.12)"}`,
                padding: "2rem"
              }}>
                <h3 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</h3>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "7rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <h2 style={{ ...syne, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Try it free. No account needed.
          </h2>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "2.5rem" }}>
            Paste any marketing copy and see what we find. 60 seconds.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/#demo" style={{
              display: "inline-block",
              background: "#E5484D", color: "white",
              ...syne, fontSize: "0.875rem", fontWeight: 700,
              padding: "13px 28px", borderRadius: "9999px",
              boxShadow: "0 8px 24px rgba(229,72,77,0.3)",
              textDecoration: "none"
            }}>
              Run a free scan
            </a>
            <Link href="/pricing" style={{
              display: "inline-block",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
              ...syne, fontSize: "0.875rem", fontWeight: 600,
              padding: "13px 28px", borderRadius: "9999px",
              textDecoration: "none"
            }}>
              See pricing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
