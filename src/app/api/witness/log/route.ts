import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { WITNESS_CHAIN_USER_ID } from "@/lib/witness";

// Public, unauthenticated, deliberately narrow: only the two witness
// actions on the one fixed company chain, never a general audit_log query.
// This is what makes the network seeable, not just individually checkable.
export async function GET() {
  const supabase = await createServiceClient();

  const { data: entries } = await supabase
    .from("audit_log")
    .select("id, action, details, created_at, ts_time, ts_tsa")
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .in("action", ["witness.anchor_received", "witness.anchor_sent"])
    .order("created_at", { ascending: false })
    .limit(25);

  const rows = (entries ?? []).map((e) => {
    const details = (e.details ?? {}) as Record<string, unknown>;
    return {
      id: e.id,
      direction: e.action === "witness.anchor_received" ? "received" : "sent",
      peerChain: (details.peer_chain as string) ?? null,
      createdAt: e.created_at,
      timestamped: Boolean(e.ts_time),
      timestampAuthority: (e.ts_tsa as string) ?? null,
      verify: `https://www.redflagaipro.com/verify?id=${e.id}`,
    };
  });

  return NextResponse.json({ entries: rows });
}
