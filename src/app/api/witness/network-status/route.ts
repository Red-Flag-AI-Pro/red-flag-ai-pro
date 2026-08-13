import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { WITNESS_CHAIN_USER_ID, APPROVED_PEERS } from "@/lib/witness";

export const revalidate = 300;

// Built 13 Aug 2026 after Michael Ross (NexusTrinity) audited the public
// page before agreeing to peer with it, and found the exact gap an honest
// network can't afford: "rewriting history would need every peer to move in
// lockstep" is a collusion resistance claim, and it means nothing without a
// stated N, a threshold, and a way for a third party to confirm the
// threshold was met rather than take the page's word. This route is the
// answer. It computes what is actually provable from this side of the wire
// and labels everything it can't prove.
//
// Definitions, deliberately conservative:
// - A peer is LIVE when this chain successfully pushed its tip to them and
//   they accepted it (HTTP 2xx, receipt stored) within the published stale
//   threshold of 72 hours (three missed daily heartbeats -- the same figure
//   already published on the peer agreement page, not a new number).
// - Inbound anchors are counted separately and labeled self-declared: the
//   receiving endpoint is unauthenticated by design, so "peer X pushed to
//   us" is a claim by whoever said they were X, not a verified identity.
// - Below three live peers the network's own strength label is WEAK. One
//   peer proves the mechanism runs; it does not prove collusion resistance,
//   and this route refuses to imply otherwise.

const STALE_HOURS = 72;
const WEAK_BELOW = 3;

export async function GET() {
  const supabase = await createServiceClient();
  const since = new Date(Date.now() - STALE_HOURS * 3_600_000).toISOString();

  const [{ data: sent }, { data: received }] = await Promise.all([
    supabase
      .from("audit_log")
      .select("id, details, created_at")
      .eq("user_id", WITNESS_CHAIN_USER_ID)
      .eq("action", "witness.anchor_sent")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("audit_log")
      .select("details, created_at")
      .eq("user_id", WITNESS_CHAIN_USER_ID)
      .eq("action", "witness.anchor_received")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const peers = APPROVED_PEERS.map((peer) => {
    const lastAccepted = (sent ?? []).find(
      (e) => ((e.details ?? {}) as Record<string, unknown>).peer_chain === peer.name
    );
    const details = (lastAccepted?.details ?? {}) as Record<string, unknown>;
    const hoursSince = lastAccepted
      ? (Date.now() - new Date(lastAccepted.created_at).getTime()) / 3_600_000
      : null;
    return {
      name: peer.name,
      live: hoursSince !== null && hoursSince < STALE_HOURS,
      lastAcceptedAnchorAt: lastAccepted?.created_at ?? null,
      hoursSinceLastAccepted: hoursSince !== null ? Math.round(hoursSince * 10) / 10 : null,
      // The peer's own acknowledgment of our tip, verbatim as stored at the
      // moment they accepted it. This is the artifact a third party compares
      // against the peer's public chain -- without it, "they sealed our tip"
      // is our word alone.
      lastSentTip: (details.sent_tip as string) ?? null,
      lastPeerResponse: (details.peer_response as string) ?? null,
      lastAnchorVerify: lastAccepted ? `https://www.redflagaipro.com/verify?id=${lastAccepted.id}` : null,
    };
  });

  const livePeerCount = peers.filter((p) => p.live).length;

  const inboundChains = new Set(
    (received ?? [])
      .map((e) => ((e.details ?? {}) as Record<string, unknown>).peer_chain as string)
      .filter(Boolean)
  );

  return NextResponse.json({
    configuredPeerCount: APPROVED_PEERS.length,
    livePeerCount,
    staleThresholdHours: STALE_HOURS,
    weakBelow: WEAK_BELOW,
    strength: livePeerCount >= WEAK_BELOW ? "live" : "weak",
    peers,
    // Distinct chains that pushed a tip to us inside the window. Labeled
    // self-declared because the endpoint is open by design.
    selfDeclaredInboundCount: inboundChains.size,
    selfDeclaredInboundChains: Array.from(inboundChains),
  });
}
