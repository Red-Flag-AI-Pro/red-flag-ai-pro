import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

const FRAMEWORKS = [
  "EU AI Act",
  "DORA",
  "NIST AI RMF",
  "ISO 42001",
  "SEC",
  "GDPR",
  "Munir v SSHD",
];

const ASSURANCES = [
  "Audit ready evidence on every assessment",
  "Your data is never stored or sold",
  "Mapped to real regulatory frameworks, not generic checklists",
];

/**
 * Institutional credibility band. Regulatory-framework mapping is the single
 * highest-impact trust signal for CFO / compliance / risk buyers — lead with it.
 */
export function TrustBar() {
  return (
    <section
      aria-label="Regulatory alignment"
      style={{
        background: "#0C1929",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "2.5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.5rem" }}>
          <span style={{ width: "24px", height: "1px", background: "rgba(229,72,77,0.5)" }} />
          <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)" }}>
            Aligned to the frameworks regulators examine
          </p>
          <span style={{ width: "24px", height: "1px", background: "rgba(229,72,77,0.5)" }} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px", justifyContent: "center", alignItems: "center", marginBottom: "1.75rem" }}>
          {FRAMEWORKS.map((f, i) => (
            <React.Fragment key={f}>
              {i > 0 && <span aria-hidden style={{ color: "rgba(255,255,255,0.15)" }}>·</span>}
              <span style={{ ...mono, fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em", color: "rgba(244,241,234,0.85)" }}>{f}</span>
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 32px", justifyContent: "center" }}>
          {ASSURANCES.map((a) => (
            <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: "8px", ...syne, fontSize: "12px", color: "rgba(244,241,234,0.5)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
                <path d="M20 6L9 17l-5-5" stroke="#C9A66B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
