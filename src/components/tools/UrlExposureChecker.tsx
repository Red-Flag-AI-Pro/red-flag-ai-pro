"use client";

import { useState } from "react";
import Link from "next/link";
import React from "react";
import { ResultsGate } from "./ResultsGate";
import { FLAG_CATEGORY_LABELS } from "@/lib/constants";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

interface ExposureFlag {
  category: string;
  severity: "high" | "medium" | "low";
  flag_description: string;
  text_excerpt: string;
  suggestion: string;
}

const SEVERITY_COLOUR: Record<string, string> = { high: "#ef4444", medium: "#f97316", low: "#eab308" };
const SEVERITY_LABEL: Record<string, string> = { high: "High", medium: "Medium", low: "Low" };

function scoreColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#eab308";
  return "#ef4444";
}

export function UrlExposureChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; flags: ExposureFlag[]; url: string } | null>(null);

  async function handleScan() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/tools/url-exposure-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="yourwebsite.com"
          style={{
            flex: 1,
            minWidth: "240px",
            background: "#0D1B2E",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px",
            padding: "13px 16px",
            color: "white",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleScan}
          disabled={!url.trim() || loading}
          style={{
            background: !url.trim() || loading ? "rgba(229,72,77,0.3)" : "#E5484D",
            color: "white",
            ...syne,
            fontSize: "0.875rem",
            fontWeight: 700,
            padding: "13px 28px",
            borderRadius: "9999px",
            border: "none",
            cursor: !url.trim() || loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Scanning…" : "Check my exposure →"}
        </button>
      </div>

      {error && <p style={{ ...syne, fontSize: "13px", color: "#ef4444", marginTop: "1rem" }}>{error}</p>}

      {result && (
        <ResultsGate tool="url-exposure-checker" title="Enter your email to see your full exposure report — free, no spam.">
        <div style={{ marginTop: "3rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Compliance Exposure Score</p>
            <p className="font-mono-fig" style={{ fontSize: "4rem", fontWeight: 700, color: scoreColor(result.score), letterSpacing: "-0.03em", lineHeight: 1 }}>{result.score}</p>
            <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "0.5rem" }}>{result.url}</p>
          </div>

          {result.flags.length === 0 ? (
            <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "2rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#22c55e" }}>No common compliance red flags detected on this page.</p>
              <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>This scans visible page text only — not a substitute for a full review across your funnel.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              {result.flags.map((flag, i) => (
                <div key={i} style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: "1rem" }}>
                    <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white" }}>{FLAG_CATEGORY_LABELS[flag.category] ?? flag.category}</p>
                    <span style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: SEVERITY_COLOUR[flag.severity], flexShrink: 0 }}>
                      {SEVERITY_LABEL[flag.severity]}
                    </span>
                  </div>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "0.5rem" }}>{flag.flag_description}</p>
                  <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>&ldquo;{flag.text_excerpt}&rdquo;</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
            <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              This checks the live page text on the URL you entered. Want every page in your funnel checked, with rewrites? That's what the full scanner does.
            </p>
            <Link href="/governance-audit" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", textDecoration: "none" }}>
              See your full compliance risk →
            </Link>
          </div>
        </div>
        </ResultsGate>
      )}
    </div>
  );
}
