"use client";

import { useEffect, useState } from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

type Lane = {
  code: string;
  name: string;
  law: string;
  detail: string;
  date: string | null; // ISO date string, or null if status is fixed (no countdown)
  status?: "in-force" | "expected";
  source: string;
};

const LANES: Lane[] = [
  {
    code: "eu",
    name: "European Union",
    law: "EU AI Act, Article 50(4)",
    detail: "AI content disclosure mandatory",
    date: "2026-08-02T00:00:00Z",
    source: "https://artificialintelligenceact.eu/article/50/",
  },
  {
    code: "eu",
    name: "European Union",
    law: "EU AI Act, Article 50(2)",
    detail: "Machine-readable watermarking required",
    date: "2026-12-02T00:00:00Z",
    source: "https://artificialintelligenceact.eu/article/50/",
  },
  {
    code: "gb",
    name: "United Kingdom",
    law: "Online Safety Act, Under-16 restrictions",
    detail: "Exact date not yet confirmed",
    date: null,
    status: "expected",
    source: "https://www.gov.uk/government/organisations/ofcom",
  },
  {
    code: "us",
    name: "United States (Vermont)",
    law: "Vermont Data Privacy & Online Surveillance Act",
    detail: "23rd/24th US state privacy law takes effect",
    date: "2028-01-01T00:00:00Z",
    source: "https://www.dataguidance.com/jurisdictions/vermont",
  },
  {
    code: "au",
    name: "Australia",
    law: "Social Media Minimum Age Act",
    detail: "Under-16 social media ban",
    date: null,
    status: "in-force",
    source: "https://www.esafety.gov.au/about-us/industry-regulation/social-media-age-restrictions",
  },
];

function getCountdown(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export function RegulatoryCountdown() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        padding: "6rem 1.5rem",
        background: "#0A1628",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.25rem" }}>
            <span style={{ width: "24px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)" }}>
              The clock you can&apos;t see
            </p>
            <span style={{ width: "24px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.02em", lineHeight: 1.12 }}>
            Every jurisdiction is running its <span style={{ fontStyle: "italic", color: "#E5484D" }}>own clock.</span>
          </h2>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.6, maxWidth: "620px", margin: "1rem auto 0" }}>
            5 jurisdictions, real deadlines, ticking right now, in parallel. Miss the one that applies to you and there&apos;s no warning shot. We track every one of these so you don&apos;t have to.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          {LANES.map((lane, i) => {
            const countdown = lane.date ? getCountdown(lane.date) : null;
            return (
              <div
                key={`${lane.law}-${i}`}
                style={{
                  background: "var(--navy-raised, #102943)",
                  padding: "1.5rem 1.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: "220px" }}>
                  <img
                    src={`https://flagcdn.com/w160/${lane.code}.png`}
                    alt={`${lane.name} flag`}
                    width={32}
                    height={21}
                    loading="lazy"
                    style={{ width: "32px", height: "21px", objectFit: "cover", borderRadius: "2px", border: "1px solid rgba(255,255,255,0.14)", flexShrink: 0 }}
                  />
                  <div>
                    <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#F4F1EA" }}>{lane.law}</p>
                    <p style={{ ...syne, fontSize: "11px", color: "rgba(244,241,234,0.5)" }}>
                      {lane.detail}
                      {" · "}
                      <a
                        href={lane.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "rgba(229,72,77,0.85)", textDecoration: "underline" }}
                      >
                        source
                      </a>
                    </p>
                  </div>
                </div>

                {countdown ? (
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "baseline" }} suppressHydrationWarning>
                    {[
                      { v: countdown.days, l: "d" },
                      { v: countdown.hours, l: "h" },
                      { v: countdown.minutes, l: "m" },
                      { v: countdown.seconds, l: "s" },
                    ].map((unit) => (
                      <span key={unit.l} style={{ ...mono, fontSize: "1.05rem", fontWeight: 700, color: "#E5484D" }}>
                        {String(unit.v).padStart(2, "0")}
                        <span style={{ fontSize: "0.7rem", color: "rgba(244,241,234,0.45)", marginLeft: "2px" }}>{unit.l}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span
                    style={{
                      ...syne,
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      color: lane.status === "in-force" ? "#4ade80" : "rgba(244,241,234,0.6)",
                      background: lane.status === "in-force" ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${lane.status === "in-force" ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.12)"}`,
                    }}
                  >
                    {lane.status === "in-force" ? "Already in force" : "Expected, date TBC"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <p style={{ ...syne, fontSize: "11px", color: "rgba(244,241,234,0.3)", textAlign: "center", marginTop: "1.5rem" }}>
          Dates sourced from official regulatory text and government announcements. Updated {new Date(now).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
        </p>
        <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.45)", textAlign: "center", marginTop: "0.75rem" }}>
          <a href="/blog/five-ai-compliance-deadlines-2026" style={{ color: "#E5484D", textDecoration: "underline" }}>
            Read what each of these 5 deadlines actually means
          </a>
        </p>
      </div>
    </section>
  );
}
