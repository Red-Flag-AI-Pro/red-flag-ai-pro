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
  | { state: "ok"; verify: string | null; failedPeers: string[] }
  | { state: "error"; message: string };

// Shape of /api/witness/network-status — the honest strength read. Added 13
// Aug 2026 after Michael Ross audited this page before agreeing to peer with
// it and asked the two questions it couldn't answer: what N is the network
// targeting, and how does a third party confirm the threshold was met rather
// than take the page's word.
interface NetworkStatus {
  configuredPeerCount: number;
  livePeerCount: number;
  staleThresholdHours: number;
  weakBelow: number;
  strength: "live" | "weak";
  peers: {
    name: string;
    live: boolean;
    lastAcceptedAnchorAt: string | null;
    hoursSinceLastAccepted: number | null;
    lastSentTip: string | null;
    lastPeerResponse: string | null;
    lastAnchorVerify: string | null;
  }[];
  selfDeclaredInboundCount: number;
  selfDeclaredInboundChains: string[];
}

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
  const [status, setStatus] = useState<NetworkStatus | null>(null);
  const [push, setPush] = useState<PushState>({ state: "idle" });

  async function loadState() {
    const [tipRes, logRes, statusRes] = await Promise.all([
      fetch("/api/witness/tip").then((r) => r.json()),
      fetch("/api/witness/log").then((r) => r.json()),
      fetch("/api/witness/network-status").then((r) => r.json()),
    ]);
    setTip(tipRes);
    setLog(logRes.entries ?? []);
    setStatus(statusRes);
  }

  useEffect(() => {
    loadState();
    // Genuinely live, not a one-time fetch: the whole point of a public
    // ledger is that it keeps proving itself without anyone refreshing the
    // page. Matches the anchor cadence rather than polling faster than
    // anything could actually change.
    const interval = setInterval(loadState, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Previously computed as 1 + distinct peer names in the last 25 log rows,
  // which counted self-declared inbound claims as witnessing chains and
  // silently shrank as the window rolled. Replaced 13 Aug 2026 with the
  // server-computed live count: peers this chain successfully pushed to,
  // and who accepted, inside the published 72 hour stale threshold.
  const livePeerCount = status?.livePeerCount ?? null;

  async function handlePush() {
    setPush({ state: "sending" });
    try {
      const res = await fetch("/api/witness/push", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        const failedPeers = ((data.results ?? []) as { peer: string; ok: boolean }[])
          .filter((r) => !r.ok)
          .map((r) => r.peer);
        setPush({ state: "ok", verify: data.verify, failedPeers });
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
            Built so two independent companies can seal each other's evidence, live, in public. Not a diagram of the idea, the actual mechanism, running below, with the real log of what has and has not landed yet.
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
              <p style={{ ...syne, fontSize: "1.7rem", fontWeight: 800, color: "#F4F1EA", marginBottom: "0.3rem" }}>{livePeerCount ?? "—"}</p>
              <p style={{ ...syne, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(244,241,234,0.4)" }}>Live peers (72h)</p>
            </div>
            <div style={{ background: "#0D1B2E", padding: "1.5rem 1rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "1.7rem", fontWeight: 800, color: "#F4F1EA", marginBottom: "0.3rem" }}>{log.length > 0 ? relativeTime(log[0].createdAt) : "—"}</p>
              <p style={{ ...syne, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(244,241,234,0.4)" }}>Last anchor</p>
            </div>
          </div>

          {status && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${status.strength === "live" ? "rgba(74,222,128,0.3)" : "rgba(251,191,36,0.35)"}`, borderRadius: "12px", padding: "1.5rem 1.75rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>
                  Network strength
                </p>
                <span style={{
                  ...syne, fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: status.strength === "live" ? "#4ade80" : "#fbbf24",
                  border: `1px solid ${status.strength === "live" ? "rgba(74,222,128,0.4)" : "rgba(251,191,36,0.4)"}`,
                  borderRadius: "4px", padding: "2px 8px",
                }}>
                  {status.strength === "live" ? "Live" : "Weak"}
                </span>
              </div>
              <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.6)", lineHeight: 1.7, marginBottom: "0.9rem" }}>
                {status.livePeerCount} of {status.configuredPeerCount} configured peer{status.configuredPeerCount === 1 ? "" : "s"} accepted an anchor inside the published {status.staleThresholdHours} hour stale threshold. Below {status.weakBelow} live peers this network labels itself weak: the mechanism is running, but collusion resistance scales with independent peers, and a small N is stated here rather than implied away. What one peer proves is that the mechanism works. What {status.weakBelow}+ prove is that rewriting history needs everyone to move together.
              </p>
              {status.peers.map((p) => (
                <div key={p.name} style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "0.75rem", marginBottom: "0.5rem" }}>
                  <p style={{ ...syne, fontSize: "0.85rem", fontWeight: 700, color: "#F4F1EA", marginBottom: "0.2rem" }}>
                    {p.name} — <span style={{ color: p.live ? "#4ade80" : "#fbbf24" }}>{p.live ? "live" : "stale"}</span>
                    {p.hoursSinceLastAccepted !== null ? ` · last accepted anchor ${p.hoursSinceLastAccepted}h ago` : " · no accepted anchor yet"}
                  </p>
                  {p.lastSentTip && (
                    <p style={{ ...mono, fontSize: "0.72rem", color: "rgba(244,241,234,0.45)", marginBottom: "0.2rem" }}>
                      tip sent: {shortHash(p.lastSentTip)}
                    </p>
                  )}
                  {p.lastPeerResponse && (
                    <p style={{ ...mono, fontSize: "0.72rem", color: "rgba(244,241,234,0.45)", whiteSpace: "pre-wrap", overflowWrap: "anywhere", marginBottom: "0.2rem" }}>
                      their receipt: {p.lastPeerResponse.slice(0, 220)}
                    </p>
                  )}
                  {p.lastAnchorVerify && (
                    <a href={p.lastAnchorVerify} style={{ ...syne, fontSize: "0.75rem", color: "#E5484D", fontWeight: 700, textDecoration: "none" }}>
                      Sealed record of this exchange →
                    </a>
                  )}
                </div>
              ))}
              {status.selfDeclaredInboundCount > 0 && (
                <p style={{ ...syne, fontSize: "0.78rem", color: "rgba(244,241,234,0.45)", lineHeight: 1.6, marginTop: "0.5rem" }}>
                  Inbound anchors received in the same window: {status.selfDeclaredInboundCount} chain{status.selfDeclaredInboundCount === 1 ? "" : "s"} ({status.selfDeclaredInboundChains.join(", ")}). Counted separately because the receiving endpoint is open by design, so these names are self declared by the sender, not verified identities.
                </p>
              )}
              <p style={{ ...syne, fontSize: "0.78rem", color: "rgba(244,241,234,0.45)", lineHeight: 1.6, marginTop: "0.75rem", paddingLeft: "0.9rem", borderLeft: "2px solid rgba(255,255,255,0.15)" }}>
                Check this yourself, without trusting this page: fetch our current tip from /api/witness/tip, compare it to the tip in the sealed exchange record above, then check the peer&apos;s own public chain for their sealed copy. Every number in this panel is computed from records you can open.
              </p>
            </div>
          )}

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
              {push.failedPeers.length > 0 && (
                <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.45)", marginTop: "0.6rem" }}>
                  Not reached: {push.failedPeers.join(", ")}
                </p>
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 0 3px rgba(74,222,128,0.15)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D" }}>
              Every anchor, in order — live
            </p>
          </div>
          <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, marginBottom: "1.5rem", paddingLeft: "0.9rem", borderLeft: "2px solid rgba(229,72,77,0.4)" }}>
            Appearing here means another company holds a sealed copy of that record, and that it has not changed since. It is not an endorsement, an audit, or a claim that anything inside that record is true. We do not vet the companies we witness, and we could not honestly claim to. That is the point: a witness with an opinion about you is not much of a witness.
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

      <section style={{ padding: "3rem 1.5rem 5rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>
            Want to try to break a seal yourself?
          </p>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Type anything, seal it, edit it, watch the fingerprint stop matching, live, in your browser. It sits alongside the full record structure on the boundary authorization records page.
          </p>
          <a href="/boundary-authorization-records" style={{ ...syne, fontSize: "0.95rem", fontWeight: 700, color: "#E5484D", textDecoration: "underline" }}>
            Try to break it →
          </a>
        </div>
      </section>

      <section style={{ padding: "3rem 1.5rem 6rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.5rem", textAlign: "center" }}>
            Explore further
          </p>
          <h2 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "2.5rem", textAlign: "center" }}>
            Everything this page links out to, in one place
          </h2>

          {(() => {
            const GROUPS: { label: string; links: { href: string; title: string; blurb: string }[] }[] = [
              {
                label: "The standard",
                links: [
                  { href: "/witness-standard/peer-agreement", title: "Peer Agreement", blurb: "The terms two companies agree to before sealing each other's records." },
                  { href: "/witness-standard/founding-chains", title: "Founding Chain Terms", blurb: "What the first chains on the network get, and what's expected of them." },
                  { href: "/witness-standard/proofs", title: "Proofs", blurb: "Completeness, absence, reproducibility, reconciliation, worked through." },
                  { href: "/witness-network/badge", title: "The Witness Badge", blurb: "What it means when you see it, and how to earn one honestly." },
                  { href: "/verify", title: "Verify a Record", blurb: "Paste a hash, check it against the chain yourself, no login needed." },
                ],
              },
              {
                label: "Getting witnessed",
                links: [
                  { href: "/installations", title: "Installations & Custom Work", blurb: "One time engagements: hosted witnessing, your own node, and other work priced separately from the standing plans." },
                  { href: "/witness-network/hosting", title: "Hosted Witnessing", blurb: "We install it, host it, hand you a dashboard." },
                  { href: "/witness-network/install", title: "Install Your Own Node", blurb: "The package runs on your infrastructure, not ours." },
                ],
              },
              {
                label: "The wider mechanism",
                links: [
                  { href: "/real-time-gate", title: "Real Time Gate", blurb: "A synchronous allow or block decision, checked before content goes live." },
                  { href: "/ruleset-integrity", title: "Ruleset Integrity", blurb: "Proving which version of the rules governed a given decision." },
                  { href: "/who-when-whether", title: "Who, When, Whether", blurb: "The governance side framework this whole approach is built on." },
                  { href: "/what-where-whether", title: "What, Where, Whether", blurb: "The compliance side counterpart, for marketing copy and claims." },
                ],
              },
            ];
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {GROUPS.map((group) => (
                  <div key={group.label}>
                    <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,241,234,0.35)", marginBottom: "1rem" }}>
                      {group.label}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                      {group.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          style={{
                            display: "block", textDecoration: "none", padding: "1.25rem",
                            borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.02)",
                          }}
                        >
                          <p style={{ ...syne, fontSize: "0.95rem", fontWeight: 700, color: "#F4F1EA", marginBottom: "0.4rem" }}>{link.title} →</p>
                          <p style={{ ...syne, fontSize: "0.8rem", color: "rgba(244,241,234,0.5)", lineHeight: 1.6 }}>{link.blurb}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      <Footer />
    </div>
  );
}
