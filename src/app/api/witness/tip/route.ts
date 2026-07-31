import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { WITNESS_CHAIN_NAME, WITNESS_CHAIN_USER_ID } from "@/lib/witness";

const GENESIS_HASH = "0".repeat(64);

// Public, unauthenticated by design — this is the whole point of a witness
// network. Anyone, including a peer chain like sebbi.pro/AILeash, can pull
// our current tip and seal it into their own independent chain without
// asking us for anything first.
export async function GET() {
  const supabase = await createServiceClient();

  const { data: last, count } = await supabase
    .from("audit_log")
    .select("hash", { count: "exact" })
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    chain: WITNESS_CHAIN_NAME,
    tip: last?.hash ?? GENESIS_HASH,
    count: count ?? 0,
    ts: new Date().toISOString(),
    url: "https://www.redflagaipro.com/api/witness/tip",
  });
}
