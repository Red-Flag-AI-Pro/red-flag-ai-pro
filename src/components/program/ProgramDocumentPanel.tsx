"use client";

import { useState } from "react";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const labelStyle: React.CSSProperties = {
  ...syne,
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
  marginBottom: "0.6rem",
  display: "block",
};

// Same panel + copy button pattern as every free tool (DPIAGenerator.tsx
// etc), reused here so the paid delivery page looks like the rest of the
// site rather than a different product bolted on.
export function ProgramDocumentPanel({ number, title, content }: { number: string; title: string; content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — text is selectable regardless
    }
  }

  return (
    <div style={{
      background: "#102943",
      border: "1px solid rgba(239,68,68,0.2)",
      borderLeft: "3px solid #E5484D",
      padding: "1.5rem 1.75rem",
      marginBottom: "1.5rem",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "0.75rem" }}>
        <span style={{ ...mono, fontSize: "11px", color: "#E5484D", fontWeight: 700 }}>{number}</span>
        <p style={labelStyle}>{title}</p>
      </div>
      <pre style={{ ...mono, fontSize: "12.5px", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "1.25rem", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {content}
      </pre>
      <button
        onClick={handleCopy}
        style={{
          background: copied ? "rgba(74,222,128,0.12)" : "#E5484D",
          color: copied ? "#4ade80" : "white",
          border: copied ? "1px solid rgba(74,222,128,0.3)" : "none",
          ...syne,
          fontSize: "0.85rem",
          fontWeight: 700,
          padding: "10px 22px",
          borderRadius: "9999px",
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "all 0.2s",
        }}
      >
        {copied ? "Copied ✓" : "Copy to clipboard"}
      </button>
    </div>
  );
}
