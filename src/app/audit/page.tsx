import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import React from "react";

export const metadata: Metadata = {
  title: "Done-For-You Compliance Audit — Red Flag AI Pro",
  description:
    "I'll personally run your site through Red Flag AI Pro, record a video walkthrough of every flag, and send you a complete report with a reviewed badge. One-time. No subscription.",
  alternates: { canonical: "https://www.redflagaipro.com/audit" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const TICKER_ITEMS = [
  "Full Site Scan",
  "Video Walkthrough",
  "PDF Report",
  "Reviewed Badge",
  "48-Hour Delivery",
  "26 Risk Categories",
  "8 Jurisdictions",
  "Plain English",
  "Compliant Rewrites",
  "FTC · ASA · GDPR · CMA · ACCC · PDPA · DPDP · UAE PDPL",
  "No Subscription",
  "By the Founder",
];

const INCLUDES = [
  {
    num: "01",
    headline: "Full site scan",
    body: "Every page on your funnel — sales pages, VSLs, email sequences — run through all 26 risk categories, across all 8 jurisdictions.",
  },
  {
    num: "02",
    headline: "Personal video walkthrough",
    body: "A recorded screen-share where I go through each flag, explain exactly what it means, why it is risky, and what to change — in plain English, no legal jargon.",
  },
  {
    num: "03",
    headline: "Written PDF report",
    body: "Every flag, every category triggered (FTC, ASA, CMA, GDPR, and the rest), and the compliant rewrite for each — yours to keep, share, or hand to a lawyer.",
  },
  {
    num: "04",
    headline: "Reviewed badge",
    body: "An embeddable badge for your site showing it has been through a full Red Flag AI Pro review — the same trust signal agencies use with their clients.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "You send me your URL",
    body: "Your sales page, funnel, or full site. That is all I need to get started.",
  },
  {
    num: "02",
    title: "I run the scan and review every flag personally",
    body: "Using the same engine behind Red Flag AI Pro, plus my own pass through the results so nothing gets missed and nothing gets over-explained.",
  },
  {
    num: "03",
    title: "You get the full package within 48 hours",
    body: "Video, PDF, badge — ready to act on immediately. No dashboard, no login, no learning curve.",
  },
];

const FAQS = [
  {
    q: "Do I need to know anything about compliance to use this?",
    a: "No. That is the entire point — I do the reading, you get the plain-English version with exactly what to fix.",
  },
  {
    q: "Is this the same as the Pro subscription?",
    a: "No. Pro is the self-serve tool — you run your own scans whenever you want. This is a one-time, fully done-for-you service: I run it, explain it, and package it for you.",
  },
  {
    q: "What if my site comes back clean?",
    a: "Then you get the full report and badge showing it — proof you can use with clients, partners, or just for your own peace of mind.",
  },
  {
    q: "Is this legal advice?",
    a: "No. This audit is generated using Red Flag AI Pro's compliance engine and reviewed personally before delivery. It flags risk areas based on real enforcement patterns — for regulated industries always confirm with a qualified professional.",
  },
  {
    q: "How do I pay?",
    a: "Email me with your URL and I will send a payment link. Delivery starts once payment is confirmed.",
  },
];

export default function AuditPage() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "6rem 1.5rem 5rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        {/* Red glow */}
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "600px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(204,0,0,0.18) 0%, transparent 60%)"
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025,
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>

          {/* Label */}
          <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.75rem" }}>
            <span className="animate-pulse-red" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", flexShrink: 0, display: "inline-block" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>
              Done for you · By the founder · 48 hours
            </p>
          </div>

          {/* H1 — tighter size */}
          <h1 className="animate-fade-up delay-1" style={{
            ...syne,
            fontSize: "clamp(2rem, 5.5vw, 3.4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.035em",
            color: "white",
            marginBottom: "1.5rem"
          }}>
            I&apos;ll personally run your site and funnel through{" "}
            <span style={{
              background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>Red Flag AI Pro</span>{" "}
            and hand you back exactly what to fix.
          </h1>

          <p className="animate-fade-up delay-2" style={{ ...syne, fontSize: "clamp(0.9rem, 2vw, 1.05rem)", fontWeight: 500, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 2.25rem" }}>
            No dashboard. No learning curve. No guessing what the flags mean. I scan your full funnel myself, record a video of every flag in plain English, and deliver a complete report plus a reviewed badge — in 48 hours.
          </p>

          <div className="animate-fade-up delay-3" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <a href="mailto:support@redflagaipro.com?subject=Done-For-You Audit" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#cc0000", color: "white",
              ...syne, fontSize: "0.9rem", fontWeight: 700,
              padding: "13px 28px", borderRadius: "9999px",
              boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
              textDecoration: "none", letterSpacing: "0.02em"
            }}>
              Get my audit — £97
            </a>
            <Link href="/pricing" style={{
              display: "inline-flex", alignItems: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.45)",
              ...syne, fontSize: "0.9rem", fontWeight: 600,
              padding: "13px 28px", borderRadius: "9999px",
              textDecoration: "none"
            }}>
              See subscription plans
            </Link>
          </div>

          <p className="animate-fade-up delay-4" style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.02em" }}>
            One-time payment · No subscription · Delivered within 48 hours
          </p>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{
        background: "#0a0a0a",
        borderBottom: "1px solid rgba(239,68,68,0.12)",
        padding: "0.9rem 0",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* fade edges */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to right, #0a0a0a, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to left, #0a0a0a, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div className="ticker-track" style={{ gap: "0" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "1.5rem", padding: "0 1.5rem" }}>
              <span style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
                {item}
              </span>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#ef4444", display: "inline-block", flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── THE PROBLEM ── */}
      <section style={{ padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#080808" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>
            The problem
          </p>
          <h2 style={{ ...syne, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "1.25rem" }}>
            You don&apos;t have time to learn a compliance tool.{" "}
            <span style={{
              background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>You just need to know what&apos;s wrong.</span>
          </h2>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.9 }}>
            You are running ads, building funnels, writing copy. Compliance is the thing you know matters and never quite get round to checking properly. Meanwhile the fines, the takedowns, and the new AI-exclusion clauses turning up on insurance renewals are real and moving faster than most people realise. So instead of handing you a tool and a login, I will do it with you. Personally.
          </p>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section style={{ padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>What you get</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Everything packaged.<br />
              <span style={{
              background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>Nothing left for you to interpret.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
            {INCLUDES.map((item, i) => (
              <div key={item.headline} style={{
                background: i % 2 === 0 ? "#0f0505" : "#0a0a0a",
                border: `1px solid ${i % 2 === 0 ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)"}`,
                padding: "2rem"
              }}>
                <p style={{ ...mono, fontSize: "10px", color: "#ef4444", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>{item.num}</p>
                <h3 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.6rem", lineHeight: 1.4 }}>{item.headline}</h3>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{item.body}</p>
                {item.num === "04" && (
                  <div style={{
                    marginTop: "1.25rem",
                    background: "linear-gradient(135deg, #0a0a0a 0%, #0d0d0d 100%)",
                    border: "1px solid rgba(22,163,74,0.25)",
                    borderRadius: "10px",
                    padding: "16px 16px",
                    display: "flex", alignItems: "center", gap: "14px",
                    position: "relative", overflow: "hidden",
                    boxShadow: "0 0 24px rgba(22,163,74,0.08)"
                  }}>
                    {/* green glow top edge */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(22,163,74,0.5), transparent)" }} />

                    {/* Shield icon */}
                    <div style={{ flexShrink: 0 }}>
                      <svg width="36" height="40" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 2L4 8v12c0 9 6.5 17 14 20C25.5 37 32 29 32 20V8L18 2Z" fill="rgba(22,163,74,0.15)" stroke="#16a34a" strokeWidth="1.5"/>
                        <path d="M18 2L4 8v12c0 9 6.5 17 14 20C25.5 37 32 29 32 20V8L18 2Z" fill="none" stroke="rgba(22,163,74,0.3)" strokeWidth="3"/>
                        {/* flag pole */}
                        <line x1="15" y1="13" x2="15" y2="29" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
                        {/* flag */}
                        <path d="M15 13h8l-2.5 4 2.5 4H15" fill="#cc0000"/>
                        {/* checkmark */}
                        <path d="M11 22l4 4 8-8" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
                      </svg>
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{ ...syne, fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "4px" }}>Compliance Verified</p>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "3px" }}>
                        <p style={{ ...syne, fontSize: "22px", fontWeight: 800, color: "#16a34a", lineHeight: 1 }}>100</p>
                        <p style={{ ...syne, fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.25)" }}>/100</p>
                      </div>
                      <p style={{ ...mono, fontSize: "9px", color: "#16a34a", letterSpacing: "0.1em" }}>FULLY COMPLIANT</p>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ ...syne, fontSize: "8px", color: "rgba(255,255,255,0.25)", marginBottom: "3px" }}>Reviewed 8 Jun 2026</p>
                      <p style={{ ...syne, fontSize: "8px", fontWeight: 700, color: "rgba(204,0,0,0.6)", letterSpacing: "0.05em" }}>RED FLAG AI PRO</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#080808" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>How it works</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Three steps. 48 hours.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2px" }}>
            {STEPS.map((s) => (
              <div key={s.num} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", padding: "2rem" }}>
                <p style={{ ...syne, fontSize: "13px", fontWeight: 800, color: "#ef4444", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>{s.num}</p>
                <h3 style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "0.6rem", lineHeight: 1.4 }}>{s.title}</h3>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>Pricing</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              What this would cost anywhere else.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px", marginBottom: "3rem" }}>
            <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", padding: "1.75rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>Compliance lawyer</p>
              <p style={{ ...syne, fontSize: "2rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>£400</p>
              <p style={{ ...mono, fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>per hour</p>
            </div>
            <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", padding: "1.75rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>Full funnel audit</p>
              <p style={{ ...syne, fontSize: "2rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>£2,400</p>
              <p style={{ ...mono, fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>minimum</p>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #1a0505 0%, #0f0505 100%)",
              border: "1px solid rgba(239,68,68,0.3)",
              padding: "1.75rem", textAlign: "center",
              position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #cc0000, transparent)" }} />
              <span style={{
                ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "#ef4444",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                padding: "3px 10px", borderRadius: "9999px",
                display: "inline-block", marginBottom: "0.75rem"
              }}>This audit</span>
              <p style={{ ...syne, fontSize: "2.5rem", fontWeight: 800, color: "white", marginBottom: "0.25rem", lineHeight: 1 }}>£97</p>
              <p style={{ ...mono, fontSize: "10px", color: "#ef4444", letterSpacing: "0.1em", marginBottom: "1rem" }}>one-time · 48 hours</p>
              <a href="mailto:support@redflagaipro.com?subject=Done-For-You Audit" style={{
                display: "inline-flex", alignItems: "center",
                background: "#cc0000", color: "white",
                ...syne, fontSize: "0.8rem", fontWeight: 700,
                padding: "10px 22px", borderRadius: "9999px",
                boxShadow: "0 4px 20px rgba(204,0,0,0.3)",
                textDecoration: "none", letterSpacing: "0.02em"
              }}>
                Get started
              </a>
            </div>
          </div>

          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
            Done personally, by the person who built the tool. No retainer, no hourly clock, no waiting weeks for a callback.
          </p>
        </div>
      </section>

      {/* ── DISCLAIMER NOTE ── */}
      <div style={{ padding: "2rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#080808" }}>
        <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", lineHeight: 1.9, textAlign: "center", maxWidth: "660px", margin: "0 auto" }}>
          This audit is generated using Red Flag AI Pro&apos;s compliance engine and reviewed personally before delivery. It flags risk areas based on real enforcement patterns — it is not a substitute for legal advice. For regulated industries (financial promotions, health claims, and similar) always confirm with a qualified professional.
        </p>
      </div>

      {/* ── FAQ ── */}
      <section style={{ padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>Questions</p>
            <h2 style={{ ...syne, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>
              Still on the fence?
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {FAQS.map((f) => (
              <div key={f.q} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", padding: "1.5rem 1.75rem" }}>
                <h3 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>{f.q}</h3>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA CLOSE ── */}
      <section style={{ padding: "7rem 1.5rem", background: "#080808" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...syne, fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "1rem" }}>
            You&apos;ll either find out you&apos;re already safe.{" "}
            <span style={{
              background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>or find out before it costs you.</span>
          </h2>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: "2.25rem" }}>
            Either way, you will have a clear picture of exactly where you stand — on video, in writing, with a badge to show for it.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <a href="mailto:support@redflagaipro.com?subject=Done-For-You Audit" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#cc0000", color: "white",
              ...syne, fontSize: "0.9rem", fontWeight: 700,
              padding: "13px 28px", borderRadius: "9999px",
              boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
              textDecoration: "none", letterSpacing: "0.02em"
            }}>
              Get my audit — £97
            </a>
            <Link href="/pricing" style={{
              display: "inline-flex", alignItems: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.45)",
              ...syne, fontSize: "0.9rem", fontWeight: 600,
              padding: "13px 28px", borderRadius: "9999px",
              textDecoration: "none"
            }}>
              See subscription plans
            </Link>
          </div>

          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
            Delivered within 48 hours · One-time payment · No subscription
          </p>
        </div>
      </section>

    </div>
  );
}
