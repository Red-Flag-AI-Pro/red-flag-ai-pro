import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { WITNESS_CHAIN_NAME, WITNESS_CHAIN_USER_ID } from "@/lib/witness";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const GENESIS_HASH = "0".repeat(64);

// Justin's AILeash / sebbi.pro receiving endpoint. His own /x/witness/tip
// response says to hand peers their tip at /observe, not the base path.
const PEER_WITNESS_URL = "https://sebbi.pro/x/witness/observe";

// Triggered by the button on /witness-network. Reads our own current tip,
// pushes it to the peer chain so they can seal it, and — only on a
// confirmed send — seals our own record that we sent it. A failed push
// seals nothing, so the log never claims more than actually happened.
export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(`witness_push:${clientIp(request)}`, 5, 60);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Wait a minute and try again." }, { status: 429 });
  }

  const supabase = await createServiceClient();

  const { data: last, count } = await supabase
    .from("audit_log")
    .select("hash", { count: "exact" })
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const outPayload = {
    chain: WITNESS_CHAIN_NAME,
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
      body: JSON.stringify(outPayload),
      signal: AbortSignal.timeout(15000),
    });
    peerStatus = res.status;
    peerResponseText = await res.text();
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        sent: outPayload,
        error: `Could not reach ${PEER_WITNESS_URL}: ${err instanceof Error ? err.message : "unknown error"}`,
      },
      { status: 502 }
    );
  }

  if (peerStatus < 200 || peerStatus >= 300) {
    return NextResponse.json(
      {
        ok: false,
        sent: outPayload,
        error: `Peer responded with status ${peerStatus}.`,
        peerResponse: peerResponseText.slice(0, 500),
      },
      { status: 502 }
    );
  }

  const entryId = await logAuditEvent(
    WITNESS_CHAIN_USER_ID,
    "witness.anchor_sent",
    {
      peer_chain: "sebbi.pro / AILeash",
      peer_url: PEER_WITNESS_URL,
      sent_tip: outPayload.tip,
      sent_count: outPayload.count,
      peer_response: peerResponseText.slice(0, 500),
    },
    { timestamp: true }
  );

  return NextResponse.json({
    ok: true,
    sent: outPayload,
    verify: entryId ? `https://www.redflagaipro.com/verify?id=${entryId}` : null,
  });
}
