import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const GRADE_COLORS: Record<string, string> = {
  A: "#4ade80",
  B: "#86efac",
  C: "#facc15",
  D: "#fb923c",
  E: "#f97316",
  F: "#f87171",
  G: "#ef4444",
};

// EPC-style certificate visual — the same "band on a scale" idea as a UK
// energy performance certificate, applied to governance maturity instead of
// energy efficiency. Score and grade come from calculateProgramScore in
// src/lib/program-grade.ts.
export function ProgramLetterGrade({
  grade,
  score,
  capped,
  notStartedCount,
}: {
  grade: string;
  score: number;
  capped?: boolean;
  notStartedCount?: number;
}) {
  const color = GRADE_COLORS[grade] ?? "#E5484D";
  const bands: string[] = ["A", "B", "C", "D", "E", "F", "G"];

  return (
    <div style={{
      background: "#0F2138",
      border: "1px solid rgba(255,255,255,0.15)",
      padding: "2rem",
      marginBottom: "1.5rem",
    }}>
      <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "1.25rem" }}>
        Governance letter grade
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "1.75rem", flexWrap: "wrap" }}>
        <div style={{
          width: "84px",
          height: "84px",
          borderRadius: "12px",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ ...syne, fontSize: "2.4rem", fontWeight: 800, color: "#0A1628" }}>{grade}</span>
        </div>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <p style={{ ...mono, fontSize: "13px", color: "rgba(255,255,255,0.85)", marginBottom: "0.5rem" }}>
            Score: {score}/100
          </p>
          <div style={{ display: "flex", gap: "3px", marginBottom: "0.5rem" }}>
            {bands.map((b) => (
              <div key={b} style={{
                flex: 1,
                height: "8px",
                borderRadius: "2px",
                background: b === grade ? color : "rgba(255,255,255,0.1)",
              }} />
            ))}
          </div>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
            Derived from the risk factors and safeguards given in your intake — more safeguards and fewer unmitigated risk factors move this toward A. This is Red Flag&apos;s own scoring model, not a regulator issued rating.
          </p>
          {capped && (
            <p style={{ ...syne, fontSize: "12px", color: "#facc15", lineHeight: 1.6, marginTop: "0.6rem" }}>
              Capped at C: {notStartedCount} of 6 regulatory document{notStartedCount === 1 ? "" : "s"} below show no input at intake. The score above reflects your risk and safeguard answers, but a grade cannot rate higher than C while a document has nothing behind it at all, whatever the rest of the intake scores.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
