"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ResultsGate } from "./ResultsGate";

/**
 * AI Compliance Fine Calculator — public, ungated lead-gen tool.
 * Shows a visitor their MAXIMUM STATUTORY exposure (a scary, believable number),
 * then gates the "where exactly you're exposed / how to fix it" behind a CTA
 * into the Red Flag governance assessment.
 *
 * Figures are statutory MAXIMUMS, verified 2026-06-20 (see penalty-caps-reference).
 * Framed as "maximum potential exposure" — not a prediction. Actual fines are at
 * regulator discretion. FX rates are approximate (clearly labelled).
 */

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

// Approximate FX → GBP (June 2026). Used only to express foreign statutory caps in £.
const FX = { EUR: 0.85, AUD: 0.52, SGD: 0.58, BRL: 0.15, INR: 0.0095, CAD: 0.58, AED: 0.215, USD: 0.79 };

type Kind = "higher" | "capped" | "fixed" | "perViolation";

interface Jur {
  id: string;
  name: string;
  law: string;
  kind: Kind;
  pct?: number; // fraction of turnover
  floorGBP?: number; // statutory fixed amount, in £
  capGBP?: number; // for "capped" regimes
  perViolationGBP?: number;
  note?: string;
  aiActPct?: number; // EU special-case when "uses AI"
  aiActFloorGBP?: number;
}

const JURISDICTIONS: Jur[] = [
  { id: "uk", name: "United Kingdom", law: "UK GDPR / DPA 2018", kind: "higher", pct: 0.04, floorGBP: 17_500_000 },
  {
    id: "eu",
    name: "European Union",
    law: "EU AI Act / GDPR",
    kind: "higher",
    pct: 0.04,
    floorGBP: Math.round(20_000_000 * FX.EUR),
    aiActPct: 0.07,
    aiActFloorGBP: Math.round(35_000_000 * FX.EUR),
    note: "EU AI Act raises this to 7% / €35M when you use AI",
  },
  { id: "au", name: "Australia", law: "Privacy Act 1988", kind: "higher", pct: 0.30, floorGBP: Math.round(50_000_000 * FX.AUD), note: "Up to 30% of adjusted turnover, the harshest %" },
  { id: "sg", name: "Singapore", law: "PDPA", kind: "higher", pct: 0.10, floorGBP: Math.round(1_000_000 * FX.SGD) },
  { id: "br", name: "Brazil", law: "LGPD", kind: "capped", pct: 0.02, capGBP: Math.round(50_000_000 * FX.BRL), note: "2% of revenue, capped at R$50M" },
  { id: "in", name: "India", law: "DPDP Act 2023", kind: "fixed", floorGBP: Math.round(2_500_000_000 * FX.INR), note: "Up to ₹250 crore per breach" },
  { id: "ae", name: "United Arab Emirates", law: "PDPL", kind: "fixed", floorGBP: Math.round(5_000_000 * FX.AED), note: "Fixed range up to AED 5M" },
  { id: "us", name: "United States", law: "FTC Act §5", kind: "perViolation", perViolationGBP: Math.round(53_088 * FX.USD), note: "Per violation, multiplies fast (per consumer / per day)" },
  { id: "ca", name: "Canada", law: "PIPEDA", kind: "fixed", floorGBP: Math.round(100_000 * FX.CAD), note: "Low today; tougher reform (C$25M/5%) proposed, not yet law" },
];

const DEFAULT_MARKETS = ["uk", "eu", "us"];

function exposureGBP(j: Jur, turnover: number, usesAI: boolean): number {
  switch (j.kind) {
    case "higher": {
      const pct = j.id === "eu" && usesAI ? j.aiActPct! : j.pct!;
      const floor = j.id === "eu" && usesAI ? j.aiActFloorGBP! : j.floorGBP!;
      return Math.max(turnover * pct, floor);
    }
    case "capped":
      return Math.min(turnover * j.pct!, j.capGBP!);
    case "fixed":
      return j.floorGBP!;
    case "perViolation":
      return j.perViolationGBP!; // nominal for ranking; labelled "per violation"
  }
}

