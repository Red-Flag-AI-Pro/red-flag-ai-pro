import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DemoScanner } from "@/components/marketing/DemoScanner";
import { RegulatoryCountdown } from "@/components/marketing/RegulatoryCountdown";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI Compliance Assessment: Check Content Against 30 Risk Categories Across 11 Jurisdictions",
  description:
    "Run a free compliance assessment across US, UK, EU, Australia, Canada, Brazil, India, Singapore, UAE, Nigeria and China. 30 risk categories including EU AI Act Article 50, GDPR, FTC, NDPR and PIPL. Instant results, no account required.",
  alternates: { canonical: "https://www.redflagaipro.com/compliance-assessment" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function ComplianceAssessmentPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        padding: "clamp(6rem, 12vw, 8.5rem) 1.5rem clamp(3.5rem, 7vw, 5rem)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Photo, graded toward navy */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: "url(/images/compliance/press.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
            filter: "saturate(0.8) contrast(1.05) brightness(1.05)",
          }}
        />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "rgba(10,22,40,0.32)", mixBlendMode: "multiply" }} />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "linear-gradient(180deg, rgba(10,22,40,0.72) 0%, rgba(10,22,40,0.4) 45%, rgba(10,22,40,0.6) 75%, #0A1628 100%)",
          }}
        />
        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.65)" }}>The Compliance Assessment</p>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.4rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1.25rem", color: "#F4F1EA", textShadow: "0 2px 40px rgba(6,14,26,0.95), 0 2px 10px rgba(6,14,26,0.9)" }}>
            30 risk categories. <span style={{ fontStyle: "italic", color: "#E5484D" }}>11 jurisdictions.</span> 60 seconds.
          </h1>
          <p style={{ ...syne, fontSize: "1.05rem", color: "rgba(244,241,234,0.85)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto", textShadow: "0 1px 3px rgba(6,14,26,0.95), 0 2px 18px rgba(6,14,26,0.9)" }}>
            Paste your marketing copy and get a compliance score with every flag explained: which rule it breaks, in which jurisdiction, and how to fix it.
          </p>
        </div>
      </section>

      <RegulatoryCountdown />

      {/* THE CHECKER */}
      <div id="scanner">
        <DemoScanner />
      </div>

      {/* THE FRAMEWORK */}
      <section style={{ background: "#0D1B2E", padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem", textAlign: "center" }}>The framework</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.5rem", color: "white", textAlign: "center" }}>Three questions. Every flag answers all of them.</h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: "600px", margin: "0 auto 4rem", lineHeight: 1.7 }}>
            What, where, whether. The same three questions a regulator asks, answered before they have to.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
            {[
              {
                word: "What",
                title: "What was actually claimed",
                detail: "Not what you meant to say. The checker reads the literal words on the page, the same way a regulator would.",
              },
              {
                word: "Where",
                title: "Which jurisdiction's rules apply",
                detail: "The same claim can be fine in one market and prohibited in another. Every flag names the jurisdiction it breaks.",
              },
              {
                word: "Whether",
                title: "Whether it's substantiated",
                detail: "An income claim, a health claim, a guarantee: whether it holds up under the standard a regulator actually applies, not just whether it sounds plausible.",
              },
            ].map((item, i) => (
              <div key={item.word} style={{
                background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
                padding: "2.5rem",
              }}>
                <p className="font-display" style={{ fontSize: "2rem", fontWeight: 500, color: "#E5484D", marginBottom: "1rem", lineHeight: 1, fontStyle: "italic" }}>{item.word}</p>
                <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF POINTS */}
      <section style={{ background: "#0A1628", padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem", textAlign: "center" }}>No unsubstantiated claims, on principle</p>
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
                stat: "11",
                title: "Jurisdictions mapped, with sources",
                detail: "Every regulation cited traces to official text or a government announcement, not a generic 'AI compliance' explainer.",
              },
            ].map((item, i) => (
              <div key={item.title} style={{
                background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
                padding: "2.5rem",
              }}>
                <p className="font-display" style={{ fontSize: "2.5rem", fontWeight: 500, color: "#E5484D", marginBottom: "1rem", lineHeight: 1 }}>{item.stat}</p>
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
          {/* Photo panel + intro, side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem", alignItems: "center", marginBottom: "3rem" }}>
            <div
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                minHeight: "360px",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "url(/images/compliance/glass.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "saturate(0.8) contrast(1.08) brightness(1.08)",
                }}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "rgba(13,27,46,0.26)", mixBlendMode: "multiply" }} />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(10,22,40,0.1) 0%, rgba(10,22,40,0.75) 100%)",
                }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem" }}>
                <p style={{ fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "clamp(13px, 2.2vw, 15px)", fontWeight: 500, color: "rgba(244,241,234,0.95)", letterSpacing: "0.08em", lineHeight: 1.7, textShadow: "0 1px 8px rgba(6,14,26,0.9)" }}>
                  excerpt flagged · &ldquo;low risk, high reward&rdquo;
                  <br />
                  FSMA 2000 s21 · severity high · fix suggested
                </p>
              </div>
            </div>

            <div>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>Case study</p>
              <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "1.25rem", color: "white", lineHeight: 1.1 }}>
                Six violations. None of them obvious. All happening right now.
              </h2>
              <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                A composite of real violations found across real agency campaigns. The copy looked professional. It had been reviewed internally. It went live. Here&apos;s what a compliance checker found that nobody else did.
              </p>
            </div>
          </div>

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
            ].map((item, i) => (
              <div key={item.tag} style={{
                background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
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

      {/* ── LETTERPRESS QUOTE BAND ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "9rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: "url(/images/compliance/newsstack.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.8) contrast(1.05) brightness(1.05)",
          }}
        />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "rgba(10,22,40,0.3)", mixBlendMode: "multiply" }} />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "linear-gradient(180deg, #0A1628 0%, rgba(10,22,40,0.1) 30%, rgba(10,22,40,0.18) 70%, #0A1628 100%)",
          }}
        />
        <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "#F4F1EA",
              textShadow: "0 2px 40px rgba(6,14,26,0.95), 0 2px 10px rgba(6,14,26,0.9)",
            }}
          >
            Every claim you publish is a promise.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>We check which ones you can&apos;t keep.</span>
          </h2>
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
