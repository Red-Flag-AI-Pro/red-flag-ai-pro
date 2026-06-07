"use client";

import { useState } from "react";
import Link from "next/link";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" };
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" };

function SellerCalculator() {
  const [adSpend, setAdSpend] = useState(2000);

  const ftcFine = 50000;
  const probability = 0.15;
  const atRisk = Math.round(adSpend * 12 * probability);
  const totalRisk = atRisk + ftcFine;
  const format = (n: number) => n >= 1000 ? `£${(n / 1000).toFixed(0)}k` : `£${n}`;

  return (
    <div style={{background: "#0f0505", border: "1px solid rgba(239,68,68,0.2)", padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2rem"}}>

      <div>
        <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "0.75rem"}}>For Sellers</p>
        <p style={{...syne, fontSize: "1.25rem", fontWeight: 700, color: "white", letterSpacing: "-0.02em"}}>What is your compliance risk worth?</p>
        <p style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem"}}>Move the slider to see your exposure</p>
      </div>

      {/* Slider */}
      <div>
        <div style={{display: "flex", justifyContent: "space-between", marginBottom: "0.75rem"}}>
          <label style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)"}}>Monthly ad spend</label>
          <span style={{...mono, fontSize: "1.5rem", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.02em"}}>£{adSpend.toLocaleString()}</span>
        </div>
        <input type="range" min={500} max={50000} step={500} value={adSpend}
          onChange={(e) => setAdSpend(Number(e.target.value))}
          style={{width: "100%", accentColor: "#cc0000", cursor: "pointer"}}
        />
        <div style={{display: "flex", justifyContent: "space-between", marginTop: "4px"}}>
          <span style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)"}}>£500</span>
          <span style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)"}}>£50,000</span>
        </div>
      </div>

      {/* Numbers — Bloomberg terminal style */}
      <div style={{display: "flex", flexDirection: "column", gap: "2px"}}>
        {[
          { label: "Annual spend at risk", sub: "if 15% of campaigns flag", value: format(atRisk), color: "rgba(251,191,36,0.9)" },
          { label: "Potential FTC fine", sub: "per violation, per day", value: "£50k+", color: "#ef4444" },
          { label: "Total exposure", sub: "if left unchecked", value: `${format(totalRisk)}+`, color: "white", highlight: true },
        ].map((item) => (
          <div key={item.label} style={{
            background: item.highlight ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${item.highlight ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.05)"}`,
            padding: "1rem 1.25rem",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <p style={{...syne, fontSize: "11px", fontWeight: 600, color: item.highlight ? "#fca5a5" : "rgba(255,255,255,0.4)", letterSpacing: "0.05em", textTransform: "uppercase"}}>{item.label}</p>
              <p style={{...syne, fontSize: "11px", color: item.highlight ? "rgba(252,165,165,0.6)" : "rgba(255,255,255,0.25)", marginTop: "2px"}}>{item.sub}</p>
            </div>
            <p style={{...mono, fontSize: "1.75rem", fontWeight: 700, color: item.color, letterSpacing: "-0.02em", flexShrink: 0}}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Cost comparison */}
      <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", padding: "1rem 1.25rem"}}>
        <p style={{...syne, fontSize: "13px", color: "rgba(134,239,172,0.8)", lineHeight: 1.6}}>
          Red Flag AI Pro costs <span style={{color: "white", fontWeight: 700}}>£0 for your first scan</span> and <span style={{color: "white", fontWeight: 700}}>£39/month</span> for unlimited protection.
        </p>
        <p style={{...mono, fontSize: "1rem", fontWeight: 700, color: "#4ade80", marginTop: "6px"}}>
          {format(Math.round(totalRisk / 39))}x cheaper than your risk exposure.
        </p>
      </div>

      <Link href="/signup" style={{
        display: "block", textAlign: "center",
        background: "#cc0000", color: "white",
        ...syne, fontSize: "0.9rem", fontWeight: 700,
        padding: "14px 24px",
        borderRadius: "9999px",
        boxShadow: "0 8px 32px rgba(204,0,0,0.35)"
      }}>
        Scan my copy free — protect {format(totalRisk)}
      </Link>
    </div>
  );
}

function BuyerCalculator() {
  const [purchaseAmount, setPurchaseAmount] = useState(500);
  const [purchasesPerYear, setPurchasesPerYear] = useState(5);

  const riskRate = 0.3;
  const atRisk = Math.round(purchaseAmount * purchasesPerYear * riskRate);
  const totalExposure = purchaseAmount * purchasesPerYear;
  const format = (n: number) => n >= 1000 ? `£${(n / 1000).toFixed(1)}k` : `£${n}`;

  return (
    <div style={{background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2rem"}}>

      <div>
        <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "0.75rem"}}>For Buyers</p>
        <p style={{...syne, fontSize: "1.25rem", fontWeight: 700, color: "white", letterSpacing: "-0.02em"}}>How much are you risking?</p>
        <p style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem"}}>Move the sliders to see your exposure</p>
      </div>

      {/* Sliders */}
      <div style={{display: "flex", flexDirection: "column", gap: "1.5rem"}}>
        {[
          { label: "Average purchase amount", value: `£${purchaseAmount.toLocaleString()}`, min: 100, max: 10000, step: 100, current: purchaseAmount, setter: setPurchaseAmount, minLabel: "£100", maxLabel: "£10,000" },
          { label: "Online purchases per year", value: String(purchasesPerYear), min: 1, max: 50, step: 1, current: purchasesPerYear, setter: setPurchasesPerYear, minLabel: "1", maxLabel: "50" },
        ].map((s) => (
          <div key={s.label}>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "0.75rem"}}>
              <label style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)"}}>{s.label}</label>
              <span style={{...mono, fontSize: "1.5rem", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.02em"}}>{s.value}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.current}
              onChange={(e) => s.setter(Number(e.target.value))}
              style={{width: "100%", accentColor: "#cc0000", cursor: "pointer"}}
            />
            <div style={{display: "flex", justifyContent: "space-between", marginTop: "4px"}}>
              <span style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)"}}>{s.minLabel}</span>
              <span style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)"}}>{s.maxLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Numbers */}
      <div style={{display: "flex", flexDirection: "column", gap: "2px"}}>
        {[
          { label: "Annual spend online", sub: "total at stake per year", value: format(totalExposure), color: "rgba(251,191,36,0.9)" },
          { label: "Misleading ads rate", sub: "of online ads break the law", value: "30%", color: "#ef4444" },
          { label: "Your money at risk", sub: "from misleading marketing", value: `${format(atRisk)}+`, color: "white", highlight: true },
        ].map((item) => (
          <div key={item.label} style={{
            background: item.highlight ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${item.highlight ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.05)"}`,
            padding: "1rem 1.25rem",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <p style={{...syne, fontSize: "11px", fontWeight: 600, color: item.highlight ? "#fca5a5" : "rgba(255,255,255,0.4)", letterSpacing: "0.05em", textTransform: "uppercase"}}>{item.label}</p>
              <p style={{...syne, fontSize: "11px", color: item.highlight ? "rgba(252,165,165,0.6)" : "rgba(255,255,255,0.25)", marginTop: "2px"}}>{item.sub}</p>
            </div>
            <p style={{...mono, fontSize: "1.75rem", fontWeight: 700, color: item.color, letterSpacing: "-0.02em", flexShrink: 0}}>{item.value}</p>
          </div>
        ))}
      </div>

      <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", padding: "1rem 1.25rem"}}>
        <p style={{...syne, fontSize: "13px", color: "rgba(134,239,172,0.8)", lineHeight: 1.6}}>
          A free 60-second scan before you buy could save you <span style={{color: "white", fontWeight: 700}}>{format(purchaseAmount)}</span> right now.
        </p>
        <p style={{...mono, fontSize: "0.9rem", fontWeight: 700, color: "#4ade80", marginTop: "6px"}}>Free. No signup. No credit card. 60 seconds.</p>
      </div>

      <a href="/#demo" style={{
        display: "block", textAlign: "center",
        background: "#cc0000", color: "white",
        ...syne, fontSize: "0.9rem", fontWeight: 700,
        padding: "14px 24px",
        borderRadius: "9999px",
        boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
        textDecoration: "none"
      }}>
        Scan before you buy — protect {format(purchaseAmount)}
      </a>
    </div>
  );
}

export function RiskCalculator() {
  return (
    <div>
      <p style={{...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem", textAlign: "center"}}>Your risk exposure</p>
      <h3 style={{...syne, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: "white", textAlign: "center", marginBottom: "0.75rem", letterSpacing: "-0.02em"}}>
        What is your compliance risk worth?
      </h3>
      <p style={{...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: "3rem"}}>
        Whether you are selling or buying — see your personal exposure
      </p>
      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2px"}}>
        <SellerCalculator />
        <BuyerCalculator />
      </div>
    </div>
  );
}
