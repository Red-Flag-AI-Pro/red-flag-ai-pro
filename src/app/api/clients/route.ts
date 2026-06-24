import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("clients")
    .select("id, name, website, notes, created_at")
    .eq("user_id", user.id)
    .order("name");

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  if (plan === "free" || plan === "scanner") {
    return NextResponse.json(
      { error: "Client workspaces are available on Growth and Sentinel plans." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const name: string = (body.name ?? "").trim();
  const website: string = (body.website ?? "").trim();
  const notes: string = (body.notes ?? "").trim();
  const contact_email: string = (body.contact_email ?? "").trim();

  if (!name) return NextResponse.json({ error: "Client name is required." }, { status: 400 });

  const { data, error } = await supabase
    .from("clients")
    .insert({ user_id: user.id, name, website: website || null, notes: notes || null, contact_email: contact_email || null })
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: "Failed to create client." }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  await supabase.from("clients").delete().eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}
