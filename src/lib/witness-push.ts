import { createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { WITNESS_CHAIN_NAME, WITNESS_CHAIN_USER_ID, APPROVED_PEERS } from "@/lib/witness";

const GENESIS_HASH = "0".repeat(64);

export type PeerPushResult = {
  peer: string;
  url: string;
  ok: boolean;
  error?: string;
  peerResponse?: string;
  verify?: string | null;
};

export type WitnessPushResult = {
  ok: boolean;
  sent: {
    chain: string;
    peer: string;
    tip: string;
    count: number;
    ts: string;
    url: string;
  };
  results: PeerPushResult[];
  // Kept for callers still reading the single-peer shape this had before
  // the approved peer list — mirrors the first result so nothing that reads
  // .error/.verify/.peerResponse off the top level breaks.
  error?: string;
  peerResponse?: string;
  verify?: string | null;
};

// Reads our own current tip, pushes it to every approved peer chain so each
// can seal it, and — only on a confirmed accept from that specific peer —
// seals our own record that we sent it there. A failed push to one peer
// seals nothing for that peer, so the log never claims more than happened,
// and one peer being down doesn't stop the others from being reached.
// Shared by the button on /witness-network and the hourly cron, so the two
// can never drift apart.
export async function performWitnessPush(trigger: "manual" | "cron"): Promise<WitnessPushResult> {
  const supabase = await createServiceClient();

  const { data: last, count } = await supabase
    .from("audit_log")
    .select("hash", { count: "exact" })
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sent = {
    // "chain" is the field name in the published Open Witness Standard.
    // sebbi.pro's /observe route requires "peer" instead and rejects the
    // spec shape with a 400, so send both until that is reconciled.
    chain: WITNESS_CHAIN_NAME,
    peer: WITNESS_CHAIN_NAME,
    tip: last?.hash ?? GENESIS_HASH,
    count: count ?? 0,
    ts: new Date().toISOString(),
    url: "https://www.redflagaipro.com/api/witness/tip",
  };

  const results: PeerPushResult[] = [];

  for (const approvedPeer of APPROVED_PEERS) {
    let peerResponseText = "";
    let peerStatus = 0;
    try {
      const res = await fetch(approvedPeer.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sent),
        signal: AbortSignal.timeout(15000),
      });
      peerStatus = res.status;
      peerResponseText = await res.text();
    } catch (err) {
      results.push({
        peer: approvedPeer.name,
        url: approvedPeer.url,
        ok: false,
        error: `Could not reach ${approvedPeer.url}: ${err instanceof Error ? err.message : "unknown error"}`,
      });
      continue;
    }

    if (peerStatus < 200 || peerStatus >= 300) {
      results.push({
        peer: approvedPeer.name,
        url: approvedPeer.url,
        ok: false,
        error: `Peer responded with status ${peerStatus}.`,
        peerResponse: peerResponseText.slice(0, 500),
      });
      continue;
    }

    const entryId = await logAuditEvent(
      WITNESS_CHAIN_USER_ID,
      "witness.anchor_sent",
      {
        peer_chain: approvedPeer.name,
        peer_url: approvedPeer.url,
        sent_tip: sent.tip,
        sent_count: sent.count,
        trigger,
        peer_response: peerResponseText.slice(0, 500),
      },
      { timestamp: true }
    );

    results.push({
      peer: approvedPeer.name,
      url: approvedPeer.url,
      ok: true,
      verify: entryId ? `https://www.redflagaipro.com/verify?id=${entryId}` : null,
    });
  }

  const first = results[0];

  return {
    // At least one peer accepting the anchor counts as the push having
    // worked — one peer being down shouldn't read as a total failure when
    // others were reachable.
    ok: results.some((r) => r.ok),
    sent,
    results,
    error: first?.error,
    peerResponse: first?.peerResponse,
    verify: first?.verify,
  };
}
