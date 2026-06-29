"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

const CHECKLIST = [
  {
    area: "Income & Earnings Claims",
    jurisdiction: "FTC (USA) · CMA (UK) · ACCC (Australia)",
    items: [
      { id: "ic1", text: "All income or earnings figures show results that are typical, not exceptional", severity: "critical" },
      { id: "ic2", text: "Income claims include a clear disclaimer (e.g. 'results not typical')", severity: "critical" },
      { id: "ic3", text: "Screenshots of revenue, bank statements or PayPal are substantiated or removed", severity: "high" },
      { id: "ic4", text: "No implied guarantee of income for buyers of a course or programme", severity: "high" },
    ],
  },
  {
    area: "Health & Supplement Claims",
    jurisdiction: "FDA (USA) · MHRA (UK) · TGA (Australia)",
    items: [
      { id: "hc1", text: "No claim to 'cure', 'treat' or 'prevent' any named condition", severity: "critical" },
      { id: "hc2", text: "No false 'FDA approved' or 'clinically proven' language without evidence", severity: "critical" },
      { id: "hc3", text: "Testimonials for health products include appropriate disclaimers", severity: "high" },
      { id: "hc4", text: "Before/after images are not misleading and comply with platform rules", severity: "medium" },
    ],
  },
  {
    area: "Fake Urgency & Scarcity",
    jurisdiction: "FTC (USA) · CMA (UK) · GDPR (EU) · DSA (EU)",
    items: [
      { id: "fu1", text: "Countdown timers reset to real deadlines — not fake recurring countdowns", severity: "critical" },
      { id: "fu2", text: "Limited availability claims ('only 3 left') reflect actual stock", severity: "high" },
      { id: "fu3", text: "Price increase warnings are genuine and not manufactured pressure", severity: "high" },
      { id: "fu4", text: "No 'today only' pricing that is available every day", severity: "high" },
    ],
  },
  {
    area: "Testimonials & Social Proof",
    jurisdiction: "FTC (USA) · ASA (UK) · ACCC (Australia)",
    items: [
      { id: "ts1", text: "All testimonials reflect honest, typical experiences — not cherry-picked outliers", severity: "critical" },
      { id: "ts2", text: "Paid or incentivised reviews are clearly disclosed", severity: "critical" },
      { id: "ts3", text: "Fabricated or AI-generated testimonials are not used", severity: "critical" },
      { id: "ts4", text: "Star ratings and review counts are accurate and sourced", severity: "medium" },
    ],
  },
  {
    area: "Influencer & Affiliate Disclosure",
    jurisdiction: "FTC (USA) · ASA/CAP (UK) · CNIL (France)",
    items: [
      { id: "id1", text: "#ad, #sponsored or #gifted appears clearly at the start of posts — not buried", severity: "critical" },
      { id: "id2", text: "Affiliate links are disclosed before the link, not just in the bio", severity: "high" },
      { id: "id3", text: "Gifted products are disclosed even if no payment was received", severity: "high" },
      { id: "id4", text: "Disclosure language is in the same language as the content", severity: "medium" },
    ],
  },
  {
    area: "Data Protection & Privacy (GDPR / CCPA)",
    jurisdiction: "GDPR (EU) · ICO (UK) · CCPA (USA) · LGPD (Brazil)",
    items: [
      { id: "dp1", text: "Cookie consent banner offers genuine opt-out and respects refusal", severity: "critical" },
      { id: "dp2", text: "Email opt-in is explicit — no pre-ticked boxes or implied consent", severity: "critical" },
      { id: "dp3", text: "Privacy policy accurately describes how data is used and stored", severity: "high" },
      { id: "dp4", text: "Third-party tools (pixels, analytics) are listed in the privacy policy", severity: "medium" },
    ],
  },
  {
    area: "Email Marketing (CAN-SPAM / CASL / PECR)",
    jurisdiction: "CAN-SPAM (USA) · CASL (Canada) · PECR (UK)",
    items: [
      { id: "em1", text: "Every marketing email contains a working one-click unsubscribe link", severity: "critical" },
      { id: "em2", text: "Sender name and address are accurate — no misleading 'From' names", severity: "high" },
      { id: "em3", text: "Subject lines do not use deceptive 'Re:' or 'Fwd:' prefixes", severity: "high" },
      { id: "em4", text: "Physical postal address is included in every commercial email", severity: "high" },
    ],
  },
  {
    area: "Pricing & Subscription Transparency",
    jurisdiction: "FTC (USA) · CMA (UK) · ACCC (Australia) · DSA (EU)",
    items: [
      { id: "pr1", text: "Recurring billing amounts and frequency are stated before purchase", severity: "critical" },
      { id: "pr2", text: "Free trial end dates and auto-charge amounts are clearly shown", severity: "critical" },
      { id: "pr3", text: "Cancellation process is clearly explained before sign-up", severity: "high" },
      { id: "pr4", text: "No hidden fees that appear only at checkout", severity: "high" },
    ],
  },
  {
    area: "Greenwashing & Environmental Claims",
    jurisdiction: "FTC (USA) Green Guides · CMA (UK) · EU Green Claims Directive",
    items: [
      { id: "gw1", text: "'Carbon neutral', 'net zero' or 'eco-friendly' claims are substantiated", severity: "critical" },
      { id: "gw2", text: "Environmental certifications displayed are current and legitimate", severity: "high" },
      { id: "gw3", text: "No vague claims like 'sustainable' or 'green' without specific evidence", severity: "medium" },
    ],
  },
];

