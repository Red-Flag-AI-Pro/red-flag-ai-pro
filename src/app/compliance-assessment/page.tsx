import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DemoScanner } from "@/components/marketing/DemoScanner";
import { RegulatoryCountdown } from "@/components/marketing/RegulatoryCountdown";

export const metadata: Metadata = {
  title: "Compliance Assessment: Check Marketing Copy Against 30 Risk Categories",
  description:
    "Check your marketing copy for compliance risk across 10 jurisdictions and 30 risk categories. Free, instant, no account required.",
  alternates: { canonical: "https://www.redflagaipro.com/compliance-assessment" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function ComplianceAssessmentPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        padding: "6rem 1.5rem 3rem",
        background: "linear-gradient(180deg, #0A1628 0%, #0D1B2E 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "600px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(229,72,77,0.09) 0%, transparent 65%)"
        }} />
        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>The Compliance Assessment</p>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.4rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1.25rem", color: "#F4F1EA" }}>
            30 risk categories. <span style={{ fontStyle: "italic", color: "#E5484D" }}>10 jurisdictions.</span> 60 seconds.
          </h1>
          <p style={{ ...syne, fontSize: "1.05rem", color: "rgba(244,241,234,0.6)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
            Paste your marketing copy and get a compliance score with every flag explained: which rule it breaks, in which jurisdiction, and how to fix it.
          </p>
        </div>
      </section>

      <RegulatoryCountdown />

      {/* THE CHECKER */}
      <div id="scanner">
        <DemoScanner />
      </div>

      {/* PROOF POINTS */}
      <section style={{ background: "#0A1628", padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>No unsubstantiated claims, on principle</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.5rem", color: "white", textAlign: "center" }}>We flag fake testimonials. We won&apos;t use them either.</h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: "640px", margin: "0 auto 4rem", lineHeight: 1.7 }}>
            Our own checker flags unsubstantiated testimonials as a compliance risk. So instead of quotes we can&apos;t verify, here&apos;s what we can actually show you.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
            {[
              {
                stat: "0/100",
                title: "We checked our own site first",
                detail: "10 violations found before launch. We fixed them, then published the score. You can run the same check on yours right now.",
              },
              {
                stat: "30",
                title: "Risk categories, updated as law changes",
                detail: "Added a 30th category, Age Assurance, within days of the UK's under-16 social media restriction announcement. Not an annual update cycle.",
              },
              {
                stat: "9",
                title: "Jurisdictions mapped, with sources",
                detail: "Every regulation cited traces to official text or a government announcement, not a generic 'AI compliance' explainer.",
              },
            ].map((item) => (
              <div key={item.title} style={{
                background: "rgba(16,41,67,0.8)",
                border: "1px solid rgba(239,68,68,0.2)",
                padding: "2.5rem",
              }}>
                <p className="font-display" style={{ fontSize: "2.5rem", fontWeight: 500, color: "#ef4444", marginBottom: "1rem", lineHeight: 1 }}>{item.stat}</p>
                <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDY TEASER */}
      <section style={{ background: "#0D1B2E", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>Case study</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.25rem", color: "white", textAlign: "center" }}>
            Six violations. None of them obvious. All happening right now.
          </h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: "680px", margin: "0 auto 3rem", lineHeight: 1.7 }}>
            A composite of real violations found across real agency campaigns. The copy looked professional. It had been reviewed internally. It went live. Here&apos;s what a compliance checker found that nobody else did.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
            {[
              {
                tag: "FCA Financial Promotion",
                severity: "HIGH",
                excerpt: "“Start growing your money today. Our members earn an average of 4.2% annually. Low risk, high reward.”",
                finding: "Unapproved financial promotion under FSMA 2000 Section 21. Not a civil fine: a criminal offence. The agency that wrote it is exposed, not just the client.",
              },
              {
                tag: "EU AI Act, Article 50",
                severity: "HIGH",
                excerpt: "“Every piece of content we create comes from genuine human expertise.”",
                finding: "Written by ChatGPT, published with a claim that it wasn't. Article 50(4) requires disclosure from 2 August 2026. Fines reach €15M or 3% of global turnover.",
              },
            ].map((item) => (
              <div key={item.tag} style={{
                background: "rgba(16,41,67,0.8)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "12px",
                padding: "2rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                  <span style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ef4444", padding: "4px 10px", borderRadius: "9999px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>{item.severity}</span>
                  <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white" }}>{item.tag}</p>
                </div>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", fontStyle: "italic", marginBottom: "1rem", borderLeft: "2px solid rgba(239,68,68,0.3)", paddingLeft: "1rem" }}>{item.excerpt}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{item.finding}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/case-study" style={{
              ...syne, fontSize: "0.95rem", fontWeight: 700,
              background: "transparent", color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "14px 32px", borderRadius: "9999px",
              textDecoration: "none", display: "inline-block"
            }}>
              Read the full case study →
            </Link>
          </div>
        </div>
      </section>

      {/* Cross-link to governance */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "2rem 1.5rem", textAlign: "center" }}>
        <p style={{ ...syne, fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>
          Here for the AI governance side instead? <Link href="/governance-audit" style={{ color: "#E5484D", textDecoration: "underline" }}>Start the governance assessment</Link>.
        </p>
      </div>

      <Footer />
    </div>
  );
}
