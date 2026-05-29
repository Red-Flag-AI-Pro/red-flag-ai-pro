import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createHash } from "crypto";

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const rawKey = authHeader.replace("Bearer ", "").trim();

  if (!rawKey.startsWith("rfp_")) {
    return NextResponse.json({ error: "Invalid API key." }, { status: 401 });
  }

  const supabase = await createClient();
  const keyHash = hashKey(rawKey);

  const { data: apiKey } = await supabase
    .from("api_keys")
    .select("user_id")
    .eq("key_hash", keyHash)
    .single();

  if (!apiKey) return NextResponse.json({ error: "Invalid API key." }, { status: 401 });

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 100);
  const offset = parseInt(url.searchParams.get("offset") ?? "0");

  const { data: scans, count } = await supabase
    .from("scans")
    .select("id, title, score, status, created_at", { count: "exact" })
    .eq("user_id", apiKey.user_id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return NextResponse.json({
    scans: scans ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
}
