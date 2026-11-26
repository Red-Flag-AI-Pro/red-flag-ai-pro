"use client";

import React, { useEffect, useState } from "react";

const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The soonest date in the law timeline, ticking in real time. The server
 * renders the whole days remaining so the page reads correctly before any
 * script runs; the hours, minutes and seconds appear once the browser takes
 * over. Nothing moves for visitors who have asked for reduced motion beyond
 * the numbers themselves changing.
 */
export function LiveCountdown({ targetMs, initialDays }: { targetMs: number; initialDays: number }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, targetMs - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const days = left === null ? initialDays : Math.floor(left / DAY);
  const h = left === null ? 0 : Math.floor((left % DAY) / 3_600_000);
  const m = left === null ? 0 : Math.floor((left % 3_600_000) / 60_000);
  const s = left === null ? 0 : Math.floor((left % 60_000) / 1000);
  const landed = left !== null && left <= 0;

  return (
    <div style={{ flexShrink: 0, width: "108px", textAlign: "left" }} aria-live="off">
      <span style={{ ...mono, display: "block", fontSize: "2.1rem", fontWeight: 500, lineHeight: 1, color: "#F4F1EA", letterSpacing: "-0.03em" }}>{days}</span>
      <span style={{ ...mono, display: "block", marginTop: "6px", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)" }}>
        {days === 1 ? "day" : "days"}
      </span>
      <span
        style={{
          ...mono,
          display: "block",
          marginTop: "8px",
          fontSize: "12.5px",
          letterSpacing: "0.04em",
          color: "#E5484D",
          fontVariantNumeric: "tabular-nums",
          opacity: left === null ? 0 : 1,
          transition: "opacity 0.4s ease",
          whiteSpace: "nowrap",
        }}
      >
        {landed ? "in force" : `${pad(h)}h ${pad(m)}m ${pad(s)}s`}
      </span>
    </div>
  );
}
