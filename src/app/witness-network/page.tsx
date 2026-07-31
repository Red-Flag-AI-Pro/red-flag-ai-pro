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

      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Witness network</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Chains proving each other, <span style={{ fontStyle: "italic", color: "#E5484D" }}>visibly</span>.
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
            Every anchor below is a moment where one independent chain sealed a claim from another. Not a diagram of the idea, the actual thing happening, checkable by anyone.
          </p>
        </div>
      </section>

      <section style={{ padding: "3rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ background: "#102943", border: "1px solid rgba(229,72,77,0.2)", borderRadius: "12px", padding: "1.75rem", marginBottom: "1.5rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.75rem" }}>
              Our chain right now
            </p>
            {tip ? (
              <>
                <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "#F4F1EA", marginBottom: "0.4rem" }}>{tip.chain}</p>
                <p style={{ ...mono, fontSize: "0.82rem", color: "rgba(244,241,234,0.6)", marginBottom: "0.3rem" }}>tip: {shortHash(tip.tip)}</p>
                <p style={{ ...syne, fontSize: "0.82rem", color: "rgba(244,241,234,0.4)" }}>{tip.count} entries sealed</p>
              </>
            ) : (
              <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.4)" }}>Loading…</p>
            )}
          </div>

          <button
            onClick={handlePush}
            disabled={push.state === "sending"}
            style={{
              width: "100%", ...syne, fontSize: "15px", fontWeight: 700, padding: "16px 24px",
              borderRadius: "10px", background: push.state === "sending" ? "rgba(229,72,77,0.5)" : "#E5484D",
              color: "white", border: "none", cursor: push.state === "sending" ? "default" : "pointer",
            }}
          >
            {push.state === "sending" ? "Anchoring…" : "Anchor to the next chain now"}
          </button>
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
