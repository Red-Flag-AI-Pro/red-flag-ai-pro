"use client";

import { useState } from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const SAMPLE_RECORD = `Vendor X approved for marketing copy generation.
Owner: J. Stokes, Founder. Expires 31 Dec 2026.
Voids if Vendor X appears on a regulator's enforcement list.`;

type SealState = { sealed: false } | { sealed: true; hash: string };

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function TryToBreakIt() {
  const [text, setText] = useState(SAMPLE_RECORD);
  const [seal, setSeal] = useState<SealState>({ sealed: false });
  const [liveHash, setLiveHash] = useState("");

  async function handleSeal() {
    const hash = await sha256Hex(text);
    setSeal({ sealed: true, hash });
    setLiveHash(hash);
  }

  async function handleChange(next: string) {
    setText(next);
    if (seal.sealed) setLiveHash(await sha256Hex(next));
  }

  function handleReset() {
    setText(SAMPLE_RECORD);
    setSeal({ sealed: false });
    setLiveHash("");
  }

  const matches = seal.sealed && liveHash === seal.hash;

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={4}
        style={{
          width: "100%", ...mono, fontSize: "13px", padding: "12px 14px", borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)", color: "#F4F1EA",
          resize: "vertical", marginBottom: "0.9rem", boxSizing: "border-box",
        }}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "1.25rem" }}>
        <button
          onClick={handleSeal}
          style={{
            ...syne, fontSize: "13px", fontWeight: 700, padding: "10px 20px", borderRadius: "8px",
            background: "#E5484D", color: "white", border: "none", cursor: "pointer",
          }}
        >
          Seal this text
        </button>
        <button
          onClick={handleReset}
          style={{
            ...syne, fontSize: "13px", fontWeight: 700, padding: "10px 20px", borderRadius: "8px",
            background: "rgba(255,255,255,0.08)", color: "#F4F1EA", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {seal.sealed && (
        <div
          style={{
            borderRadius: "10px", padding: "1.25rem",
            border: matches ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(239,68,68,0.4)",
            background: matches ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)",
          }}
        >
          <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: matches ? "#4ade80" : "#ef4444", marginBottom: "0.5rem" }}>
            {matches ? "✓ Matches the seal" : "✕ Does not match — this change would be caught"}
          </p>
          <p style={{ ...mono, fontSize: "11px", color: "rgba(244,241,234,0.5)", wordBreak: "break-all" }}>
            sealed: {seal.hash.slice(0, 24)}…
          </p>
          <p style={{ ...mono, fontSize: "11px", color: "rgba(244,241,234,0.5)", wordBreak: "break-all" }}>
            now: {liveHash.slice(0, 24)}…
          </p>
        </div>
      )}
    </div>
  );
}
