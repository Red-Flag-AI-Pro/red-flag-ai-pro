import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createHash, randomBytes } from "crypto";

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, created_at, last_used_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { count } = await supabase
    .from("api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "Maximum 5 API keys allowed. Delete one to create another." }, { status: 400 });
  }

  const body = await request.json();
  const name: string = (body.name ?? "").trim() || "My API Key";

  const rawKey = "rfp_" + randomBytes(24).toString("hex");
  const keyHash = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, 12) + "…";

  const { data, error } = await supabase
    .from("api_keys")
    .insert({ user_id: user.id, name, key_hash: keyHash, key_prefix: keyPrefix })
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: "Failed to create key." }, { status: 500 });

  // Return the full key once — never stored
  return NextResponse.json({ ...data, raw_key: rawKey }, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  await supabase.from("api_keys").delete().eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}
