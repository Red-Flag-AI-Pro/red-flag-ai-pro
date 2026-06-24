import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { StickyCTA } from "@/components/marketing/StickyCTA";
import { TrustBar } from "@/components/marketing/TrustBar";

export const metadata: Metadata = {
  title: "Red Flag AI Pro: Compliance Checking + AI Governance Proof",
  description:
    "Check your marketing copy for compliance risk across 9 jurisdictions and 30 risk categories. Prove your AI governance to regulators and boards with a free 5-minute assessment. One platform, both halves, kept current as the law changes.",
  alternates: { canonical: "https://www.redflagaipro.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Red Flag AI Pro",
  url: "https://www.redflagaipro.com",
  description: "AI Governance Assessment & Compliance Infrastructure for Enterprises",
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function LandingPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StickyCTA />
      <ExitIntent />
      <Navbar />

      {/* HERO */}
      <section style={{
        padding: "8rem 1.5rem 6rem",
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
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.75rem" }}>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Two halves. One platform. Updated as the law changes.</p>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.6rem, 6vw, 4.4rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: "1.75rem", color: "#F4F1EA" }}>
            Catch what you said.<br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>Prove what you did.</span>
          </h1>
          <p style={{ ...syne, fontSize: "clamp(1.02rem, 3vw, 1.2rem)", color: "rgba(244,241,234,0.62)", lineHeight: 1.7, marginBottom: "2.25rem", maxWidth: "640px", margin: "0 auto 2.25rem" }}>
            Check your marketing copy for compliance risk. Prove your AI governance to regulators and boards. Pick the side you need, or run both.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link href="/compliance-assessment" className="btn-primary" style={{ fontSize: "0.95rem", padding: "14px 30px" }}>
              Start free check <span className="arrow">→</span>
            </Link>
            <Link href="/governance-audit" className="btn-secondary" style={{ fontSize: "0.95rem", padding: "14px 30px" }}>
              Free governance assessment <span className="arrow">→</span>
            </Link>
          </div>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.38)" }}>No credit card · No account required · Results delivered instantly</p>
        </div>
      </section>

      <TrustBar />

      {/* CHOOSE YOUR PATH */}
      <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>Two halves, two free checks</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "white" }}>
              Which side are you here for?
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <div style={{ background: "#0F2138", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "2.5rem" }}>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>Compliance Assessment</p>
              <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: "white", marginBottom: "1rem" }}>Check your marketing copy</h3>
              <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                Paste an ad, page, or email. Get a compliance score across 30 risk categories and 9 jurisdictions, with every flag explained, in 60 seconds.
              </p>
              <Link href="/compliance-assessment" className="btn-primary" style={{ fontSize: "0.9rem", padding: "12px 26px" }}>
                Check your copy <span className="arrow">→</span>
              </Link>
            </div>

            <div style={{ background: "#0F2138", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "2.5rem" }}>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>Governance Assessment</p>
              <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: "white", marginBottom: "1rem" }}>Prove your AI governance</h3>
              <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                23 questions across 6 dimensions. Get a Governance Maturity Index, your top gaps, and an audit ready evidence package, in 5 minutes.
              </p>
              <Link href="/governance-audit" className="btn-secondary" style={{ fontSize: "0.9rem", padding: "12px 26px" }}>
                Start the assessment <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "#0A1628",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>Built for both halves</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", color: "white", textAlign: "center" }}>Creators protecting their copy. CFOs proving their governance.</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {[
              {
                role: "Creators & Course Sellers",
                pain: "Is your ad about to get you fined, or flagged by the platform you're paying to run it on?",
                solution: "Check your copy in under 60 seconds. Catch income claims, fake urgency, and missing disclosures before you publish.",
              },
              {
                role: "Marketing Agencies",
                pain: "Are you confident every client account is compliant, across every jurisdiction you serve?",
                solution: "Run the checker across every client's copy from one dashboard. Catch what slips past human review.",
              },
              {
                role: "CFOs & Finance Leaders",
                pain: "Can you prove AI governance to the board? Can you quantify compliance risk?",
                solution: "Score governance maturity. Model financial impact. Get board ready reports.",
              },
              {
                role: "Compliance Officers",
                pain: "Are you ready for SEC exams? Can you demonstrate policy to practice alignment?",
                solution: "Gap assessment + evidence package. Regulatory framework mapping.",
              },
            ].map((item) => (
              <div key={item.role} style={{
                background: "rgba(16,41,67,0.6)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "12px",
                padding: "2rem"
              }}>
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#ef4444", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.role}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "1rem", borderLeft: "2px solid rgba(239,68,68,0.3)", paddingLeft: "1rem", fontStyle: "italic" }}>{item.pain}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>✓ {item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "linear-gradient(180deg, #0A1628 0%, #0D1B2E 100%)",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "#ef4444", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Ready?</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.5rem", color: "white" }}>Know where you stand in 5 minutes.</h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.7 }}>
            Free either way. No credit card. No account. Results delivered instantly to your inbox.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/compliance-assessment" style={{
              ...syne, fontSize: "1rem", fontWeight: 700,
              background: "#ef4444", color: "white",
              padding: "14px 40px", borderRadius: "9999px",
              textDecoration: "none", display: "inline-block"
            }}>
              Start free check
            </Link>
            <Link href="/governance-audit" style={{
              ...syne, fontSize: "1rem", fontWeight: 700,
              background: "transparent", color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "14px 40px", borderRadius: "9999px",
              textDecoration: "none", display: "inline-block"
            }}>
              Start governance assessment
            </Link>
          </div>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "1.5rem" }}><Link href="/pricing" style={{ color: "#ef4444", textDecoration: "none" }}>See pricing for Pro, Growth + Sentinel</Link></p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
