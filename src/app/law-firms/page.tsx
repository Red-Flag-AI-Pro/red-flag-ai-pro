import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";
import { JURISDICTION_COUNT, RISK_CATEGORY_COUNT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "AI Governance & Compliance Evidence for Law Firms",
  description:
    "A solicitor was referred to the regulator after unchecked AI output reached a tribunal. Prove every AI assisted document in your firm was reviewed, with a cryptographically sealed, timestamped audit trail you can verify on demand. Free governance assessment, no account required.",
  alternates: { canonical: "https://www.redflagaipro.com/law-firms" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const PRESSURES = [
  {
    label: "Munir v SSHD",
    date: "[2026] UKUT 00081 (IAC)",
    description:
      "Judicial review grounds contained false and non existent citations generated with non specialist AI tools. A three judge panel of the Upper Tribunal heard the Hamid proceedings and the solicitor responsible was referred to the SRA. Responsibility for AI output sits with the person who signs the document.",
    hot: true,
  },
  {
    label: "The supervision duty",
    date: "Munir, Upper Tribunal 2026",
    description:
      "The tribunal held that a solicitor who delegates work remains responsible for supervising it, and that failing to ensure fee earners understood the dangers of non specialist AI for legal research, or failing to undertake appropriate checks, is likely to result in a referral to the SRA.",
    hot: false,
  },
  {
    label: "Privilege, waived in one upload",
    date: "Munir, Upper Tribunal 2026",
    description:
      "The first case in England and Wales to address the point: the tribunal observed that uploading confidential documents into an open source AI tool places the information in the public domain, breaching client confidentiality and waiving privilege.",
    hot: false,
  },
  {
    label: "UKJT on AI liability",
    date: "Legal statement, 7 July 2026",
    description:
      "The UK Jurisdiction Taskforce's Legal Statement on Liability for AI Harms confirms AI has no legal personality under English law. Liability stays with the people and businesses that use it, under ordinary principles of contract, negligence and misrepresentation.",
    hot: false,
  },
  {
    label: "EU AI Act Article 50",
    date: "Enforceable 2 August 2026",
    description:
      "Transparency obligations for AI generated content take effect. Firms producing client facing content and marketing with AI assistance need to be able to disclose and document that use, not just their clients.",
    hot: false,
  },
  {
    label: "Your own marketing",
    date: "Active now",
    description:
      "Law firm websites and client alerts are advertising. Unsubstantiated superlatives, testimonial rules and comparison claims apply to firms like anyone else, and regulators do not give lawyers a pass for knowing better.",
    hot: false,
  },
];

const EVIDENCE = [
  {
    headline: "Every review, sealed the moment it happens.",
    body: "Each check and each sign off is written into a hash chain using SHA-256. Edit, delete or backdate any record and the break is provable. Nobody has to take your word for it, and nobody can quietly rewrite history.",
  },
  {
    headline: "Independent timestamps a court can weigh.",
    body: "High value records are sealed with an RFC 3161 trusted timestamp from an independent authority. Anyone can verify it with standard tools, without trusting our database or your firm's.",
  },
  {
    headline: "Verify a record yourself, right now.",
    body: "We publish a live verification page. Open a real audit record, check the chain, confirm nothing was altered. No account, no sales call. If you would not accept unverifiable evidence from a witness, do not accept it from software.",
  },
  {
    headline: "A report you can hand to anyone.",
    body: "Every check produces a PDF with the score, the flags, the reviewer and the timestamp. Built to be handed to an insurer, a client, a COLP file or a regulator without a covering explanation.",
  },
];

const RULES = [
  {
    rule: "SRA Transparency Rules",
    demands: "Price and service information for specified practice areas, complaints signposting and regulatory information must be published on your website, accurately.",
    checks: "Pricing transparency, missing disclosures and required information checks across your published pages.",
  },
  {
    rule: "LASPO s.56 referral fee ban",
    demands: "Paid referral arrangements in personal injury work are banned, and acquisition marketing must not disguise them.",
    checks: "Undisclosed paid promotion and acquisition claims flagged in marketing copy before it publishes.",
  },
  {
    rule: "DMCC Act 2024",
    demands: "The CMA now fines unfair commercial practices directly, up to 10% of global turnover. Fake reviews, false urgency and misleading price claims are explicitly in scope.",
    checks: `Fake discount patterns, manufactured urgency, testimonial and review claims, and misleading statements, the core of our ${RISK_CATEGORY_COUNT} risk categories.`,
  },
  {
    rule: "UK GDPR and PECR",
    demands: "Marketing emails need a lawful basis, honest sender identification and a working opt out.",
    checks: "Email compliance checks on your outbound marketing copy.",
  },
  {
    rule: "EU AI Act Article 50",
    demands: "From 2 August 2026, AI generated content requires transparency. Firms using AI for client facing content carry the obligation.",
    checks: "AI disclosure checks, plus the governance record proving human review, sealed and timestamped.",
  },
  {
    rule: "SRA ethics discussions",
    demands:
      "Where a decision turns on a question of professional ethics, the firm is expected to be able to show that the discussion happened, who took part, and what was decided. A file note written afterwards is worth considerably less than a record made at the time.",
    checks:
      "Every ethics decision about AI use gets a dated record naming who decided and on what authority, sealed so it cannot be added to later. Records are retained for at least three years, past the point where anyone remembers the conversation.",
  },
];

const WHO = [
  {
    label: "Managing partners",
    title: "The firm's name is on every document AI touches.",
    description:
      "Associates are already using AI, with or without a policy. The question is whether the firm can prove oversight when it matters. A governance record turns an unmanaged risk into a supervised process.",
  },
  {
    label: "COLP and COFA",
    title: "Your compliance file needs evidence, not assurances.",
    description:
      "When the SRA asks how AI is controlled, the answer needs dates, names and records. The governance assessment maps your gaps across 6 dimensions, and every subsequent check builds the evidence file for you.",
  },
  {
    label: "Heads of risk",
    title: "AI risk is now insurable, or expensive.",
    description:
      "PI renewal questionnaires increasingly ask about AI controls. A timestamped review trail is the difference between a standard premium and an uncomfortable conversation.",
  },
  {
    label: "Marketing and BD teams",
    title: "Client alerts and websites are regulated advertising.",
    description:
      `Check any page or client communication against ${RISK_CATEGORY_COUNT} risk categories across ${JURISDICTION_COUNT} jurisdictions in under 60 seconds, with every flag explained in plain English before it publishes.`,
  },
];

export default function LawFirmsPage() {
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
        {/* Photo, graded toward navy */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: "url(/images/law/law-library.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: "saturate(0.82) contrast(1.05) brightness(1.08)",
          }}
        />
        {/* Navy multiply grade */}
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
        {/* Scrim for legibility, fading to page navy */}
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
              For law firms and chambers
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
            After an AI mistake, one question:
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>who reviewed it?</span>
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
            In Munir v SSHD, unchecked AI output reached a tribunal and a solicitor was referred to the regulator.
            Red Flag AI Pro gives your firm the answer that survives scrutiny: a sealed, timestamped record proving
            every AI assisted document and every piece of marketing was checked before it left the building.
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
            No credit card · No account required · Results delivered instantly
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
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#E5484D", flexShrink: 0, animation: "pulseRed 2s ease-in-out infinite" }} />
        <p style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", textAlign: "center" }}>
          Munir v SSHD [2026] UKUT 00081 (IAC): <span style={{ color: "#E5484D" }}>fabricated AI citations, solicitor referred to the SRA.</span> The supervising solicitor remains responsible.
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
              The profession that documents everything
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
                    The precedent
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
          {/* Photo panel, scales graded to navy */}
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
                backgroundImage: "url(/images/law/scales.jpg)",
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

          {/* Copy panel */}
          <div>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
              Cryptographically sealed. Not just stored.
            </p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2rem" }}>
              Evidence you would
              <br />
              accept in a courtroom.
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
              law firm marketing against.
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
            And the honest scope line: we are not your AML officer, your accounts auditor or your PI broker.
            We cover the published word and the AI governance record, the two places where the evidence
            either exists or it does not.
          </p>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0C1929" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
              Inside the firm
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
                "AI review happens in email threads and memory",
                "No timestamp, no named reviewer",
                "The regulator asks, the firm reconstructs",
                "PI insurer asks, the firm hopes",
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
                "PDF evidence ready for insurer, client or SRA",
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

      {/* ── LIBRARY HALL BAND ── */}
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
            backgroundImage: "url(/images/law/library-hall.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 60%",
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
            The law has always run on records.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>AI should be no different.</span>
          </h2>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section style={{ padding: "7rem 1.5rem 8rem", textAlign: "center" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
            Know where the firm stands in 5 minutes
          </p>
          <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
            Two free checks.
            <br />
            Both halves of the risk.
          </h2>
          <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            The governance assessment scores your AI oversight across 6 dimensions and shows the single biggest gap.
            The compliance check reads any page or document against {RISK_CATEGORY_COUNT} risk categories across {JURISDICTION_COUNT} jurisdictions in under
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
            Rolling this out firm wide, with client workspaces, white label reports and a managed audit trail?{" "}
            <Link href="/sentinel#request" style={{ color: "#E5484D", textDecoration: "underline" }}>
              Talk to us about Sentinel
            </Link>
            , scoped and priced to your team.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
