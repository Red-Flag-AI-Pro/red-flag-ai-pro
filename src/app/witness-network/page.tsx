"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

interface TipInfo {
  chain: string;
  tip: string;
  count: number;
  ts: string;
}

interface LogRow {
  id: string;
  direction: "received" | "sent";
  peerChain: string | null;
  createdAt: string;
  timestamped: boolean;
  timestampAuthority: string | null;
  verify: string;
}

type PushState =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "ok"; verify: string | null }
  | { state: "error"; message: string };

function shortHash(hash: string) {
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`;
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function WitnessNetworkPage() {
  const [tip, setTip] = useState<TipInfo | null>(null);
  const [log, setLog] = useState<LogRow[]>([]);
  const [push, setPush] = useState<PushState>({ state: "idle" });

  async function loadState() {
    const [tipRes, logRes] = await Promise.all([
      fetch("/api/witness/tip").then((r) => r.json()),
      fetch("/api/witness/log").then((r) => r.json()),
    ]);
    setTip(tipRes);
    setLog(logRes.entries ?? []);
  }

  useEffect(() => {
    loadState();
  }, []);

  const peerCount = 1 + new Set(log.map((r) => r.peerChain).filter(Boolean)).size;

  async function handlePush() {
    setPush({ state: "sending" });
    try {
      const res = await fetch("/api/witness/push", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setPush({ state: "ok", verify: data.verify });
        loadState();
      } else {
        setPush({ state: "error", message: data.error ?? "The peer did not accept the anchor." });
      }
    } catch {
      setPush({ state: "error", message: "Could not reach the network. Try again." });
    }
  }

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none",
            background: "radial-gradient(ellipse 640px 320px at 50% 0%, rgba(229,72,77,0.16), transparent 70%)",
          }}
        />
        <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.75rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Witness network</p>
          </div>

          <svg width="220" height="52" viewBox="0 0 220 52" style={{ margin: "0 auto 1.75rem", display: "block" }}>
            <line x1="20" y1="26" x2="200" y2="26" stroke="rgba(244,241,234,0.15)" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
            <circle cx="20" cy="26" r="9" fill="#0A1628" stroke="#E5484D" strokeWidth="2.5" />
            <circle cx="20" cy="26" r="3" fill="#E5484D" />
            <circle cx="110" cy="26" r="5" fill="rgba(244,241,234,0.5)" />
            <circle cx="200" cy="26" r="9" fill="#0A1628" stroke="rgba(244,241,234,0.5)" strokeWidth="2.5" />
            <circle cx="200" cy="26" r="3" fill="rgba(244,241,234,0.5)" />
          </svg>

          <h1 className="font-display" style={{ fontSize: "clamp(2.1rem, 5vw, 3.2rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: "1.1rem" }}>
            Chains proving each other, <span style={{ fontStyle: "italic", color: "#E5484D" }}>visibly</span>.
          </h1>
          <p style={{ ...syne, fontSize: "0.98rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
            Two independent companies, sealing each other's evidence, live, in public. Not a diagram of the idea. The actual thing happening, checkable by anyone below.
          </p>
          <p style={{ ...syne, fontSize: "0.85rem", marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <a href="/witness-standard" style={{ color: "#E5484D", textDecoration: "underline" }}>Read the open protocol →</a>
            <a href="/witness-network/apply" style={{ color: "#E5484D", textDecoration: "underline" }}>Apply to join the network →</a>
          </p>
        </div>
      </section>

      <section style={{ padding: "2.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden", marginBottom: "1.75rem" }}>
            <div style={{ background: "#0D1B2E", padding: "1.5rem 1rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "1.7rem", fontWeight: 800, color: "#F4F1EA", marginBottom: "0.3rem" }}>{tip ? tip.count : "—"}</p>
              <p style={{ ...syne, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(244,241,234,0.4)" }}>Entries sealed</p>
            </div>
            <div style={{ background: "#0D1B2E", padding: "1.5rem 1rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "1.7rem", fontWeight: 800, color: "#F4F1EA", marginBottom: "0.3rem" }}>{peerCount}</p>
              <p style={{ ...syne, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(244,241,234,0.4)" }}>Chains witnessing</p>
            </div>
            <div style={{ background: "#0D1B2E", padding: "1.5rem 1rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "1.7rem", fontWeight: 800, color: "#F4F1EA", marginBottom: "0.3rem" }}>{log.length > 0 ? relativeTime(log[0].createdAt) : "—"}</p>
              <p style={{ ...syne, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(244,241,234,0.4)" }}>Last anchor</p>
            </div>
          </div>

          <div style={{ background: "linear-gradient(145deg, #102943, #0D1F35)", border: "1px solid rgba(229,72,77,0.25)", borderRadius: "12px", padding: "1.75rem", marginBottom: "1.5rem", boxShadow: "0 12px 40px -12px rgba(229,72,77,0.15)" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.75rem" }}>
              Our chain right now
            </p>
            {tip ? (
              <>
                <p style={{ ...syne, fontSize: "1.15rem", fontWeight: 700, color: "#F4F1EA", marginBottom: "0.5rem" }}>{tip.chain}</p>
                <p style={{ ...mono, fontSize: "0.85rem", color: "rgba(244,241,234,0.65)" }}>tip: {shortHash(tip.tip)}</p>
              </>
            ) : (
              <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.4)" }}>Loading…</p>
            )}
          </div>

          <button
            onClick={handlePush}
            disabled={push.state === "sending"}
            style={{
              width: "100%", ...syne, fontSize: "15px", fontWeight: 700, padding: "17px 24px",
              borderRadius: "10px", background: push.state === "sending" ? "rgba(229,72,77,0.55)" : "#E5484D",
              color: "white", border: "none", cursor: push.state === "sending" ? "default" : "pointer",
              boxShadow: push.state === "sending" ? "none" : "0 10px 32px -8px rgba(229,72,77,0.55)",
              transition: "box-shadow 0.2s, transform 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            }}
          >
            {push.state === "sending" && (
              <span
                style={{
                  width: "14px", height: "14px", borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff",
                  animation: "witness-spin 0.7s linear infinite",
                }}
              />
            )}
            {push.state === "sending" ? "Anchoring…" : "Anchor to the next chain now"}
          </button>
          <style>{`@keyframes witness-spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ ...syne, fontSize: "0.78rem", color: "rgba(244,241,234,0.35)", textAlign: "center", marginTop: "0.6rem" }}>
            Sends our current tip to the peer chain live. If it lands, the seal below updates and you can check it yourself.
          </p>

          {push.state === "ok" && (
            <div style={{ marginTop: "1rem", borderRadius: "10px", border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.08)", padding: "1.25rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#4ade80", marginBottom: "0.4rem" }}>✓ Anchored</p>
              {push.verify && (
                <a href={push.verify} style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.7)", textDecoration: "underline" }}>
                  Check the sealed record →
                </a>
              )}
            </div>
          )}
          {push.state === "error" && (
            <div style={{ marginTop: "1rem", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)", padding: "1.25rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", marginBottom: "0.4rem" }}>Not sent</p>
              <p style={{ ...syne, fontSize: "12.5px", color: "rgba(244,241,234,0.6)" }}>{push.message}</p>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.25rem" }}>
            Every anchor, in order
          </p>
          {log.length === 0 && (
            <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.4)" }}>No anchors yet. Press the button above to make the first one.</p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {log.map((row) => (
              <a
                key={row.id}
                href={row.verify}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px", padding: "1rem 1.25rem", textDecoration: "none",
                }}
              >
                <div>
                  <p style={{ ...syne, fontSize: "0.88rem", fontWeight: 700, color: "#F4F1EA" }}>
                    {row.direction === "received" ? "Received from" : "Sent to"} {row.peerChain ?? "a peer chain"}
                  </p>
                  <p style={{ ...syne, fontSize: "0.75rem", color: "rgba(244,241,234,0.4)" }}>
                    {new Date(row.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    {row.timestamped && row.timestampAuthority ? ` · timestamped by ${row.timestampAuthority}` : ""}
                  </p>
                </div>
                <span style={{ ...syne, fontSize: "0.78rem", color: "#E5484D", fontWeight: 700, whiteSpace: "nowrap" }}>Verify →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
