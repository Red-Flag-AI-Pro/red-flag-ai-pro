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
  everReviewed,
  lastReviewedAt,
  sealedAt,
  currentNote,
  currentUpdatedAt,
  exercisable,
  exercisedAt,
  exerciseNote,
  exercisedBy,
  exercisedFirstTime,
  signoff,
}: {
  number: string;
  title: string;
  content: string;
  orderId?: string;
  documentKey?: string;
  dueAt?: string;
  stale?: boolean;
  // Task #281, second correction, 10 Aug 2026 per Brad Wolfe: "confirm it
  // still matches" answers whether the hash held, not whether anyone has
  // actually stood behind it since delivery. Before this, "not stale yet"
  // looked identical whether someone had confirmed the document yesterday
  // or nobody had looked at it since the seal -- his "unchecked renders the
  // same as fine" line, checked against the actual code and found true.
  // everReviewed + lastReviewedAt let the panel say which one it actually is.
  everReviewed?: boolean;
  lastReviewedAt?: string;
  // Task #281, corrected 10 Aug 2026 per Brad Wolfe: the sealed original
  // (this content, frozen since sealedAt) and the current status (matches
  // sealed, or diverged with a note) are two different facts now, not one
  // flag on one artifact.
  sealedAt?: string;
  currentNote?: string;
  currentUpdatedAt?: string;
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
  // Brad Wolfe, "How to let finance use AI and still be able to sign," 10 Aug
  // 2026: a different granularity to everything above. Reviewed/exercised
  // are about whether the document itself still holds up. This is about
  // whether a specific named person is certifying THIS document as the
  // source for a number they're signing off on elsewhere. Deliberately not
  // shown as a badge on every document -- his own warning kept: it should
  // stay rare, applied only where a customer is actually certifying
  // something, not routine activity.
  signoff?: {
    source: string;
    model_version: string | null;
    accepted_by_name: string;
    accepted_by_role: string;
    note: string | null;
    accepted_at: string;
  } | null;
}) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmedJustNow, setConfirmedJustNow] = useState(false);
  const [changeFormOpen, setChangeFormOpen] = useState(false);
  const [changeDraft, setChangeDraft] = useState("");
  const [markingChanged, setMarkingChanged] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);
  const [divergedJustNow, setDivergedJustNow] = useState<{ note: string; at: string } | null>(null);
  const [exerciseFormOpen, setExerciseFormOpen] = useState(false);
  const [exerciseDraft, setExerciseDraft] = useState("");
  const [exercisedByDraft, setExercisedByDraft] = useState("");
  const [firstTimeDraft, setFirstTimeDraft] = useState<boolean | null>(null);
  const [exercising, setExercising] = useState(false);
  const [exercisedJustNow, setExercisedJustNow] = useState<{ at: string; note: string; by: string; firstTime: boolean } | null>(null);
  const [exerciseError, setExerciseError] = useState<string | null>(null);
  const [signoffFormOpen, setSignoffFormOpen] = useState(false);
  const [signoffSource, setSignoffSource] = useState("");
  const [signoffModelVersion, setSignoffModelVersion] = useState("");
  const [signoffName, setSignoffName] = useState("");
  const [signoffRole, setSignoffRole] = useState("");
  const [signoffNote, setSignoffNote] = useState("");
  const [signingOff, setSigningOff] = useState(false);
  const [signoffError, setSignoffError] = useState<string | null>(null);
  const [signedOffJustNow, setSignedOffJustNow] = useState<{
    source: string; model_version: string | null; accepted_by_name: string; accepted_by_role: string; note: string | null; accepted_at: string;
  } | null>(null);

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

  async function handleMarkChanged() {
    if (!orderId || !documentKey || markingChanged) return;
    if (!changeDraft.trim()) {
      setChangeError("Say what changed since the sealed original — that's what makes this a real divergence, not a guess.");
      return;
    }
    setMarkingChanged(true);
    setChangeError(null);
    try {
      const res = await fetch(`/api/program/${orderId}/confirm-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentKey, changed: true, note: changeDraft.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setDivergedJustNow({ note: changeDraft.trim(), at: data.reviewedAt });
        setChangeFormOpen(false);
        setChangeDraft("");
      } else {
        setChangeError(data.error ?? "Could not save that.");
      }
    } finally {
      setMarkingChanged(false);
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

  async function handleSignOff() {
    if (!orderId || !documentKey || signingOff) return;
    if (!signoffSource.trim()) {
      setSignoffError("Say what source this came from.");
      return;
    }
    if (!signoffName.trim() || !signoffRole.trim()) {
      setSignoffError("Name and role are both required — the role is what gets frozen at this moment.");
      return;
    }
    setSigningOff(true);
    setSignoffError(null);
    try {
      const res = await fetch(`/api/program/${orderId}/sign-off-artifact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentKey,
          source: signoffSource,
          modelVersion: signoffModelVersion,
          acceptedByName: signoffName,
          acceptedByRole: signoffRole,
          note: signoffNote,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSignedOffJustNow({
          source: signoffSource.trim(),
          model_version: signoffModelVersion.trim() || null,
          accepted_by_name: signoffName.trim(),
          accepted_by_role: signoffRole.trim(),
          note: signoffNote.trim() || null,
          accepted_at: data.acceptedAt,
        });
        setSignoffFormOpen(false);
      } else {
        setSignoffError(data.error ?? "Could not save that.");
      }
    } finally {
      setSigningOff(false);
    }
  }

  const currentSignoff = signedOffJustNow ?? signoff ?? null;

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

      {sealedAt && (
        <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem", lineHeight: 1.6 }}>
          Sealed original — delivered {new Date(sealedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, hash verified, this text never changes.
        </p>
      )}

      {(divergedJustNow || currentNote) && (
        <p style={{ ...syne, fontSize: "11.5px", color: "#C9A66B", marginBottom: "0.9rem", lineHeight: 1.6 }}>
          {`Current status: diverged from the sealed original since ${new Date((divergedJustNow ?? { at: currentUpdatedAt! }).at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} — "${(divergedJustNow ?? { note: currentNote! }).note}"`}
        </p>
      )}

      {dueAt && (
        <p style={{
          ...syne,
          fontSize: "11.5px",
          color: (stale && !confirmedJustNow) ? "#facc15" : (!everReviewed && !confirmedJustNow) ? "#C9A66B" : "rgba(255,255,255,0.4)",
          marginBottom: "0.9rem",
          lineHeight: 1.6,
        }}>
          {confirmedJustNow
            ? "Confirmed just now — review clock reset."
            : stale
            ? `Past its review date (${new Date(dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}). Excluded from Data Room exports until reconfirmed.`
            : everReviewed
            ? `Confirmed current ${new Date(lastReviewedAt!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} — next review due ${new Date(dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}.`
            : `Never checked since delivery. Not past due yet — due ${new Date(dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, but nobody has confirmed this since the seal.`}
        </p>
      )}

      {exercisable && (
        <p style={{ ...syne, fontSize: "11.5px", color: lastExercised ? "rgba(74,222,128,0.75)" : "#facc15", marginBottom: "0.9rem", lineHeight: 1.6 }}>
          {lastExercised
            ? `Last exercised ${new Date(lastExercised.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} by ${lastExercised.by || "someone unnamed"}${lastExercised.firstTime ? ", their first time running it" : ", who had run it before"}${lastExercised.note ? ` — "${lastExercised.note}"` : ""}`
            : "Never exercised end to end. Reviewed is not the same as run."}
        </p>
      )}

      {currentSignoff && (
        <p style={{ ...syne, fontSize: "11.5px", color: "rgba(74,222,128,0.85)", marginBottom: "0.9rem", lineHeight: 1.6 }}>
          {`Certified by ${currentSignoff.accepted_by_name} (${currentSignoff.accepted_by_role}) on ${new Date(currentSignoff.accepted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} as the source for something they signed off on — from "${currentSignoff.source}"${currentSignoff.model_version ? `, ${currentSignoff.model_version}` : ""}${currentSignoff.note ? ` — "${currentSignoff.note}"` : ""}`}
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
            {confirming ? "Confirming…" : "Confirm current version matches sealed original"}
          </button>
        )}

        {orderId && documentKey && !changeFormOpen && !divergedJustNow && !currentNote && (
          <button
            onClick={() => setChangeFormOpen(true)}
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
            Mark as changed since delivery
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

        {orderId && documentKey && !signoffFormOpen && !currentSignoff && (
          <button
            onClick={() => setSignoffFormOpen(true)}
            style={{
              background: "transparent",
              color: "rgba(74,222,128,0.85)",
              border: "1px solid rgba(74,222,128,0.35)",
              ...syne,
              fontSize: "0.85rem",
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: "9999px",
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            Certify this as a source I'm signing off on
          </button>
        )}
      </div>

      {signoffFormOpen && (
        <div style={{ marginTop: "1rem", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(74,222,128,0.25)", background: "rgba(74,222,128,0.04)" }}>
          <p style={{ ...syne, fontSize: "11.5px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
            Different from the review confirmation above. This is a named person certifying THIS document as the source for a specific number, filing, or decision they&apos;re signing off on elsewhere. Keep this rare — it should only mark the few documents that actually feed something you certify, not routine activity.
          </p>
          <input
            type="text"
            value={signoffSource}
            onChange={(e) => setSignoffSource(e.target.value)}
            maxLength={300}
            placeholder="What source did this come from? e.g. Q3 board pack, filed accessibility statement"
            style={{
              width: "100%", ...syne, fontSize: "13px", color: "#F4F1EA",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px", padding: "10px 12px", marginBottom: "0.75rem",
            }}
          />
          <input
            type="text"
            value={signoffModelVersion}
            onChange={(e) => setSignoffModelVersion(e.target.value)}
            maxLength={200}
            placeholder="Which model/version produced it, if AI assisted (optional)"
            style={{
              width: "100%", ...syne, fontSize: "13px", color: "#F4F1EA",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px", padding: "10px 12px", marginBottom: "0.75rem",
            }}
          />
          <div style={{ display: "flex", gap: "10px", marginBottom: "0.75rem" }}>
            <input
              type="text"
              value={signoffName}
              onChange={(e) => setSignoffName(e.target.value)}
              maxLength={200}
              placeholder="Your name"
              style={{
                flex: 1, ...syne, fontSize: "13px", color: "#F4F1EA",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px", padding: "10px 12px",
              }}
            />
            <input
              type="text"
              value={signoffRole}
              onChange={(e) => setSignoffRole(e.target.value)}
              maxLength={200}
              placeholder="Your role, right now"
              style={{
                flex: 1, ...syne, fontSize: "13px", color: "#F4F1EA",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px", padding: "10px 12px",
              }}
            />
          </div>
          <textarea
            value={signoffNote}
            onChange={(e) => setSignoffNote(e.target.value)}
            maxLength={1000}
            placeholder="What are you accepting, specifically? (optional)"
            style={{
              width: "100%", minHeight: "60px", ...syne, fontSize: "13px", color: "#F4F1EA",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px", padding: "10px 12px", resize: "vertical", marginBottom: "0.75rem",
            }}
          />
          {signoffError && (
            <p style={{ ...syne, fontSize: "11.5px", color: "#ef4444", marginBottom: "0.75rem" }}>{signoffError}</p>
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleSignOff}
              disabled={signingOff}
              style={{
                background: "rgba(74,222,128,0.85)", color: "#0A1628", border: "none", ...syne, fontSize: "0.82rem",
                fontWeight: 700, padding: "9px 20px", borderRadius: "9999px",
                cursor: signingOff ? "default" : "pointer", opacity: signingOff ? 0.6 : 1,
              }}
            >
              {signingOff ? "Saving…" : "Certify"}
            </button>
            <button
              onClick={() => { setSignoffFormOpen(false); setSignoffError(null); }}
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

      {changeFormOpen && (
        <div style={{ marginTop: "1rem", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(201,166,107,0.25)", background: "rgba(201,166,107,0.04)" }}>
          <p style={{ ...syne, fontSize: "11.5px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
            The sealed original above stays exactly as delivered — it&apos;s proof of what was agreed on the day. This note is separate: what&apos;s actually true now, since something changed.
          </p>
          <textarea
            value={changeDraft}
            onChange={(e) => setChangeDraft(e.target.value)}
            maxLength={2000}
            placeholder="e.g. Escalation contact changed, updated in our own process, sealed document not reissued."
            style={{
              width: "100%", minHeight: "80px", ...syne, fontSize: "13px", color: "#F4F1EA",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px", padding: "10px 12px", resize: "vertical", marginBottom: "0.75rem",
            }}
          />
          {changeError && (
            <p style={{ ...syne, fontSize: "11.5px", color: "#ef4444", marginBottom: "0.75rem" }}>{changeError}</p>
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleMarkChanged}
              disabled={markingChanged}
              style={{
                background: "#C9A66B", color: "#0A1628", border: "none", ...syne, fontSize: "0.82rem",
                fontWeight: 700, padding: "9px 20px", borderRadius: "9999px",
                cursor: markingChanged ? "default" : "pointer", opacity: markingChanged ? 0.6 : 1,
              }}
            >
              {markingChanged ? "Saving…" : "Save current status"}
            </button>
            <button
              onClick={() => { setChangeFormOpen(false); setChangeError(null); }}
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
