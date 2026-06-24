import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { StickyCTA } from "@/components/marketing/StickyCTA";
import { TrustBar } from "@/components/marketing/TrustBar";
import { ProveItWidget } from "@/components/marketing/ProveItWidget";
import { JurisdictionStrip } from "@/components/marketing/JurisdictionStrip";
import { RegulatoryCountdown } from "@/components/marketing/RegulatoryCountdown";

export const metadata: Metadata = {
  title: "Red Flag AI Pro: Compliance Scanning + AI Governance Proof",
  description:
    "Scan your marketing copy for compliance risk across 9 jurisdictions and 30 risk categories. Prove your AI governance to regulators and boards with a free 5-minute assessment. One platform, both halves, kept current as the law changes.",
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
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>9 jurisdictions. 30 categories. The only scanner that tracks both as they change.</p>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.6rem, 6vw, 4.4rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: "1.75rem", color: "#F4F1EA" }}>
            Catch what you said.<br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>Prove what you did.</span>
          </h1>
          <p style={{ ...syne, fontSize: "clamp(1.02rem, 3vw, 1.2rem)", color: "rgba(244,241,234,0.62)", lineHeight: 1.7, marginBottom: "2.25rem", maxWidth: "640px", margin: "0 auto 2.25rem" }}>
            Scan your marketing copy for compliance risk. Prove your AI governance to regulators and boards. One platform, both halves, and we update every category and jurisdiction as the law changes, so you're never caught running on rules that already moved.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link href="/#scanner" className="btn-primary" style={{ fontSize: "0.95rem", padding: "14px 30px" }}>
              Start free scan <span className="arrow">→</span>
            </Link>
            <Link href="/governance-audit" className="btn-secondary" style={{ fontSize: "0.95rem", padding: "14px 30px" }}>
              Free governance assessment <span className="arrow">→</span>
            </Link>
          </div>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.38)" }}>No credit card · No account required · Results delivered instantly</p>
        </div>
      </section>

      <RegulatoryCountdown />

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
              { tag: "UK · NOV 2025", title: "Munir v SSHD", desc: "Tribunal sanctioned a firm for filing AI hallucinated case citations. Delegating to AI doesn't remove the duty to verify and supervise.", source: "https://www.bailii.org/uk/cases/UKUT/IAC/2026/81.html" },
              { tag: "EU · 2 AUGUST 2026", title: "EU AI Act, Article 50", desc: "Mandatory AI disclosure and governance evidence for systems touching the EU.", source: "https://artificialintelligenceact.eu/article/50/" },
              { tag: "EU · IN FORCE", title: "DORA", desc: "Reporting on operational resilience under active audit. 93.5% failed the 2024 dry run.", source: "https://www.eiopa.europa.eu/publications/key-findings-2024-esas-dry-run-exercise-dora_en" },
              { tag: "US · 2026 EXAMS", title: "SEC & FTC", desc: "Examiners now test whether you can prove governance, and monitor it, not just describe it.", source: "https://www.sec.gov/newsroom/press-releases" },
            ].map((item) => (
              <div key={item.title} style={{
                background: "var(--navy-raised)",
                padding: "1.85rem",
              }}>
                <div style={{ width: "32px", height: "2px", background: "#E5484D", marginBottom: "1.1rem" }} />
                <p className="font-mono-fig" style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", color: "rgba(229,72,77,0.85)", marginBottom: "0.6rem" }}>{item.tag}</p>
                <p className="font-display" style={{ fontSize: "1.15rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.5rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.6, marginBottom: "0.6rem" }}>{item.desc}</p>
                <a href={item.source} target="_blank" rel="noopener noreferrer" style={{ ...syne, fontSize: "11px", color: "rgba(229,72,77,0.85)", textDecoration: "underline" }}>
                  source
                </a>
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
            <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>83% of organisations use AI. Only 25% have governance that would hold up to a regulator. 72% are increasing GRC spend right now, but 78% are still unprepared for the EU AI Act. Your insurance won't cover regulatory fines.</p>
          </div>
        </div>
      </section>

      <div id="scanner">
        <ProveItWidget />
      </div>

      {/* WHAT YOU GET */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "#0A1628"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>The Governance Assessment</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "white" }}>
              5 minutes. You get instant clarity.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
            {[
              {
                icon: "",
                title: "Governance Maturity Index",
                desc: "0-100 across 6 dimensions: Strategy, Tools, Policy, Monitoring, Vendors, Regulatory Readiness"
              },
              {
                icon: "",
                title: "Top 3-5 Critical Gaps",
                desc: "Specific governance failures ranked by severity. Each with regulatory context (Munir, SEC, EU AI Act, etc.)"
              },
              {
                icon: "",
                title: "90-Day Roadmap",
                desc: "Quick wins (2 to 3 weeks), medium term (6 months), strategic (12 months). Who owns each, timeline."
              },
              {
                icon: "",
                title: "Peer Benchmarking",
                desc: "See how you compare. Industry average: 35/100. Top quartile: 78+. Where are you?"
              },
              {
                icon: "",
                title: "6-Page PDF Report",
                desc: "Board ready executive summary, dimension breakdown, red flags with recommendations, full roadmap"
              },
              {
                icon: "",
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
                <div style={{ width: "32px", height: "2px", background: "#E5484D", marginBottom: "1.25rem" }} />
                <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JurisdictionStrip />

      {/* WHO IT'S FOR */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "#0D1B2E",
        borderTop: "1px solid rgba(255,255,255,0.05)",
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
                solution: "Scan your copy in under 60 seconds. Catch income claims, fake urgency, and missing disclosures before you publish.",
              },
              {
                role: "Marketing Agencies",
                pain: "Are you confident every client account is compliant, across every jurisdiction you serve?",
                solution: "Run the scanner across every client's copy from one dashboard. Catch what slips past human review.",
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

      {/* PROOF POINTS — VERIFIABLE, NOT UNVERIFIED TESTIMONIALS */}
      <section style={{ background: "#0A1628", padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>No unsubstantiated claims, on principle</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.5rem", color: "white", textAlign: "center", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>We flag fake testimonials. We won&apos;t use them either.</h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: "640px", margin: "0 auto 4rem", lineHeight: 1.7 }}>
            Our own scanner flags unsubstantiated testimonials as a compliance risk. So instead of quotes we can&apos;t verify, here&apos;s what we can actually show you.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
            {[
              {
                stat: "0/100",
                title: "We scanned our own site first",
                detail: "10 violations found before launch. We fixed them, then published the score. You can run the same scan on yours right now.",
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
            A composite of real violations found across real agency campaigns. The copy looked professional. It had been reviewed internally. It went live. Here&apos;s what a compliance scanner found that nobody else did.
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
            <Link href="/#scanner" style={{
              ...syne, fontSize: "1rem", fontWeight: 700,
              background: "#ef4444", color: "white",
              padding: "14px 40px", borderRadius: "9999px",
              textDecoration: "none", display: "inline-block"
            }}>
              Start free scan
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
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "1.5rem" }}><Link href="/pricing" style={{ color: "#ef4444", textDecoration: "none" }}>See pricing for Scanner, Growth + Sentinel</Link></p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
