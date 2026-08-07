"use client";

import { useState } from "react";
import Link from "next/link";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function canonicalize(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

interface SealResult {
  id: string;
  sealed_at: string;
  tsa: string | null;
}

const FIELD_STYLE: React.CSSProperties = {
  width: "100%", background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px", padding: "0.9rem 1rem", color: "white", ...syne, fontSize: "13px",
};

// One-off, ungated demonstration of a boundary authorization record: the
// real, ongoing version (with renewal reminders and decay alerts) is a
// Sentinel dashboard feature, but the who/when/whether shape itself is worth
// letting anyone try for free, once, with no account. Reuses the same
// public sealing endpoint built for Post Notary/Payment Notary — a
// boundary authorization record is structurally the same idea (a fact,
// sealed at a moment, checkable later) applied to a permission instead of
// a quote or a payment detail.
export function AuthorizationRecordDemo() {
  const [who, setWho] = useState("");
  const [what, setWhat] = useState("");
  const [whenCondition, setWhenCondition] = useState("");
  const [sealing, setSealing] = useState(false);
  const [result, setResult] = useState<SealResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = who.trim() && what.trim() && whenCondition.trim();

  function recordText() {
    return [
      `Authorized by: ${canonicalize(who)}`,
      `Authorizes: ${canonicalize(what)}`,
      `Void when: ${canonicalize(whenCondition)}`,
    ].join("\n");
  }

  async function handleSeal() {
    if (!canSubmit) return;
    setSealing(true);
    setError(null);
    try {
      const hash = await sha256Hex(recordText());
      const res = await fetch("/api/notary/seal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash, label: "boundary_authorization_demo" }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError("Could not seal this right now. Try again in a moment.");
    } finally {
      setSealing(false);
    }
  }

  if (result) {
    return (
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "10px", padding: "1.75rem" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#22c55e", marginBottom: "1rem" }}>Sealed boundary authorization record</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginBottom: "1.25rem" }}>
            <div>
              <p style={{ ...syne, fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.25rem" }}>Who</p>
              <p style={{ ...syne, fontSize: "14px", color: "white" }}>{who}</p>
            </div>
            <div>
              <p style={{ ...syne, fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.25rem" }}>What</p>
              <p style={{ ...syne, fontSize: "14px", color: "white" }}>{what}</p>
            </div>
            <div>
              <p style={{ ...syne, fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.25rem" }}>Whether (void when)</p>
              <p style={{ ...syne, fontSize: "14px", color: "white" }}>{whenCondition}</p>
            </div>
          </div>
          <pre style={{ ...mono, fontSize: "11px", color: "rgba(255,255,255,0.5)", whiteSpace: "pre-wrap", lineHeight: 1.7, margin: 0, marginBottom: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {`Seal ID: ${result.id}\nSealed at: ${new Date(result.sealed_at).toUTCString()}\n${result.tsa ? `Independently timestamped by: ${result.tsa} (RFC 3161)` : "Timestamp: unavailable, sealed with Red Flag's own record only"}`}
          </pre>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(`${recordText()}\n\nSeal ID: ${result.id}\nSealed at: ${new Date(result.sealed_at).toUTCString()}`)}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", borderRadius: "9999px", padding: "8px 20px", ...syne, fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
          >
            Copy record
          </button>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "1rem", lineHeight: 1.6 }}>
            This was a one time demo. A real boundary authorization record tracks itself: it can renew, decay, or auto expire when the &quot;whether&quot; condition triggers, and it lives alongside every other one your business holds.
          </p>
          <Link href="/boundary-authorization-records" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "13px 28px", borderRadius: "9999px", textDecoration: "none" }}>
            See how the real version works →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#E5484D", display: "block", marginBottom: "0.5rem" }}>Who is authorizing this?</label>
          <input value={who} onChange={(e) => setWho(e.target.value)} placeholder="e.g. Sarah Chen, Head of Marketing" style={FIELD_STYLE} />
        </div>
        <div>
          <label style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#E5484D", display: "block", marginBottom: "0.5rem" }}>What is being authorized?</label>
          <input value={what} onChange={(e) => setWhat(e.target.value)} placeholder="e.g. The AI content tool may auto publish blog drafts under 500 words" style={FIELD_STYLE} />
        </div>
        <div>
          <label style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#E5484D", display: "block", marginBottom: "0.5rem" }}>Whether it still holds — when does this become void?</label>
          <input value={whenCondition} onChange={(e) => setWhenCondition(e.target.value)} placeholder="e.g. 90 days pass without review, or the tool's model version changes" style={FIELD_STYLE} />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSeal}
        disabled={sealing || !canSubmit}
        style={{
          width: "100%", background: "#E5484D", color: "white", border: "none",
          borderRadius: "9999px", padding: "13px", ...syne, fontSize: "0.9rem", fontWeight: 700,
          cursor: sealing ? "default" : "pointer", opacity: sealing || !canSubmit ? 0.6 : 1, marginTop: "1.5rem",
        }}
      >
        {sealing ? "Sealing…" : "Seal this record →"}
      </button>
      {error && <p style={{ ...syne, fontSize: "12px", color: "#ff9b9e", marginTop: "0.75rem" }}>{error}</p>}
    </div>
  );
}
