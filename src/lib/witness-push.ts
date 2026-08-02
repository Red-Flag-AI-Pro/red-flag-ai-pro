import { createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { WITNESS_CHAIN_NAME, WITNESS_CHAIN_USER_ID } from "@/lib/witness";

const GENESIS_HASH = "0".repeat(64);

// Justin's AILeash / sebbi.pro receiving endpoint. His own /x/witness/tip
// response says to hand peers their tip at /observe, not the base path.
export const PEER_WITNESS_URL = "https://sebbi.pro/x/witness/observe";

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
  error?: string;
  peerResponse?: string;
  verify?: string | null;
};

// Reads our own current tip, pushes it to the peer chain so they can seal it,
// and — only on a confirmed accept — seals our own record that we sent it.
// A failed push seals nothing, so the log never claims more than happened.
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

  let peerResponseText = "";
  let peerStatus = 0;
  try {
    const res = await fetch(PEER_WITNESS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sent),
      signal: AbortSignal.timeout(15000),
    });
    peerStatus = res.status;
    peerResponseText = await res.text();
  } catch (err) {
    return {
      ok: false,
      sent,
      error: `Could not reach ${PEER_WITNESS_URL}: ${err instanceof Error ? err.message : "unknown error"}`,
    };
  }

  if (peerStatus < 200 || peerStatus >= 300) {
    return {
      ok: false,
      sent,
      error: `Peer responded with status ${peerStatus}.`,
      peerResponse: peerResponseText.slice(0, 500),
    };
  }

  const entryId = await logAuditEvent(
    WITNESS_CHAIN_USER_ID,
    "witness.anchor_sent",
    {
      peer_chain: "sebbi.pro / AILeash",
      peer_url: PEER_WITNESS_URL,
      sent_tip: sent.tip,
      sent_count: sent.count,
      trigger,
      peer_response: peerResponseText.slice(0, 500),
    },
    { timestamp: true }
  );

  return {
    ok: true,
    sent,
    verify: entryId ? `https://www.redflagaipro.com/verify?id=${entryId}` : null,
  };
}
