"use client";

import { useState } from "react";
import React from "react";
import type { CanaryEvent } from "@/lib/canary-check";

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

const inputStyle: React.CSSProperties = {
  ...syne,
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "6px",
  padding: "0.5rem 0.75rem",
  fontSize: "13px",
  color: "white",
  outline: "none",
};

// Task #137. The panel is honest about what it is -- a review authenticity
// exercise the account owner runs on their own certification process. What
// it never reveals, until after the response is recorded, is what was
// changed. Knowing a test is happening and knowing the answer are different
// things; a fire drill announced in advance still proves whether people
// leave the building.
export function CanaryCheckPanel({
  orderId,
  documents,
  history,
}: {
  orderId: string;
  documents: { key: string; label: string; hasContent: boolean }[];
  history: CanaryEvent[];
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [alteredContent, setAlteredContent] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reveal, setReveal] = useState<{
    status: string;
    trueCatch: boolean;
    originalExcerpt: string;
    alteredExcerpt: string;
    verifyUrl: string | null;
  } | null>(null);

  const completed = history.filter((e) => e.status !== "pending");

  async function start(key: string) {
    setBusy(true);
    setError(null);
    setReveal(null);
    try {
      const res = await fetch(`/api/program/${orderId}/canary-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", documentKey: key }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start the check.");
      setActiveKey(key);
      setAlteredContent(data.alteredContent);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the check.");
    } finally {
      setBusy(false);
    }
  }

  async function respond(response: "confirmed" | "flagged") {
    if (!activeKey) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/program/${orderId}/canary-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "respond",
          documentKey: activeKey,
          response,
          note,
          respondedByName: name,
          respondedByRole: role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not record the response.");
      setReveal({
        status: data.status,
        trueCatch: Boolean(data.trueCatch),
        originalExcerpt: data.originalExcerpt,
        alteredExcerpt: data.alteredExcerpt,
        verifyUrl: data.verify_url ?? null,
      });
      setActiveKey(null);
      setAlteredContent(null);
      setNote("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not record the response.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.08)",
      padding: "1.25rem 1.5rem",
      marginBottom: "1.5rem",
    }}>
      <p style={{ ...labelStyle }}>Canary check</p>
      <p style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "0.9rem" }}>
        A review authenticity exercise. The system presents a version of one of your documents with a single known material error planted in it, and records whether your reviewer catches it or certifies it anyway. The real document is never touched. The outcome is sealed and independently timestamped, evidence your review process works, not a claim that it does.
      </p>

      {!activeKey && !reveal && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: completed.length ? "1rem" : 0 }}>
          {documents.filter((d) => d.hasContent).map((d) => (
            <button
              key={d.key}
              onClick={() => start(d.key)}
              disabled={busy}
              style={{
                ...syne, fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.75)",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "6px", padding: "0.45rem 0.8rem", cursor: busy ? "wait" : "pointer",
              }}
            >
              Run on {d.label}
            </button>
          ))}
        </div>
      )}

      {activeKey && alteredContent && (
        <div>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
            Read the document below. One material detail has been changed. Certify it as accurate, or flag it and say what&apos;s wrong. A flag only counts as a true catch if the note names the actual error.
          </p>
          <pre style={{
            ...mono, fontSize: "11.5px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6,
            background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", padding: "1rem", maxHeight: "320px", overflow: "auto",
            whiteSpace: "pre-wrap", marginBottom: "0.9rem",
          }}>{alteredContent}</pre>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.6rem" }}>
            <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            <input placeholder="Your role" value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle} />
          </div>
          <input
            placeholder="If flagging: what exactly is wrong?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ ...inputStyle, marginBottom: "0.75rem" }}
          />
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              onClick={() => respond("flagged")}
              disabled={busy}
              style={{
                ...syne, fontSize: "12.5px", fontWeight: 700, color: "#f87171",
                background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.35)",
                borderRadius: "6px", padding: "0.55rem 1rem", cursor: busy ? "wait" : "pointer",
              }}
            >
              Flag it, something is wrong
            </button>
            <button
              onClick={() => respond("confirmed")}
              disabled={busy}
              style={{
                ...syne, fontSize: "12.5px", fontWeight: 700, color: "rgba(255,255,255,0.75)",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "6px", padding: "0.55rem 1rem", cursor: busy ? "wait" : "pointer",
              }}
            >
              Certify as accurate
            </button>
          </div>
        </div>
      )}

      {reveal && (
        <div style={{
          background: reveal.status === "caught" ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)",
          border: `1px solid ${reveal.status === "caught" ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
          borderRadius: "8px", padding: "0.9rem 1.1rem", marginBottom: "0.9rem",
        }}>
          <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: reveal.status === "caught" ? "#4ade80" : "#f87171", marginBottom: "0.4rem" }}>
            {reveal.status === "caught"
              ? reveal.trueCatch
                ? "Caught, and the note named the actual error."
                : "Flagged, but the note did not name the actual error."
              : "Missed. The document was certified with a known error in it."}
          </p>
          <p style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: reveal.verifyUrl ? "0.5rem" : 0 }}>
            What was changed: &ldquo;{reveal.originalExcerpt}&rdquo; became &ldquo;{reveal.alteredExcerpt}&rdquo;. The real document was never altered.
          </p>
          {reveal.verifyUrl && (
            <a href={reveal.verifyUrl} style={{ ...mono, fontSize: "12px", color: "#C9A66B", textDecoration: "none" }}>
              Sealed record →
            </a>
          )}
        </div>
      )}

      {error && (
        <p style={{ ...syne, fontSize: "12.5px", color: "#f87171", marginBottom: "0.6rem" }}>{error}</p>
      )}

      {completed.length > 0 && !activeKey && (
        <div>
          <p style={{ ...labelStyle, marginBottom: "0.4rem" }}>History</p>
          {completed.map((e, i) => (
            <p key={i} style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: i === completed.length - 1 ? 0 : "0.35rem" }}>
              <strong style={{ color: e.status === "caught" ? "#4ade80" : "#f87171" }}>
                {e.status === "caught" ? (e.true_catch ? "True catch" : "Flagged, error not named") : "Missed"}
              </strong>
              {" "}· {documents.find((d) => d.key === e.document_key)?.label ?? e.document_key} · {e.responded_by_name}
              {typeof e.dwell_seconds === "number" ? ` · ${e.dwell_seconds}s` : ""}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
