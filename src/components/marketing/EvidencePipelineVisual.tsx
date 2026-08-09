import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const STAGES = [
  { label: "CONTENT", detail: "A post, a message, an agent step, about to go live." },
  { label: "CHECK", detail: "Screened against the active ruleset in milliseconds." },
  { label: "DECISION", detail: "Allow or block, with the specific flags behind it." },
  { label: "SEAL", detail: "Hashed and chained. Blocks get an independent timestamp." },
  { label: "VERIFY", detail: "Anyone can check the seal, publicly, no account needed." },
];

// Task #271, illustrative visual idea seen on a competitor's homepage
// (KairoNull, 9 Aug 2026 research), built honestly here: this is Red
// Flag's own real pipeline shape (check, seal, verify), not staged to
// resemble live traffic, and labeled as such throughout. The real,
// non-illustrative version of this is the governed-decision count and
// the verify tool elsewhere on this page.
export function EvidencePipelineVisual() {
  return (
    <section style={{ padding: "3.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D1B2E" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.6rem", textAlign: "center" }}>
          Illustrative example
        </p>
        <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.5rem", textAlign: "center" }}>
          The shape of one decision, start to finish
        </h2>
        <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.4)", textAlign: "center", maxWidth: "460px", margin: "0 auto 2.25rem" }}>
          Synthetic data, not a live feed. This is the pipeline shape every real call to the gate follows, not a recording of actual traffic.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "stretch", gap: "0" }}>
          {STAGES.map((stage, i) => (
            <React.Fragment key={stage.label}>
              <div className="epv-stage" style={{
                width: "160px",
                padding: "1.1rem 1rem",
                borderRadius: "10px",
                border: "1px solid rgba(229,72,77,0.25)",
                background: "rgba(229,72,77,0.05)",
                textAlign: "center",
                animation: "epv-pulse 5s ease-in-out infinite",
                animationDelay: `${i * 1}s`,
              }}>
                <p style={{ ...mono, fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#E5484D", marginBottom: "0.5rem" }}>
                  {stage.label}
                </p>
                <p style={{ ...syne, fontSize: "11.5px", color: "rgba(244,241,234,0.55)", lineHeight: 1.5 }}>
                  {stage.detail}
                </p>
              </div>
              {i < STAGES.length - 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", flexShrink: 0 }} aria-hidden>
                  <span style={{ color: "rgba(244,241,234,0.25)", fontSize: "16px" }}>→</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center", padding: "0.9rem 1.4rem", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(244,241,234,0.4)", letterSpacing: "0.04em" }}>
            ILLUSTRATIVE EXAMPLE · SYNTHETIC DATA · NOT A LIVE FEED
          </p>
        </div>

        <style>{`
          @keyframes epv-pulse {
            0%, 80%, 100% { border-color: rgba(229,72,77,0.25); box-shadow: none; }
            10%, 20% { border-color: rgba(229,72,77,0.7); box-shadow: 0 0 20px rgba(229,72,77,0.15); }
          }
          @media (prefers-reduced-motion: reduce) {
            .epv-stage { animation: none !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
