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
  exercisable,
  exercisedAt,
  exerciseNote,
  exercisedBy,
  exercisedFirstTime,
}: {
  number: string;
  title: string;
  content: string;
  orderId?: string;
  documentKey?: string;
  dueAt?: string;
  stale?: boolean;
  // Task #292, Brad Wolfe "standby capacity" post: reviewed and exercised
  // are different facts. Only the incident checklist gets this, it's the
  // one document that's genuinely a plan meant to be run, not just context.
  exercisable?: boolean;
  exercisedAt?: string;
  exerciseNote?: string;
  // Task #293, Brad Wolfe follow-up: who ran it is the cheapest proxy for
  // whether the exercise resembled the real event, not just that it happened.
  exercisedBy?: string;
  exercisedFirstTime?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmedJustNow, setConfirmedJustNow] = useState(false);
  const [exerciseFormOpen, setExerciseFormOpen] = useState(false);
  const [exerciseDraft, setExerciseDraft] = useState("");
  const [exercisedByDraft, setExercisedByDraft] = useState("");
  const [firstTimeDraft, setFirstTimeDraft] = useState<boolean | null>(null);
  const [exercising, setExercising] = useState(false);
  const [exercisedJustNow, setExercisedJustNow] = useState<{ at: string; note: string; by: string; firstTime: boolean } | null>(null);
  const [exerciseError, setExerciseError] = useState<string | null>(null);

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

  async function handleLogExercise() {
    if (!orderId || !documentKey || exercising) return;
    if (!exerciseDraft.trim()) {
      setExerciseError("Say briefly what happened when you ran it — that's the finding.");
      return;
    }
    if (!exercisedByDraft.trim()) {
      setExerciseError("Name who actually ran it — testing your own memory isn't the same as testing the document.");
      return;
    }
    if (firstTimeDraft === null) {
      setExerciseError("Say whether this is the first time that person has run it.");
      return;
    }
    setExercising(true);
    setExerciseError(null);
    try {
      const res = await fetch(`/api/program/${orderId}/log-exercise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentKey, note: exerciseDraft, exercisedBy: exercisedByDraft, firstTime: firstTimeDraft }),
      });
      const data = await res.json();
      if (res.ok) {
        setExercisedJustNow({ at: data.exercisedAt, note: exerciseDraft.trim(), by: exercisedByDraft.trim(), firstTime: firstTimeDraft });
        setExerciseFormOpen(false);
        setExerciseDraft("");
        setExercisedByDraft("");
        setFirstTimeDraft(null);
      } else {
        setExerciseError(data.error ?? "Could not save that.");
      }
    } finally {
      setExercising(false);
    }
  }

  const lastExercised = exercisedJustNow
    ? { at: exercisedJustNow.at, note: exercisedJustNow.note, by: exercisedJustNow.by, firstTime: exercisedJustNow.firstTime }
    : exercisedAt
    ? { at: exercisedAt, note: exerciseNote ?? "", by: exercisedBy ?? "", firstTime: exercisedFirstTime ?? false }
    : null;

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

      {exercisable && (
        <p style={{ ...syne, fontSize: "11.5px", color: lastExercised ? "rgba(74,222,128,0.75)" : "#facc15", marginBottom: "0.9rem", lineHeight: 1.6 }}>
          {lastExercised
            ? `Last exercised ${new Date(lastExercised.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} by ${lastExercised.by || "someone unnamed"}${lastExercised.firstTime ? ", their first time running it" : ", who had run it before"}${lastExercised.note ? ` — "${lastExercised.note}"` : ""}`
            : "Never exercised end to end. Reviewed is not the same as run."}
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

        {exercisable && orderId && documentKey && !exerciseFormOpen && (
          <button
            onClick={() => setExerciseFormOpen(true)}
            style={{
              background: "transparent",
              color: "#C9A66B",
              border: "1px solid rgba(201,166,107,0.4)",
              ...syne,
              fontSize: "0.85rem",
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: "9999px",
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            Log an exercise
          </button>
        )}
      </div>

      {exerciseFormOpen && (
        <div style={{ marginTop: "1rem", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(201,166,107,0.25)", background: "rgba(201,166,107,0.04)" }}>
          <p style={{ ...syne, fontSize: "11.5px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
            What happened when you actually ran this end to end, not whether it still reads correctly. A finding is the point, if something didn&apos;t work, say so, that&apos;s what makes this different from a review.
          </p>
          <input
            type="text"
            value={exercisedByDraft}
            onChange={(e) => setExercisedByDraft(e.target.value)}
            maxLength={200}
            placeholder="Who ran it? Ideally not whoever wrote the document."
            style={{
              width: "100%", ...syne, fontSize: "13px", color: "#F4F1EA",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px", padding: "10px 12px", marginBottom: "0.75rem",
            }}
          />
          <div style={{ display: "flex", gap: "16px", marginBottom: "0.75rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="radio" name={`firstTime-${documentKey}`} checked={firstTimeDraft === true} onChange={() => setFirstTimeDraft(true)} />
              <span style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.6)" }}>Their first time running it</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="radio" name={`firstTime-${documentKey}`} checked={firstTimeDraft === false} onChange={() => setFirstTimeDraft(false)} />
              <span style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.6)" }}>They&apos;d run it before</span>
            </label>
          </div>
          <textarea
            value={exerciseDraft}
            onChange={(e) => setExerciseDraft(e.target.value)}
            maxLength={2000}
            placeholder="e.g. Ran the drill with the ops team, escalation contact was out of date, fixed and retested."
            style={{
              width: "100%", minHeight: "80px", ...syne, fontSize: "13px", color: "#F4F1EA",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px", padding: "10px 12px", resize: "vertical", marginBottom: "0.75rem",
            }}
          />
          {exerciseError && (
            <p style={{ ...syne, fontSize: "11.5px", color: "#ef4444", marginBottom: "0.75rem" }}>{exerciseError}</p>
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleLogExercise}
              disabled={exercising}
              style={{
                background: "#C9A66B", color: "#0A1628", border: "none", ...syne, fontSize: "0.82rem",
                fontWeight: 700, padding: "9px 20px", borderRadius: "9999px",
                cursor: exercising ? "default" : "pointer", opacity: exercising ? 0.6 : 1,
              }}
            >
              {exercising ? "Saving…" : "Save exercise"}
            </button>
            <button
              onClick={() => { setExerciseFormOpen(false); setExerciseError(null); }}
              style={{
                background: "transparent", color: "rgba(255,255,255,0.5)", border: "none", ...syne,
                fontSize: "0.82rem", fontWeight: 700, padding: "9px 12px", cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
