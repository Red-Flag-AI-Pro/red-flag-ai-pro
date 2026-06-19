"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" };
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" };

/* ── Animated number hook ── */
function useAnimatedNumber(target: number, duration = 600) {
  const [current, setCurrent] = useState(target);
  const frameRef = useRef<number>(0);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (target - from) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
      else fromRef.current = target;
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return current;
}

/* ── Risk dial ── */
function RiskDial({ riskPercent, color }: { riskPercent: number; color: string }) {
  const R = 72;
  const cx = 90;
  const cy = 82;
  const startDeg = -135;
  const totalDeg = 270;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const arc = (fromDeg: number, toDeg: number) => {
    const s = toRad(fromDeg), e = toRad(toDeg);
    const large = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${cx + R * Math.cos(s)} ${cy + R * Math.sin(s)} A ${R} ${R} 0 ${large} 1 ${cx + R * Math.cos(e)} ${cy + R * Math.sin(e)}`;
  };

  const needleDeg = startDeg + (riskPercent / 100) * totalDeg;
  const nRad = toRad(needleDeg);
  const label = riskPercent < 25 ? "LOW" : riskPercent < 50 ? "MODERATE" : riskPercent < 75 ? "HIGH" : "CRITICAL";
  const fillEnd = riskPercent > 0 ? startDeg + (riskPercent / 100) * totalDeg : startDeg;

  return (
    <div style={{ position: "relative", textAlign: "center", width: "180px" }}>
      <svg width="180" height="110" viewBox="0 0 180 110" style={{ overflow: "visible" }}>
        {/* Track */}
        <path d={arc(startDeg, startDeg + totalDeg)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round" />
        {/* Fill */}
        {riskPercent > 0 && (
          <path
            d={arc(startDeg, fillEnd)}
            fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            style={{ transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)", filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        )}
        {/* Ticks */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const a = toRad(startDeg + pct * (totalDeg / 100));
          return <line key={pct} x1={cx + 64 * Math.cos(a)} y1={cy + 64 * Math.sin(a)} x2={cx + 74 * Math.cos(a)} y2={cy + 74 * Math.sin(a)} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />;
        })}
        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={cx + 54 * Math.cos(nRad)} y2={cy + 54 * Math.sin(nRad)}
          stroke="white" strokeWidth="2" strokeLinecap="round"
          style={{ transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <circle cx={cx} cy={cy} r="5" fill="white" />
      </svg>
      <p style={{
        ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em",
        textTransform: "uppercase" as const, color,
        position: "absolute", bottom: "-2px", left: "50%", transform: "translateX(-50%)",
        transition: "color 0.6s", whiteSpace: "nowrap" as const
      }}>{label}</p>
    </div>
  );
}

/* ── Share button ── */
function ShareButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    if (navigator.share) {
      await navigator.share({ text, url: "https://redflagaipro.com" }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text + " — redflagaipro.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };
  return (
    <button onClick={share} style={{
      display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
      color: "rgba(255,255,255,0.6)", ...syne, fontSize: "11px", fontWeight: 600,
      padding: "10px", borderRadius: "9999px", cursor: "pointer",
      letterSpacing: "0.05em", textTransform: "uppercase" as const, width: "100%",
      transition: "all 0.2s"
    }}>
      {copied
        ? "✓ Copied to clipboard"
        : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg> Share my risk score</>
      }
    </button>
  );
}

/* ── Data ── */
const INDUSTRIES = [
  { label: "E-commerce",             riskMult: 1.0, fineMult: 1.0 },
  { label: "Health & Supplements",   riskMult: 2.5, fineMult: 3.0 },
  { label: "Finance & Investing",    riskMult: 2.0, fineMult: 4.0 },
  { label: "Coaching & Courses",     riskMult: 1.8, fineMult: 2.0 },
  { label: "SaaS / Software",        riskMult: 0.8, fineMult: 1.2 },
  { label: "Beauty & Skincare",      riskMult: 1.5, fineMult: 1.8 },
];

const PRODUCT_TYPES = [
  { label: "Online course / coaching",  riskRate: 0.38 },
  { label: "Supplement / health",       riskRate: 0.45 },
  { label: "Software / SaaS",           riskRate: 0.20 },
  { label: "Physical product",          riskRate: 0.25 },
  { label: "Financial product",         riskRate: 0.42 },
  { label: "Beauty / skincare",         riskRate: 0.35 },
];

const selectStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
  ...syne,
  fontSize: "13px",
  padding: "10px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  outline: "none",
  appearance: "none" as const,
};

/* ── Seller ── */
function SellerCalculator() {
  const [adSpend, setAdSpend]           = useState(2000);
  const [industryIdx, setIndustryIdx]   = useState(0);
  const [incomeClaims, setIncomeClaims] = useState(false);

  const ind        = INDUSTRIES[industryIdx];
  const probability = Math.min(0.15 * ind.riskMult * (incomeClaims ? 1.6 : 1), 0.9);
  const atRisk     = Math.round(adSpend * 12 * probability);
  const fine       = Math.round(50000 * ind.fineMult * (incomeClaims ? 1.5 : 1));
  const total      = atRisk + fine;
  const riskPct    = Math.min((total / 250000) * 100, 100);
  const dialColor  = riskPct < 25 ? "#4ade80" : riskPct < 50 ? "#fbbf24" : riskPct < 75 ? "#f97316" : "#ef4444";

  const fmt = (n: number) =>
    n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(1)}m` :
    n >= 1_000     ? `£${(n / 1_000).toFixed(0)}k`     : `£${n}`;

  const animTotal  = useAnimatedNumber(total);
  const animAtRisk = useAnimatedNumber(atRisk);
  const animFine   = useAnimatedNumber(fine);

  return (
    <div style={{
      background: "#080303",
      border: `1px solid ${riskPct > 50 ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.07)"}`,
      padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem",
      transition: "border-color 0.6s",
    }}>
      <div>
        <p style={{...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "4px"}}>For Sellers</p>
        <p style={{...syne, fontSize: "1.05rem", fontWeight: 700, color: "white", letterSpacing: "-0.02em"}}>What's your compliance exposure?</p>
      </div>

      {/* Dial + big number */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        <RiskDial riskPercent={riskPct} color={dialColor} />
        <div style={{ textAlign: "center" }}>
          <p style={{...mono, fontSize: "2.75rem", fontWeight: 700, color: dialColor, letterSpacing: "-0.03em", lineHeight: 1, transition: "color 0.6s"}}>
            {fmt(animTotal)}
          </p>
          <p style={{...syne, fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "4px", letterSpacing: "0.08em", textTransform: "uppercase"}}>total exposure</p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        {/* Slider */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.45)"}}>Monthly ad spend</label>
            <span style={{...mono, fontSize: "1rem", fontWeight: 700, color: "white"}}>£{adSpend.toLocaleString()}</span>
          </div>
          <input type="range" min={500} max={50000} step={500} value={adSpend}
            onChange={(e) => setAdSpend(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#cc0000", cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
            <span style={{...syne, fontSize: "9px", color: "rgba(255,255,255,0.2)"}}>£500</span>
            <span style={{...syne, fontSize: "9px", color: "rgba(255,255,255,0.2)"}}>£50k</span>
          </div>
        </div>

        {/* Industry */}
        <div>
          <label style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "6px"}}>Industry</label>
          <select value={industryIdx} onChange={(e) => setIndustryIdx(Number(e.target.value))} style={selectStyle}>
            {INDUSTRIES.map((ind, i) => <option key={i} value={i} style={{ background: "#111" }}>{ind.label}</option>)}
          </select>
        </div>

        {/* Income claims toggle */}
        <div
          onClick={() => setIncomeClaims(!incomeClaims)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: incomeClaims ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${incomeClaims ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.07)"}`,
            padding: "11px 14px", borderRadius: "6px", cursor: "pointer", transition: "all 0.3s",
          }}>
          <span style={{...syne, fontSize: "12px", color: incomeClaims ? "#fca5a5" : "rgba(255,255,255,0.45)"}}>My copy includes income claims</span>
          <div style={{ width: "34px", height: "18px", borderRadius: "9999px", background: incomeClaims ? "#cc0000" : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: "2px", left: incomeClaims ? "16px" : "2px", width: "14px", height: "14px", borderRadius: "50%", background: "white", transition: "left 0.3s" }} />
          </div>
        </div>
      </div>

      {/* Breakdown rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {[
          { label: "Annual spend at risk", sub: `${Math.round(probability * 100)}% of campaigns flag`, val: fmt(animAtRisk) },
          { label: "Max regulatory fine",  sub: "per violation, per day",                              val: fmt(animFine) },
        ].map((row) => (
          <div key={row.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{...syne, fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em"}}>{row.label}</p>
              <p style={{...syne, fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: "2px"}}>{row.sub}</p>
            </div>
            <p style={{...mono, fontSize: "1.15rem", fontWeight: 700, color: "rgba(251,191,36,0.9)"}}>{row.val}</p>
          </div>
        ))}
      </div>

      {/* Value line */}
      <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", padding: "12px 14px" }}>
        <p style={{...mono, fontSize: "1rem", fontWeight: 700, color: "#4ade80"}}>{fmt(Math.round(total / 350))}x cheaper than your risk</p>
        <p style={{...syne, fontSize: "11px", color: "rgba(134,239,172,0.65)", marginTop: "3px"}}>Red Flag AI Pro is £350/month. Your exposure is {fmt(total)}.</p>
      </div>

      <ShareButton text={`My marketing compliance exposure is ${fmt(total)} — just calculated it. What's yours?`} />

      <Link href="/signup" style={{
        display: "block", textAlign: "center", background: "#cc0000", color: "white",
        ...syne, fontSize: "0.875rem", fontWeight: 700, padding: "13px 24px",
        borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)", textDecoration: "none",
      }}>
        Scan my copy free — protect {fmt(total)}
      </Link>
    </div>
  );
}

