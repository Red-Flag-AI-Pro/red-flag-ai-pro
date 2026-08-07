"use client";

import { useState } from "react";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

// Trim and collapse whitespace runs so a stray double space or trailing
// newline on re-paste doesn't cause a false "does not match" — but case,
// punctuation and digits are never touched, since those are exactly what
// this tool exists to catch a change in.
function canonicalize(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface SealResult {
  id: string;
  sealed_at: string;
  tsa: string | null;
  tsa_time: string | null;
}

interface VerifyResult {
  found: boolean;
  matches?: boolean;
  sealed_at?: string;
  tsa?: string | null;
}

interface NotarySealProps {
  placeholder: string;
  sealLabel: string;
  verifyHelp: string;
}

// Shared engine for the Post Notary and Payment Notary free tools. The
// server never receives plaintext content — only its SHA-256 hash, computed
// here in the browser via Web Crypto — so raw payment details or the text
// of a promise never touch Red Flag's database at all, only its fingerprint.
export function NotarySeal({ placeholder, sealLabel, verifyHelp }: NotarySealProps) {
  const [tab, setTab] = useState<"seal" | "verify">("seal");

  const [sealText, setSealText] = useState("");
  const [sealLabelText, setSealLabelText] = useState("");
  const [sealing, setSealing] = useState(false);
  const [sealResult, setSealResult] = useState<SealResult | null>(null);
  const [sealError, setSealError] = useState<string | null>(null);

  const [verifyText, setVerifyText] = useState("");
  const [verifyId, setVerifyId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  async function handleSeal() {
    if (!sealText.trim()) return;
    setSealing(true);
    setSealError(null);
    try {
      const hash = await sha256Hex(canonicalize(sealText));
      const res = await fetch("/api/notary/seal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash, label: sealLabelText }),
      });
      if (!res.ok) throw new Error();
      setSealResult(await res.json());
    } catch {
      setSealError("Could not seal this right now. Try again in a moment.");
    } finally {
      setSealing(false);
    }
  }

  async function handleVerify() {
    if (!verifyText.trim() || !verifyId.trim()) return;
    setVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);
    try {
      const hash = await sha256Hex(canonicalize(verifyText));
      const res = await fetch("/api/notary/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: verifyId.trim(), hash }),
      });
      if (!res.ok) throw new Error();
      setVerifyResult(await res.json());
    } catch {
      setVerifyError("Could not verify this right now. Try again in a moment.");
    } finally {
      setVerifying(false);
    }
  }

  function certificateText(r: SealResult): string {
    return [
      "Sealed by Red Flag AI Pro Notary",
      `Seal ID: ${r.id}`,
      `Sealed at: ${new Date(r.sealed_at).toUTCString()}`,
      r.tsa ? `Independently timestamped by: ${r.tsa} (RFC 3161)` : "Independent timestamp: unavailable, sealed with Red Flag's own record only",
      "Verify at: https://www.redflagaipro.com/tools/post-notary",
      "To verify, paste the exact original text back in with this Seal ID.",
    ].join("\n");
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => setTab("seal")}
          style={{
            flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer",
            background: tab === "seal" ? "#E5484D" : "transparent",
            border: tab === "seal" ? "1px solid #E5484D" : "1px solid rgba(255,255,255,0.15)",
            color: "white", ...syne, fontSize: "13px", fontWeight: 700,
          }}
        >
          Seal something new
        </button>
        <button
          type="button"
          onClick={() => setTab("verify")}
          style={{
            flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer",
            background: tab === "verify" ? "#E5484D" : "transparent",
            border: tab === "verify" ? "1px solid #E5484D" : "1px solid rgba(255,255,255,0.15)",
            color: "white", ...syne, fontSize: "13px", fontWeight: 700,
          }}
        >
          Verify an existing seal
        </button>
      </div>

      {tab === "seal" && (
        <div>
          <textarea
            value={sealText}
            onChange={(e) => setSealText(e.target.value)}
            placeholder={placeholder}
            rows={6}
            style={{
              width: "100%", background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "1rem", color: "white", ...syne, fontSize: "13px",
              resize: "vertical", marginBottom: "0.75rem",
            }}
          />
          <input
            value={sealLabelText}
            onChange={(e) => setSealLabelText(e.target.value)}
            placeholder="Optional label — e.g. 'Invoice #4471 bank details' (not stored with the content, just a note for your own reference)"
            style={{
              width: "100%", background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "0.75rem 1rem", color: "white", ...syne, fontSize: "12px",
              marginBottom: "1rem",
            }}
          />
          <button
            type="button"
            onClick={handleSeal}
            disabled={sealing || !sealText.trim()}
            style={{
              width: "100%", background: "#E5484D", color: "white", border: "none",
              borderRadius: "9999px", padding: "13px", ...syne, fontSize: "0.9rem", fontWeight: 700,
              cursor: sealing ? "default" : "pointer", opacity: sealing || !sealText.trim() ? 0.6 : 1,
            }}
          >
            {sealing ? "Sealing…" : sealLabel}
          </button>
          {sealError && <p style={{ ...syne, fontSize: "12px", color: "#ff9b9e", marginTop: "0.75rem" }}>{sealError}</p>}

          {sealResult && (
            <div style={{ marginTop: "1.5rem", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "10px", padding: "1.5rem" }}>
              <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#22c55e", marginBottom: "0.75rem" }}>Sealed.</p>
              <pre style={{ ...mono, fontSize: "11.5px", color: "rgba(255,255,255,0.7)", whiteSpace: "pre-wrap", lineHeight: 1.7, margin: 0, marginBottom: "1rem" }}>
                {certificateText(sealResult)}
              </pre>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(certificateText(sealResult))}
                style={{
                  background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white",
                  borderRadius: "9999px", padding: "8px 20px", ...syne, fontSize: "12px", fontWeight: 700, cursor: "pointer",
                }}
              >
                Copy certificate text
              </button>
              <p style={{ ...syne, fontSize: "11.5px", color: "rgba(255,255,255,0.35)", marginTop: "0.9rem", lineHeight: 1.6 }}>
                Paste this into the email or message you send. If the content changes later, the seal ID above will no longer verify it.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "verify" && (
        <div>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "1rem", lineHeight: 1.6 }}>{verifyHelp}</p>
          <textarea
            value={verifyText}
            onChange={(e) => setVerifyText(e.target.value)}
            placeholder="Paste the text exactly as it should have been sealed"
            rows={6}
            style={{
              width: "100%", background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "1rem", color: "white", ...syne, fontSize: "13px",
              resize: "vertical", marginBottom: "0.75rem",
            }}
          />
          <input
            value={verifyId}
            onChange={(e) => setVerifyId(e.target.value)}
            placeholder="Seal ID"
            style={{
              width: "100%", background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "0.75rem 1rem", color: "white", ...mono, fontSize: "12px",
              marginBottom: "1rem",
            }}
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={verifying || !verifyText.trim() || !verifyId.trim()}
            style={{
              width: "100%", background: "#E5484D", color: "white", border: "none",
              borderRadius: "9999px", padding: "13px", ...syne, fontSize: "0.9rem", fontWeight: 700,
              cursor: verifying ? "default" : "pointer", opacity: verifying || !verifyText.trim() || !verifyId.trim() ? 0.6 : 1,
            }}
          >
            {verifying ? "Checking…" : "Verify"}
          </button>
          {verifyError && <p style={{ ...syne, fontSize: "12px", color: "#ff9b9e", marginTop: "0.75rem" }}>{verifyError}</p>}

          {verifyResult && (
            <div style={{
              marginTop: "1.5rem", borderRadius: "10px", padding: "1.5rem",
              background: !verifyResult.found ? "rgba(255,255,255,0.03)" : verifyResult.matches ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${!verifyResult.found ? "rgba(255,255,255,0.1)" : verifyResult.matches ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.3)"}`,
            }}>
              {!verifyResult.found ? (
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>No seal found with that ID.</p>
              ) : verifyResult.matches ? (
                <>
                  <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#22c55e", marginBottom: "0.5rem" }}>Matches. This is the original text.</p>
                  <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                    Sealed {new Date(verifyResult.sealed_at!).toUTCString()}{verifyResult.tsa ? `, independently timestamped by ${verifyResult.tsa}.` : "."}
                  </p>
                </>
              ) : (
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#ff9b9e" }}>Does not match this seal. Either the text has changed, or this is the wrong seal ID. Do not act on this without checking directly with the sender.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
