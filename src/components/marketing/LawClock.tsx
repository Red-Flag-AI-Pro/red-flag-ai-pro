import React from "react";
import Link from "next/link";
import { REGULATORY_MAPPING_LAST_REVIEWED } from "@/lib/constants";
import { splitLawTimeline, daysUntil, formatLawDate, type LawEvent } from "@/lib/law-timeline";
import { LawAlertSignup } from "@/components/marketing/LawAlertSignup";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

const SIDE_LABEL: Record<LawEvent["side"], string> = {
  compliance: "What you said",
  governance: "What you did",
  both: "Both sides",
};

function SideTag({ side }: { side: LawEvent["side"] }) {
  return (
    <span style={{ ...mono, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A66B", whiteSpace: "nowrap" }}>
      {SIDE_LABEL[side]}
    </span>
  );
}

/**
 * The law, as of today. Server rendered, and the page revalidates hourly, so
 * the countdowns are always current and an event moves itself from "landing
 * next" to "in force now" the day its date passes. Nobody has to remember to
 * edit the homepage, which is exactly how the old "enforcement begins August
 * 2026" line was still on the site in late November.
 */
export function LawClock() {
  const now = new Date();
  const { inForce, next } = splitLawTimeline(now);
  const today = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });

  return (
    <section
      aria-label="The law today"
      style={{ padding: "5.5rem 1.5rem", background: "#0A1628", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#E5484D", animation: "pulseRed 2s ease-in-out infinite" }} />
            <p style={{ ...mono, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,241,234,0.7)" }}>
              The law today · {today}
            </p>
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.12, color: "#F4F1EA", marginBottom: "1rem" }}>
            The law didn&apos;t wait.<br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>Neither did we.</span>
          </h2>
          <p style={{ ...syne, fontSize: "1.02rem", color: "rgba(244,241,234,0.65)", lineHeight: 1.7, maxWidth: "620px", margin: "0 auto" }}>
            What already applies to a business using AI, and what lands next. Each one is marked with the side of Red Flag that covers it.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
          {/* IN FORCE NOW */}
          <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "2rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem" }}>
              In force now
            </p>
            {inForce.map((e, i) => (
              <div key={e.date + e.law} style={{ paddingTop: i === 0 ? 0 : "1.4rem", marginTop: i === 0 ? 0 : "1.4rem", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", marginBottom: "0.5rem" }}>
                  <span style={{ ...mono, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)" }}>
                    {e.region} · since {formatLawDate(e.date)}
                  </span>
                  <SideTag side={e.side} />
                </div>
                <h3 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 500, color: "#F4F1EA", lineHeight: 1.3, marginBottom: "0.45rem" }}>{e.headline}</h3>
                <p style={{ ...syne, fontSize: "13.5px", color: "rgba(244,241,234,0.6)", lineHeight: 1.65 }}>{e.detail}</p>
              </div>
            ))}
          </div>

          {/* LANDING NEXT */}
          <div style={{ background: "#102943", border: "1px solid rgba(229,72,77,0.28)", borderRadius: "12px", padding: "2rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem" }}>
              Landing next
            </p>
            {next.map((e, i) => {
              const d = daysUntil(e.date, now);
              return (
                <div key={e.date + e.law} style={{ display: "flex", gap: "1.25rem", paddingTop: i === 0 ? 0 : "1.4rem", marginTop: i === 0 ? 0 : "1.4rem", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ flexShrink: 0, width: "74px", textAlign: "left" }}>
                    <span style={{ ...mono, display: "block", fontSize: "2.1rem", fontWeight: 500, lineHeight: 1, color: "#F4F1EA", letterSpacing: "-0.03em" }}>{d}</span>
                    <span style={{ ...mono, display: "block", marginTop: "6px", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)" }}>
                      {d === 1 ? "day" : "days"}
                    </span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", marginBottom: "0.45rem", flexWrap: "wrap" }}>
                      <span style={{ ...mono, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)" }}>
                        {e.region} · {formatLawDate(e.date)}
                      </span>
                      <SideTag side={e.side} />
                    </div>
                    <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 500, color: "#F4F1EA", lineHeight: 1.3, marginBottom: "0.4rem" }}>{e.headline}</h3>
                    <p style={{ ...syne, fontSize: "13.5px", color: "rgba(244,241,234,0.62)", lineHeight: 1.65 }}>{e.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <LawAlertSignup />

        <div style={{ marginTop: "2.25rem", display: "flex", flexWrap: "wrap", gap: "14px 28px", justifyContent: "center", alignItems: "center" }}>
          <Link href="/compliance-assessment" className="btn-primary" style={{ fontSize: "0.9rem", padding: "12px 26px" }}>
            Check what you said <span className="arrow">→</span>
          </Link>
          <Link href="/governance-audit" className="btn-secondary" style={{ fontSize: "0.9rem", padding: "12px 26px" }}>
            Prove what you did <span className="arrow">→</span>
          </Link>
        </div>
        <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.4)", textAlign: "center", marginTop: "1.5rem", lineHeight: 1.6 }}>
          Every date checked against the official text. Last reviewed {REGULATORY_MAPPING_LAST_REVIEWED}. This is a summary, not legal advice.
        </p>
      </div>
    </section>
  );
}
