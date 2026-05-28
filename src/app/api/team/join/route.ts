import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("organisation_id")
    .eq("user_id", user.id)
    .single();

  if (profile?.organisation_id) {
    return NextResponse.json({ error: "You are already part of an organisation." }, { status: 400 });
  }

  const body = await request.json();
  const invite_code: string = body.invite_code?.trim().toUpperCase();

  if (!invite_code) {
    return NextResponse.json({ error: "Invite code is required." }, { status: 400 });
  }

  // Find organisation by invite code
  const { data: org } = await supabase
    .from("organisations")
    .select("id, name, owner_id")
    .eq("invite_code", invite_code)
    .single();

  if (!org) {
    return NextResponse.json({ error: "Invalid invite code. Please check with your team admin." }, { status: 404 });
  }

  // Don't allow owner to join their own org via invite code
  if (org.owner_id === user.id) {
    return NextResponse.json({ error: "You are already the owner of this organisation." }, { status: 400 });
  }

  // Join the organisation
  await supabase
    .from("profiles")
    .update({ organisation_id: org.id })
    .eq("user_id", user.id);

  return NextResponse.json({ organisation: { id: org.id, name: org.name } });
}