const SEVERITY_COLOUR: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
};

const SEVERITY_LABEL: Record<string, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
};

export default function ComplianceChecklistPage() {
  const allIds = CHECKLIST.flatMap((s) => s.items.map((i) => i.id));
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const total = allIds.length;
  const done = checked.size;
  const pct = Math.round((done / total) * 100);

  const criticalItems = CHECKLIST.flatMap((s) => s.items.filter((i) => i.severity === "critical"));
  const criticalDone = criticalItems.filter((i) => checked.has(i.id)).length;
  const criticalTotal = criticalItems.length;

  let statusLabel = "Not started";
  let statusColour = "rgba(255,255,255,0.3)";
  if (pct === 100) { statusLabel = "Fully compliant"; statusColour = "#22c55e"; }
  else if (pct >= 75) { statusLabel = "Nearly there"; statusColour = "#eab308"; }
  else if (pct >= 40) { statusLabel = "Gaps remain"; statusColour = "#f97316"; }
  else if (pct > 0) { statusLabel = "High risk"; statusColour = "#ef4444"; }

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "10rem 1.5rem 4rem", textAlign: "center" }}>
        <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Free tool</p>
        <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1rem" }}>
          Marketing Compliance Checklist
        </h1>
        <p style={{ ...syne, fontSize: "1.1rem", color: "rgba(255,255,255,0.45)", maxWidth: "580px", margin: "0 auto 1rem", lineHeight: 1.7 }}>
          {total} checkpoints across 10 jurisdictions and 30 risk categories. Tick each one off — or find out what needs fixing before you publish.
        </p>
        <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.25)", maxWidth: "500px", margin: "0 auto" }}>
          Free to use. For a full AI-powered scan of your actual copy, use the scanner below.
        </p>
      </section>

      {/* Sticky score bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5,5,5,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : pct >= 75 ? "#eab308" : pct >= 40 ? "#f97316" : "#ef4444", borderRadius: "9999px", transition: "width 0.3s ease" }} />
            </div>
          </div>
          <span style={{ ...mono, fontSize: "1.5rem", fontWeight: 700, color: statusColour, letterSpacing: "-0.02em", minWidth: "60px" }}>{pct}%</span>
          <span style={{ ...syne, fontSize: "13px", fontWeight: 700, color: statusColour }}>{statusLabel}</span>
          <span style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{done}/{total} items · {criticalDone}/{criticalTotal} critical</span>
        </div>
      </div>

      {/* Checklist */}
      <section style={{ padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>
          {CHECKLIST.map((section) => (
            <div key={section.area}>
              <div style={{ marginBottom: "1.25rem" }}>
                <h2 style={{ ...syne, fontSize: "1.1rem", fontWeight: 800, color: "white", letterSpacing: "-0.01em", marginBottom: "4px" }}>{section.area}</h2>
                <p style={{ ...syne, fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>{section.jurisdiction}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {section.items.map((item) => {
                  const isDone = checked.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1rem",
                        background: isDone ? "rgba(34,197,94,0.04)" : "#0D1B2E",
                        border: `1px solid ${isDone ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)"}`,
                        padding: "1.25rem 1.5rem",
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        flexShrink: 0,
                        width: "20px",
                        height: "20px",
                        border: `2px solid ${isDone ? "#22c55e" : "rgba(255,255,255,0.2)"}`,
                        borderRadius: "4px",
                        background: isDone ? "#22c55e" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "1px",
                        transition: "all 0.15s ease",
                      }}>
                        {isDone && (
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                            <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {/* Text */}
                      <span style={{ ...syne, fontSize: "14px", color: isDone ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)", lineHeight: 1.6, flex: 1, textDecoration: isDone ? "line-through" : "none", transition: "all 0.15s ease" }}>
                        {item.text}
                      </span>
                      {/* Severity */}
                      <span style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: isDone ? "rgba(255,255,255,0.2)" : SEVERITY_COLOUR[item.severity], flexShrink: 0, marginTop: "2px" }}>
                        {SEVERITY_LABEL[item.severity]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA block */}
      <section style={{ background: "#0C1929", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Go deeper</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: "1rem", lineHeight: 1.1 }}>
            Checklist says you're clean?<br />Let the AI confirm it.
          </h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            The checklist tells you what to look for. The scanner reads your actual copy — every sentence — and flags what you missed. 60 seconds. Free.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/compliance-assessment" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.95rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)", textDecoration: "none" }}>
              Scan my copy free →
            </Link>
            <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", ...syne, fontSize: "0.95rem", fontWeight: 600, padding: "13px 32px", borderRadius: "9999px", textDecoration: "none" }}>
              Create free account
            </Link>
          </div>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1.5rem" }}>
            Not legal advice. For a formal compliance audit contact a qualified legal professional.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
