import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "AI Governance Evidence for PI Brokers and MGAs",
  description:
    "You can delegate underwriting authority. You can't delegate the AI risk. Prove your own AI governance, and your delegated authority's, with a cryptographically sealed, timestamped audit trail you can verify on demand. Free governance assessment, no account required.",
  alternates: { canonical: "https://www.redflagaipro.com/insurance-brokers" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const PRESSURES = [
  {
    label: "The exam reaches you, not your MGA",
    date: "Delegated authority, live now",
    description:
      "When a carrier delegates underwriting authority to an MGA or coverholder, the work moves but the oversight obligation stays with the carrier. Regulators are explicit that AI governance responsibility extends to AI a delegate runs on your behalf. Binder due diligence has always checked premium, claims and bordereaux quality. It has never asked to see a delegate's AI governance program, or where a human signs off.",
    hot: true,
  },
  {
    label: "FCA on accountability and AI",
    date: "Nikhil Rathi, FCA",
    description:
      "As AI moves from supporting decisions to making them, accountability has to stay clear. The regulator's direction of travel is explicit: firms will be judged on how fast they surface problems once they know something has gone wrong, not on whether a policy document existed.",
    hot: false,
  },
  {
    label: "Consumer Duty needs evidence",
    date: "FCA, ongoing",
    description:
      "Fair value and good outcomes have to be evidenced, not asserted. If AI plays any part in pricing, underwriting screening or claims triage, the firm needs to be able to show how that output was reviewed, not just that a human theoretically could have looked.",
    hot: false,
  },
  {
    label: "The same shift, in the US",
    date: "NAIC, pilot through Sep 2026",
    description:
      "The NAIC's AI Systems Evaluation Tool is being piloted across a dozen US states, with formal adoption expected at the Fall 2026 National Meeting. The NAIC's AI Model Bulletin has already been adopted by more than half of US states. Governing AI use in insurance is shifting from principle to an actual exam item on both sides of the Atlantic.",
    hot: false,
  },
  {
    label: "The EU named insurance pricing directly",
    date: "EU AI Act, deadline moved to 2 Dec 2027",
    description:
      "Annex III of the EU AI Act classifies AI used for risk assessment and pricing in life and health insurance as high risk, by name, not by inference. The Digital Omnibus agreement pushed the compliance deadline from August 2026 to December 2027. Sixteen extra months is not the same as no obligation. The system named in the regulation is still the system named in the regulation, and a governance record built now is worth more than one built the month the new date arrives.",
    hot: false,
  },
  {
    label: "PI renewal questionnaires",
    date: "Already changing",
    description:
      "Renewal questionnaires increasingly ask about AI controls directly. A timestamped review trail is the difference between a standard premium and an uncomfortable conversation with your own insurer.",
    hot: false,
  },
  {
    label: "Your own marketing",
    date: "Active now",
    description:
      "Broker and MGA websites are advertising. Unsubstantiated claims, comparison rates and urgency wording are regulated the same way for insurance intermediaries as for anyone else.",
    hot: false,
  },
];

const EVIDENCE = [
  {
    headline: "Every review, sealed the moment it happens.",
    body: "Each check and each sign off is written into a hash chain using SHA-256. Edit, delete or backdate any record and the break is provable. Nobody has to take your word for it, including a carrier auditing your delegated authority.",
  },
  {
    headline: "Independent timestamps a carrier can weigh.",
    body: "High value records are sealed with an RFC 3161 trusted timestamp from an independent authority. Anyone can verify it with standard tools, without trusting our database or yours.",
  },
  {
    headline: "Verify a record yourself, right now.",
    body: "We publish a live verification page. Open a real audit record, check the chain, confirm nothing was altered. No account, no sales call. If you would not accept unverifiable evidence from a delegate, do not accept it from software either.",
  },
  {
    headline: "A report you can hand to anyone.",
    body: "Every check produces a PDF with the score, the flags, the reviewer and the timestamp. Built to be handed to a carrier, an insurer, a compliance file or a regulator without a covering explanation.",
  },
];

const RULES = [
  {
    rule: "Delegated authority oversight",
    demands: "A carrier delegating underwriting authority remains responsible for the AI governance of whoever holds that authority, including MGAs and coverholders.",
    checks: "A sealed governance record naming who owns the AI decision, what it's allowed to do, and when that authority expires or needs renewal.",
  },
  {
    rule: "FCA Consumer Duty",
    demands: "Fair value and good outcomes have to be evidenced when AI plays any part in pricing, underwriting or claims screening.",
    checks: "Named reviewer, timestamped decision, sealed record, not a policy document nobody can point to.",
  },
  {
    rule: "NAIC AI Model Bulletin",
    demands: "Adopted by more than half of US states. Requires a documented AI governance program with accountable ownership, for firms with a US book.",
    checks: "Same underlying evidence, jurisdiction mapped, so one governance record answers both sides of the Atlantic.",
  },
  {
    rule: "EU AI Act, Annex III",
    demands: "Names life and health insurance risk assessment and pricing directly as high risk AI. The compliance deadline moved to 2 December 2027, the obligation did not disappear.",
    checks: "A sealed record naming who owns the pricing or risk model, what it is allowed to do, ready well ahead of the new date rather than the month it arrives.",
  },
  {
    rule: "CAP Code / ASA",
    demands: "Broker and MGA marketing claims, comparison rates and urgency wording are regulated advertising, the same as any other sector.",
    checks: "Fake discount patterns, manufactured urgency, testimonial and comparison claims, the core of our 30 risk categories.",
  },
  {
    rule: "UK GDPR and PECR",
    demands: "Marketing emails need a lawful basis, honest sender identification and a working opt out.",
    checks: "Email compliance checks on outbound marketing copy.",
  },
];

const WHO = [
  {
    label: "MGA and coverholder principals",
    title: "The delegated authority is only as strong as the file behind it.",
    description:
      "Underwriters are already using AI screening tools, with or without a governance record. The question a carrier will ask is whether you can prove oversight when it matters. This turns an unmanaged risk into a documented, supervised process.",
  },
  {
    label: "Compliance and risk officers",
    title: "Your file needs evidence, not assurances.",
    description:
      "When a carrier or the FCA asks how AI is controlled, the answer needs dates, names and records. The governance assessment maps your gaps across 6 dimensions, and every subsequent check builds the evidence file for you.",
  },
  {
    label: "Underwriters",
    title: "AI risk is now a binder due diligence item, or it will be.",
    description:
      "Binder reviews have always checked premium, claims and bordereaux quality. A sealed AI governance record is the difference between a routine renewal and a delegated authority that gets pulled.",
  },
  {
    label: "Marketing and BD teams",
    title: "Broker websites and client alerts are regulated advertising.",
    description:
      "Check any page or client communication against 30 risk categories across 11 jurisdictions in under 60 seconds, with every flag explained in plain English before it publishes.",
  },
];

export default function InsuranceBrokersPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "clamp(6rem, 14vw, 10rem) 1.5rem clamp(5rem, 10vw, 7rem)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: "url(/images/broker/signing.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: "saturate(0.82) contrast(1.05) brightness(1.08)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "rgba(10,22,40,0.55)",
            mixBlendMode: "multiply",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(10,22,40,0.72) 0%, rgba(10,22,40,0.35) 40%, rgba(10,22,40,0.55) 75%, #0A1628 100%)",
          }}
        />

        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.75rem" }}>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(244,241,234,0.65)" }}>
              For PI brokers and MGAs
            </p>
            <span style={{ width: "28px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "1.75rem",
              color: "#F4F1EA",
              textShadow: "0 2px 40px rgba(6,14,26,0.95), 0 2px 10px rgba(6,14,26,0.9)",
            }}
          >
            You can delegate underwriting authority.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>You can&apos;t delegate the AI risk.</span>
          </h1>

          <p
            style={{
              ...syne,
              fontSize: "clamp(1rem, 2.6vw, 1.15rem)",
              color: "rgba(244,241,234,0.92)",
              lineHeight: 1.7,
              maxWidth: "640px",
              margin: "0 auto 2.25rem",
              textShadow: "0 1px 3px rgba(6,14,26,0.95), 0 2px 18px rgba(6,14,26,0.9)",
            }}
          >
            Binder due diligence has always checked premium, claims and bordereaux quality. It has never asked to see
            a delegate&apos;s AI governance program. Red Flag AI Pro gives you the sealed, timestamped record that
            answers the question before a carrier has to ask it.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link href="/governance-audit" className="btn-primary" style={{ fontSize: "0.95rem", padding: "14px 30px" }}>
              Free governance assessment <span className="arrow">→</span>
            </Link>
            <Link href="/compliance-assessment" className="btn-secondary" style={{ fontSize: "0.95rem", padding: "14px 30px" }}>
              Free compliance check <span className="arrow">→</span>
            </Link>
          </div>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.55)" }}>
            No card · No account to create · Just your email, results delivered instantly
          </p>
        </div>
      </section>

      {/* ── CASE BAR ── */}
      <div
        style={{
          background: "#102943",
          borderBottom: "1px solid rgba(239,68,68,0.15)",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#E5484D", flexShrink: 0 }} />
        <p style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", textAlign: "center" }}>
          Delegated authority does not delegate liability: <span style={{ color: "#E5484D" }}>the exam reaches you, not your MGA.</span>
        </p>
      </div>

      {/* ── THE PRESSURES ── */}
      <section
        style={{
          padding: "7rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "linear-gradient(180deg, #0C1929 0%, #102943 100%)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
              What is already moving
            </p>
            <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              A sector built on delegated trust
              <br />
              <span style={{ color: "rgba(255,255,255,0.35)" }}>has no record of its AI use.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px" }}>
            {PRESSURES.map((item, i) => (
              <div
                key={item.label}
                style={{
                  background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                  border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
                  padding: "2rem",
                }}
              >
                {item.hot && (
                  <span
                    style={{
                      ...syne,
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#E5484D",
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      display: "inline-block",
                      marginBottom: "1rem",
                    }}
                  >
                    The gap
                  </span>
                )}
                <h3 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>{item.label}</h3>
                <p style={{ ...mono, fontSize: "10px", color: "#E5484D", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>{item.date}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CRYPTOGRAPHIC EVIDENCE, the spine ── */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          style={{
            maxWidth: "1050px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              minHeight: "420px",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url(/images/broker/archive.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "saturate(0.8) contrast(1.08) brightness(1.05)",
              }}
            />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "rgba(13,27,46,0.28)", mixBlendMode: "multiply" }} />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(10,22,40,0.15) 0%, rgba(10,22,40,0.75) 100%)",
              }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.75rem" }}>
              <p style={{ ...mono, fontSize: "clamp(14px, 2.4vw, 17px)", fontWeight: 500, color: "rgba(244,241,234,0.95)", letterSpacing: "0.08em", lineHeight: 1.7, textShadow: "0 1px 8px rgba(6,14,26,0.9)" }}>
                record #4,182 · sealed 26 Jul 2026 14:03:11 UTC
                <br />
                sha256 9f2c…b417 · chain intact · RFC 3161 verified
              </p>
            </div>
          </div>

          <div>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
              Cryptographically sealed. Not just stored.
            </p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2rem" }}>
              Evidence a carrier
              <br />
              would actually accept.
            </h2>

            <div style={{ display: "grid", gap: "1.5rem" }}>
              {EVIDENCE.map((e) => (
                <div key={e.headline} style={{ borderLeft: "2px solid rgba(229,72,77,0.4)", paddingLeft: "1.25rem" }}>
                  <h3 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.4rem" }}>{e.headline}</h3>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{e.body}</p>
                </div>
              ))}
            </div>

            <Link
              href="/verify"
              style={{
                display: "inline-block",
                marginTop: "2rem",
                ...syne,
                fontSize: "13px",
                fontWeight: 700,
                color: "#E5484D",
                textDecoration: "underline",
              }}
            >
              Verify a real audit record yourself, no account needed →
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE RULES WE CHECK AGAINST ── */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "linear-gradient(180deg, #0A1628 0%, #0C1929 100%)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
              Specific, not vague
            </p>
            <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              The rules we check
              <br />
              broker and MGA marketing against.
            </h2>
          </div>

          <div style={{ display: "grid", gap: "2px" }}>
            {RULES.map((r, i) => (
              <div
                key={r.rule}
                style={{
                  background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                  border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
                  padding: "1.75rem 2rem",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "1.25rem",
                  alignItems: "start",
                }}
              >
                <div>
                  <h3 style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "0.4rem" }}>{r.rule}</h3>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{r.demands}</p>
                </div>
                <div style={{ borderLeft: "2px solid rgba(229,72,77,0.4)", paddingLeft: "1.25rem" }}>
                  <p style={{ ...mono, fontSize: "10px", color: "#E5484D", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>What we check</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{r.checks}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: "2.5rem", lineHeight: 1.8, maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}>
            And the honest scope line: we are not your MGA, your carrier or your reinsurer. We cover the published
            word and the AI governance record, the two places where the evidence either exists or it does not.
          </p>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0C1929" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
              Inside the binder
            </p>
            <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Four desks. One record.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2px" }}>
            {WHO.map((w, i) => (
              <div
                key={w.label}
                style={{
                  background: i % 2 === 0 ? "#102943" : "#0D1B2E",
                  border: `1px solid ${i % 2 === 0 ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)"}`,
                  padding: "2rem",
                }}
              >
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.75rem" }}>
                  {w.label}
                </p>
                <h3 style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "0.75rem", lineHeight: 1.4 }}>{w.title}</h3>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{w.description}</p>
              </div>
            ))}
          </div>

          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: "2rem" }}>
            Start with the free checks. The evidence file builds itself from there.
          </p>
        </div>
      </section>

      {/* ── THE CONTRAST ── */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
              The difference
            </p>
            <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              &ldquo;We reviewed it&rdquo; is a claim.
              <br />
              <span style={{ color: "rgba(255,255,255,0.35)" }}>A sealed record is a fact.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px" }}>
            <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.05)", padding: "2rem" }}>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.25rem" }}>
                Without a record
              </p>
              {[
                "AI oversight happens in email threads and memory",
                "No timestamp, no named reviewer",
                "The carrier asks, you reconstruct",
                "Renewal questionnaire arrives, you hope",
                "One incident, no defence",
              ].map((t) => (
                <p key={t} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: "0.6rem" }}>
                  <span style={{ color: "rgba(255,255,255,0.25)", marginRight: "8px" }}>✕</span>
                  {t}
                </p>
              ))}
            </div>
            <div style={{ background: "#102943", border: "1px solid rgba(239,68,68,0.15)", padding: "2rem" }}>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.25rem" }}>
                With Red Flag AI Pro
              </p>
              {[
                "Every check logged with reviewer and timestamp",
                "Records sealed into a SHA-256 hash chain",
                "RFC 3161 trusted timestamps on key events",
                "PDF evidence ready for a carrier, insurer or regulator",
                "One incident, instant answer",
              ].map((t) => (
                <p key={t} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "0.6rem" }}>
                  <span style={{ color: "#E5484D", marginRight: "8px" }}>✓</span>
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LOBBY BAND, the closing quote ── */}
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
            backgroundImage: "url(/images/broker/lobby.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
            filter: "saturate(0.8) contrast(1.05) brightness(1.02)",
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
            Insurance has always run on evidence.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>AI should be no different.</span>
          </h2>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section style={{ padding: "7rem 1.5rem 8rem", textAlign: "center" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
            Know where you stand in 5 minutes
          </p>
          <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
            Two free checks.
            <br />
            Both halves of the risk.
          </h2>
          <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            The governance assessment scores your AI oversight across 6 dimensions and shows the single biggest gap.
            The compliance check reads any page or document against 30 risk categories across 11 jurisdictions in under
            60 seconds. Free, no account, results instantly.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
            <Link href="/governance-audit" className="btn-primary" style={{ fontSize: "0.95rem", padding: "14px 30px" }}>
              Start the governance assessment <span className="arrow">→</span>
            </Link>
            <Link href="/compliance-assessment" className="btn-secondary" style={{ fontSize: "0.95rem", padding: "14px 30px" }}>
              Run the compliance check <span className="arrow">→</span>
            </Link>
          </div>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
            Rolling this out across your delegated authorities, with client workspaces, white label reports and a
            managed audit trail?{" "}
            <Link href="/sentinel#request" style={{ color: "#E5484D", textDecoration: "underline" }}>
              Talk to us about Sentinel
            </Link>
            , scoped and priced to your book.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
