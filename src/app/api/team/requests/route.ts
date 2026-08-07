import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Owner-only: the pending join requests for their own organisation, so
// TeamManager has something to show and act on.
export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("organisation_id")
    .eq("user_id", user.id)
    .single();

  if (!profile?.organisation_id) {
    return NextResponse.json({ requests: [] });
  }

  const { data: org } = await supabase
    .from("organisations")
    .select("owner_id")
    .eq("id", profile.organisation_id)
    .single();

  if (org?.owner_id !== user.id) {
    return NextResponse.json({ requests: [] });
  }

  const { data: requests } = await supabase
    .from("team_join_requests")
    .select("id, user_id, requested_at")
    .eq("organisation_id", profile.organisation_id)
    .eq("status", "pending")
    .order("requested_at", { ascending: true });

  if (!requests || requests.length === 0) {
    return NextResponse.json({ requests: [] });
  }

  const { data: requesterProfiles } = await supabase
    .from("profiles")
    .select("user_id, full_name")
    .in("user_id", requests.map((r) => r.user_id));

  const nameByUserId = new Map((requesterProfiles ?? []).map((p) => [p.user_id, p.full_name]));

  return NextResponse.json({
    requests: requests.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      full_name: nameByUserId.get(r.user_id) ?? null,
      requested_at: r.requested_at,
    })),
  });
}
