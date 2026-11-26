import type { Metadata } from "next";
import { SisterBusiness } from "@/components/marketing/SisterBusiness";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { StickyCTA } from "@/components/marketing/StickyCTA";
import { TrustBar } from "@/components/marketing/TrustBar";
import { LawClock } from "@/components/marketing/LawClock";
import { GetChecked } from "@/components/marketing/GetChecked";
import { LiveCount } from "@/components/marketing/LiveCount";
import { SiteCheckRequestForm } from "@/components/marketing/SiteCheckRequestForm";
import { getProofStats, formatProofDate } from "@/lib/proof-stats";
import { JURISDICTION_COUNT, RISK_CATEGORY_COUNT, AUDIT_PRICE } from "@/lib/constants";

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
const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

export default async function LandingPage() {
  // Live figures from the sealed chain. Null when the database cannot be
  // reached, in which case the page falls back to wording with no numbers.
  const proof = await getProofStats();
  const num = (n: number) => n.toLocaleString("en-GB");
  const proofFigures = proof
    ? [
        { value: num(proof.daysRunning), label: "days running", live: proof.daysRunning, pollUrl: undefined as string | undefined },
        { value: num(proof.recordsSealed), label: "records sealed", live: proof.recordsSealed, pollUrl: "/api/witness/tip" as string | undefined },
        proof.daysMissed === 0
          ? { value: "0", label: "days missed", live: undefined as number | undefined, pollUrl: undefined as string | undefined }
          : { value: num(proof.daysRunning - proof.daysMissed), label: `of ${num(proof.daysRunning)} days sealed`, live: undefined as number | undefined, pollUrl: undefined as string | undefined },
      ]
    : null;

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StickyCTA />
      <ExitIntent />
      <Navbar />

      {/* ANNOUNCEMENT: live proof from the sealed chain */}
      <Link
        href="/witness-network"
        style={{
          display: "block", textDecoration: "none", background: "#0D1B2E",
          borderBottom: "1px solid rgba(229,72,77,0.25)", padding: "0.6rem 1.5rem", textAlign: "center",
        }}
      >
        <span style={{ ...syne, fontSize: "0.82rem", color: "rgba(244,241,234,0.75)" }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#E5484D", marginRight: "8px", verticalAlign: "middle", animation: "pulseRed 2s ease-in-out infinite" }} />
          {proof ? (
            <>
              <span style={{ color: "#F4F1EA", fontWeight: 700 }}>Live:</span> proof sealed every hour for {num(proof.daysRunning)} days. {proof.daysMissed === 0 ? "No day missed." : `${num(proof.daysRunning - proof.daysMissed)} of them sealed.`}{" "}
            </>
          ) : (
            <>
              <span style={{ color: "#F4F1EA", fontWeight: 700 }}>Live:</span> our own records, sealed every hour and witnessed by independent chains.{" "}
            </>
          )}
          <span style={{ color: "#F4F1EA", fontWeight: 700, textDecoration: "underline" }}>Check it yourself →</span>
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
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Catch what you said. Prove what you did.</p>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.6rem, 6vw, 4.4rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: "1.75rem", color: "#F4F1EA", textShadow: "0 2px 40px rgba(6,14,26,0.95), 0 2px 10px rgba(6,14,26,0.9)" }}>
            What&apos;s your red flag?<br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>We&apos;ll find it for you.</span>
          </h1>
          <p style={{ ...syne, fontSize: "clamp(1.02rem, 3vw, 1.2rem)", color: "rgba(244,241,234,0.92)", lineHeight: 1.7, marginBottom: "2.25rem", maxWidth: "640px", margin: "0 auto 2.25rem", textShadow: "0 1px 3px rgba(6,14,26,0.95), 0 2px 18px rgba(6,14,26,0.9)" }}>
            Give us your website. We check both halves: what you say in public, and how you use AI. Then we show you the one problem most likely to cost you. Free, and you don&apos;t lift a finger.
          </p>
          <div id="red-flag" style={{ maxWidth: "720px", margin: "0 auto 1.1rem", scrollMarginTop: "110px" }}>
            <SiteCheckRequestForm variant="compact" />
          </div>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.7)", textShadow: "0 1px 3px rgba(6,14,26,0.95)" }}>
            Free · No card · No account · If we find nothing, we tell you that too ·{" "}
            <a href="#get-checked" style={{ color: "#F4F1EA", fontWeight: 700, textDecoration: "underline" }}>See what you get ↓</a>
          </p>
        </div>
      </section>

      <TrustBar />

      {/* TWO HALVES: compliance and AI governance given equal weight, with
          governance made concrete for small businesses (26 Nov 2026). Most
          owners do not know they "do" AI governance until they see the four
          everyday examples on the right. */}
      <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "1rem" }}>What we check</p>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.12, color: "#F4F1EA", marginBottom: "1rem" }}>
              Two halves. <span style={{ fontStyle: "italic", color: "#E5484D" }}>One check.</span>
            </h2>
            <p style={{ ...syne, fontSize: "15.5px", color: "rgba(244,241,234,0.7)", lineHeight: 1.75, maxWidth: "620px", margin: "0 auto" }}>
              Most businesses only think about the first half. The second one is where the new rules are landing.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                tag: "Compliance · What you said",
                title: "Your website, ads and offers.",
                items: ["Prices, offers and deadlines", "Reviews and testimonials", "Claims about results, health or income", "Privacy notices and the legal details your site must show"],
                ask: "Is everything you say in public allowed?",
                accent: "#E5484D",
              },
              {
                tag: "AI governance · What you did",
                title: "How your business uses AI.",
                items: ["The chat or booking assistant on your website", "Pages, posts and replies written by AI", "Staff pasting client details into ChatGPT", "Software that helps decide who gets an appointment, a job or a refund"],
                ask: "Who approved it, and could you prove it?",
                accent: "#C9A66B",
              },
            ].map((h) => (
              <div key={h.tag} style={{ background: "#0A1628", border: "1px solid rgba(255,255,255,0.08)", borderTop: `3px solid ${h.accent}`, borderRadius: "12px", padding: "2rem" }}>
                <p style={{ ...mono, fontSize: "10.5px", letterSpacing: "0.16em", textTransform: "uppercase", color: h.accent, marginBottom: "0.9rem" }}>{h.tag}</p>
                <p className="font-display" style={{ fontSize: "1.55rem", fontWeight: 500, color: "#F4F1EA", lineHeight: 1.25, marginBottom: "1.1rem" }}>{h.title}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.4rem", display: "grid", gap: "0.6rem" }}>
                  {h.items.map((t) => (
                    <li key={t} style={{ ...syne, fontSize: "15px", color: "rgba(244,241,234,0.78)", lineHeight: 1.5, display: "flex", gap: "10px" }}>
                      <span style={{ color: h.accent, flexShrink: 0 }}>●</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="font-display" style={{ fontSize: "1.15rem", fontStyle: "italic", color: h.accent, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>{h.ask}</p>
              </div>
            ))}
          </div>

          <p style={{ ...syne, fontSize: "15px", color: "rgba(244,241,234,0.75)", lineHeight: 1.75, textAlign: "center", maxWidth: "680px", margin: "2.5rem auto 0" }}>
            If you use any of the four on the right, you are already doing AI governance, whether or not anyone has called it that. <strong style={{ color: "#F4F1EA" }}>We check both halves for you.</strong>
          </p>
        </div>
      </section>

      <GetChecked />

      <LawClock />

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
                role: "Clinics & local businesses",
                pain: "Your website chat is AI. If it gives a patient the wrong answer, who signed it off?",
                solution: "We check what your site says and how your AI is used, and show you the gaps.",
              },
              {
                role: "Marketing agencies",
                pain: "One client's ad gets an ASA ruling. Is your agency's name on the file?",
                solution: "We check every client's site for you. Catch what slips past human review.",
              },
              {
                role: "CFOs & finance leaders",
                pain: "The board asks who signed off on the AI system. What do you actually have?",
                solution: "We check how your business uses AI and give you a clear, board ready report.",
              },
              {
                role: "Compliance officers",
                pain: "The examiner asks for the record, not the policy. Do you have one?",
                solution: "Every gap found and mapped to the rules, with the evidence sealed on the record.",
              },
            ];
            // Task #279, site simplification audit 9 Aug 2026: seven full
            // cards on first view was real dilution. Row one keeps the four
            // strongest, most direct-ICP personas as full cards; row two is
            // visually demoted to a single compact strip below rather than
            // trimmed away entirely, so an insurance broker or HR lead who
            // lands here still finds their own language, just without
            // competing with row one for the first screen.
            // Task update, 9 Aug 2026: law firms and PI brokers moved back to
            // full cards of their own, a dedicated regulated-industries row
            // rather than folded into the general grid or the demoted strip,
            // so they read as main content the way the requirement asked.
            const REGULATED_VERTICALS = [
              {
                role: "Law firms",
                pain: "A solicitor was referred to the SRA over unchecked AI output. Could your firm show the review happened, and when?",
                solution: "Every AI assisted document logged and sealed. Timestamped proof of review, produced on demand.",
              },
              {
                role: "Insurance brokers & underwriters",
                pain: "A claim comes in. Can you tell if the AI system was even authorized to make that call?",
                solution: "Boundary authorization records show exactly who authorized what, and whether it still holds.",
              },
            ];
            const ROW_TWO = [
              {
                role: "Solo founders using AI",
                pain: "You added an AI chatbot last month. If it gives bad advice tomorrow, who's actually on the hook?",
              },
              {
                role: "HR & people teams",
                pain: "Your AI screens candidates. If someone complains about bias, what would you actually show a tribunal?",
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
            const VERTICAL_HREF: Record<string, string> = {
              "Law firms": "/law-firms",
              "Insurance brokers & underwriters": "/insurance-brokers",
            };
            return (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
                  {ROW_ONE.map((item, i) => card(item, i % 2 === 0))}
                </div>

                <div style={{ marginTop: "3rem", paddingTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "#E5484D", marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.14em", textAlign: "center" }}>Built for regulated industries</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                    {REGULATED_VERTICALS.map((item, i) => (
                      <a key={item.role} href={VERTICAL_HREF[item.role]} style={{ textDecoration: "none", display: "block" }}>
                        {card(item, i % 2 === 0)}
                      </a>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.35)", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }}>Also built for</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
                    {ROW_TWO.map((item) => (
                      <div key={item.role}>
                        <p style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.75)", marginBottom: "0.4rem" }}>{item.role}</p>
                        <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{item.pain}</p>
                      </div>
                    ))}
                  </div>
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
            Sealed and witnessed. Not just stored.
          </p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "1.25rem", color: "white" }}>
            Never be the person who cannot explain a decision<br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>when someone asks.</span>
          </h2>
          <p style={{ ...syne, fontSize: "1.02rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: "640px", margin: "0 auto 2rem" }}>
            Every check we do is dated and sealed the moment it happens, and witnessed by independent parties we do not control. Change or backdate a record and it shows. So when a regulator, an insurer or a customer asks what you checked and when, you can prove it.
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

      {/* START ON YOUR OWN: the governance assessment is the one self serve route left in public */}
      <section style={{ padding: "3.5rem 1.5rem", background: "#0D1B2E", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,241,234,0.5)", marginBottom: "0.9rem" }}>Prefer to start on your own?</p>
          <p className="font-display" style={{ fontSize: "1.45rem", fontWeight: 500, color: "#F4F1EA", lineHeight: 1.35, marginBottom: "0.9rem" }}>
            Score your own AI governance. Twelve questions, your biggest gap on screen.
          </p>
          <Link href="/governance-audit" style={{ ...syne, fontSize: "0.92rem", fontWeight: 700, color: "#E5484D", textDecoration: "none" }}>
            Take the free governance assessment →
          </Link>
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
        {/* Extra shade behind the figures so they read cleanly over the photo. */}
        {proof && (
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 85% 62% at 50% 58%, rgba(10,22,40,0.86) 0%, rgba(10,22,40,0.55) 55%, rgba(10,22,40,0) 100%)" }} />
        )}
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
          {proof && proofFigures && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "clamp(0.75rem, 3vw, 2.5rem)", maxWidth: "600px", margin: "3rem auto 0" }}>
                {proofFigures.map((f) => (
                  <div key={f.label} style={{ textAlign: "left", paddingLeft: "clamp(10px, 2.5vw, 16px)", borderLeft: "2px solid #E5484D" }}>
                    <span style={{ ...mono, display: "block", fontSize: "clamp(1.5rem, 6.4vw, 3rem)", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.02em", color: "#F4F1EA", textShadow: "0 2px 24px rgba(6,14,26,0.95)" }}>{typeof f.live === "number" ? <LiveCount value={f.live} pollUrl={f.pollUrl} /> : f.value}</span>
                    <span style={{ ...mono, display: "block", marginTop: "10px", fontSize: "10.5px", lineHeight: 1.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,241,234,0.85)", textShadow: "0 1px 8px rgba(6,14,26,0.95)" }}>{f.label}</span>
                  </div>
                ))}
              </div>
              <p style={{ ...syne, fontSize: "0.98rem", color: "rgba(244,241,234,0.88)", lineHeight: 1.7, maxWidth: "560px", margin: "2.25rem auto 0", textShadow: "0 1px 3px rgba(6,14,26,0.95), 0 2px 18px rgba(6,14,26,0.9)" }}>
                The EU AI Act&apos;s transparency rules went live on {formatProofDate(proof.since)}. From that day, the fingerprint of our own sealed records has gone out every hour to independent chains we do not control.{proof.daysMissed === 0 ? " We have not missed a day since." : ""}
              </p>
              <Link href="/witness-network" style={{
                ...syne, fontSize: "0.92rem", fontWeight: 700, marginTop: "1.75rem",
                background: "rgba(10,22,40,0.55)", color: "#F4F1EA",
                border: "1px solid rgba(244,241,234,0.35)",
                padding: "12px 28px", borderRadius: "9999px",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px"
              }}>
                See the live record <span className="arrow">→</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* GET AHEAD, NOT CAUGHT: the reward that follows the red flag.
          The page opens on the fear (what could cost you). This is the other
          half: firms that can prove they used AI properly come out stronger. */}
      <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "940px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "1.1rem" }}>Why it is worth doing properly</p>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.12, color: "#F4F1EA", marginBottom: "1.4rem" }}>
              Use AI to get ahead.<br />
              <span style={{ fontStyle: "italic", color: "#E5484D" }}>Not to get caught.</span>
            </h2>
            <p className="font-display" style={{ fontSize: "clamp(1.15rem, 2.6vw, 1.45rem)", fontWeight: 400, color: "rgba(244,241,234,0.85)", lineHeight: 1.5, maxWidth: "720px", margin: "0 auto" }}>
              Two kinds of business use AI: the ones who can prove they used it properly, and the ones hoping nobody asks.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              { tag: "The risk", line: "AI should make your business stronger. Unchecked, it makes you easier to fine." },
              { tag: "What we do", line: "We don\u2019t tell you to slow down. We make sure it holds up." },
            ].map((q) => (
              <div key={q.tag} style={{ background: "#0A1628", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "2px solid #E5484D", borderRadius: "10px", padding: "1.75rem" }}>
                <p style={{ ...mono, fontSize: "10.5px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.8rem" }}>{q.tag}</p>
                <p className="font-display" style={{ fontSize: "1.35rem", fontWeight: 500, color: "#F4F1EA", lineHeight: 1.35 }}>{q.line}</p>
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
          <p style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "#E5484D", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Your move</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.5rem", color: "white" }}>Find out before someone else does.</h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.7 }}>
            Give us your website. We show you the one problem most likely to cost you. Free, no card, no account.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#red-flag" style={{
              ...syne, fontSize: "1rem", fontWeight: 700,
              background: "#E5484D", color: "white",
              padding: "14px 40px", borderRadius: "9999px",
              textDecoration: "none", display: "inline-block"
            }}>
              Show me my red flag
            </a>
            <Link href="/audit" style={{
              ...syne, fontSize: "1rem", fontWeight: 700,
              background: "transparent", color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "14px 40px", borderRadius: "9999px",
              textDecoration: "none", display: "inline-block"
            }}>
              The full audit, £{AUDIT_PRICE.amount}
            </Link>
          </div>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "1.5rem" }}><Link href="/sentinel" style={{ color: "#E5484D", textDecoration: "none" }}>Need it handled every month? See Sentinel</Link></p>
        </div>
      </section>

      {/* WHO RUNS THIS, and the other business he runs. Same panel as the
          About page, so nobody has to go looking for it. */}
      <section style={{ padding: "0 1.5rem 5rem", background: "#0D1B2E" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <SisterBusiness />
        </div>
      </section>
      <Footer />
    </div>
  );
}
