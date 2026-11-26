import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { REGULATORY_MAPPING_LAST_REVIEWED, AUDIT_PRICE, JURISDICTION_COUNT, RISK_CATEGORY_COUNT } from "@/lib/constants";
import React from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing: Done For You Compliance and AI Governance",
  description: "Three ways to work with us. A free first finding on your website, a fixed price done for you audit, and Sentinel for firms that want compliance and AI governance handled every month.",
  alternates: { canonical: "https://www.redflagaipro.com/pricing" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

export default async function PricingPage() {
  const cookieStore = await cookies();
  const isNigeria = cookieStore.get("rfai_geo")?.value === "NG";

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* PAIN SECTION — THE PROBLEM */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "linear-gradient(180deg, #0A1628 0%, #102943 100%)",
        borderBottom: "1px solid rgba(239,68,68,0.15)",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>The Problem</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.5rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.5rem", color: "white" }}>
              You can't prove governance happened.
              <br />
              <span style={{ color: "#F4F1EA" }}>That's the problem.</span>
            </h2>
          </div>

          <div className="problem-grid">
            {[
              {
                title: "Munir v SSHD",
                desc: "Tribunal sanctioned a firm for filing AI hallucinated case citations. Delegating to AI doesn't remove the duty to verify and supervise.",
              },
              {
                title: "EU AI Act (Aug 2, 2026)",
                desc: "Mandatory disclosure of AI generated content + governance evidence. Weeks away, not years.",
              },
              {
                title: "SEC 2026 Exams",
                desc: "Financial regulators now testing: Can you prove governance? Can you prove monitoring?",
              },
              {
                title: "FTC Enforcement ($53K per violation)",
                desc: "Unsubstantiated AI claims in marketing. April 2026 onwards: consent orders, not warnings.",
              },
              {
                title: "Policy vs. Practice Gap",
                desc: "Your team has written policies. But desk behavior ≠ policy. No one's checking.",
              },
              {
                title: "Ownership Gap",
                desc: "Who decides about AI? Who owns the output when it drifts? No single answer = no control.",
              },
            ].map((item, i) => (
              <div key={item.title} style={{
                background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
                padding: "1.75rem",
              }}>
                <p style={{ ...mono, fontSize: "10px", color: "#E5484D", letterSpacing: "0.15em", marginBottom: "0.85rem" }}>{String(i + 1).padStart(2, "0")}</p>
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "3rem",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px",
            padding: "2rem",
            textAlign: "center",
          }}>
            <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#E5484D", marginBottom: "0.5rem" }}>THE REALITY</p>
            <p style={{ ...syne, fontSize: "1.2rem", fontWeight: 700, color: "white", lineHeight: 1.6 }}>
              One unchecked ad with an undisclosed claim can trigger a fine before legal ever sees it. A regulator finding you can't prove governance afterward: enterprise reputation destroyed. Your insurance won't cover either.
            </p>
            <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "1rem" }}>83% of organisations use AI. Only 25% have governance that would hold up to a regulator. 72% are increasing GRC spend right now, but 78% are still unprepared for the EU AI Act. EU AI Act Article 50 transparency duties have applied since 2 August 2026, even though high risk system deadlines were pushed to Dec 2027 and Aug 2028. Most compliance tools are built once and left to go stale. We re-check every jurisdiction against the official text, so you're never caught running on a rule that already moved.</p>
          </div>
        </div>
      </section>

      {/* HERO */}
      <section style={{
        padding: "6rem 1.5rem 4rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "500px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(229,72,77,0.08) 0%, transparent 65%)"
        }} />
        <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>{JURISDICTION_COUNT} jurisdictions covered across {RISK_CATEGORY_COUNT} risk categories. Wherever your business operates, you are protected.</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2.3rem, 6vw, 3.6rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: "1rem", color: "#F4F1EA" }}>
            Catch what you said.<br /><span style={{ fontStyle: "italic", color: "#E5484D" }}>Then prove what you did.</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Three ways to work with us, and no tiers to compare. We find your red flag for free, clear all of them for one fixed price, or handle it for you every month.
          </p>
        </div>
      </section>

      {/* THE THREE OFFERS */}
      <section style={{ padding: "5rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", alignItems: "stretch" }}>

            {/* 01 FREE FIRST FINDING */}
            <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "2.25rem", display: "flex", flexDirection: "column" }}>
              <p style={{ ...mono, fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginBottom: "1rem" }}>01 · YOUR RED FLAG</p>
              <p style={{ ...syne, fontSize: "2.4rem", fontWeight: 800, color: "white", lineHeight: 1, marginBottom: "0.5rem" }}>Free</p>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1.5rem" }}>We check your site and show you the one problem most likely to cost you.</p>
              <div style={{ flex: 1 }}>
                {[
                  "You give us your website, nothing else",
                  `Checked against ${RISK_CATEGORY_COUNT} risk categories across ${JURISDICTION_COUNT} jurisdictions`,
                  "Your red flag, the rule it breaks, and how many more there are",
                  "A personal reply from James",
                ].map((f) => (
                  <p key={f} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "0.6rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.3)", marginRight: "10px" }}>✓</span>{f}
                  </p>
                ))}
              </div>
              <Link href="/get-checked" className="btn-secondary" style={{ marginTop: "1.75rem", justifyContent: "center", fontSize: "0.9rem", padding: "13px 24px" }}>
                Show me my red flag <span className="arrow">→</span>
              </Link>
            </div>

            {/* 02 THE FULL AUDIT */}
            <div style={{ background: "#102943", border: "1px solid rgba(229,72,77,0.45)", borderRadius: "12px", padding: "2.25rem", display: "flex", flexDirection: "column", position: "relative" }}>
              <span style={{ ...mono, position: "absolute", top: "-11px", left: "2.25rem", background: "#E5484D", color: "white", fontSize: "10px", letterSpacing: "0.14em", padding: "4px 10px", borderRadius: "4px" }}>RECOMMENDED</span>
              <p style={{ ...mono, fontSize: "10px", color: "#C9A66B", letterSpacing: "0.15em", marginBottom: "1rem" }}>02 · THE FULL AUDIT</p>
              <p style={{ ...syne, fontSize: "2.4rem", fontWeight: 800, color: "white", lineHeight: 1, marginBottom: "0.5rem" }}>£{AUDIT_PRICE.amount}<span style={{ ...mono, fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", marginLeft: "10px" }}>ONE TIME</span></p>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1.5rem" }}>Every red flag and how to clear it. Compliance and AI governance in one.</p>
              <div style={{ flex: 1 }}>
                {[
                  "James personally checks your site and AI use, on video",
                  "Written report: compliance exposure and governance gaps",
                  "What to fix first, in plain English",
                  "Reviewed badge for your site",
                  "No subscription, no tool to learn",
                  "Money back if we find nothing worth fixing",
                ].map((f) => (
                  <p key={f} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "0.6rem" }}>
                    <span style={{ color: "#C9A66B", marginRight: "10px" }}>✓</span>{f}
                  </p>
                ))}
              </div>
              <Link href="/audit" className="btn-primary" style={{ marginTop: "1.75rem", justifyContent: "center", fontSize: "0.9rem", padding: "13px 24px" }}>
                See the full audit <span className="arrow">→</span>
              </Link>
            </div>

            {/* 03 SENTINEL */}
            <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "2.25rem", display: "flex", flexDirection: "column" }}>
              <p style={{ ...mono, fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginBottom: "1rem" }}>03 · SENTINEL</p>
              <p style={{ ...syne, fontSize: "2.4rem", fontWeight: 800, color: "white", lineHeight: 1, marginBottom: "0.5rem" }}>Talk to us</p>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1.5rem" }}>Compliance and AI governance handled for you, every month.</p>
              <div style={{ flex: 1 }}>
                {[
                  "Managed governance implementation, worked with you",
                  "Cryptographically sealed audit log, verifiable on demand",
                  "Sign offs stamped with the signer's role and authority",
                  "Board ready reporting, built with your team",
                  "Dedicated governance advisor",
                ].map((f) => (
                  <p key={f} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "0.6rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.3)", marginRight: "10px" }}>✓</span>{f}
                  </p>
                ))}
              </div>
              <Link href="/sentinel#request" className="btn-secondary" style={{ marginTop: "1.75rem", justifyContent: "center", fontSize: "0.9rem", padding: "13px 24px" }}>
                Ask about Sentinel <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: "2.5rem", lineHeight: 1.7 }}>
            Prefer to do it yourself? Both tools are free to run on your own:{" "}
            <Link href="/compliance-assessment" style={{ color: "#E5484D", textDecoration: "none", fontWeight: 700 }}>check your copy</Link>{" "}or{" "}
            <Link href="/governance-audit" style={{ color: "#E5484D", textDecoration: "none", fontWeight: 700 }}>assess your AI governance</Link>.
          </p>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "1rem" }}>
            Regulatory mapping last reviewed: {REGULATORY_MAPPING_LAST_REVIEWED}
          </p>
        </div>
      </section>

      {/* WHY SENTINEL CTA */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "linear-gradient(180deg, #0D1B2E 0%, #0A1628 100%)",
        borderTop: "1px solid rgba(239,68,68,0.15)"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>Why CFOs choose Sentinel</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2rem", color: "white" }}>
            Governance that <span style={{ color: "#F4F1EA" }}>regulators accept.</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
            {[
              {
                title: "Forensic Proof",
                desc: "A cryptographic hash chain seals every audit log entry. Edit, delete, or backdate one and the chain breaks, verifiably. When regulators ask 'prove it happened,' you have the answer.",
              },
              {
                title: "Implementation Partner",
                desc: "We don't just identify gaps. We build the infrastructure. You're not managing consultants; we're doing it.",
              },
              {
                title: "Board Reporting",
                desc: "Quarterly governance decks + financial impact modeling. Board sees risk declining, compliance improving.",
              },
              {
                title: "Regulatory Readiness",
                desc: "Evidence package mapped to EU AI Act, SEC, GDPR, Munir. Ready for audit, inspection, or enforcement action.",
              },
            ].map((item) => (
              <div key={item.title} style={{
                background: "rgba(16,41,67,0.5)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "12px",
                padding: "2rem",
                textAlign: "left"
              }}>
                <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "3rem",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px",
            padding: "2rem"
          }}>
            <p style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "#E5484D", marginBottom: "0.5rem" }}>Ready to know where you stand?</p>
            <p style={{ ...syne, fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "1rem" }}>Give us your website and we will send you the worst thing we find. Free, and you do none of the work.</p>
            <Link href="/get-checked" style={{
              display: "inline-block",
              background: "#E5484D",
              color: "white",
              ...syne, fontSize: "0.875rem", fontWeight: 700,
              padding: "12px 32px", borderRadius: "9999px",
              textDecoration: "none"
            }}>
              Start assessment
            </Link>
          </div>

          <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.5)", marginTop: "2rem" }}>
            Need something installed or built for you rather than switched on? See <Link href="/installations" style={{ color: "#E5484D" }}>installations & custom work</Link>.
          </p>
        </div>
      </section>

      <style>{`
        @keyframes pulseRed {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .problem-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 2rem; }
        @media (max-width: 700px) { .problem-grid { grid-template-columns: 1fr; } }
      `}</style>
      <Footer />
    </div>
  );
}
