import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { StickyCTA } from "@/components/marketing/StickyCTA";
import { TrustBar } from "@/components/marketing/TrustBar";

export const metadata: Metadata = {
  title: "Red Flag AI Pro — AI Governance Maturity Assessment & Compliance Proof",
  description:
    "Free 5-minute governance assessment reveals your AI maturity across 6 dimensions, identifies critical gaps, and generates a 90-day roadmap. For CFOs, compliance teams, and regulated businesses. Know where you stand before regulators ask.",
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
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

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
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>AI Governance Assurance</p>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.6rem, 6vw, 4.4rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: "1.75rem", color: "#F4F1EA" }}>
            Prove your AI governance<br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>before regulators ask.</span>
          </h1>
          <p style={{ ...syne, fontSize: "clamp(1.02rem, 3vw, 1.2rem)", color: "rgba(244,241,234,0.62)", lineHeight: 1.7, marginBottom: "2.25rem", maxWidth: "640px", margin: "0 auto 2.25rem" }}>
            A 5-minute assessment scores your governance maturity across 6 dimensions, benchmarks you against peers, and generates the audit-ready evidence CFOs and compliance teams need for the EU AI Act, DORA and SEC exams.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link href="/governance-audit" className="btn-primary" style={{ fontSize: "0.95rem", padding: "14px 30px" }}>
              Start free assessment <span className="arrow">→</span>
            </Link>
            <Link href="/pricing" className="btn-secondary" style={{ fontSize: "0.95rem", padding: "14px 30px" }}>
              View pricing <span className="arrow">→</span>
            </Link>
          </div>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.38)" }}>No credit card · No account required · Results delivered instantly</p>
        </div>
      </section>

      <TrustBar />

      {/* PROBLEM SECTION */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "#0D1B2E",
        borderBottom: "1px solid rgba(239,68,68,0.1)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.5)", marginBottom: "1.25rem" }}>The Regulatory Reality</p>
            <h2 className="font-display" style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.12, color: "#F4F1EA", marginBottom: "1.25rem" }}>
              Every organisation has a policy.<br />
              <span style={{ fontStyle: "italic", color: "#E5484D" }}>Almost none can prove it happened.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { tag: "UK · ENFORCED NOW", title: "Munir v SSHD", desc: "Governance you cannot demonstrate is treated as liability. Already case law." },
              { tag: "EU · 2 AUGUST 2026", title: "EU AI Act, Article 50", desc: "Mandatory AI disclosure and governance evidence for systems touching the EU." },
              { tag: "EU · IN FORCE", title: "DORA", desc: "Operational-resilience reporting under active audit. 93.5% failed the 2024 dry run." },
              { tag: "US · 2026 EXAMS", title: "SEC & FTC", desc: "Examiners now test whether you can prove governance — and monitor it — not just describe it." },
            ].map((item) => (
              <div key={item.title} style={{
                background: "var(--navy-raised)",
                padding: "1.85rem",
              }}>
                <div style={{ width: "32px", height: "2px", background: "#E5484D", marginBottom: "1.1rem" }} />
                <p className="font-mono-fig" style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", color: "rgba(229,72,77,0.85)", marginBottom: "0.6rem" }}>{item.tag}</p>
                <p className="font-display" style={{ fontSize: "1.15rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.5rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "3rem",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px",
            padding: "2.5rem",
            textAlign: "center"
          }}>
            <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#ef4444", marginBottom: "0.75rem" }}>NOT OPTIONAL ANYMORE</p>
            <p style={{ ...syne, fontSize: "1.3rem", fontWeight: 700, color: "white", marginBottom: "0.5rem", lineHeight: 1.5 }}>
              You're one compliance fine away from £millions in penalties + reputation destruction.
            </p>
            <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Your insurance won't cover regulatory fines.</p>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "#0A1628"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>The Assessment</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "white" }}>
              5 minutes. You get instant clarity.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
            {[
              {
                icon: "📊",
                title: "Governance Maturity Score",
                desc: "0-100 across 6 dimensions: Strategy, Tools, Policy, Monitoring, Vendors, Regulatory Readiness"
              },
              {
                icon: "🚩",
                title: "Top 3-5 Critical Gaps",
                desc: "Specific governance failures ranked by severity. Each with regulatory context (Munir, SEC, EU AI Act, etc.)"
              },
              {
                icon: "📈",
                title: "90-Day Roadmap",
                desc: "Quick wins (2-3 weeks), medium-term (6 months), strategic (12 months). Who owns each, timeline."
              },
              {
                icon: "👥",
                title: "Peer Benchmarking",
                desc: "See how you compare. Industry average: 35/100. Top quartile: 78+. Where are you?"
              },
              {
                icon: "📄",
                title: "6-Page PDF Report",
                desc: "Board-ready executive summary, dimension breakdown, red flags with recommendations, full roadmap"
              },
              {
                icon: "🔐",
                title: "Regulatory Evidence Map",
                desc: "Your gaps mapped to EU AI Act, SEC requirements, GDPR, Munir v SSHD, FTC. Ready for audits."
              },
            ].map((item) => (
              <div key={item.title} style={{
                background: "#0F2138",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: "12px",
                padding: "2rem"
              }}>
                <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{item.icon}</p>
                <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "#0D1B2E",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>Built for</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", color: "white", textAlign: "center" }}>CFOs, Compliance Teams & Regulated Businesses</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {[
              {
                role: "CFOs & Finance Leaders",
                pain: "Can you prove AI governance to the board? Can you quantify compliance risk?",
                solution: "Score governance maturity. Model financial impact. Get board-ready reports.",
              },
              {
                role: "Compliance Officers",
                pain: "Are you ready for SEC exams? Can you demonstrate policy-to-practice alignment?",
                solution: "Gap assessment + evidence package. Regulatory framework mapping.",
              },
              {
                role: "Risk & Legal Teams",
                pain: "What's your exposure? What do you need to prove?",
                solution: "Forensic evidence roadmap. Munir compliance checklist. Audit trail automation.",
              },
              {
                role: "Enterprise AI Leaders",
                pain: "How do you scale AI governance across 50+ models/teams?",
                solution: "Centralized monitoring. Vendor risk tracking. Enforcement automation.",
              },
            ].map((item) => (
              <div key={item.role} style={{
                background: "rgba(15, 5, 5, 0.6)",
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

      {/* TESTIMONIALS — GOVERNANCE FOCUSED */}
      <section style={{ background: "#0A1628", padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>How teams use it</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "4rem", color: "white", textAlign: "center", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>From assessment to compliance.</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2px" }}>
            {[
              {
                quote: "Took the assessment and realized we had zero vendor governance. That gap alone could have cost us £millions in a breach. 90 days later, we had contracts in place and were monitoring all third-party AI.",
                role: "CFO, Mid-Market Enterprise",
              },
              {
                quote: "We scored 38/100. The governance roadmap showed us which quick wins to do first (2 weeks) vs. the strategic work (6-12 months). Board meeting next week—finally have numbers to show.",
                role: "Compliance Director, FinTech",
              },
              {
                quote: "The PDF report was ready-to-present to our audit team. Mapped straight to SEC requirements. Instead of a month of back-and-forth, we had proof in a week.",
                role: "COO, Regulated Tech",
              },
            ].map((t, i) => (
              <div key={t.role} style={{
                background: i % 2 === 0 ? "rgba(15, 5, 5, 0.8)" : "rgba(15, 15, 15, 0.6)",
                border: `1px solid ${i % 2 === 0 ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
                padding: "2.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "250px"
              }}>
                <div>
                  <p style={{
                    ...syne,
                    fontSize: "4rem",
                    color: "#ef4444",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                    opacity: 0.3
                  }}>&ldquo;</p>
                  <p style={{
                    ...syne,
                    fontSize: "1.05rem",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.85)",
                    fontStyle: "italic",
                    marginBottom: "2rem"
                  }}>{t.quote}</p>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem" }}>
                  <p style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "2rem" }}>Roles withheld at request.</p>
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
            Free assessment. No credit card. No account. Results delivered instantly to your inbox.
          </p>
          <Link href="/governance-audit" style={{
            ...syne, fontSize: "1rem", fontWeight: 700,
            background: "#ef4444", color: "white",
            padding: "14px 40px", borderRadius: "9999px",
            textDecoration: "none", display: "inline-block"
          }}>
            Start assessment
          </Link>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "1.5rem" }}>or <Link href="/pricing" style={{ color: "#ef4444", textDecoration: "none" }}>see pricing for Pro + Sentinel</Link></p>
        </div>
      </section>
    </div>
  );
}
