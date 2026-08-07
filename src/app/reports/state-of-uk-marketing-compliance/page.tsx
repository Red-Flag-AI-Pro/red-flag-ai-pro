import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RULING_COMPANIES, UNIQUE_RULING_COUNT, REPORT_CHECKED_AT, REPORT_TOTAL_CHECKED } from "@/lib/uk-marketing-compliance-report";
import React from "react";

const PERCENTAGE = Math.round((UNIQUE_RULING_COUNT / REPORT_TOTAL_CHECKED) * 100);

export const metadata: Metadata = {
  title: `State of UK Marketing Compliance: ${UNIQUE_RULING_COUNT} of ${REPORT_TOTAL_CHECKED} Businesses Checked Have a Live ASA Ruling`,
  description: `Red Flag AI Pro checked ${REPORT_TOTAL_CHECKED} UK businesses. ${UNIQUE_RULING_COUNT} (${PERCENTAGE}%) already carry a live, upheld ASA ruling against their marketing. Every ruling linked to the ASA's own public record.`,
  alternates: { canonical: "https://www.redflagaipro.com/reports/state-of-uk-marketing-compliance" },
  openGraph: {
    title: `${UNIQUE_RULING_COUNT} of ${REPORT_TOTAL_CHECKED} UK businesses checked already have a live ASA ruling`,
    description: "Every ruling linked to the ASA's own public record, updated as more businesses are checked.",
    url: "https://www.redflagaipro.com/reports/state-of-uk-marketing-compliance",
  },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

function scoreColor(score: number | null) {
  if (score === null) return "rgba(244,241,234,0.4)";
  if (score >= 70) return "#4ade80";
  if (score >= 40) return "#fbbf24";
  return "#ff9b9e";
}

export default function StateOfUKMarketingCompliancePage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Living report</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.15, marginBottom: "1.25rem" }}>
            <span style={{ color: "#E5484D" }}>{UNIQUE_RULING_COUNT} of {REPORT_TOTAL_CHECKED}</span> UK businesses we checked already have a live ASA ruling.
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "580px", margin: "0 auto" }}>
            {PERCENTAGE}% of the businesses run through Red Flag&apos;s compliance check on {new Date(REPORT_CHECKED_AT).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} carry an upheld Advertising Standards Authority ruling against their own marketing. Every ruling below links to the ASA&apos;s own published decision, not our word for it.
          </p>
        </div>
      </section>

      <section style={{ padding: "3rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>Methodology, stated plainly</p>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.6)", lineHeight: 1.75, marginBottom: "1rem" }}>
            {REPORT_TOTAL_CHECKED} UK businesses were run through Red Flag&apos;s own compliance check on {new Date(REPORT_CHECKED_AT).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Each ruling here was independently verified against the ASA&apos;s own public rulings register, deduplicated by ruling reference so the same decision is never counted twice under two spellings of a company name.
          </p>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.6)", lineHeight: 1.75 }}>
            The score shown is Red Flag&apos;s own automated check score for that company&apos;s site at the time, out of 100. It is shown even where it is high, because several of these companies score well on an automated read of their copy while still carrying a real ASA ruling — the ruling often concerns something a text check alone would not catch, like a subscription trap or a missing influencer disclosure. That is a limit worth stating honestly, not a result worth hiding.
          </p>
        </div>
      </section>

      <section style={{ padding: "3rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.25rem" }}>
            Every ruling, linked
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "620px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                  <th style={{ ...syne, textAlign: "left", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(244,241,234,0.5)", padding: "0 1rem 0.75rem 0" }}>Company</th>
                  <th style={{ ...syne, textAlign: "left", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(244,241,234,0.5)", padding: "0 1rem 0.75rem 0" }}>What ASA upheld</th>
                  <th style={{ ...syne, textAlign: "left", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(244,241,234,0.5)", padding: "0 1rem 0.75rem 0" }}>Our score</th>
                  <th style={{ ...syne, textAlign: "left", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(244,241,234,0.5)", padding: "0 0 0.75rem 0" }}>Ruling</th>
                </tr>
              </thead>
              <tbody>
                {RULING_COMPANIES.map((c) => (
                  <tr key={c.ruling} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ ...syne, fontSize: "12.5px", color: "#F4F1EA", padding: "0.85rem 1rem 0.85rem 0", verticalAlign: "top" }}>
                      {c.name}
                      <div style={{ ...mono, fontSize: "10.5px", color: "rgba(244,241,234,0.35)", marginTop: "2px" }}>{c.domain}</div>
                    </td>
                    <td style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.6)", padding: "0.85rem 1rem 0.85rem 0", verticalAlign: "top" }}>{c.categories}</td>
                    <td style={{ ...mono, fontSize: "13px", fontWeight: 700, color: scoreColor(c.score), padding: "0.85rem 1rem 0.85rem 0", verticalAlign: "top" }}>{c.score === null ? "—" : c.score}</td>
                    <td style={{ padding: "0.85rem 0", verticalAlign: "top" }}>
                      <a href={c.ruling} target="_blank" rel="noopener noreferrer" style={{ ...syne, fontSize: "12px", color: "#E5484D", textDecoration: "none" }}>
                        ASA record →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ padding: "3.5rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.75rem" }}>Check where your own business stands</h2>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            Free, under 60 seconds, no card needed.
          </p>
          <a href="/compliance-assessment" style={{
            display: "inline-block", background: "#E5484D", color: "white",
            ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "14px 32px",
            borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
            textDecoration: "none", letterSpacing: "0.02em",
          }}>
            Run the free check →
          </a>
        </div>
      </section>

      <section style={{ padding: "2rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ ...syne, fontSize: "11px", color: "rgba(244,241,234,0.35)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
          Compiled by Red Flag AI Pro from public ASA rulings. This is a research finding, not an accusation — every claim here is sourced to the regulator&apos;s own published decision, linked above. Businesses listed have already had their case decided by the ASA; nothing here is Red Flag&apos;s own judgment.
        </p>
      </section>

      <Footer />
    </div>
  );
}
