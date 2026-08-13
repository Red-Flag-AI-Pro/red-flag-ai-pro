"use client";

import { useState } from "react";
import React from "react";
import type { DocumentException } from "@/lib/document-exceptions";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

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

const buttonStyle: React.CSSProperties = {
  ...syne,
  fontSize: "12.5px",
  fontWeight: 700,
  borderRadius: "6px",
  padding: "0.55rem 1rem",
  cursor: "pointer",
};

// Brad Wolfe, 12-13 Aug 2026. You cannot generate a disagreement alone at a
// desk: an exception has a receiver, and the ones worth counting come from
// somebody whose own results move with the answer. The form makes both
// facts mandatory and freezes them at the moment of the event.
export function ExceptionPanel({
  orderId,
  documents,
  exceptions,
}: {
  orderId: string;
  documents: { key: string; label: string; hasContent: boolean }[];
  exceptions: DocumentException[];
}) {
  const [raisingKey, setRaisingKey] = useState<string | null>(null);
  const [resolvingIndex, setResolvingIndex] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", role: "", stake: "", counterpartyName: "", counterpartyRole: "", note: "",
  });
  const [resolveForm, setResolveForm] = useState({ name: "", role: "", note: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const open = exceptions
    .map((e, i) => ({ ...e, index: i }))
    .filter((e) => e.status === "open");
  const closed = exceptions.filter((e) => e.status !== "open");

  function setField(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function raise() {
    if (!raisingKey) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/program/${orderId}/exception`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "raise",
          documentKey: raisingKey,
          raisedByName: form.name,
          raisedByRole: form.role,
          stake: form.stake,
          counterpartyName: form.counterpartyName,
          counterpartyRole: form.counterpartyRole,
          note: form.note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not record the exception.");
      setDone(data.verify_url ?? "recorded");
      setRaisingKey(null);
      setForm({ name: "", role: "", stake: "", counterpartyName: "", counterpartyRole: "", note: "" });
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not record the exception.");
    } finally {
      setBusy(false);
    }
  }

  async function resolve(index: number, outcome: "document_corrected" | "exception_declined") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/program/${orderId}/exception`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resolve",
          exceptionIndex: index,
          outcome,
          resolvedByName: resolveForm.name,
          resolvedByRole: resolveForm.role,
          resolutionNote: resolveForm.note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not record the resolution.");
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not record the resolution.");
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
      <p style={{ ...labelStyle }}>Exceptions</p>
      <p style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "0.9rem" }}>
        A review that never changes anything leaves no evidence it happened. Raising an exception here records a real disagreement: who raised it, what of theirs was riding on the answer, who received it, and how it was resolved. Every step is sealed and independently timestamped.
      </p>

      {done && (
        <p style={{ ...syne, fontSize: "12.5px", color: "#4ade80", marginBottom: "0.75rem" }}>
          Exception recorded and sealed.
        </p>
      )}
      {error && (
        <p style={{ ...syne, fontSize: "12.5px", color: "#f87171", marginBottom: "0.75rem" }}>{error}</p>
      )}

      {!raisingKey && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: open.length || closed.length ? "1rem" : 0 }}>
          {documents.filter((d) => d.hasContent).map((d) => (
            <button
              key={d.key}
              onClick={() => { setRaisingKey(d.key); setDone(null); }}
              disabled={busy}
              style={{
                ...buttonStyle,
                color: "rgba(255,255,255,0.75)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Raise on {d.label}
            </button>
          ))}
        </div>
      )}

      {raisingKey && (
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", marginBottom: "0.6rem" }}>
            Raising an exception on: <strong style={{ color: "white" }}>{documents.find((d) => d.key === raisingKey)?.label}</strong>
          </p>
          <input placeholder="What exactly is wrong?" value={form.note} onChange={(e) => setField("note", e.target.value)} style={{ ...inputStyle, marginBottom: "0.6rem" }} />
          <input
            placeholder="Your stake: what of yours gets worse if this answer is wrong?"
            value={form.stake}
            onChange={(e) => setField("stake", e.target.value)}
            style={{ ...inputStyle, marginBottom: "0.6rem" }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.6rem" }}>
            <input placeholder="Your name" value={form.name} onChange={(e) => setField("name", e.target.value)} style={inputStyle} />
            <input placeholder="Your role" value={form.role} onChange={(e) => setField("role", e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <input placeholder="Who receives this (name)" value={form.counterpartyName} onChange={(e) => setField("counterpartyName", e.target.value)} style={inputStyle} />
            <input placeholder="Their role" value={form.counterpartyRole} onChange={(e) => setField("counterpartyRole", e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button onClick={raise} disabled={busy} style={{
              ...buttonStyle, color: "#f87171",
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.35)",
            }}>
              Record the exception
            </button>
            <button onClick={() => setRaisingKey(null)} disabled={busy} style={{
              ...buttonStyle, color: "rgba(255,255,255,0.5)",
              background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {open.length > 0 && (
        <div style={{ marginBottom: closed.length ? "1rem" : 0 }}>
          <p style={{ ...labelStyle, marginBottom: "0.4rem" }}>Open</p>
          {open.map((e) => (
            <div key={e.index} style={{
              background: "rgba(248,113,113,0.05)",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: "8px", padding: "0.8rem 1rem", marginBottom: "0.6rem",
            }}>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "0.3rem" }}>
                <strong style={{ color: "white" }}>{e.raised_by_name}</strong> ({e.raised_by_role}) on {documents.find((d) => d.key === e.document_key)?.label ?? e.document_key}: &ldquo;{e.note}&rdquo;
              </p>
              <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "0.6rem" }}>
                Stake: {e.stake} · Awaiting {e.counterparty_name} ({e.counterparty_role})
              </p>
              {resolvingIndex === e.index ? (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.6rem" }}>
                    <input placeholder="Resolver name" value={resolveForm.name} onChange={(ev) => setResolveForm((f) => ({ ...f, name: ev.target.value }))} style={inputStyle} />
                    <input placeholder="Resolver role" value={resolveForm.role} onChange={(ev) => setResolveForm((f) => ({ ...f, role: ev.target.value }))} style={inputStyle} />
                  </div>
                  <input placeholder="Resolution note (required when declining)" value={resolveForm.note} onChange={(ev) => setResolveForm((f) => ({ ...f, note: ev.target.value }))} style={{ ...inputStyle, marginBottom: "0.6rem" }} />
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <button onClick={() => resolve(e.index, "document_corrected")} disabled={busy} style={{
                      ...buttonStyle, color: "#4ade80",
                      background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)",
                    }}>
                      Document corrected
                    </button>
                    <button onClick={() => resolve(e.index, "exception_declined")} disabled={busy} style={{
                      ...buttonStyle, color: "rgba(255,255,255,0.75)",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
                    }}>
                      Decline with reason
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setResolvingIndex(e.index)} disabled={busy} style={{
                  ...buttonStyle, fontSize: "12px", color: "rgba(255,255,255,0.65)",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
                }}>
                  Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {closed.length > 0 && (
        <div>
          <p style={{ ...labelStyle, marginBottom: "0.4rem" }}>Resolved</p>
          {closed.map((e, i) => (
            <p key={i} style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: i === closed.length - 1 ? 0 : "0.35rem" }}>
              <strong style={{ color: e.status === "document_corrected" ? "#4ade80" : "rgba(255,255,255,0.8)" }}>
                {e.status === "document_corrected" ? "Corrected" : "Declined"}
              </strong>
              {" "}· {documents.find((d) => d.key === e.document_key)?.label ?? e.document_key} · raised by {e.raised_by_name}, resolved by {e.resolved_by_name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
