import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requestTimestamp } from "@/lib/audit-timestamp";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const SHA256_HEX = /^[a-f0-9]{64}$/i;

// The server never receives plaintext — the visitor's browser hashes the
// content with Web Crypto before this request is made. That means this
// route (and the database row it writes) cannot leak what was sealed even
// if compromised, which matters most for the Payment Notary use case.
export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(`notary_seal:${clientIp(request)}`, 20, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  const body = await request.json();
  const hash: string = (body.hash ?? "").trim().toLowerCase();
  const label: string = (body.label ?? "").trim().slice(0, 200);

  if (!SHA256_HEX.test(hash)) {
    return NextResponse.json({ error: "Invalid hash." }, { status: 400 });
  }

  const ts = await requestTimestamp(hash);
  const supabase = await createServiceClient();

  const { data: seal, error } = await supabase
    .from("notary_seals")
    .insert({
      content_hash: hash,
      label: label || null,
      ts_token: ts?.token ?? null,
      ts_time: ts?.time ?? null,
      ts_tsa: ts?.tsa ?? null,
    })
    .select("id, created_at, ts_time, ts_tsa")
    .single();

  if (error || !seal) {
    return NextResponse.json({ error: "Could not create seal." }, { status: 500 });
  }

  return NextResponse.json({
    id: seal.id,
    sealed_at: seal.created_at,
    tsa: seal.ts_tsa,
    tsa_time: seal.ts_time,
  });
}
