import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JURISDICTION_COUNT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Compliance and AI Governance Tools: Red Flag AI Pro",
  description:
    "Free AI governance assessment, plus marketing compliance tools: a 30 category compliance checklist, an affiliate disclosure generator, and more, included free with every account.",
  alternates: { canonical: "https://www.redflagaipro.com/tools" },
};

interface ToolCard {
  href: string;
  title: string;
  desc: string;
}

const ASSESSMENT_TOOLS: ToolCard[] = [
  { href: "/tools/does-this-apply-to-you", title: "Does This Even Apply to You?", desc: "5 quick questions, no email needed. An honest answer, including if the honest answer is not yet." },
  { href: "/governance-audit", title: "AI Governance Maturity Assessment", desc: "5 minutes, 6 dimensions, a real score, and a roadmap mapped to the EU AI Act, SEC and GDPR." },
  { href: "/witness-test", title: "The Witness Test", desc: "Five questions on how your AI governance evidence is produced. Find out whether anything outside the operator ever saw it." },
  { href: "/tools/shadow-ai-survey", title: "Shadow AI Audit", desc: "7 quick questions to score how much AI usage is happening at your company that IT doesn't know about." },
  { href: "/tools/fine-calculator", title: "AI Compliance Fine Calculator", desc: `See your maximum regulatory exposure across the EU AI Act, GDPR, FTC and ${JURISDICTION_COUNT} jurisdictions, in 10 seconds.` },
];

const DOCUMENT_TOOLS: ToolCard[] = [
  { href: "/tools/dpia-generator", title: "DPIA Generator", desc: "Answer a few questions and get a DPIA screening document, following the ICO's own checklist." },
  { href: "/tools/fria-assistant", title: "Fundamental Rights Impact Assessment", desc: "Answer a few questions and get a FRIA draft covering all 6 elements Article 27 requires." },
  { href: "/tools/incident-reporting-checklist", title: "Incident Reporting Checklist", desc: "Pick what happened and where. Get the deadline and who to notify, free." },
  { href: "/tools/documentation-assistant", title: "AI System Documentation Assistant", desc: "Answer a few questions and get a documentation draft, structured the way EU AI Act Annex IV expects." },
  { href: "/tools/monitoring-plan-generator", title: "Post-Market Monitoring Plan Generator", desc: "Draft the monitoring plan Article 72 requires: metrics, thresholds, review cadence." },
  { href: "/tools/eu-database-registration-assistant", title: "EU AI Database Registration Assistant", desc: "Answer a few questions and get a registration draft covering all 13 Annex VIII fields, free." },
];

const POLICY_TOOLS: ToolCard[] = [
  { href: "/tools/ai-use-policy-generator", title: "AI Acceptable Use Policy Generator", desc: "Draft a policy for your own staff using AI tools: approved tools, prohibited uses, data rules." },
  { href: "/tools/ai-literacy-log", title: "AI Literacy Measures Log", desc: "Record the AI literacy training you've given staff, per Article 4. Applies to every AI deployer." },
];

const MARKETING_TOOLS: ToolCard[] = [
  { href: "/tools/compliance-checklist", title: "30 Category Compliance Checklist", desc: "Every compliance check to run before you launch a campaign. Free." },
  { href: "/tools/disclosure-generator", title: "Affiliate Disclosure Generator", desc: "Generate an FTC/ASA compliant affiliate or sponsorship disclaimer in seconds." },
  { href: "/tools/contract-red-flags", title: "Contract Red Flags Checker", desc: "Paste any contract or terms of service and flag risky clauses: auto renewal traps, uncapped liability, IP grabs." },
  { href: "/tools/accessibility-checker", title: "Accessibility Score Checker", desc: "Enter a URL and get an instant score on the accessibility issues most commonly cited in ADA demand letters." },
  { href: "/tools/url-exposure-checker", title: "URL Exposure Checker", desc: "Paste any live URL and we check the actual page text for compliance red flags. No copy and paste needed." },
  { href: "/tools/ai-visibility-checker", title: "AI Visibility Checker", desc: "7 questions to score how likely AI assistants are to find and recommend your business." },
];

