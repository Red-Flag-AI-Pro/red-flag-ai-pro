import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

// An illustration of what the free reply looks like, so a visitor can picture
// it before handing over their website. It is invented, and it says so on the
// card: we never present a made up finding as a real client's.
//
// Both rows are deliberately common, well established problems:
// - Falsely claiming limited time or limited stock is a banned practice in the
//   UK (Digital Markets, Competition and Consumers Act 2024, Schedule 20), and
//   the CMA can fine up to 10% of global turnover directly.
// - Significant decisions made by automated means need safeguards including a
//   way to get human review (UK GDPR Articles 22A to 22D, in force 5 Feb 2026).
const ROWS = [
  {
    side: "What you said",
    where: "Sales page, above the price",
    quote: "Only 3 places left at this price. Ends at midnight.",
    problem: "The timer starts again every time the page is opened, so the deadline is fake.",
    rule: "UK consumer law (DMCC Act 2024) bans it outright.",
    penalty: "The CMA can fine up to 10% of global turnover, with no court needed.",
  },
  {
    side: "What you did",
    where: "Careers page",
    quote: "Applications are screened automatically.",
    problem: "Nothing tells an applicant how to ask for a person to look at the decision.",
    rule: "UK GDPR Articles 22A to 22D require that safeguard for significant automated decisions.",
    penalty: "The ICO can fine for breaching people's data rights.",
  },
];

export function ExampleRedFlag() {
  return (
    <div style={{ background: "#0A1628", border: "1px solid rgba(201,166,107,0.4)", borderRadius: "14px", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "0.9rem 1.5rem", background: "rgba(201,166,107,0.1)", borderBottom: "1px solid rgba(201,166,107,0.3)" }}>
        <span style={{ ...mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A66B" }}>Example reply</span>
        <span style={{ ...mono, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,241,234,0.5)" }}>Illustration · not a real business</span>
      </div>

      <div style={{ padding: "1.5rem" }}>
        {ROWS.map((r, i) => (
          <div key={r.side} style={{ paddingTop: i === 0 ? 0 : "1.4rem", marginTop: i === 0 ? 0 : "1.4rem", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.7rem", flexWrap: "wrap" }}>
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden style={{ flexShrink: 0 }}>
                <line x1="1.5" y1="1" x2="1.5" y2="15" stroke="#E5484D" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M1.5 2h10.5l-3 3.75 3 3.75H1.5" fill="#E5484D" />
              </svg>
              <span style={{ ...mono, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D" }}>{r.side}</span>
              <span style={{ ...mono, fontSize: "10.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(244,241,234,0.45)" }}>{r.where}</span>
            </div>
            <p className="font-display" style={{ fontSize: "1.15rem", fontWeight: 500, fontStyle: "italic", color: "#F4F1EA", lineHeight: 1.4, borderLeft: "2px solid #E5484D", paddingLeft: "0.9rem", marginBottom: "0.8rem" }}>
              &ldquo;{r.quote}&rdquo;
            </p>
            <p style={{ ...syne, fontSize: "13.5px", color: "rgba(244,241,234,0.8)", lineHeight: 1.6, marginBottom: "0.35rem" }}>{r.problem}</p>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.6 }}>{r.rule} {r.penalty}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "1rem 1.5rem", background: "rgba(229,72,77,0.1)", borderTop: "1px solid rgba(229,72,77,0.3)" }}>
        <p style={{ ...syne, fontSize: "13.5px", fontWeight: 700, color: "#F4F1EA", lineHeight: 1.5 }}>
          Plus 11 more on this site. <span style={{ fontWeight: 500, color: "rgba(244,241,234,0.65)" }}>The full audit lists every one and how to fix it.</span>
        </p>
      </div>
    </div>
  );
}