function fmtGBP(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return "£" + (m >= 10 ? Math.round(m) : Math.round(m * 10) / 10) + "M";
  }
  if (n >= 1000) return "£" + Math.round(n / 1000) + "k";
  return "£" + Math.round(n);
}

// Slider 0..100 → turnover on a log scale (£100k → £1bn)
function sliderToTurnover(v: number): number {
  const t = 100_000 * Math.pow(10, v / 25);
  // round to 2 significant figures
  const mag = Math.pow(10, Math.floor(Math.log10(t)));
  return Math.round(t / mag * 10) / 10 * mag;
}

export function FineCalculator() {
  const [sliderVal, setSliderVal] = useState(50); // ~£10M
  const [markets, setMarkets] = useState<string[]>(DEFAULT_MARKETS);
  const [usesAI, setUsesAI] = useState(true);

  const turnover = sliderToTurnover(sliderVal);

  const result = useMemo(() => {
    const selected = JURISDICTIONS.filter((j) => markets.includes(j.id));
    const rows = selected
      .map((j) => ({ j, gbp: exposureGBP(j, turnover, usesAI) }))
      .sort((a, b) => b.gbp - a.gbp);
    const headline = rows.length ? rows[0].gbp : 0;
    const severity = Math.max(0.1, Math.min(0.96, headline / 30_000_000));
    return { rows, headline, severity, count: selected.length };
  }, [markets, turnover, usesAI]);

  // Count-up animation for the headline number
  const [shown, setShown] = useState(result.headline);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(result.headline); return; }
    const from = shown;
    const to = result.headline;
    const start = performance.now();
    const dur = 700;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(from + (to - from) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.headline]);

  const sevLabel = result.severity > 0.66 ? "severe" : result.severity > 0.33 ? "high" : "elevated";

  // Gauge geometry (semicircle r=82, centre 100,100)
  const a = Math.PI * (1 - result.severity); // radians, π(left)→0(right)
  const needleX = 100 + 70 * Math.cos(a);
  const needleY = 100 - 70 * Math.sin(a);
  const arcLen = Math.PI * 82;
  const dash = result.severity * arcLen;

  function toggleMarket(id: string) {
    setMarkets((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  }

  return (
    <div>
      {/* ── Inputs ── */}
      <div style={{ background: "#102943", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "1.75rem 1.75rem 2rem", marginBottom: "1.25rem" }}>
        {/* Turnover */}
        <label htmlFor="turnover" style={{ ...syne, display: "block", fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", color: "rgba(244,241,234,0.6)", marginBottom: "10px" }}>
          Annual turnover
        </label>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "12px" }}>
          <span className="font-display" style={{ fontSize: "1.9rem", fontWeight: 500, color: "#F4F1EA", lineHeight: 1 }}>{fmtGBP(turnover)}</span>
        </div>
        <input
          id="turnover" type="range" min={0} max={100} step={1} value={sliderVal}
          onChange={(e) => setSliderVal(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#E5484D" }}
          aria-label="Annual turnover"
        />

        {/* Markets */}
        <p style={{ ...syne, fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", color: "rgba(244,241,234,0.6)", margin: "1.5rem 0 10px" }}>Where do you operate?</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {JURISDICTIONS.map((j) => {
            const on = markets.includes(j.id);
            return (
              <button
                key={j.id} type="button" onClick={() => toggleMarket(j.id)} aria-pressed={on}
                style={{
                  ...syne, fontSize: "12px", fontWeight: 600, padding: "7px 13px", borderRadius: "9999px", cursor: "pointer",
                  background: on ? "rgba(229,72,77,0.16)" : "transparent",
                  color: on ? "#F4F1EA" : "rgba(244,241,234,0.5)",
                  border: on ? "1px solid rgba(229,72,77,0.55)" : "1px solid rgba(255,255,255,0.14)",
                  transition: "all 150ms ease",
                }}
              >
                {j.name}
              </button>
            );
          })}
        </div>

        {/* Uses AI */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "1.5rem" }}>
          <button
            type="button" role="switch" aria-checked={usesAI} onClick={() => setUsesAI((v) => !v)}
            style={{ width: "44px", height: "24px", borderRadius: "9999px", border: "none", cursor: "pointer", position: "relative", background: usesAI ? "#E5484D" : "rgba(255,255,255,0.18)", transition: "background 150ms ease", flexShrink: 0 }}
          >
            <span style={{ position: "absolute", top: "3px", left: usesAI ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left 150ms ease" }} />
          </button>
          <span style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.75)" }}>We use AI in our business <span style={{ color: "rgba(244,241,234,0.4)" }}>(brings the EU AI Act into scope)</span></span>
        </div>
      </div>

      {/* ── Result ── */}
      <ResultsGate tool="fine-calculator" title="Enter your email to see your maximum regulatory exposure. Free, no spam.">
      <div style={{ background: "#0A1628", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "2rem 2rem 1.75rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <p style={{ ...syne, margin: "0 0 12px", fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)" }}>Your maximum regulatory exposure</p>
            <p className="font-display" style={{ margin: 0, fontSize: "clamp(2.8rem, 8vw, 3.6rem)", fontWeight: 500, color: "#F4F1EA", lineHeight: 1 }}>{fmtGBP(shown)}</p>
            <div style={{ width: "54px", height: "3px", background: "#E5484D", margin: "16px 0" }} />
            <p style={{ ...syne, margin: 0, fontSize: "12px", color: "#C9A66B" }}>
              across {result.count} {result.count === 1 ? "market" : "markets"}{usesAI ? " · EU AI Act in scope" : ""}
            </p>
          </div>

          {/* Severity gauge */}
          <div style={{ flex: "0 0 auto", textAlign: "center" }}>
            <svg viewBox="0 0 200 122" width="184" height="112" role="img" aria-label={`Severity gauge: ${sevLabel}`}>
              <path d="M18 100 A82 82 0 0 1 182 100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="13" strokeLinecap="round" />
              <path d="M18 100 A82 82 0 0 1 182 100" fill="none" stroke="#E5484D" strokeWidth="13" strokeLinecap="round" strokeDasharray={`${dash} ${arcLen}`} />
              <line x1="100" y1="100" x2={needleX.toFixed(1)} y2={needleY.toFixed(1)} stroke="#F4F1EA" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="100" r="5" fill="#F4F1EA" />
              <text x="100" y="118" textAnchor="middle" fill="#E5484D" style={{ ...syne }} fontSize="13" fontWeight="600" letterSpacing="0.12em">{sevLabel}</text>
            </svg>
          </div>
        </div>

        {/* Breakdown */}
        {result.rows.length > 0 && (
          <>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "1.5rem 0 1.25rem" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {result.rows.slice(0, 4).map(({ j, gbp }) => {
                const isPv = j.kind === "perViolation";
                const width = result.headline > 0 ? Math.max(6, Math.min(100, (gbp / result.headline) * 100)) : 6;
                return (
                  <div key={j.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: "13px", marginBottom: "6px" }}>
                      <span style={{ ...syne, color: "rgba(244,241,234,0.7)" }}>{j.name} <span style={{ color: "rgba(244,241,234,0.4)" }}>· {j.law}</span></span>
                      <span className="font-mono-fig" style={{ color: "#F4F1EA" }}>{isPv ? fmtGBP(gbp) + " / violation" : fmtGBP(gbp)}</span>
                    </div>
                    <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "3px" }}>
                      <div style={{ height: "5px", width: `${width}%`, background: "#E5484D", borderRadius: "3px", transition: "width 300ms ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Gated CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "1.75rem", flexWrap: "wrap" }}>
          <Link href="/governance-audit" className="btn-primary" style={{ fontSize: "0.95rem", padding: "13px 26px" }}>
            See exactly where you&apos;re exposed <span className="arrow">→</span>
          </Link>
          <span className="font-mono-fig" style={{ fontSize: "11px", color: "rgba(244,241,234,0.4)" }}>free · 10 seconds</span>
        </div>
      </div>
      </ResultsGate>

      {/* Honest footnote */}
      <p style={{ ...syne, fontSize: "11px", color: "rgba(244,241,234,0.38)", lineHeight: 1.6, marginTop: "1rem", textAlign: "center" }}>
        Statutory maximum exposure, the legal ceiling, not a prediction. Actual penalties are at each regulator&apos;s discretion. Foreign caps converted to GBP at approximate rates. Figures verified June 2026.
      </p>
    </div>
  );
}
