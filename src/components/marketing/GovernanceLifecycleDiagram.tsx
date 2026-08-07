import Link from "next/link";
import type React from "react";
import { JURISDICTION_COUNT, JURISDICTION_COUNT_WORD, RISK_CATEGORY_COUNT, RISK_CATEGORY_COUNT_WORD } from "@/lib/constants";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

interface StageTool {
  label: string;
  href: string;
}

interface Stage {
  n: number;
  title: string;
  desc: string;
  mechanism: string;
  hot: boolean;
  hotNote?: string;
  tools?: StageTool[];
}

const STAGES: Stage[] = [
  {
    n: 1,
    title: "Discover",
    desc: "Find where AI already makes or shapes decisions, including tools nobody formally approved. The free governance assessment scores six dimensions; the shadow AI audit surfaces the unauthorised tools already touching real decisions.",
    mechanism: "Free governance assessment + Shadow AI audit",
    hot: false,
    tools: [
      { label: "Shadow AI Audit", href: "/tools/shadow-ai-survey" },
      { label: "AI Literacy Log", href: "/tools/ai-literacy-log" },
    ],
  },
  {
    n: 2,
    title: "Authorize",
    desc: "Every system gets a boundary authorization record: who approved it, what role they held, what options were weighed, what risk was knowingly accepted, and the exact date and named condition that voids the grant. A decision, not a policy.",
    mechanism: "Boundary authorization record — who / when / whether",
    hot: false,
    tools: [
      { label: "DPIA Generator", href: "/tools/dpia-generator" },
      { label: "FRIA Assistant", href: "/tools/fria-assistant" },
      { label: "AI Use Policy Generator", href: "/tools/ai-use-policy-generator" },
    ],
  },
  {
    n: 3,
    title: "Compliance",
    desc: `Marketing copy, claims and disclosures checked against the actual rules regulators enforce, across ${JURISDICTION_COUNT_WORD} jurisdictions and ${RISK_CATEGORY_COUNT_WORD} risk categories, before a complaint does the checking for you.`,
    mechanism: `Compliance check — ${JURISDICTION_COUNT} jurisdictions, ${RISK_CATEGORY_COUNT} categories`,
    hot: true,
    hotNote: "One of two pillars. Compliance checks what's said, run before the copy goes out, not after a complaint does it for you.",
    tools: [{ label: "Fine Calculator", href: "/tools/fine-calculator" }],
  },
  {
    n: 4,
    title: "Governance",
    desc: "Every governance decision is checked and sealed the moment it happens, chained cryptographically with SHA-256, so editing, deleting or backdating a past entry breaks the chain and is provable, not just unlikely. Compliance checks what's said; governance seals what's decided.",
    mechanism: "Governance decision, cryptographically sealed live",
    hot: true,
    hotNote: "The other pillar. Governance seals what's decided, a distinct check from compliance and just as load-bearing.",
  },
  {
    n: 5,
    title: "Review",
    desc: "A named person's honest first read is sealed before the AI's own reasoning is shown, so a sign-off can never be a rubber stamp on what the AI already said. Pushback rate and average time to sign-off are tracked, not just the final answer.",
    mechanism: "Commit-before-reveal + reviewer signal",
    hot: false,
  },
  {
    n: 6,
    title: "Remediate",
    desc: "Disposing of a flag isn't the same as fixing it. Whether something was actually remediated, and when, is a separate, later confirmation, sealed on its own so a judgment call and a genuine fix can never be collapsed into one event.",
    mechanism: "Remediation record, sealed separately from disposition",
    hot: false,
    tools: [{ label: "Incident Reporting Checklist", href: "/tools/incident-reporting-checklist" }],
  },
  {
    n: 7,
    title: "Decay",
    desc: "Authorization isn't permanent by default. Every grant carries a named condition or date that voids it, and unreviewed, unbounded or overdue grants are surfaced as the live risk they are, not left to quietly expire unnoticed.",
    mechanism: "Falsifier conditions + authorization decay tracking",
    hot: false,
    tools: [{ label: "Monitoring Plan Generator", href: "/tools/monitoring-plan-generator" }],
  },
  {
    n: 8,
    title: "Prove",
    desc: "High value records carry an independent RFC 3161 trusted timestamp from a third party authority, and are cross sealed inside the Witness Network, so separate companies vouch for each other's evidence. Anyone can verify a record publicly, no account, without trusting our word for it.",
    mechanism: "RFC 3161 timestamp + Witness Network",
    hot: false,
    tools: [
      { label: "Documentation Assistant", href: "/tools/documentation-assistant" },
      { label: "EU Database Registration", href: "/tools/eu-database-registration-assistant" },
    ],
  },
];

