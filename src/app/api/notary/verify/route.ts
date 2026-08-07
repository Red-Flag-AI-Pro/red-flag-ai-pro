import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const SHA256_HEX = /^[a-f0-9]{64}$/i;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(`notary_verify:${clientIp(request)}`, 20, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  const body = await request.json();
  const id: string = (body.id ?? "").trim();
  const hash: string = (body.hash ?? "").trim().toLowerCase();

  if (!UUID_RE.test(id) || !SHA256_HEX.test(hash)) {
    return NextResponse.json({ error: "Invalid seal ID or hash." }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { data: seal } = await supabase
    .from("notary_seals")
    .select("content_hash, created_at, ts_time, ts_tsa")
    .eq("id", id)
    .maybeSingle();

  if (!seal) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    matches: seal.content_hash === hash,
    sealed_at: seal.created_at,
    tsa: seal.ts_tsa,
    tsa_time: seal.ts_time,
  });
}
