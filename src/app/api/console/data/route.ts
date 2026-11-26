import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/console";

export const dynamic = "force-dynamic";

// Everything the console needs in one read: prospects, their recent history,
// and website requests still waiting for a reply. Admin only.
export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const [prospects, activity, requests] = await Promise.all([
    supabase.from("prospects").select("*").order("next_action_at", { ascending: true, nullsFirst: false }).limit(1000),
    supabase.from("prospect_activity").select("*").order("created_at", { ascending: false }).limit(500),
    supabase
      .from("lead_requests")
      .select("id, kind, email, name, company, website, message, created_at")
      .is("handled_at", null)
      .order("created_at", { ascending: true })
      .limit(200),
  ]);

  const failed = prospects.error || activity.error || requests.error;
  if (failed) {
    console.error("console data failed:", failed.message);
    return NextResponse.json({ error: failed.message }, { status: 500 });
  }

  return NextResponse.json({
    prospects: prospects.data ?? [],
    activity: activity.data ?? [],
    requests: requests.data ?? [],
  });
}
