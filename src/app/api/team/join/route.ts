import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// Used to grant organisation membership the instant a valid code came in.
// Now it only files a request — the owner has to approve it from /team
// before organisation_id is ever set. See /api/team/requests/decide.
export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(`team_join:${clientIp(request)}`, 10, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

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

  const { data: org } = await supabase
    .from("organisations")
    .select("id, name, owner_id")
    .eq("invite_code", invite_code)
    .single();

  if (!org) {
    return NextResponse.json({ error: "Invalid invite code. Please check with your team admin." }, { status: 404 });
  }

  if (org.owner_id === user.id) {
    return NextResponse.json({ error: "You are already the owner of this organisation." }, { status: 400 });
  }

  const { data: existingRequest } = await supabase
    .from("team_join_requests")
    .select("id, status")
    .eq("organisation_id", org.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingRequest?.status === "pending") {
    return NextResponse.json({ error: "You already have a pending request to join this organisation." }, { status: 400 });
  }

  // A prior denial gets overwritten by a fresh pending request rather than
  // permanently blocking a retry — the unique (organisation_id, user_id)
  // constraint means this has to be an upsert, not a plain insert.
  const { error: upsertError } = await supabase
    .from("team_join_requests")
    .upsert(
      { organisation_id: org.id, user_id: user.id, status: "pending", requested_at: new Date().toISOString(), decided_at: null },
      { onConflict: "organisation_id,user_id" }
    );

  if (upsertError) {
    return NextResponse.json({ error: "Could not file the join request." }, { status: 500 });
  }

  return NextResponse.json({ requested: true, organisation: { id: org.id, name: org.name } });
}
