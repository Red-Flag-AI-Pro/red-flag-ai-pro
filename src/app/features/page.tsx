import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Governance Features — Red Flag AI Pro",
  description:
    "6-dimension governance assessment, strategic roadmap generation, forensic monitoring, vendor risk tracking, regulatory evidence automation, board reporting, and automated governance enforcement.",
  alternates: { canonical: "https://www.redflagaipro.com/features" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

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
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Governance Engine</p>
          <h1 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.5rem", background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #E5484D 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Every tool you need to prove governance.
          </h1>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.7 }}>
            From assessment to implementation to forensic proof. Governance infrastructure built for CFOs, compliance teams, and regulated enterprises.
          </p>
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
                  icon: "📊",
                  title: "6-Dimension Assessment",
                  desc: "Strategy & Decision Rights, Tool & Data Governance, Policy & Documentation, Monitoring & Outcome Accountability, Vendor Risk, Regulatory Readiness.",
                },
                {
                  icon: "🎯",
                  title: "Instant Maturity Scoring",
                  desc: "0-100 governance score. Dimension breakdown (0-30 each). Risk level classification (Critical/Moderate/Managed/Mature).",
                },
                {
                  icon: "🚩",
                  title: "Critical Gap Identification",
                  desc: "Top 3-5 gaps ranked by severity. Each flagged with regulatory context (Munir, SEC, EU AI Act, FTC, GDPR).",
                },
                {
                  icon: "📈",
                  title: "Strategic Roadmap",
                  desc: "90-day quick wins, 6-month medium-term, 12-month strategic plan. Owner + timeline for each action.",
                },
                {
                  icon: "📄",
                  title: "Board-Ready PDF",
                  desc: "6-page report: cover, dimension breakdown, red flags, strategic roadmap, executive summary, regulatory mapping.",
                },
                {
                  icon: "👥",
                  title: "Peer Benchmarking",
                  desc: "Compare your score to industry average. See top quartile. Know where you stand relative to peers.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "rgba(15, 5, 5, 0.6)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "12px",
                    padding: "2rem",
                  }}
                >
                  <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{item.icon}</p>
                  <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PRO TIER FEATURES */}
          <div style={{ marginBottom: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>PRO Tier (£350/mo)</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", color: "white", textAlign: "center" }}>
              Ongoing Monitoring & Proof
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {[
                {
                  icon: "🔄",
                  title: "Monthly Governance Reassessment",
                  desc: "Quarterly governance score updates. Track improvement over time. Measure progress against roadmap.",
                },
                {
                  icon: "🏢",
                  title: "Vendor AI Risk Tracking",
                  desc: "Track all third-party AI tools. Risk assessment scores. Data flow mapping. Contract checklist per vendor.",
                },
                {
                  icon: "📊",
                  title: "Monthly Compliance Dashboard",
                  desc: "Dimension trends. Gap closure progress. Vendor risk overview. Policy compliance metrics.",
                },
                {
                  icon: "🔍",
                  title: "Policy-to-Practice Gap Detection",
                  desc: "Identify where policy differs from actual desk behavior. Governance drift alerts. Non-compliance flags.",
                },
                {
                  icon: "📋",
                  title: "Evidence Package Generation",
                  desc: "Auto-generated audit-ready artifacts. Governance logs. Compliance checklist. Regulatory framework mapping.",
                },
                {
                  icon: "🎓",
                  title: "Quarterly Improvement Roadmaps",
                  desc: "Updated strategic plan every 90 days. Adjust based on progress. New quick wins. Reorder by impact.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "rgba(15, 5, 5, 0.8)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "12px",
                    padding: "2rem",
                  }}
                >
                  <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{item.icon}</p>
                  <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SENTINEL TIER FEATURES */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem", textAlign: "center" }}>SENTINEL Tier (£5000+/mo)</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", color: "white", textAlign: "center" }}>
              Managed Governance + Forensic Proof
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {[
                {
                  icon: "🛠️",
                  title: "Managed Implementation",
                  desc: "We build governance for you. Framework selection. Process design. Team training. Deployment support.",
                },
                {
                  icon: "🔐",
                  title: "Automated Audit Logging",
                  desc: "Forensic audit trails for every AI decision. Output tracking. Model versioning. Approval chains. Immutable records.",
                },
                {
                  icon: "📉",
                  title: "Real-Time Output Drift Detection",
                  desc: "Monitor for model degradation. Alert on anomalies. Catch policy violations before they're live. Performance tracking.",
                },
                {
                  icon: "💰",
                  title: "Financial Impact Modeling",
                  desc: "Compliance cost calculator. Penalty risk modeling. ROI of governance investment. Board-ready financial impact.",
                },
                {
                  icon: "🛡️",
                  title: "Automated Governance Enforcement",
                  desc: "Guardrails enforcement. Policy automation. Unapproved tool blocking. Data flow controls. Automated remediation.",
                },
                {
                  icon: "📊",
                  title: "Quarterly Board Reporting",
                  desc: "Executive decks. Governance scorecard. Risk trends. Compliance status. Regulatory readiness. Financial impact.",
                },
                {
                  icon: "✅",
                  title: "Regulatory Certification",
                  desc: "Governance certification mapped to EU AI Act, SEC, GDPR, Munir. Audit-ready evidence package. Compliance badge.",
                },
                {
                  icon: "🔗",
                  title: "API Integrations",
                  desc: "Vendor mgmt systems. Security tools. Finance systems. Custom integrations. Webhook automation.",
                },
                {
                  icon: "👨‍💼",
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
                  <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{item.icon}</p>
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
    </div>
  );
}