function ToolGrid({ tools }: { tools: ToolCard[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
      {tools.map((t, i) => (
        <Link
          key={t.href}
          href={t.href}
          style={{
            display: "flex",
            flexDirection: "column",
            background: i % 2 === 0 ? "#0D1B2E" : "#102943",
            border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
            padding: "2rem",
            textDecoration: "none",
          }}
        >
          <p style={{ fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "10px", color: "#E5484D", letterSpacing: "0.15em", marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</p>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "white", marginBottom: "0.5rem", lineHeight: 1.3 }}>{t.title}</h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: "1.25rem" }}>{t.desc}</p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "12px", fontWeight: 700, color: "#E5484D", marginTop: "auto" }}>Use it free →</p>
        </Link>
      ))}
    </div>
  );
}

function ToolSection({ kicker, title, tools, first }: { kicker: string; title: string; tools: ToolCard[]; first?: boolean }) {
  return (
    <section style={{ background: "#0A1628", padding: first ? "4rem 1.5rem 2.5rem" : "2rem 1.5rem 2.5rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1rem" }}>
          <span style={{ fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "11px", fontWeight: 500, color: "#E5484D", letterSpacing: "0.15em" }}>{kicker}</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "#F4F1EA", letterSpacing: "-0.01em" }}>{title}</h2>
          <span style={{ fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{tools.length} tools</span>
        </div>
        <ToolGrid tools={tools} />
      </div>
    </section>
  );
}

export default function ToolsPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* Compact header — no upsell blocking the tools below the fold */}
      <section style={{background: "#0C1929", padding: "7.5rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth: "700px", margin: "0 auto"}}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.25rem" }}>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
            <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.65)"}}>Free, no account needed</p>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h1 className="font-display" style={{
            fontSize: "clamp(2rem, 4.5vw, 2.9rem)", fontWeight: 500,
            letterSpacing: "-0.02em", lineHeight: 1.12, marginBottom: "0.75rem",
            color: "#F4F1EA",
          }}>Nineteen tools. <span style={{ fontStyle: "italic", color: "#E5484D" }}>All free.</span></h1>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto"}}>
            Pick a tool below and use it now. No signup required.
          </p>
        </div>
      </section>

      {/* Free, ungated tools — four findable groups, first thing on the page */}
      <ToolSection kicker="01" title="Assessments" tools={ASSESSMENT_TOOLS} first />
      <ToolSection kicker="02" title="EU AI Act document generators" tools={DOCUMENT_TOOLS} />
      <ToolSection kicker="03" title="Internal policy and training" tools={POLICY_TOOLS} />
      <section style={{background: "#0A1628", padding: "2rem 1.5rem 3rem"}}>
        <div style={{maxWidth: "900px", margin: "0 auto"}}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1rem" }}>
            <span style={{ fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "11px", fontWeight: 500, color: "#E5484D", letterSpacing: "0.15em" }}>04</span>
            <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "#F4F1EA", letterSpacing: "-0.01em"}}>Marketing compliance</h2>
            <span style={{ fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{MARKETING_TOOLS.length} tools</span>
          </div>
          <ToolGrid tools={MARKETING_TOOLS} />
        </div>
      </section>

      {/* ── QUOTE BAND ── */}
      <section style={{ padding: "6rem 1.5rem", background: "linear-gradient(180deg, #0A1628 0%, #0C1929 100%)", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "#F4F1EA",
            }}
          >
            We would rather show you than tell you.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>Pick a tool and see.</span>
          </h2>
        </div>
      </section>

      {/* Signup upsell — moved below the actual tools, a secondary CTA not a gate */}
      <section style={{background: "#0C1929", padding: "5rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth: "700px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem"}}>Unlocked free the moment you sign up</p>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 700,
            letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1rem",
            color: "#F4F1EA",
          }}>Nine more tools, free the moment you sign up.</h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem"}}>
            Risk calculators, testimonial checker, email compliance, refund rights checker and more. No check credits used. Always free.
          </p>
          <div style={{display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "2.5rem"}}>
            {["Risk Calculator", "Testimonial Checker", "Email Compliance", "Urgency Validator", "Health Claim Rater", "Red Flag Checklist", "Refund Rights", "Influencer Disclosure"].map((t) => (
              <span key={t} style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px 12px", borderRadius: "9999px"}}>
                {t}
              </span>
            ))}
          </div>
          <Link href="/signup" style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", fontFamily: "'Syne', sans-serif", fontSize: "0.9rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)", textDecoration: "none"}}>
            Create free account: unlock toolkit →
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
