import Link from "next/link";
import type React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const STAGES = [
  {
    n: 1,
    title: "Discover",
    desc: "Find where AI already makes or shapes decisions, including tools nobody formally approved. The free governance assessment scores six dimensions; the shadow AI audit surfaces the unauthorised tools already touching real decisions.",
    mechanism: "Free governance assessment + Shadow AI audit",
    hot: false,
  },
  {
    n: 2,
    title: "Authorize",
    desc: "Every system gets a boundary authorization record: who approved it, what role they held, what options were weighed, what risk was knowingly accepted, and the exact date and named condition that voids the grant. A decision, not a policy.",
    mechanism: "Boundary authorization record — who / when / whether",
    hot: false,
  },
  {
    n: 3,
    title: "Compliance",
    desc: "Marketing copy, claims and disclosures checked against the actual rules regulators enforce, across ten jurisdictions and thirty risk categories, before a complaint does the checking for you.",
    mechanism: "Compliance check — 10 jurisdictions, 30 categories",
    hot: true,
  },
  {
    n: 4,
    title: "Check",
    desc: "Every governance decision is checked and sealed the moment it happens. Each record is chained cryptographically with SHA-256, so editing, deleting or backdating a past entry breaks the chain and is provable, not just unlikely.",
    mechanism: "Governance check, cryptographically sealed live",
    hot: false,
  },
  {
    n: 5,
    title: "Prove",
    desc: "High value records carry an independent RFC 3161 trusted timestamp from a third party authority, and are cross sealed inside the Witness Network, so separate companies vouch for each other's evidence. Anyone can verify a record publicly, no account, without trusting our word for it.",
    mechanism: "RFC 3161 timestamp + Witness Network",
    hot: false,
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
          Every AI decision moves through five stages.
        </h2>
        <p style={{ ...syne, fontSize: "0.92rem", color: "rgba(244,241,234,0.5)", lineHeight: 1.65, maxWidth: "560px", margin: "0 auto" }}>
          Most governance programs stop at stage one, a document describing intent. The record only becomes real evidence once it survives stages two through five.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2px", background: "rgba(255,255,255,0.06)" }}>
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
            {s.hot && (
              <p style={{ ...syne, fontSize: "11.5px", color: "#ff8c89", lineHeight: 1.5, marginTop: "0.85rem" }}>
                <strong>Where compliance actually lives.</strong> A distinct check from governance, run before the copy goes out, not after a complaint does it for you.
              </p>
            )}
          </div>
        ))}
      </div>

      <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.35)", textAlign: "center", marginTop: "2rem" }}>
        Read the reasoning behind each stage in{" "}
        <Link href="/who-when-whether" style={{ color: "#C9A66B", textDecoration: "none" }}>the whitepaper</Link>.
      </p>
    </div>
  );
}
