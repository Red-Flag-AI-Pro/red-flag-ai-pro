import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { REGULATORY_MAPPING_LAST_REVIEWED, PLAN_PRICES, JURISDICTION_COUNT, RISK_CATEGORY_COUNT } from "@/lib/constants";
import { GovernanceLifecycleDiagram } from "@/components/marketing/GovernanceLifecycleDiagram";

export const metadata: Metadata = {
  title: "Governance and Compliance Checking Features: Red Flag AI Pro",
  description:
    `Real time compliance checking across ${JURISDICTION_COUNT} jurisdictions and ${RISK_CATEGORY_COUNT} risk categories, plus a six dimension governance assessment, strategic roadmap generation, audit logging, vendor risk tracking, and board ready reporting.`,
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.65)" }}>Features</p>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.4rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1.5rem", color: "#F4F1EA" }}>
            Every tool you need to catch risk, <span style={{ fontStyle: "italic", color: "#E5484D" }}>then prove governance.</span>
          </h1>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "1rem", lineHeight: 1.7 }}>
            From real time copy checking to governance assessment to forensic proof. Infrastructure built for marketers, agencies, CFOs, and compliance teams alike.
          </p>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            Regulatory mapping last reviewed: {REGULATORY_MAPPING_LAST_REVIEWED}
          </p>
        </div>
      </section>

      {/* RECENT REGULATORY UPDATES */}
      <section style={{ padding: "4rem 1.5rem", background: "#0A1628", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem", textAlign: "center" }}>
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

      {/* THE PROOF LAYER — the differentiator, and the part nobody could find */}
      <section style={{ padding: "6rem 1.5rem", background: "#0A1628", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem", textAlign: "center" }}>The proof layer</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.25rem", color: "white", textAlign: "center" }}>
            Anyone can write a policy. This proves one was followed.
          </h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "3rem", maxWidth: "700px", margin: "0 auto 3rem", textAlign: "center" }}>
            Every governance product will tell you it keeps a record. The question worth asking is whether that record could survive someone checking it. These are the parts built for that.
          </p>

          <div style={{ marginBottom: "4rem" }}>
            <GovernanceLifecycleDiagram />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2px" }}>
            {[
              {
                title: "Boundary authorization records",
                desc: "One sealed record per AI system: what was approved, who approved it, in what role, when it expires, and the specific observable conditions that void it early, and anyone who notices one become true can act on it directly, without needing edit rights over the record. Covers API keys and agent credentials too, since a credential is standing authority the same way a decision is.",
                href: "/boundary-authorization-records",
                linkText: "Every field, and why it exists",
              },
              {
                title: "The decision authority map",
                desc: "Across every system you have authorized: how many decisions a human still makes, how many the AI recommends and a human clears, and how many the system now makes outright. Plus the ones where nobody ever said, which is usually the largest group at first.",
                href: "/boundary-authorization-records",
                linkText: "How the map works",
              },
              {
                title: "Commit before reveal",
                desc: "A reviewer records their own read of a flag before the AI's reasoning is shown to them, sealed in that order. You cannot rubber stamp a conclusion you have not seen yet. Enforced in the system, not promised in the interface.",
                href: null,
                linkText: null,
              },
              {
                title: "Reviewer signal, not just sign-offs",
                desc: "How long a reviewer took before signing, and how often their sign-offs actually push back on a flag rather than accepting it. A clean approval history can mean careful judgment, or it can mean nobody looked. These tell them apart.",
                href: null,
                linkText: null,
              },
              {
                title: "Sealed lapses and expiry",
                desc: "When an authorization passes its expiry, the lapse is sealed as its own dated event before any successor exists. A gap in coverage becomes a recorded fact rather than something reconstructed later, if anyone thinks to look.",
                href: "/boundary-authorization-records",
                linkText: "What happens when one lapses",
              },
              {
                title: "Independent witnessing",
                desc: "Records are hash chained and independently timestamped, and separate companies witness each other's chains so the proof does not rest on our word alone. There is a live tamper test you can run yourself.",
                href: "/witness-network",
                linkText: "See the witness network",
              },
              {
                title: "Remediation tracking",
                desc: "A flag being found and disposed of is not the end of the record. Whether it was actually fixed, and when, is a separate, later confirmation, sealed on its own so a judgment call and a genuine fix can never be collapsed into one event.",
                href: null,
                linkText: null,
              },
              {
                title: "Authority health, at a glance",
                desc: "Whether a scope decision still holds should never depend on someone remembering to ask. Every authorization you've recorded shows as a running count, still valid, unbounded, or already lapsed, so a gap in coverage is a visible fact on your dashboard, not something waiting to be discovered.",
                href: "/boundary-authorization-records",
                linkText: "See how it's scored",
              },
            ].map((item, i) => (
              <div key={item.title} style={{ background: i % 2 === 0 ? "#0D1B2E" : "#102943", border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`, padding: "2rem" }}>
                <p style={{ ...mono, fontSize: "10px", color: "#E5484D", letterSpacing: "0.15em", marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</p>
                <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: item.href ? "1rem" : 0 }}>{item.desc}</p>
                {item.href && (
                  <Link href={item.href} style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "#E5484D", textDecoration: "none" }}>
                    {item.linkText} →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: "2.5rem" }}>
            The proof layer is part of Sentinel. Read the thinking behind it in{" "}
            <Link href="/who-when-whether" style={{ color: "#C9A66B", textDecoration: "none" }}>the whitepaper</Link>.
          </p>
        </div>
      </section>

      {/* FEATURES BY TIER */}
      <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem", textAlign: "center" }}>Core Capabilities</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", color: "white", textAlign: "center" }}>
              All Tiers Include
            </h2>

            <div className="tier-grid">
              {[
                {
                  icon: "",
                  title: "Real Time Compliance Checking",
                  desc: `${JURISDICTION_COUNT} jurisdictions, up to ${RISK_CATEGORY_COUNT} risk categories. Paste copy or a URL and get a flagged result in under 60 seconds.`,
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
                {
                  icon: "",
                  title: "Your Full History, Not Just Today's Flags",
                  desc: "Every result lists the categories checked that came back clean, not only the ones that flagged, and shows your score against your previous check automatically. A clean result is evidence too, and improvement is visible without anyone having to go looking for it.",
                },
                {
                  icon: "",
                  title: "24 Free Tools, No Account",
                  desc: "Fine calculator, DPIA generator, FRIA assistant, EU database registration assistant, contract red flags checker, accessibility scorer, shadow AI audit and more. Free, and they stay free.",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                    border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
                    padding: "2rem",
                  }}
                >
                  <p style={{ ...mono, fontSize: "10px", color: "#E5484D", letterSpacing: "0.15em", marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</p>
                  <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PRO TIER FEATURES */}
          <div style={{ marginBottom: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem", textAlign: "center" }}>GROWTH Tier (£{PLAN_PRICES.enterprise.monthly.toLocaleString("en-GB")}/mo)</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", color: "white", textAlign: "center" }}>
              Ongoing Monitoring & Proof
            </h2>

            <div className="tier-grid">
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
              ].map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    background: i % 2 === 0 ? "#102943" : "#0D1B2E",
                    border: "1px solid rgba(239,68,68,0.18)",
                    padding: "2rem",
                  }}
                >
                  <p style={{ ...mono, fontSize: "10px", color: "#E5484D", letterSpacing: "0.15em", marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</p>
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

            <div className="tier-grid">
              {[
                {
                  icon: "",
                  title: "Managed Implementation",
                  desc: "We build governance for you. Framework selection. Process design. Team training. Deployment support.",
                },
                {
                  icon: "",
                  title: "Automated Audit Logging",
                  desc: "Every governance action is sealed into a cryptographic hash chain, verifiable on demand. Report downloads, vendor reviews, policy changes, stored server side, never editable by a user.",
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
                  desc: "Programmatic access to your check and assessment data, build it into your own vendor management, security or finance workflows.",
                },
                {
                  icon: "",
                  title: "Dedicated Governance Advisor",
                  desc: "Quarterly strategy calls. Roadmap updates. Best practice guidance. Regulatory news briefings. Continuous improvement.",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    background: i % 2 === 0 ? "#102943" : "#0D1B2E",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderLeft: "2px solid rgba(229,72,77,0.5)",
                    padding: "2rem",
                  }}
                >
                  <p style={{ ...mono, fontSize: "10px", color: "#E5484D", letterSpacing: "0.15em", marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</p>
                  <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE BAND ── */}
      <section style={{ padding: "7rem 1.5rem", background: "linear-gradient(180deg, #0D1B2E 0%, #0A1628 100%)", borderBottom: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "#F4F1EA",
            }}
          >
            The tools find the risk.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>The record proves you dealt with it.</span>
          </h2>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 1.5rem", background: "#0A1628", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.5rem", color: "white" }}>
            Ready to know where you stand?
          </h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.7 }}>
            Start with a free assessment. See your score, gaps, and roadmap. Then choose Pro, Growth, or Sentinel.
          </p>
          <Link href="/governance-audit" style={{
            ...syne, fontSize: "1rem", fontWeight: 700,
            background: "#E5484D", color: "white",
            padding: "14px 40px", borderRadius: "9999px",
            textDecoration: "none", display: "inline-block"
          }}>
            Start assessment
          </Link>
        </div>
      </section>
      <style>{`
        .tier-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        @media (max-width: 700px) { .tier-grid { grid-template-columns: 1fr; } }
      `}</style>
      <Footer />
    </div>
  );
}
