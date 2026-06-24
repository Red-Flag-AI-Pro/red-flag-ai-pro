import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { REGULATORY_MAPPING_LAST_REVIEWED } from "@/lib/constants";
import React from "react";

export const metadata: Metadata = {
  title: "Red Flag AI Pro: For Investors",
  description: "AI governance evidence for the small and mid size segment enterprise tools ignore. The pitch, the market timing, and the real numbers, in one place.",
  alternates: { canonical: "https://www.redflagaipro.com/investors" },
  robots: { index: false, follow: false },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1.75rem 1.5rem", textAlign: "center" }}>
      <p className="font-mono-fig" style={{ ...mono, fontSize: "2rem", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>{value}</p>
      <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "3.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>{title}</p>
        {children}
      </div>
    </section>
  );
}

export default function InvestorsPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>For Investors</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.02em", lineHeight: 1.12, marginBottom: "1.25rem" }}>
            Verifiable AI governance for the price bracket <span style={{ fontStyle: "italic", color: "#E5484D" }}>enterprise tools ignore.</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
            Companies have zero way to prove AI governance when a regulator or board asks. EU AI Act enforcement starts August 2026. SEC is running 2026 exams testing exactly this. Everyone who already serves this charges £24,000 to £790,000 a year and only sells to enterprise.
          </p>
        </div>
      </section>

      <Section title="The Founder">
        <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
          James Stokes, a solo founder with no technical background. Red Flag started as a compliance scanner for course creators and pivoted to AI governance when the regulatory pattern became impossible to ignore. Every feature on this site was built using AI, by someone who isn&apos;t a lawyer or an engineer. That&apos;s not a positioning line, it&apos;s the literal build process, and it&apos;s also the product&apos;s thesis: governance tooling doesn&apos;t require a law degree to use, it requires the right structure.
        </p>
      </Section>

      <Section title="The Gap">
        <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "2rem" }}>
          83% of organizations use AI. Only 25% have adequate governance. Every existing solution, Credo AI, OneTrust, legacy GRC platforms, serves enterprise only, at enterprise pricing. Nobody affordable serves the next 10,000 companies below that line.
        </p>
        <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#0D1B2E" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th style={{ ...syne, padding: "1rem 1.25rem", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Platform</th>
                <th style={{ ...syne, padding: "1rem 1.25rem", textAlign: "right", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Typical annual cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Legacy enterprise GRC (ServiceNow, AuditBoard, MetricStream)", cost: "£200,000 to £790,000+", highlight: false },
                { name: "OneTrust AI Governance / IBM OpenPages", cost: "£40,000 to £160,000", highlight: false },
                { name: "Credo AI", cost: "£24,000 to £120,000", highlight: false },
                { name: "Red Flag AI Pro (Sentinel)", cost: "£60,000", highlight: true },
                { name: "Red Flag AI Pro (Pro)", cost: "£4,200", highlight: true },
                { name: "Red Flag AI Pro (Assessment)", cost: "Free", highlight: true },
              ].map((row) => (
                <tr key={row.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: row.highlight ? "rgba(229,72,77,0.06)" : "transparent" }}>
                  <td style={{ ...syne, padding: "0.85rem 1.25rem", fontSize: "13px", color: row.highlight ? "#F4F1EA" : "rgba(255,255,255,0.55)", fontWeight: row.highlight ? 700 : 400 }}>{row.name}</td>
                  <td style={{ ...syne, padding: "0.85rem 1.25rem", fontSize: "13px", textAlign: "right", color: row.highlight ? "#ff9b9e" : "rgba(255,255,255,0.5)", fontWeight: row.highlight ? 700 : 400 }}>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Why Now">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            ["EU AI Act enforcement begins", "2 August 2026. Fines up to €35M or 7% of global turnover"],
            ["FTC penalty per violation", "$53,088, already enforced against Cox Media Group (about $1M, May 2026)"],
            ["SEC", "named AI governance a 2026 exam priority, testing for “AI washing”"],
            ["AI usage vs. policy gap", "over half of employees use AI at work; under 40% of companies have a policy covering it"],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#F4F1EA" }}>{k}</p>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{v}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Traction (Pre Revenue, Early)">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <StatCard value="147" label="Visitors, last 7 days" />
          <StatCard value="13" label="Signups, last 7 days" />
          <StatCard value="7" label="Assessments completed, last 7 days" />
          <StatCard value="8" label="Free tools live" />
        </div>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
          Pivoted recently, validating before pushing spend on growth. Normal for this stage. The build is real and live; the customer base is not yet.
        </p>
      </Section>

      <Section title="Product, Live Today">
        <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
          Everything below is real and working, checked the same day as this page. Free assessment scores governance maturity across 6 dimensions, mapped question by question to EU AI Act, SEC, GDPR and FTC requirements, not decorative labels.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.5rem" }}>
          {["AI Governance Assessment", "Fine Calculator", "Compliance Checklist", "Disclosure Generator", "Contract Red Flags Checker", "Accessibility Score Checker", "Shadow AI Audit", "URL Exposure Checker", "AI Visibility Checker"].map((t) => (
            <span key={t} style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "0.6rem 0.85rem" }}>{t}</span>
          ))}
        </div>
        <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "1rem" }}>Regulatory mapping last reviewed: {REGULATORY_MAPPING_LAST_REVIEWED}.</p>
      </Section>

      <Section title="The Moat">
        <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
          Not a patent. Speed today; accumulated audit history and client relationships over time. Once a client has months of evidence in the system, switching costs them their record right when a regulator might ask. Sentinel means the founder works directly with clients, which doesn&apos;t scale infinitely but builds the kind of trust enterprise tools can&apos;t buy at this price point.
        </p>
      </Section>

      <section style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Questions, numbers, or access to the product itself: reach out directly.
          </p>
          <Link href="mailto:support@redflagaipro.com" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", textDecoration: "none" }}>
            Get in touch →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
