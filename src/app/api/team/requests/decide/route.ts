import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// Owner-only. Approving is the one place organisation_id actually gets set
// on the requester's profile — the whole point of this change is that a
// valid invite code alone no longer does that.
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const requestId: string = body.request_id;
  const approve: boolean = body.approve === true;

  if (!requestId) {
    return NextResponse.json({ error: "request_id is required." }, { status: 400 });
  }

  const { data: joinRequest } = await supabase
    .from("team_join_requests")
    .select("id, organisation_id, user_id, status")
    .eq("id", requestId)
    .single();

  if (!joinRequest) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  const { data: org } = await supabase
    .from("organisations")
    .select("owner_id")
    .eq("id", joinRequest.organisation_id)
    .single();

  if (org?.owner_id !== user.id) {
    return NextResponse.json({ error: "Only the organisation owner can decide join requests." }, { status: 403 });
  }

  if (joinRequest.status !== "pending") {
    return NextResponse.json({ error: "This request has already been decided." }, { status: 400 });
  }

  // Service client for the second write: setting organisation_id on another
  // user's profile is a legitimate owner action but not something the
  // requester's own session client is allowed to do to itself via RLS.
  const service = await createServiceClient();

  await supabase
    .from("team_join_requests")
    .update({ status: approve ? "approved" : "denied", decided_at: new Date().toISOString() })
    .eq("id", requestId);

  if (approve) {
    await service
      .from("profiles")
      .update({ organisation_id: joinRequest.organisation_id })
      .eq("user_id", joinRequest.user_id);
  }

  return NextResponse.json({ ok: true, approved: approve });
}
