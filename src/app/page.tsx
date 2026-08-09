import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { StickyCTA } from "@/components/marketing/StickyCTA";
import { TrustBar } from "@/components/marketing/TrustBar";
import { JURISDICTION_COUNT, RISK_CATEGORY_COUNT } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Red Flag AI Pro: Compliance Checking + AI Governance Proof",
  description:
    `Know your marketing is clean before you hit publish, and know your AI governance holds up before a regulator asks. Checked across ${JURISDICTION_COUNT} jurisdictions and ${RISK_CATEGORY_COUNT} risk categories, so the confidence is backed by something real.`,
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

      {/* ANNOUNCEMENT: witness network */}
      <Link
        href="/witness-network"
        style={{
          display: "block", textDecoration: "none", background: "#0D1B2E",
          borderBottom: "1px solid rgba(229,72,77,0.25)", padding: "0.6rem 1.5rem", textAlign: "center",
        }}
      >
        <span style={{ ...syne, fontSize: "0.82rem", color: "rgba(244,241,234,0.75)" }}>
          <span style={{ color: "#E5484D", fontWeight: 700 }}>New:</span> two independent companies sealing each other's evidence, live.{" "}
          <span style={{ color: "#F4F1EA", fontWeight: 700, textDecoration: "underline" }}>See the witness network →</span>
        </span>
      </Link>

      {/* HERO */}
      <section style={{
        padding: "clamp(5rem, 12vw, 8rem) 1.5rem clamp(4rem, 10vw, 6rem)",
        background: "linear-gradient(180deg, #0A1628 0%, #0D1B2E 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Photo is the hero. Shown at full strength so the person and the
            stress of the moment are unmistakable. next/image (not a plain
            CSS background) so mobile gets a properly sized, sharp variant
            instead of either a stretched small file or the full desktop one. */}
        <Image
          src="/images/hero-compliance.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          quality={75}
          style={{ objectFit: "cover", objectPosition: "center 22%", pointerEvents: "none" }}
        />
        {/* Light scrim only where the text sits: a touch at the very top and
            a fade to navy at the base to blend into the next section. The
            middle is left clear so the image reads at full strength. */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(10,22,40,0.6) 0%, rgba(10,22,40,0.18) 30%, rgba(10,22,40,0.05) 55%, rgba(10,22,40,0.55) 90%, #0A1628 100%)"
        }} />
        <div style={{
          position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)",
          width: "min(800px, 120vw)", height: "600px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(229,72,77,0.1) 0%, transparent 65%)"
        }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.75rem" }}>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Two halves. One platform. Updated as the law changes.</p>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.6rem, 6vw, 4.4rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: "1.75rem", color: "#F4F1EA", textShadow: "0 2px 40px rgba(6,14,26,0.95), 0 2px 10px rgba(6,14,26,0.9)" }}>
            Catch what you said.<br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>Prove what you did.</span>
          </h1>
          <p style={{ ...syne, fontSize: "clamp(1.02rem, 3vw, 1.2rem)", color: "rgba(244,241,234,0.92)", lineHeight: 1.7, marginBottom: "2.25rem", maxWidth: "640px", margin: "0 auto 2.25rem", textShadow: "0 1px 3px rgba(6,14,26,0.95), 0 2px 18px rgba(6,14,26,0.9)" }}>
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
          <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.55)" }}>No card · No account to create · Just your email, results delivered instantly</p>
        </div>
      </section>

      <TrustBar />

      {/* CHOOSE YOUR PATH */}
      <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>Two halves, two free checks</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "white" }}>
              Which side are you here for?
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {/* Compliance: the published word */}
            <div style={{ position: "relative", overflow: "hidden", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "2.5rem" }}>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "url(/images/home/newsprint.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "saturate(0.85) contrast(1.05) brightness(1.05)",
                }}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "rgba(10,22,40,0.28)", mixBlendMode: "multiply" }} />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(10,22,40,0.15) 0%, rgba(10,22,40,0.75) 100%)",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem", textShadow: "0 1px 6px rgba(6,14,26,0.9)" }}>Compliance Assessment</p>
                <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "1rem", textShadow: "0 1px 12px rgba(6,14,26,0.9)" }}>Check your marketing copy</h3>
                <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.85)", lineHeight: 1.7, marginBottom: "1.75rem", textShadow: "0 1px 6px rgba(6,14,26,0.9)" }}>
                  Publish with confidence, not a guess. Paste your copy and know in 60 seconds if it is clean, checked against {RISK_CATEGORY_COUNT} risk categories across {JURISDICTION_COUNT} jurisdictions, with every flag explained so you know exactly what to fix.
                </p>
                <Link href="/compliance-assessment" className="btn-primary" style={{ fontSize: "0.9rem", padding: "12px 26px" }}>
                  Check your copy <span className="arrow">→</span>
                </Link>
              </div>
            </div>

            {/* Governance: the record */}
            <div style={{ position: "relative", overflow: "hidden", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "2.5rem" }}>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "url(/images/home/ledger.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "saturate(0.85) contrast(1.05) brightness(1.05)",
                }}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "rgba(10,22,40,0.28)", mixBlendMode: "multiply" }} />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(10,22,40,0.15) 0%, rgba(10,22,40,0.75) 100%)",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem", textShadow: "0 1px 6px rgba(6,14,26,0.9)" }}>Governance Assessment</p>
                <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "1rem", textShadow: "0 1px 12px rgba(6,14,26,0.9)" }}>Prove your AI governance</h3>
                <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.85)", lineHeight: 1.7, marginBottom: "1.75rem", textShadow: "0 1px 6px rgba(6,14,26,0.9)" }}>
                  Find out in 2 minutes whether you could survive an audit tomorrow. 12 questions across 6 dimensions reveal your governance maturity and your single biggest gap, before someone else finds it first.
                </p>
                <Link href="/governance-audit" className="btn-secondary" style={{ fontSize: "0.9rem", padding: "12px 26px" }}>
                  Start the assessment <span className="arrow">→</span>
                </Link>
              </div>
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
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem", textAlign: "center" }}>Different job. Same moment.</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", color: "white", textAlign: "center" }}>The moment someone asks you to prove it, and you can&apos;t.</h2>

          {(() => {
            const ROW_ONE = [
              {
                role: "Creators & course sellers",
                pain: "Is your ad about to get you fined, or flagged by the platform you're paying to run it on?",
                solution: "Check your copy in under 60 seconds. Catch income claims, fake urgency, and missing disclosures before you publish.",
              },
              {
                role: "Marketing agencies",
                pain: "One client's ad gets an ASA ruling. Is your agency's name on the file?",
                solution: "Run the checker across every client's copy from one dashboard. Catch what slips past human review.",
              },
              {
                role: "CFOs & finance leaders",
                pain: "The board asks who signed off on the AI system. What do you actually have?",
                solution: "Score governance maturity. Model financial impact. Get board ready reports.",
              },
              {
                role: "Compliance officers",
                pain: "The examiner asks for the record, not the policy. Do you have one?",
                solution: "Gap assessment + evidence package. Regulatory framework mapping.",
              },
            ];
            // Second row is its own independent 3-column grid rather than a
            // continuation of row one's 4 columns, so three items divide
            // evenly and center properly instead of leaving an orphan slot.
            const ROW_TWO = [
              {
                role: "Insurance brokers & underwriters",
                pain: "A claim comes in. Can you tell if the AI system was even authorized to make that call?",
                solution: "Prove your own AI governance, and any delegate's, with a sealed, timestamped audit trail.",
              },
              {
                role: "Solo founders using AI",
                pain: "You added an AI chatbot last month. If it gives bad advice tomorrow, who's actually on the hook?",
                solution: "Get a boundary authorization record in minutes. Know who's accountable before it matters.",
              },
              {
                role: "HR & people teams",
                pain: "Your AI screens candidates. If someone complains about bias, what would you actually show a tribunal?",
                solution: "Governance assessment built for hiring AI. Prove the process, not just the policy.",
              },
            ];
            const card = (item: { role: string; pain: string; solution: string }, dark: boolean) => (
              <div key={item.role} style={{
                background: dark ? "#0D1B2E" : "#102943",
                border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
                borderRadius: "12px",
                padding: "2rem"
              }}>
                <p style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "#E5484D", marginBottom: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.role}</p>
                <p className="font-display" style={{ fontSize: "1.15rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "1.1rem", lineHeight: 1.4, borderLeft: "2px solid #E5484D", paddingLeft: "1rem" }}>{item.pain}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>✓ {item.solution}</p>
              </div>
            );
            return (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
                  {ROW_ONE.map((item, i) => card(item, i % 2 === 0))}
                </div>
                {/* Row two continues row one's index rather than restarting it.
                    On desktop the two rows sit side by side so either start
                    colour reads as a checkerboard, but on mobile every card
                    collapses into one vertical column and a restart put two
                    identical panels back to back at the seam, visibly breaking
                    the alternation. Counting straight through keeps the
                    sequence honest at every width. */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 320px))", justifyContent: "center", gap: "2rem", marginTop: "2rem" }}>
                  {ROW_TWO.map((item, i) => card(item, (i + ROW_ONE.length) % 2 === 0))}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* TAMPER-EVIDENCE / VERIFY */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "#0D1B2E",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "300px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(229,72,77,0.1) 0%, transparent 70%)"
        }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.25rem" }}>
            Cryptographically sealed. Not just stored.
          </p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "1.25rem", color: "white" }}>
            Never be the person who cannot explain a decision<br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>when the board asks.</span>
          </h2>
          <p style={{ ...syne, fontSize: "1.02rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: "640px", margin: "0 auto 2rem" }}>
            Every check and every governance action is sealed the moment it happens, chained to the one before it with SHA-256. Edit, delete, or backdate any record and the break is provable, not something you have to take our word for.
          </p>
          <Link href="/verify" style={{
            ...syne, fontSize: "0.95rem", fontWeight: 700,
            background: "transparent", color: "#E5484D",
            border: "1px solid rgba(229,72,77,0.4)",
            padding: "13px 32px", borderRadius: "9999px",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px"
          }}>
            Verify a real record yourself <span className="arrow">→</span>
          </Link>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "1rem" }}>No account needed. We don&apos;t ask you to trust us on this.</p>

          {/* The proof pillar: the two pages that explain the record itself.
              These had no homepage presence at all (nav dropdown + footer
              only), which matched the zero-usage numbers exactly — nobody
              creates a record they never learn exists. */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginTop: "3rem", textAlign: "left" }}>
            <Link href="/what-where-whether" style={{ textDecoration: "none", background: "rgba(16,41,67,0.6)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "1.75rem", display: "block" }}>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.75rem" }}>The framework</p>
              <h3 style={{ ...syne, fontSize: "1.15rem", fontWeight: 700, color: "white", marginBottom: "0.6rem" }}>What, where, whether</h3>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
                Every compliance flag answers the same three questions a regulator asks: what was actually claimed, which jurisdiction's rules apply, and whether it's substantiated. Read the framework →
              </p>
            </Link>
            <Link href="/who-when-whether" style={{ textDecoration: "none", background: "rgba(16,41,67,0.6)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "1.75rem", display: "block" }}>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.75rem" }}>The framework</p>
              <h3 style={{ ...syne, fontSize: "1.15rem", fontWeight: 700, color: "white", marginBottom: "0.6rem" }}>Who, when, whether</h3>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
                Every AI accountability question a regulator or board asks reduces to three: who approved it, when they approved it, and whether their authority still held when it mattered. Read the framework →
              </p>
            </Link>
          </div>
          {/* Its own centered row rather than a third grid cell, same fix as
              the who-it's-for section: a lone item in an auto-fit 1fr grid
              stretches to fill the row instead of sitting sized and centered. */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 400px))", justifyContent: "center", gap: "1rem", marginTop: "1rem", textAlign: "left" }}>
            <Link href="/boundary-authorization-records" style={{ textDecoration: "none", background: "rgba(16,41,67,0.6)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "1.75rem", display: "block" }}>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.75rem" }}>The record</p>
              <h3 style={{ ...syne, fontSize: "1.15rem", fontWeight: 700, color: "white", marginBottom: "0.6rem" }}>Boundary authorization records</h3>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
                The sealed record that answers all three: a named owner, a decision date, an expiry, and the conditions that void it. Includes a live tamper test you can run yourself →
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── VAULT QUOTE BAND ── */}
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
            backgroundImage: "url(/images/home/vault.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 45%",
            filter: "saturate(0.78) contrast(1.05) brightness(1.0)",
          }}
        />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "rgba(10,22,40,0.32)", mixBlendMode: "multiply" }} />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "linear-gradient(180deg, #0A1628 0%, rgba(10,22,40,0.12) 30%, rgba(10,22,40,0.2) 70%, #0A1628 100%)",
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
            Anyone can say they checked.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>We can prove it.</span>
          </h2>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "linear-gradient(180deg, #0A1628 0%, #0D1B2E 100%)",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "#E5484D", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Ready?</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.5rem", color: "white" }}>Know where you stand in 5 minutes.</h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.7 }}>
            Free either way. No credit card. No account. Results delivered instantly to your inbox.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/compliance-assessment" style={{
              ...syne, fontSize: "1rem", fontWeight: 700,
              background: "#E5484D", color: "white",
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
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "1.5rem" }}><Link href="/pricing" style={{ color: "#E5484D", textDecoration: "none" }}>See pricing for Pro, Growth + Sentinel</Link></p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
