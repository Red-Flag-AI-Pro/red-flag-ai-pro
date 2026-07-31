import { NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit-log";
import { parseWitnessPayload, WITNESS_CHAIN_USER_ID } from "@/lib/witness";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// Public, unauthenticated by design. A witness network only works if
// anyone can anchor to it without asking permission first — the record
// this creates only ever claims "we received and sealed this tip from
// this peer at this time," never that the peer's own chain is truthful.
// That is the peer's own business to prove, on their own chain.
//
// Open to anyone also means open to abuse, so it's rate limited per IP:
// 10 anchors a minute is far more than any legitimate peer needs, since
// a tip only changes when a real entry gets sealed.
export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(`witness_anchor:${clientIp(request)}`, 10, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many anchors from this address. Try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const payload = parseWitnessPayload(body);
  if (!payload) {
    return NextResponse.json(
      { error: "Expected chain (string), tip (string), count (number), ts (string), url (optional string)." },
      { status: 400 }
    );
  }

  const entryId = await logAuditEvent(
    WITNESS_CHAIN_USER_ID,
    "witness.anchor_received",
    {
      peer_chain: payload.chain,
      peer_tip: payload.tip,
      peer_count: payload.count,
      peer_ts: payload.ts,
      peer_url: payload.url ?? null,
    },
    { timestamp: true }
  );

  if (!entryId) {
    return NextResponse.json({ error: "Could not seal the anchor. Try again." }, { status: 502 });
  }

  return NextResponse.json({
    sealed: true,
    verify: `https://www.redflagaipro.com/verify?id=${entryId}`,
  });
}
