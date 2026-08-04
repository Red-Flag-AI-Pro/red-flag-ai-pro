import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

const GOVERNANCE_TOOLS: ToolCard[] = [
  { href: "/governance-audit", title: "AI Governance Maturity Assessment", desc: "5 minutes, 6 dimensions, a real score, and a roadmap mapped to the EU AI Act, SEC and GDPR." },
  { href: "/witness-test", title: "The Witness Test", desc: "Five questions on how your AI governance evidence is produced. Find out whether anything outside the operator ever saw it." },
  { href: "/tools/shadow-ai-survey", title: "Shadow AI Audit", desc: "7 quick questions to score how much AI usage is happening at your company that IT doesn't know about." },
  { href: "/tools/dpia-generator", title: "DPIA Generator", desc: "Answer a few questions and get a DPIA screening document, following the ICO's own checklist." },
  { href: "/tools/incident-reporting-checklist", title: "Incident Reporting Checklist", desc: "Pick what happened and where. Get the deadline and who to notify, free." },
  { href: "/tools/documentation-assistant", title: "AI System Documentation Assistant", desc: "Answer a few questions and get a documentation draft, structured the way EU AI Act Annex IV expects." },
  { href: "/tools/eu-database-registration-assistant", title: "EU AI Database Registration Assistant", desc: "Answer a few questions and get a registration draft covering all 13 Annex VIII fields, free." },
  { href: "/tools/fine-calculator", title: "AI Compliance Fine Calculator", desc: "See your maximum regulatory exposure across the EU AI Act, GDPR, FTC and 11 jurisdictions, in 10 seconds." },
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
            display: "block",
            background: i % 2 === 0 ? "#102943" : "#0F2138",
            border: i % 2 === 0 ? "1px solid rgba(239,68,68,0.15)" : "1px solid rgba(255,255,255,0.06)",
            padding: "2rem",
            textDecoration: "none",
          }}
        >
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>{t.title}</h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{t.desc}</p>
        </Link>
      ))}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* Compact header — no upsell blocking the tools below the fold */}
      <section style={{background: "#0C1929", padding: "7.5rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth: "700px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem"}}>Free, no account needed</p>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700,
            letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "0.75rem",
            color: "#F4F1EA",
          }}>Free tools</h1>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto"}}>
            Pick a tool below and use it now. No signup required.
          </p>
        </div>
      </section>

      {/* Free, ungated tools — split into two findable groups, first thing on the page */}
      <section style={{background: "#0A1628", padding: "4rem 1.5rem 2rem"}}>
        <div style={{maxWidth: "900px", margin: "0 auto"}}>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#F4F1EA", textAlign: "center", marginBottom: "3rem"}}>Governance and accountability</h2>
          <ToolGrid tools={GOVERNANCE_TOOLS} />
        </div>
      </section>

      <section style={{background: "#0A1628", padding: "1rem 1.5rem 5rem"}}>
        <div style={{maxWidth: "900px", margin: "0 auto"}}>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#F4F1EA", textAlign: "center", marginBottom: "3rem"}}>Marketing compliance</h2>
          <ToolGrid tools={MARKETING_TOOLS} />
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
