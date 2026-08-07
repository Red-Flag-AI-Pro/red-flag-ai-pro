"use client";

import { useState } from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

interface ProveResult {
  value: string;
  present: boolean;
  entry_id?: string;
  verify?: string;
  lower_neighbor?: { id: string; hash: string; created_at: string } | null;
  upper_neighbor?: { id: string; hash: string; created_at: string } | null;
  why?: string;
  error?: string;
}

// Lets a visitor run the absence proof themselves rather than take the claim
// on trust. Made up hash: proves it, showing the two real chain entries
// either side. A real hash off /verify: proves presence instead.
export function AbsenceProofTester() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ProveResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!value.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/complete/prove?value=${encodeURIComponent(value.trim())}`);
      const json = await res.json();
      setResult(json);
    } catch {
      setResult({ value, present: false, error: "Could not reach the proof endpoint." });
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste any 64 character hex string, made up is fine"
          style={{
            flex: "1 1 320px", minWidth: 0, padding: "0.65rem 0.85rem", borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.15)", background: "#0A1628",
            color: "#F4F1EA", fontSize: "13px", ...mono,
          }}
        />
        <button onClick={run} disabled={loading || !value.trim()} style={{
          ...syne, fontSize: "13px", fontWeight: 700, color: "white",
          background: "#E5484D", border: "none", borderRadius: "8px",
          padding: "0.65rem 1.2rem", cursor: loading ? "not-allowed" : "pointer",
        }}>
          {loading ? "Checking…" : "Prove it"}
        </button>
      </div>

      {result && !result.error && (
        <div style={{ padding: "1.1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
          {result.present ? (
            <>
              <p style={{ ...syne, fontSize: "13px", color: "#C9A66B", marginBottom: "0.5rem", fontWeight: 700 }}>Present in the chain.</p>
              <p style={{ ...syne, fontSize: "12.5px", color: "rgba(244,241,234,0.6)" }}>
                <a href={result.verify} style={{ color: "#E5484D" }}>Verify entry {result.entry_id}</a>
              </p>
            </>
          ) : (
            <>
              <p style={{ ...syne, fontSize: "13px", color: "#C9A66B", marginBottom: "0.6rem", fontWeight: 700 }}>Not present — here is the proof.</p>
              <p style={{ ...syne, fontSize: "12.5px", color: "rgba(244,241,234,0.6)", lineHeight: 1.6, marginBottom: "0.75rem" }}>{result.why}</p>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <div>
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.2rem" }}>Lower neighbor</p>
                  <p style={{ ...mono, fontSize: "11px", color: "rgba(244,241,234,0.6)", wordBreak: "break-all" }}>
                    {result.lower_neighbor ? `${result.lower_neighbor.hash} (${result.lower_neighbor.created_at.slice(0, 10)})` : "none — this would sort before every entry that exists"}
                  </p>
                </div>
                <div>
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.2rem" }}>Upper neighbor</p>
                  <p style={{ ...mono, fontSize: "11px", color: "rgba(244,241,234,0.6)", wordBreak: "break-all" }}>
                    {result.upper_neighbor ? `${result.upper_neighbor.hash} (${result.upper_neighbor.created_at.slice(0, 10)})` : "none — this would sort after every entry that exists"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {result?.error && <p style={{ ...syne, fontSize: "12px", color: "#E5484D" }}>{result.error}</p>}
    </div>
  );
}