export function GovernanceLifecycleDiagram({ maxWidth = "1100px" }: { maxWidth?: string }) {
  return (
    <div style={{ maxWidth, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>
          The governance lifecycle
        </p>
        <h2 style={{ ...syne, fontSize: "clamp(1.5rem, 4vw, 2.1rem)", fontWeight: 700, letterSpacing: "-0.015em", color: "#F4F1EA", marginBottom: "0.75rem" }}>
          Every AI decision moves through eight stages.
        </h2>
        <p style={{ ...syne, fontSize: "0.92rem", color: "rgba(244,241,234,0.5)", lineHeight: 1.65, maxWidth: "560px", margin: "0 auto" }}>
          Most governance programs stop at stage one, a document describing intent. The record only becomes real evidence once it survives stages two through eight.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px", background: "rgba(255,255,255,0.06)" }}>
        {STAGES.map((s) => (
          <div
            key={s.n}
            style={{
              background: s.hot ? "rgba(229,72,77,0.08)" : "#0D1B2E",
              border: s.hot ? "1px solid rgba(229,72,77,0.35)" : "1px solid transparent",
              padding: "1.75rem 1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                ...syne,
                fontSize: "16px",
                fontWeight: 800,
                background: s.hot ? "#E5484D" : "rgba(255,255,255,0.06)",
                color: s.hot ? "white" : "#F4F1EA",
                border: s.hot ? "none" : "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {s.n}
            </div>
            <p style={{ ...syne, fontSize: "16px", fontWeight: 700, color: "#F4F1EA", marginBottom: "0.5rem" }}>{s.title}</p>
            <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.6)", lineHeight: 1.62, marginBottom: "1rem" }}>{s.desc}</p>
            <span
              style={{
                ...mono,
                fontSize: "10.5px",
                lineHeight: 1.5,
                color: "#C9A66B",
                background: "rgba(201,166,107,0.08)",
                border: "1px solid rgba(201,166,107,0.25)",
                borderRadius: "6px",
                padding: "6px 8px",
                marginTop: "auto",
              }}
            >
              {s.mechanism}
            </span>
            {s.hot && s.hotNote && (
              <p style={{ ...syne, fontSize: "11.5px", color: "#ff8c89", lineHeight: 1.5, marginTop: "0.85rem" }}>
                {s.hotNote}
              </p>
            )}
            {s.tools && s.tools.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "0.85rem" }}>
                {s.tools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    style={{
                      ...syne,
                      fontSize: "10.5px",
                      fontWeight: 700,
                      color: "#F4F1EA",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "9999px",
                      padding: "4px 10px",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.label} →
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.35)", textAlign: "center", marginTop: "2rem" }}>
        Read the reasoning behind each stage in{" "}
        <Link href="/who-when-whether" style={{ color: "#C9A66B", textDecoration: "none" }}>the whitepaper</Link>, or see{" "}
        <Link href="/tools" style={{ color: "#C9A66B", textDecoration: "none" }}>every free tool</Link>.
      </p>

      <p style={{ ...syne, fontSize: "11px", color: "rgba(244,241,234,0.3)", lineHeight: 1.7, textAlign: "center", marginTop: "1.25rem", maxWidth: "620px", marginLeft: "auto", marginRight: "auto" }}>
        This is the accountability layer: proof of who decided, when, and whether it holds up. It isn&apos;t a substitute for a formal conformity assessment, live model monitoring, or a regulatory filing. The linked tools above prepare real documents; none of them submit or certify anything on your behalf.
      </p>
    </div>
  );
}
