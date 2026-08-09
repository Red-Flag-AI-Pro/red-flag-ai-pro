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
//
// Task #281: review is optional so older callers/tests keep working, but
// the delivery page always passes it. Confirming here is the actual
// dependency a stale document has -- see src/lib/program-document-review.ts
// and the Data Room export, which excludes a document nobody has
// reconfirmed past its review date.
export function ProgramDocumentPanel({
  number,
  title,
  content,
  orderId,
  documentKey,
  dueAt,
  stale,
}: {
  number: string;
  title: string;
  content: string;
  orderId?: string;
  documentKey?: string;
  dueAt?: string;
  stale?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmedJustNow, setConfirmedJustNow] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — text is selectable regardless
    }
  }

  async function handleConfirmReview() {
    if (!orderId || !documentKey || confirming) return;
    setConfirming(true);
    try {
      const res = await fetch(`/api/program/${orderId}/confirm-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentKey }),
      });
      if (res.ok) setConfirmedJustNow(true);
    } finally {
      setConfirming(false);
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

      {dueAt && (
        <p style={{ ...syne, fontSize: "11.5px", color: (stale && !confirmedJustNow) ? "#facc15" : "rgba(255,255,255,0.4)", marginBottom: "0.9rem", lineHeight: 1.6 }}>
          {confirmedJustNow
            ? "Confirmed just now — review clock reset."
            : stale
            ? `Past its review date (${new Date(dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}). Excluded from Data Room exports until reconfirmed.`
            : `Next review due ${new Date(dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}.`}
        </p>
      )}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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

        {orderId && documentKey && !confirmedJustNow && (
          <button
            onClick={handleConfirmReview}
            disabled={confirming}
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.25)",
              ...syne,
              fontSize: "0.85rem",
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: "9999px",
              cursor: confirming ? "default" : "pointer",
              letterSpacing: "0.02em",
              opacity: confirming ? 0.6 : 1,
            }}
          >
            {confirming ? "Confirming…" : "Confirm still accurate"}
          </button>
        )}
      </div>
    </div>
  );
}
