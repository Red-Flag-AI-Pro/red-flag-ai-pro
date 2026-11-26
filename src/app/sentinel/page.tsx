import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SentinelRequestForm } from "@/components/marketing/SentinelRequestForm";
import { LawClock } from "@/components/marketing/LawClock";
import React from "react";
import { AUDIT_PRICE } from "@/lib/constants";
import { getProofStats, formatProofDate } from "@/lib/proof-stats";

// Sentinel is the monthly step after the done for you audit: the audit clears
// a site's red flags, Sentinel keeps them cleared and keeps a sealed, dated
// record of every check. The witness network is the proof behind it.

export const revalidate = 3600;

const SENTINEL_MONTHLY = 199;

export const metadata: Metadata = {
  title: "Sentinel: Your Website Checked Every Month, Every Check on the Record",
  description:
    "After the audit, Sentinel keeps your site clear. We check what your website says and how you use AI every month, tell you when the law changes, keep your reviewed badge live and seal a dated record of every check. Compliance and AI governance, handled.",
  alternates: { canonical: "https://www.redflagaipro.com/sentinel" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const DRIFT = [
  {
    tag: "Your site",
    title: "New offers, new pages, new risks.",
    body: "Every new offer, treatment page, price change or ad is a fresh chance to say something you can't. A site that was clear in November can carry three new red flags by March.",
  },
  {
    tag: "The law",
    title: "The rules keep moving.",
    body: "Advertising rulings, consumer law and AI rules change through the year. What was fine when you were audited may not be fine six months later.",
  },
  {
    tag: "Your AI",
    title: "More of your words are written by AI.",
    body: "Chatbots, AI written pages and automated replies all speak for your business. If one of them gets it wrong, it is your name on the complaint.",
  },
];

const MONTHLY = [
  {
    n: "01",
    title: "Your site checked every month.",
    body: "Every page, every new offer, what your site says and how you use AI. You get a short note each month: all clear, or exactly what to change and how.",
  },
  {
    n: "02",
    title: "When the law changes, you hear it from us first.",
    body: "If a new rule or ruling touches your business, you get a plain English note on what it means for you and what, if anything, to do.",
  },
  {
    n: "03",
    title: "Your reviewed badge stays live.",
    body: "The badge from your audit stays on your site for as long as you are covered, so customers and partners can see you take this seriously.",
  },
  {
    n: "04",
    title: "Added to the Witness Network automatically.",
    body: "From your first month, every check is sealed with the date it happened and joins the Witness Network, where independent witnesses we do not control hold its fingerprint. Nothing to install, nothing to set up. If the ASA, a regulator, an insurer or a client ever asks what you checked and when, you can prove it, not just say it.",
  },
];

const FAQ = [
  {
    q: "Do I need the audit first?",
    a: `Yes. Sentinel keeps a clear site clear, so it starts from the full audit (£${AUDIT_PRICE.amount}), which finds and clears everything that is there today.`,
  },
  {
    q: "What happens when you find something?",
    a: "It goes in that month's note with the exact wording to change and why. You or whoever runs your website makes the change. If it is urgent, you hear about it straight away, not at the end of the month.",
  },
  {
    q: "Is there a contract?",
    a: "No. It is monthly and you can stop any time.",
  },
  {
    q: "Is this legal advice?",
    a: "No. It is a professional check of what your site says and how you use AI, against the rules regulators apply. Where something needs a lawyer, we will tell you.",
  },
  {
    q: "We are bigger than one website.",
    a: "For several sites, several brands or a regulated team, Sentinel is scoped to you. Use the form below and tell us what you need.",
  },
];

const num = (n: number) => n.toLocaleString("en-GB");

export default async function SentinelPage() {
  const proof = await getProofStats();

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* Gold sheen for the Sentinel wordmark, page local so globals stay untouched */}
      <style>{`
        @keyframes sentinelSheen {
          0% { background-position: 200% center; }
          55%, 100% { background-position: -200% center; }
        }
        .sentinel-gold {
          background: linear-gradient(110deg, #C9A66B 25%, #F7EDD8 42%, #E8D5AC 48%, #C9A66B 62%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #C9A66B;
          animation: sentinelSheen 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .sentinel-gold { animation: none; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(6rem, 14vw, 10rem) 1.5rem clamp(5rem, 10vw, 7rem)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "url(/images/sentinel/tower.jpg)", backgroundSize: "cover", backgroundPosition: "center 35%", filter: "saturate(0.82) contrast(1.05) brightness(1.08)" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "rgba(10,22,40,0.3)", mixBlendMode: "multiply" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(10,22,40,0.7) 0%, rgba(10,22,40,0.35) 40%, rgba(10,22,40,0.6) 75%, #0A1628 100%)" }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "2rem" }}>
            <span style={{ width: "28px", height: "1px", background: "rgba(201,166,107,0.6)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.7)" }}>After the audit</p>
            <span style={{ width: "28px", height: "1px", background: "rgba(201,166,107,0.6)" }} />
          </div>

          <h1 className="sentinel-gold" style={{ ...syne, fontSize: "clamp(3rem, 9vw, 6.5rem)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "1.75rem" }}>
            Sentinel
          </h1>

          <p className="font-display" style={{ fontSize: "clamp(1.3rem, 3.2vw, 1.9rem)", fontWeight: 500, color: "#F4F1EA", lineHeight: 1.4, maxWidth: "700px", margin: "0 auto 1.25rem", textShadow: "0 2px 30px rgba(6,14,26,0.95), 0 2px 8px rgba(6,14,26,0.9)" }}>
            Your site checked every month.{" "}
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>Every check on the record.</span>
          </p>

          <p style={{ ...syne, fontSize: "15px", color: "rgba(244,241,234,0.88)", lineHeight: 1.8, maxWidth: "580px", margin: "0 auto 2.5rem", textShadow: "0 1px 3px rgba(6,14,26,0.95), 0 2px 18px rgba(6,14,26,0.9)" }}>
            The audit clears your red flags. Sentinel keeps them cleared. We check what your website says and how you use AI every month, tell you when the law changes, and add every check to the Witness Network automatically, so if anyone ever asks, you can prove it.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <a href="#request" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "14px 32px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)", textDecoration: "none", letterSpacing: "0.02em" }}>
              Start Sentinel
            </a>
            <Link href="/audit" style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)", ...syne, fontSize: "0.9rem", fontWeight: 600, padding: "14px 32px", borderRadius: "9999px", textDecoration: "none" }}>
              First, the full audit
            </Link>
          </div>
          <p style={{ ...mono, fontSize: "12px", letterSpacing: "0.08em", color: "rgba(244,241,234,0.7)", textShadow: "0 1px 3px rgba(6,14,26,0.95)" }}>
            £{SENTINEL_MONTHLY} a month · No contract · Stop any time
          </p>
        </div>
      </section>

      {/* ── WHY: a site does not stay fixed ── */}
      <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "1rem" }}>Why one audit is not enough</p>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.12, color: "#F4F1EA" }}>
              Your site doesn&apos;t stay fixed.
              <br />
              <span style={{ fontStyle: "italic", color: "#E5484D" }}>Nobody&apos;s does.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {DRIFT.map((d) => (
              <div key={d.tag} style={{ background: "#0A1628", border: "1px solid rgba(255,255,255,0.08)", borderTop: "2px solid #E5484D", borderRadius: "10px", padding: "1.75rem" }}>
                <p style={{ ...mono, fontSize: "10.5px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.8rem" }}>{d.tag}</p>
                <p className="font-display" style={{ fontSize: "1.35rem", fontWeight: 500, color: "#F4F1EA", lineHeight: 1.3, marginBottom: "0.7rem" }}>{d.title}</p>
                <p style={{ ...syne, fontSize: "14.5px", color: "rgba(244,241,234,0.62)", lineHeight: 1.7 }}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET EVERY MONTH ── */}
      <section style={{ padding: "6rem 1.5rem", background: "#0A1628" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "1rem" }}>What you get every month</p>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#F4F1EA" }}>
              We keep watching.
              <br />
              <span style={{ fontStyle: "italic", color: "#C9A66B" }}>You get on with your business.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gap: "1rem" }}>
            {MONTHLY.map((m) => (
              <div key={m.n} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.75rem" }}>
                <span style={{ ...mono, fontSize: "14px", color: "#E5484D", flexShrink: 0, paddingTop: "4px" }}>{m.n}</span>
                <div>
                  <p className="font-display" style={{ fontSize: "1.4rem", fontWeight: 500, color: "#F4F1EA", lineHeight: 1.3, marginBottom: "0.5rem" }}>{m.title}</p>
                  <p style={{ ...syne, fontSize: "15px", color: "rgba(244,241,234,0.65)", lineHeight: 1.7 }}>{m.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, textAlign: "center", marginTop: "1.75rem" }}>
            And a question answered whenever you have one. Email us and you hear back within one working day.
          </p>
        </div>
      </section>

      {/* ── PROOF: the witness record behind every check ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "7rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "url(/images/sentinel/signature.jpg)", backgroundSize: "cover", backgroundPosition: "center", filter: "saturate(0.7) brightness(0.9)" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, #0A1628 0%, rgba(10,22,40,0.82) 25%, rgba(10,22,40,0.82) 75%, #0A1628 100%)" }} />
        <div style={{ maxWidth: "820px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "1rem" }}>What makes it different</p>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#F4F1EA", marginBottom: "1.4rem" }}>
            Anyone can say they checked.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>You&apos;ll be able to prove it.</span>
          </h2>
          <p style={{ ...syne, fontSize: "15.5px", color: "rgba(244,241,234,0.75)", lineHeight: 1.8, maxWidth: "640px", margin: "0 auto 2.5rem" }}>
            Every Sentinel client joins the Witness Network automatically. Each check is sealed the moment it happens and chained to the one before it, and the fingerprint of the record goes out every hour to independent witnesses we do not control. Nobody, including us, can change or backdate it without the break showing. Only the fingerprint leaves us; your findings stay private.
          </p>

          {proof && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem", maxWidth: "640px", margin: "0 auto 2rem" }}>
              {[
                { v: num(proof.daysRunning), l: "days running" },
                { v: num(proof.recordsSealed), l: "records sealed" },
                { v: proof.daysMissed === 0 ? "0" : num(proof.daysMissed), l: "days missed" },
              ].map((s) => (
                <div key={s.l} style={{ background: "rgba(13,27,46,0.85)", border: "1px solid rgba(201,166,107,0.3)", borderRadius: "10px", padding: "1.25rem" }}>
                  <p className="font-mono-fig" style={{ fontSize: "2rem", color: "#F4F1EA", lineHeight: 1 }}>{s.v}</p>
                  <p style={{ ...mono, fontSize: "10.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)", marginTop: "0.5rem" }}>{s.l}</p>
                </div>
              ))}
            </div>
          )}
          {proof && (
            <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.55)", marginBottom: "1.5rem" }}>
              Running every hour since {formatProofDate(proof.since)}.
            </p>
          )}
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/witness-network" style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#C9A66B", textDecoration: "none" }}>
              How the Witness Network works →
            </Link>
            <Link href="/verify" style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#C9A66B", textDecoration: "none" }}>
              Check a real record yourself →
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE LAW, live ── */}
      <LawClock cta={false} />

      {/* ── PRICE ── */}
      <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "1rem" }}>How it starts</p>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#F4F1EA" }}>
              Clear it once. <span style={{ fontStyle: "italic", color: "#C9A66B" }}>Keep it clear.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            <div style={{ background: "#0A1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "2rem" }}>
              <p style={{ ...mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)", marginBottom: "0.8rem" }}>Step 1 · once</p>
              <p className="font-display" style={{ fontSize: "1.6rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.4rem" }}>The full audit</p>
              <p className="font-mono-fig" style={{ fontSize: "2.2rem", color: "#F4F1EA", marginBottom: "0.8rem" }}>£{AUDIT_PRICE.amount}</p>
              <p style={{ ...syne, fontSize: "14.5px", color: "rgba(244,241,234,0.65)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Every red flag on your site and how to clear it, on video and in writing within 48 hours, with your reviewed badge. Money back if we find nothing worth fixing.
              </p>
              <Link href="/audit" style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#F4F1EA", textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "9999px", padding: "10px 22px", display: "inline-block" }}>
                About the audit
              </Link>
            </div>

            <div style={{ background: "#0A1628", border: "1px solid rgba(201,166,107,0.55)", borderRadius: "14px", padding: "2rem", boxShadow: "0 0 0 1px rgba(201,166,107,0.15), 0 20px 50px rgba(0,0,0,0.25)" }}>
              <p style={{ ...mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "0.8rem" }}>Step 2 · every month</p>
              <p className="font-display sentinel-gold" style={{ fontSize: "1.6rem", fontWeight: 500, marginBottom: "0.4rem" }}>Sentinel</p>
              <p style={{ marginBottom: "0.8rem" }}>
                <span className="font-mono-fig" style={{ fontSize: "2.2rem", color: "#F4F1EA" }}>£{SENTINEL_MONTHLY}</span>
                <span style={{ ...syne, fontSize: "14px", color: "rgba(244,241,234,0.6)" }}> a month</span>
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "grid", gap: "0.5rem" }}>
                {["Your site checked every month", "Law changes explained for you", "Reviewed badge kept live", "Added to the Witness Network automatically", "Questions answered within a working day", "No contract, stop any time"].map((t) => (
                  <li key={t} style={{ ...syne, fontSize: "14.5px", color: "rgba(244,241,234,0.8)", display: "flex", gap: "10px" }}>
                    <span style={{ color: "#C9A66B" }}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
              <a href="#request" style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", background: "#E5484D", textDecoration: "none", borderRadius: "9999px", padding: "11px 24px", display: "inline-block" }}>
                Start Sentinel
              </a>
            </div>
          </div>

          <p style={{ ...syne, fontSize: "14px", color: "rgba(244,241,234,0.55)", textAlign: "center", marginTop: "1.75rem", lineHeight: 1.7 }}>
            Several sites, several brands or a regulated team? Sentinel is scoped to you. <a href="#request" style={{ color: "#C9A66B", textDecoration: "none", fontWeight: 700 }}>Tell us what you need.</a>
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "5rem 1.5rem", background: "#0A1628" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 500, color: "#F4F1EA", textAlign: "center", marginBottom: "2rem" }}>Questions</h2>
          {FAQ.map((f) => (
            <details key={f.q} style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1.1rem 0.25rem" }}>
              <summary style={{ ...syne, fontSize: "16px", fontWeight: 700, color: "#F4F1EA", cursor: "pointer" }}>{f.q}</summary>
              <p style={{ ...syne, fontSize: "15px", color: "rgba(244,241,234,0.65)", lineHeight: 1.75, marginTop: "0.7rem" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── REQUEST FORM ── */}
      <section id="request" style={{ padding: "5rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0C1929", scrollMarginTop: "80px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>Start Sentinel</p>
            <h2 className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#F4F1EA", marginBottom: "0.75rem" }}>
              Start Sentinel, or ask a question.
            </h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
              Send the short form and James replies personally within one working day. Not had your audit yet?{" "}
              <Link href="/get-checked" style={{ color: "#E5484D", textDecoration: "none", fontWeight: 700 }}>Start with your free red flag.</Link>
            </p>
          </div>
          <SentinelRequestForm />
        </div>
      </section>

      {/* ── CLOSER ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(7rem, 16vw, 11rem) 1.5rem" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "url(/images/sentinel/skyline.jpg)", backgroundSize: "cover", backgroundPosition: "center 60%", filter: "saturate(0.8) contrast(1.05)" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "rgba(10,22,40,0.3)", mixBlendMode: "multiply" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, #0A1628 0%, rgba(10,22,40,0.1) 30%, rgba(10,22,40,0.18) 70%, #0A1628 100%)" }} />
        <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.2, color: "#F4F1EA", textShadow: "0 2px 40px rgba(6,14,26,0.95), 0 2px 10px rgba(6,14,26,0.9)" }}>
            Everyone else has gone home.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>The record is still on duty.</span>
          </h2>
        </div>
      </section>

      <Footer />
    </div>
  );
}
