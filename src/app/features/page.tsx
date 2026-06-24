import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { REGULATORY_MAPPING_LAST_REVIEWED } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Governance and Compliance Scanning Features: Red Flag AI Pro",
  description:
    "Real time compliance scanning across 9 jurisdictions and 30 risk categories, plus a six dimension governance assessment, strategic roadmap generation, audit logging, vendor risk tracking, and board ready reporting.",
  alternates: { canonical: "https://www.redflagaipro.com/features" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

const RECENT_REGULATORY_UPDATES = [
  { date: "May 2026", text: "FTC settled with Cox Media Group and two other firms for ~$1M over deceptive claims about an AI powered marketing service. First major \"AI washing\" settlement of the year." },
  { date: "May 2026", text: "EU AI Act timeline revised: high risk system deadlines pushed to Dec 2027 (Annex III) and Aug 2028 (Annex I), but prohibited practice and GPAI rules are already enforceable now, with fines up to €35M / 7% of turnover." },
  { date: "Jan 2026", text: "SEC named AI governance a cross cutting 2026 exam priority. Examiners will test whether firms' AI disclosures and controls match what their systems actually do, and scrutinise \"AI washing\" claims directly." },
];

export default function FeaturesPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        background: "#0A1628",
        padding: "6rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Compliance Scanning + AI Governance, re-checked against the official text every time the law moves</p>
          <h1 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.5rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Every tool you need to catch risk, then prove governance.
          </h1>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "1rem", lineHeight: 1.7 }}>
            From real time copy scanning to governance assessment to forensic proof. Infrastructure built for marketers, agencies, CFOs, and compliance teams alike.
          </p>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            Regulatory mapping last reviewed: {REGULATORY_MAPPING_LAST_REVIEWED}
          </p>
        </div>
      </section>

      {/* RECENT REGULATORY UPDATES */}
      <section style={{ padding: "4rem 1.5rem", background: "#0A1628", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>
            What we&apos;re tracking
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {RECENT_REGULATORY_UPDATES.map((u) => (
              <div key={u.text} style={{ display: "flex", gap: "1.25rem", background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 1.5rem" }}>
                <span style={{ ...mono, fontSize: "11px", fontWeight: 700, color: "#C9A66B", flexShrink: 0, paddingTop: "2px" }}>{u.date}</span>
                <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{u.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BY TIER */}
      <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>Core Capabilities</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", color: "white", textAlign: "center" }}>
              All Tiers Include
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {[
                {
                  icon: "",
                  title: "Real Time Compliance Scanning",
                  desc: "9 jurisdictions, up to 30 risk categories. Paste copy or a URL and get a flagged result in under 60 seconds.",
                },
                {
                  icon: "",
                  title: "6-Dimension Assessment",
                  desc: "Strategy & Decision Rights, Tool & Data Governance, Policy & Documentation, Monitoring & Outcome Accountability, Vendor Risk, Regulatory Readiness.",
                },
                {
                  icon: "",
                  title: "Instant Maturity Scoring",
                  desc: "0-100 governance score. Dimension breakdown (0-30 each). Risk level classification (Critical/Moderate/Managed/Mature).",
                },
                {
                  icon: "",
                  title: "Critical Gap Identification",
                  desc: "Top 3 to 5 gaps ranked by severity. Each flagged with regulatory context (Munir, SEC, EU AI Act, FTC, GDPR).",
                },
                {
                  icon: "",
                  title: "Strategic Roadmap",
                  desc: "90 day quick wins, 6 month medium term, 12 month strategic plan. Owner + timeline for each action.",
                },
                {
                  icon: "",
                  title: "Board Ready PDF",
                  desc: "Six page report: cover, dimension breakdown, red flags, strategic roadmap, executive summary, regulatory mapping.",
                },
                {
                  icon: "",
                  title: "Peer Benchmarking",
                  desc: "Compare your score to industry average. See top quartile. Know where you stand relative to peers.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "rgba(16,41,67,0.6)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "12px",
                    padding: "2rem",
                  }}
                >
                  <div style={{ width: "32px", height: "2px", background: "#E5484D", marginBottom: "1.25rem" }} />
                  <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PRO TIER FEATURES */}
          <div style={{ marginBottom: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>GROWTH Tier (£1,200/mo)</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", color: "white", textAlign: "center" }}>
              Ongoing Monitoring & Proof
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {[
                {
                  icon: "",
                  title: "Monthly Governance Reassessment",
                  desc: "Quarterly governance score updates. Track improvement over time. Measure progress against roadmap.",
                },
                {
                  icon: "",
                  title: "Vendor AI Risk Tracking",
                  desc: "Track all third party AI tools. Risk assessment scores. Data flow mapping. Contract checklist per vendor.",
                },
                {
                  icon: "",
                  title: "Monthly Compliance Dashboard",
                  desc: "Dimension trends. Gap closure progress. Vendor risk overview. Policy compliance metrics.",
                },
                {
                  icon: "",
                  title: "Policy to Practice Gap Detection",
                  desc: "Identify where policy differs from actual desk behavior. Governance drift alerts. Non compliance flags.",
                },
                {
                  icon: "",
                  title: "Evidence Package Generation",
                  desc: "Auto generated audit ready artifacts. Governance logs. Compliance checklist. Regulatory framework mapping.",
                },
                {
                  icon: "",
                  title: "Quarterly Improvement Roadmaps",
                  desc: "Updated strategic plan every 90 days. Adjust based on progress. New quick wins. Reorder by impact.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "rgba(16,41,67,0.8)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "12px",
                    padding: "2rem",
                  }}
                >
                  <div style={{ width: "32px", height: "2px", background: "#E5484D", marginBottom: "1.25rem" }} />
                  <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SENTINEL TIER FEATURES */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem", textAlign: "center" }}>SENTINEL Tier (custom pricing)</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", color: "white", textAlign: "center" }}>
              Managed Governance + Forensic Proof
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {[
                {
                  icon: "",
                  title: "Managed Implementation",
                  desc: "We build governance for you. Framework selection. Process design. Team training. Deployment support.",
                },
                {
                  icon: "",
                  title: "Automated Audit Logging",
                  desc: "Immutable, tamper resistant audit trail of every governance action. Report downloads, vendor reviews, policy changes, stored server side, never editable by a user.",
                },
                {
                  icon: "",
                  title: "Ongoing Governance Monitoring",
                  desc: "Monthly vendor and governance review reminders. Track drift between policy and practice. Flag gaps before they're tested by a regulator.",
                },
                {
                  icon: "",
                  title: "Financial Impact Modeling",
                  desc: "Compliance cost calculator. Penalty risk modeling. ROI of governance investment. Board ready financial impact.",
                },
                {
                  icon: "",
                  title: "Governance Enforcement Support",
                  desc: "We help you design and roll out real guardrails: policy enforcement, tool approval processes, data flow controls, with your team.",
                },
                {
                  icon: "",
                  title: "Board Ready Reporting",
                  desc: "Governance scorecard. Risk trends. Compliance status. Built into a report you can take straight into your next board meeting.",
                },
                {
                  icon: "",
                  title: "Regulatory Readiness Review",
                  desc: "Your governance mapped to EU AI Act, SEC, GDPR, Munir. Audit ready evidence package showing exactly where you stand against each framework.",
                },
                {
                  icon: "",
                  title: "API Access",
                  desc: "Programmatic access to your scan and assessment data, build it into your own vendor management, security or finance workflows.",
                },
                {
                  icon: "",
                  title: "Dedicated Governance Advisor",
                  desc: "Quarterly strategy calls. Roadmap updates. Best practice guidance. Regulatory news briefings. Continuous improvement.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "rgba(255, 0, 0, 0.08)",
                    border: "1px solid rgba(229,72,77,0.3)",
                    borderRadius: "12px",
                    padding: "2rem",
                  }}
                >
                  <div style={{ width: "32px", height: "2px", background: "#E5484D", marginBottom: "1.25rem" }} />
                  <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 1.5rem", background: "#0A1628", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.5rem", color: "white" }}>
            Ready to know where you stand?
          </h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.7 }}>
            Start with a free assessment. See your score, gaps, and roadmap. Then choose Pro or Sentinel.
          </p>
          <Link href="/governance-audit" style={{
            ...syne, fontSize: "1rem", fontWeight: 700,
            background: "#ef4444", color: "white",
            padding: "14px 40px", borderRadius: "9999px",
            textDecoration: "none", display: "inline-block"
          }}>
            Start assessment
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
