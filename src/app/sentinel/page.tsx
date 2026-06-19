import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import React from "react";

export const metadata: Metadata = {
  title: "Sentinel — Compliance Infrastructure for Agencies and Regulated Businesses",
  description:
    "Stop managing compliance in email threads. Sentinel gives agencies a signed, timestamped audit trail for every piece of copy reviewed. Built for the teams where a compliance failure is a regulatory event.",
  alternates: { canonical: "https://www.redflagaipro.com/sentinel" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const BENEFITS = [
  {
    headline: "A complaint lands. You have proof.",
    body: "Without a record, your agency has no defence. Sentinel logs every review with a legal timestamp and issues a signed certificate. When the regulator or client asks what you checked and when, the answer is instant.",
  },
  {
    headline: "Your PI insurer will ask. Now you can answer.",
    body: "Professional indemnity insurers increasingly require documented compliance processes. A signed audit trail showing you reviewed copy before it published is exactly the kind of evidence they expect.",
  },
  {
    headline: "Compliance that keeps pace with delivery.",
    body: "Your team ships fast. Compliance cannot be a bottleneck. Sentinel checks copy against FTC, GDPR, ASA, FCA and the EU AI Act in under 60 seconds — the compliance review happens before the brief leaves your desk.",
  },
  {
    headline: "FCA and financial promotions handled.",
    body: "Financial promotion rules are the highest-stakes area of UK advertising law. One unapproved copy can trigger an FCA investigation for both you and your client. Sentinel checks financial copy at source, before it publishes.",
  },
  {
    headline: "Greenwashing is now an enforcement priority.",
    body: "The EU Green Claims Directive and CMA Green Claims Code are actively enforced. Agencies writing sustainability copy for clients are exposed if claims are unsubstantiated. Sentinel catches it before it becomes a headline.",
  },
  {
    headline: "Scan live pages, not just copy you paste.",
    body: "Give Sentinel a URL and it fetches the live page, strips navigation and boilerplate, and runs a full compliance scan against the actual published copy. If the page changes, run it again in seconds.",
  },
  {
    headline: "VSLs checked before they cost you money.",
    body: "Paste the YouTube URL and Sentinel fetches the transcript automatically. Or drop in an audio file and Whisper transcribes it first. Every word goes through all 29 risk categories before a penny is spent on traffic.",
  },
  {
    headline: "Compliance in your workflow, not outside it.",
    body: "Every scan fires a webhook to any URL. Paste your Zapier hook into Settings and scan results flow directly into Slack, your CRM or Google Sheets. The REST API lets you embed scanning into your own systems.",
  },
  {
    headline: "AI copy. August 2026. Your responsibility.",
    body: "The EU AI Act requires disclosure on AI-assisted content from August 2026. If you use AI to write copy for clients, the obligation to disclose sits with you. Sentinel records what was checked, when, and by whom.",
  },
  {
    headline: "Turn scan results into something you can actually show.",
    body: "Every scan can be rendered into a short video summary — the score, the flags, the risk breakdown, presented clearly. Send it to a client, drop it in a report, or use it to show a prospect exactly what you found on their site. No screenshots, no explaining a spreadsheet.",
  },
];

const WHO = [
  {
    label: "Digital agencies",
    title: "You write copy for clients. Their compliance failure is your liability.",
    description: "When a client campaign triggers an ASA or FCA complaint, the agency that wrote the copy is named too. Sentinel gives you a signed record proving you reviewed it before it went out — plus white-label reports, team seats, client workspaces and auto-monitoring.",
  },
  {
    label: "Legal and compliance teams",
    title: "Your review process lives in inboxes. That is not a system.",
    description: "Sentinel replaces informal email review with a logged, timestamped, signed process. API access and webhooks let you integrate scanning into your existing workflow. Every certificate is retrievable in seconds.",
  },
  {
    label: "FCA-regulated businesses",
    title: "Financial promotions carry the heaviest penalties in UK advertising law.",
    description: "Sentinel checks copy against FCA financial promotion rules before publication and issues a signed certificate confirming it was checked. The Chrome extension means your team can scan any page without leaving the browser.",
  },
  {
    label: "Enterprise marketing teams",
    title: "Multi-jurisdiction campaigns. One failure can shut a campaign in five countries.",
    description: "GDPR, FTC, ASA, EU AI Act, ACCC and CASL checked simultaneously. Site audit scans your entire domain in one run. Weekly monitoring flags changes before they become complaints.",
  },
];

const LAWS = [
  { law: "EU AI Act", date: "Enforceable August 2026", description: "If you use AI to write copy for clients, you must disclose it and prove it was reviewed before publication. The obligation sits with the creator, not just the brand.", hot: true },
  { law: "FCA Financial Promotions", date: "Active now", description: "Any copy touching investments, returns, crypto or financial products must be pre-approved by an FCA-authorised person. One unapproved ad triggers an investigation.", hot: false },
  { law: "EU Green Claims Directive", date: "Enforcement ramping 2026", description: "Sustainability claims like carbon neutral, eco-friendly or net zero require substantiated evidence. Writing them without proof is now a regulatory offence across the EU.", hot: false },
  { law: "ASA CAP Code", date: "Active now", description: "UK advertising rules cover every ad your agency produces. Income claims, guarantees, testimonials and urgency tactics are all regulated. Agencies are routinely named in upheld complaints.", hot: false },
  { law: "FTC Endorsement Guides", date: "Updated 2023 — active now", description: "Influencer content, affiliate links and paid partnerships for US-facing clients must all be clearly disclosed. Agencies managing these relationships carry liability if disclosure is missing.", hot: false },
  { law: "CMA Green Claims Code", date: "Active now — UK", description: "The CMA is actively pursuing greenwashing cases. Environmental claims must be accurate, clear and substantiated or your agency is exposed.", hot: false },
];

const RISKS = [
  { label: "ASA investigation", cost: "£5k–£50k", detail: "legal costs, campaign takedown, management time" },
  { label: "FCA unapproved promotion", cost: "Criminal", detail: "fine, public censure, FCA investigation" },
  { label: "GDPR violation", cost: "€20m", detail: "or 4% of global annual turnover" },
  { label: "CMA dark pattern", cost: "£300k", detail: "per violation plus injunction" },
  { label: "Client claim vs agency", cost: "PI excess", detail: "plus policy review, possible non-renewal" },
];

export default function SentinelPage() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <Navbar />

      {/* Sentinel teaser — slim */}
      <section style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #0d0010 50%, #0a0a0a 100%)",
        padding: "6rem 1.5rem",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{maxWidth: "600px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem"}}>Sentinel — enterprise compliance</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", marginBottom: "1rem"}}>Built for agencies and regulated businesses.</h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "2rem"}}>Human review logs, legal timestamps, signed PDF certificates, FCA financial promotions, greenwashing checks and a 3-year audit trail.</p>
          <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
            <Link href="/signup" style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "#cc0000", color: "white", fontFamily: "'Syne', sans-serif", fontSize: "0.875rem", fontWeight: 700, padding: "12px 28px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)", textDecoration: "none"}}>Get started free</Link>
            <a href="mailto:support@redflagaipro.com?subject=Sentinel Enquiry" style={{display: "inline-flex", alignItems: "center", fontFamily: "'Syne', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 28px", borderRadius: "9999px", textDecoration: "none"}}>Get in touch</a>
          </div>
        </div>
      </section>

      {/* ── HERO ── */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "10rem 1.5rem 8rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        {/* Red glow */}
        <div style={{
          position: "absolute", top: "-150px", left: "50%", transform: "translateX(-50%)",
          width: "1000px", height: "700px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(204,0,0,0.2) 0%, transparent 60%)"
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025,
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "2.5rem" }}>
            <span className="flag-wave" style={{ display: "inline-block" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>
              Stay compliant. Stay protected. Stay ahead.
            </p>
          </div>

          <h1 style={{
            ...syne,
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "2.5rem"
          }}>
            Sentinel
          </h1>

          <p style={{ ...syne, fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontWeight: 600, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, maxWidth: "600px", margin: "0 auto 1rem" }}>
            Compliance infrastructure for agencies, legal teams and regulated businesses.
          </p>

          <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.35)", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto 3.5rem" }}>
            All 29 risk categories, legally mapped across 9 jurisdictions. Human review logs. Legal timestamps. Signed certificates. Built for the teams where a compliance failure is a regulatory event.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:support@redflagaipro.com?subject=Sentinel Enquiry" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#cc0000", color: "white",
              ...syne, fontSize: "0.9rem", fontWeight: 700,
              padding: "14px 32px", borderRadius: "9999px",
              boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
              textDecoration: "none", letterSpacing: "0.02em"
            }}>
              Get compliant today
            </a>
            <Link href="/pricing" style={{
              display: "inline-flex", alignItems: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.55)",
              ...syne, fontSize: "0.9rem", fontWeight: 600,
              padding: "14px 32px", borderRadius: "9999px",
              textDecoration: "none"
            }}>
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIVE THREAT BAR ── */}
      <div style={{
        background: "#0f0505",
        borderBottom: "1px solid rgba(239,68,68,0.15)",
        padding: "1rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "12px"
      }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", flexShrink: 0, animation: "pulseRed 2s ease-in-out infinite" }} />
        <p style={{ ...syne, fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>
          EU AI Act Article 50 enforcement begins <span style={{ color: "#ef4444" }}>2 August 2026</span> — AI-generated marketing copy must be disclosed or documented. Agencies are in the frame.
        </p>
      </div>

      {/* ── COMPLIANCE CLOCK ── striking design moment */}
      <section style={{
        padding: "7rem 1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "linear-gradient(180deg, #080808 0%, #0f0505 100%)"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>What is already coming for your agency</p>
            <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              The rules your clients expect you to know.<br />
              <span style={{ color: "rgba(255,255,255,0.35)" }}>Most agencies don&apos;t.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px" }}>
            {LAWS.map((item, i) => (
              <div key={item.law} style={{
                background: i % 2 === 0 ? "#0a0a0a" : "#0f0505",
                border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
                padding: "2rem"
              }}>
                {item.hot && (
                  <span style={{
                    ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: "#ef4444",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    padding: "3px 10px", borderRadius: "9999px",
                    display: "inline-block", marginBottom: "1rem"
                  }}>Urgent</span>
                )}
                <h3 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>{item.law}</h3>
                <p style={{ ...mono, fontSize: "10px", color: "#ef4444", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>{item.date}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{item.description}</p>
              </div>
            ))}
          </div>

          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "2rem" }}>
            Sentinel checks copy against all of these, automatically, before it publishes.
          </p>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>Why Sentinel</p>
            <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              What it actually means<br />for your agency
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2px" }}>
            {BENEFITS.map((b, i) => (
              <div key={b.headline} style={{
                background: i % 2 === 0 ? "#0f0505" : "#0a0a0a",
                border: `1px solid ${i % 2 === 0 ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)"}`,
                padding: "2rem"
              }}>
                <span className="flag-wave" style={{ display: "inline-block", marginBottom: "1rem" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
                  </svg>
                </span>
                <h3 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.75rem", lineHeight: 1.4 }}>{b.headline}</h3>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#080808" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>Who it&apos;s for</p>
            <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Built for teams where<br />compliance is not optional
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2px" }}>
            {WHO.map((item, i) => (
              <div key={item.label} style={{
                background: i % 2 === 0 ? "#0a0a0a" : "#0f0505",
                border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.1)"}`,
                padding: "2.5rem"
              }}>
                <span style={{
                  ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.25)",
                  padding: "4px 12px", borderRadius: "9999px",
                  display: "inline-block", marginBottom: "1.5rem"
                }}>{item.label}</span>
                <h3 style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: "1rem", lineHeight: 1.4 }}>{item.title}</h3>
                <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.8 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>The difference</p>
            <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>
              Replace your compliance spreadsheet
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
            <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
              <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "2rem" }}>Without Sentinel</p>
              {[
                "Copy reviewed over email threads",
                "No record of what was checked",
                "No timestamp, no signature",
                "Compliance lives in someone's inbox",
                "One complaint, no evidence",
                "PI insurer asks: can you prove it?",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "0.875rem" }}>
                  <span style={{ color: "#ef4444", flexShrink: 0, ...syne, fontSize: "12px", marginTop: "2px" }}>✕</span>
                  <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{
              background: "#0f0505",
              border: "1px solid rgba(239,68,68,0.2)",
              padding: "2.5rem",
              position: "relative"
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: "linear-gradient(90deg, #cc0000, transparent)"
              }} />
              <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ef4444", marginBottom: "2rem" }}>With Sentinel</p>
              {[
                "Copy reviewed in a proper system",
                "Every check logged and timestamped",
                "Cryptographic signature on every review",
                "Compliance is a retrievable record",
                "One complaint, instant evidence",
                "PI insurer asks: yes, here it is.",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "0.875rem" }}>
                  <span style={{ color: "#4ade80", flexShrink: 0, ...syne, fontSize: "12px", marginTop: "2px" }}>✓</span>
                  <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RISK VS COST ── Bloomberg numbers */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#080808" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>The numbers</p>
            <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>
              What one complaint actually costs
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
            {/* Risk column */}
            <div style={{ background: "#0f0505", border: "1px solid rgba(239,68,68,0.2)", padding: "2.5rem" }}>
              <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ef4444", marginBottom: "2rem" }}>The risk without Sentinel</p>
              {RISKS.map((r) => (
                <div key={r.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  gap: "1rem",
                  borderBottom: "1px solid rgba(239,68,68,0.1)",
                  paddingBottom: "1rem", marginBottom: "1rem"
                }}>
                  <div>
                    <p style={{ ...syne, fontSize: "13px", fontWeight: 600, color: "white", marginBottom: "2px" }}>{r.label}</p>
                    <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{r.detail}</p>
                  </div>
                  <span style={{ ...mono, fontSize: "14px", fontWeight: 700, color: "#ef4444", flexShrink: 0 }}>{r.cost}</span>
                </div>
              ))}
            </div>

            {/* Sentinel cost */}
            <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "2rem" }}>Sentinel</p>
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <p style={{ ...mono, fontSize: "4rem", fontWeight: 700, color: "white", lineHeight: 1, letterSpacing: "-0.04em" }}>£5000+</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)", marginTop: "8px" }}>per month</p>
                </div>
                {[
                  "Unlimited scans across your whole team",
                  "Every campaign reviewed before it goes live",
                  "Signed PDF certificate on every review",
                  "Weekly monitoring of live pages",
                  "The paper trail your PI insurer needs",
                ].map((b) => (
                  <div key={b} style={{ display: "flex", gap: "8px", marginBottom: "0.75rem" }}>
                    <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span>
                    <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{b}</span>
                  </div>
                ))}
              </div>
              <Link href="/signup" style={{
                display: "block", textAlign: "center",
                background: "#cc0000", color: "white",
                ...syne, fontSize: "0.875rem", fontWeight: 700,
                padding: "13px 24px", borderRadius: "9999px",
                boxShadow: "0 8px 24px rgba(204,0,0,0.3)",
                textDecoration: "none", marginTop: "1.5rem"
              }}>
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>How we compare</p>
            <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Enterprise compliance.<br />Without the enterprise price.
            </h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.35)", marginTop: "1rem" }}>
              The tools agencies traditionally use cost £2,000–£10,000 a month. Sentinel is live in a day.
            </p>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textAlign: "left", padding: "1rem 1rem 1rem 0", width: "40%" }}>Feature</th>
                  <th style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "1rem" }}>Red Marker / Blee</th>
                  <th style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "#ef4444", textAlign: "center", padding: "1rem" }}>Sentinel</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Multi-jurisdiction scanning", "Sometimes", "✓ FTC, GDPR, ASA, FCA, ACCC, CASL"],
                  ["EU AI Act compliance", "Partial", "✓ Full"],
                  ["FCA financial promotions", "Enterprise only", "✓ Included"],
                  ["Greenwashing scanner", "Limited", "✓ EU Green Claims Directive"],
                  ["URL page scanning", "✗", "✓ Live page fetch"],
                  ["YouTube VSL scanning", "✗", "✓ Auto transcript"],
                  ["Full site audit", "✗", "✓ Up to 50 pages"],
                  ["Weekly auto-monitoring", "✗", "✓ Unlimited URLs"],
                  ["Chrome extension", "✗", "✓ Included"],
                  ["REST API + webhooks", "✗", "✓ Zapier ready"],
                  ["White-label PDF reports", "✗", "✓ Your branding"],
                  ["Video scan summaries", "✗", "✓ Shareable MP4"],
                  ["Signed PDF certificates", "✓", "✓"],
                  ["Onboarding time", "Weeks", "Same day"],
                  ["Typical monthly cost", "£2,000 – £10,000", "£5000+"],
                ].map(([feature, them, us], i) => (
                  <tr key={feature} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", padding: "0.875rem 1rem 0.875rem 0" }}>{feature}</td>
                    <td style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "0.875rem 1rem", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>{them}</td>
                    <td style={{ ...syne, fontSize: "13px", color: us.startsWith("✓") ? "#4ade80" : "#ef4444", textAlign: "center", padding: "0.875rem 1rem", fontWeight: 600, background: i % 2 === 0 ? "rgba(204,0,0,0.03)" : "rgba(204,0,0,0.05)" }}>{us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "1.5rem" }}>
            Competitor pricing based on publicly available information and industry estimates.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        padding: "10rem 1.5rem",
        textAlign: "center",
        position: "relative", overflow: "hidden",
        background: "linear-gradient(180deg, #0a0a0a 0%, #0f0505 100%)"
      }}>
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "400px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center bottom, rgba(204,0,0,0.2) 0%, transparent 65%)"
        }} />

        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Get started</p>
          <h2 style={{
            ...syne, fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800,
            color: "white", letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: "1.5rem"
          }}>
            Ready when you are.
          </h2>
          <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: "3rem" }}>
            Compliance is not a one-off task. It is a constant. Sentinel keeps your agency protected every time copy is created, reviewed and published.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
            <a href="mailto:support@redflagaipro.com?subject=Sentinel Enquiry" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#cc0000", color: "white",
              ...syne, fontSize: "0.9rem", fontWeight: 700,
              padding: "14px 32px", borderRadius: "9999px",
              boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
              textDecoration: "none", letterSpacing: "0.02em"
            }}>
              Get in touch
            </a>
            <Link href="/signup" style={{
              display: "inline-flex", alignItems: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.55)",
              ...syne, fontSize: "0.9rem", fontWeight: 600,
              padding: "14px 32px", borderRadius: "9999px",
              textDecoration: "none"
            }}>
              Try Red Flag AI Pro free
            </Link>
          </div>

          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
            Or email{" "}
            <a href="mailto:support@redflagaipro.com" style={{ color: "rgba(239,68,68,0.5)", textDecoration: "none" }}>
              support@redflagaipro.com
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}
