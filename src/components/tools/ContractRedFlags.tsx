"use client";

import { useState } from "react";
import Link from "next/link";
import React from "react";
import { scanContract, type ContractFlag } from "@/lib/contract-red-flags";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

const SEVERITY_COLOUR: Record<string, string> = {
  high: "#ef4444",
  medium: "#f97316",
  low: "#eab308",
};

const SEVERITY_LABEL: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const PLACEHOLDER = `Paste a contract, terms of service, or agreement here...`;

export function ContractRedFlags() {
  const [text, setText] = useState("");
  const [flags, setFlags] = useState<ContractFlag[] | null>(null);
  const [scanning, setScanning] = useState(false);

  function handleScan() {
    if (text.trim().length < 50) return;
    setScanning(true);
    setTimeout(() => {
      setFlags(scanContract(text));
      setScanning(false);
    }, 400);
  }

  const highCount = flags?.filter((f) => f.severity === "high").length ?? 0;
  const medCount = flags?.filter((f) => f.severity === "medium").length ?? 0;
  const lowCount = flags?.filter((f) => f.severity === "low").length ?? 0;

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={12}
        style={{
          width: "100%",
          background: "#0D1B2E",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          padding: "1.25rem",
          color: "white",
          fontSize: "13px",
          lineHeight: 1.6,
          resize: "vertical",
          fontFamily: "inherit",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{text.trim().length} characters · minimum 50</p>
        <button
          onClick={handleScan}
          disabled={text.trim().length < 50 || scanning}
          style={{
            background: text.trim().length < 50 ? "rgba(229,72,77,0.3)" : "#E5484D",
            color: "white",
            ...syne,
            fontSize: "0.875rem",
            fontWeight: 700,
            padding: "12px 28px",
            borderRadius: "9999px",
            border: "none",
            cursor: text.trim().length < 50 ? "not-allowed" : "pointer",
          }}
        >
          {scanning ? "Scanning…" : "Scan for red flags →"}
        </button>
      </div>

      {flags !== null && (
        <div style={{ marginTop: "3rem" }}>
          {flags.length === 0 ? (
            <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "2rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#22c55e" }}>No common red flags detected.</p>
              <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>This checks for common risky clause patterns only — not a substitute for legal review.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "0.75rem 1.25rem" }}>
                  <span style={{ ...syne, fontSize: "1.3rem", fontWeight: 800, color: "#ef4444" }}>{highCount}</span>
                  <span style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.5)", marginLeft: "0.5rem" }}>high risk</span>
                </div>
                <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "8px", padding: "0.75rem 1.25rem" }}>
                  <span style={{ ...syne, fontSize: "1.3rem", fontWeight: 800, color: "#f97316" }}>{medCount}</span>
                  <span style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.5)", marginLeft: "0.5rem" }}>medium</span>
                </div>
                <div style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: "8px", padding: "0.75rem 1.25rem" }}>
                  <span style={{ ...syne, fontSize: "1.3rem", fontWeight: 800, color: "#eab308" }}>{lowCount}</span>
                  <span style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.5)", marginLeft: "0.5rem" }}>low</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {flags.map((flag, i) => (
                  <div key={i} style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: "1rem" }}>
                      <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white" }}>{flag.title}</p>
                      <span style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: SEVERITY_COLOUR[flag.severity], flexShrink: 0 }}>
                        {SEVERITY_LABEL[flag.severity]}
                      </span>
                    </div>
                    <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "0.75rem" }}>{flag.description}</p>
                    <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "0.75rem" }}><strong style={{ color: "rgba(255,255,255,0.6)" }}>What to do: </strong>{flag.whatToDo}</p>
                    <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>Matched: &ldquo;{flag.matchedText}&rdquo;</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              This is a pattern-based check, not legal advice. For a full review, talk to a qualified lawyer.
            </p>
            <Link href="/governance-audit" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", textDecoration: "none" }}>
              See your full governance risk →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