/* ── Buyer ── */
function BuyerCalculator() {
  const [amount, setAmount]           = useState(500);
  const [perYear, setPerYear]         = useState(5);
  const [typeIdx, setTypeIdx]         = useState(0);

  const pt         = PRODUCT_TYPES[typeIdx];
  const atRisk     = Math.round(amount * perYear * pt.riskRate);
  const total      = amount * perYear;
  const riskPct    = Math.min((atRisk / 5000) * 100, 100);
  const dialColor  = riskPct < 25 ? "#4ade80" : riskPct < 50 ? "#fbbf24" : riskPct < 75 ? "#f97316" : "#ef4444";

  const fmt = (n: number) => n >= 1000 ? `£${(n / 1000).toFixed(1)}k` : `£${n}`;

  const animAtRisk = useAnimatedNumber(atRisk);
  const animTotal  = useAnimatedNumber(total);

  return (
    <div style={{
      background: "#050508",
      border: `1px solid ${riskPct > 50 ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.07)"}`,
      padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem",
      transition: "border-color 0.6s",
    }}>
      <div>
        <p style={{...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "4px"}}>For Buyers</p>
        <p style={{...syne, fontSize: "1.05rem", fontWeight: 700, color: "white", letterSpacing: "-0.02em"}}>How much are you being misled out of?</p>
      </div>

      {/* Dial + big number */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        <RiskDial riskPercent={riskPct} color={dialColor} />
        <div style={{ textAlign: "center" }}>
          <p style={{...mono, fontSize: "2.75rem", fontWeight: 700, color: dialColor, letterSpacing: "-0.03em", lineHeight: 1, transition: "color 0.6s"}}>
            {fmt(animAtRisk)}
          </p>
          <p style={{...syne, fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "4px", letterSpacing: "0.08em", textTransform: "uppercase"}}>at risk per year</p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.45)"}}>Average purchase amount</label>
            <span style={{...mono, fontSize: "1rem", fontWeight: 700, color: "white"}}>£{amount.toLocaleString()}</span>
          </div>
          <input type="range" min={50} max={10000} step={50} value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#cc0000", cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
            <span style={{...syne, fontSize: "9px", color: "rgba(255,255,255,0.2)"}}>£50</span>
            <span style={{...syne, fontSize: "9px", color: "rgba(255,255,255,0.2)"}}>£10k</span>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.45)"}}>Online purchases per year</label>
            <span style={{...mono, fontSize: "1rem", fontWeight: 700, color: "white"}}>{perYear}</span>
          </div>
          <input type="range" min={1} max={50} step={1} value={perYear}
            onChange={(e) => setPerYear(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#cc0000", cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
            <span style={{...syne, fontSize: "9px", color: "rgba(255,255,255,0.2)"}}>1</span>
            <span style={{...syne, fontSize: "9px", color: "rgba(255,255,255,0.2)"}}>50</span>
          </div>
        </div>

        <div>
          <label style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "6px"}}>What do you mainly buy?</label>
          <select value={typeIdx} onChange={(e) => setTypeIdx(Number(e.target.value))} style={selectStyle}>
            {PRODUCT_TYPES.map((pt, i) => <option key={i} value={i} style={{ background: "#111" }}>{pt.label}</option>)}
          </select>
        </div>
      </div>

      {/* Breakdown rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {[
          { label: "Annual online spend",  sub: "total at stake",                              val: fmt(animTotal) },
          { label: "Misleading ads rate",  sub: `for ${pt.label.toLowerCase()}`,               val: `${Math.round(pt.riskRate * 100)}%` },
        ].map((row) => (
          <div key={row.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{...syne, fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em"}}>{row.label}</p>
              <p style={{...syne, fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: "2px"}}>{row.sub}</p>
            </div>
            <p style={{...mono, fontSize: "1.15rem", fontWeight: 700, color: "rgba(251,191,36,0.9)"}}>{row.val}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", padding: "12px 14px" }}>
        <p style={{...syne, fontSize: "13px", color: "rgba(134,239,172,0.8)", lineHeight: 1.6}}>
          A free 60-second scan before you buy could protect <span style={{ color: "white", fontWeight: 700 }}>{fmt(amount)}</span> right now.
        </p>
        <p style={{...mono, fontSize: "0.85rem", fontWeight: 700, color: "#4ade80", marginTop: "4px"}}>Free. No signup. 60 seconds.</p>
      </div>

      <ShareButton text={`£${atRisk.toLocaleString()} of my online spending is at risk from misleading ads. Just calculated it.`} />

      <a href="/#demo" style={{
        display: "block", textAlign: "center", background: "#cc0000", color: "white",
        ...syne, fontSize: "0.875rem", fontWeight: 700, padding: "13px 24px",
        borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)", textDecoration: "none",
      }}>
        Scan before you buy — protect {fmt(amount)}
      </a>
    </div>
  );
}

/* ── Wrapper ── */
export function RiskCalculator() {
  return (
    <div>
      <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem", textAlign: "center"}}>
        Your risk exposure
      </p>
      <h3 style={{...syne, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: "white", textAlign: "center", marginBottom: "0.75rem", letterSpacing: "-0.02em"}}>
        What is your compliance risk worth?
      </h3>
      <p style={{...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: "3rem"}}>
        Whether you are selling or buying — see your personal exposure
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2px" }}>
        <SellerCalculator />
        <BuyerCalculator />
      </div>
    </div>
  );
}
