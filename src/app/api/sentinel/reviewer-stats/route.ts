import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Divergence rate: of everything this user has signed off, how often did
// they actually push back on the flag (not_applicable) rather than just
// accept it. A reviewer who never diverges is producing exactly the
// clean-looking, unexamined record the sentence-vs-gate limit warns about.
//
// Time to sign off: the gap between committing an initial read (before the
// AI's reasoning is shown) and the final disposition. Only flags that went
// through commit-before-reveal carry both timestamps, so this is the actual
// deliberation time, not just "time since the scan ran."
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  if (profile?.plan !== "sentinel") {
    return NextResponse.json({ error: "Reviewer stats require a Sentinel plan." }, { status: 403 });
  }

  const { data: rows, error } = await supabase
    .from("scan_flags")
    .select("disposition, initial_read_at, reviewed_at, scans!inner(user_id)")
    .eq("scans.user_id", user.id)
    .not("disposition", "is", null);

  if (error) {
    return NextResponse.json({ error: "Failed to load reviewer stats." }, { status: 500 });
  }

  const total = rows?.length ?? 0;
  const notApplicable = rows?.filter((r) => r.disposition === "not_applicable").length ?? 0;
  const divergenceRate = total > 0 ? Math.round((notApplicable / total) * 100) : null;

  const timedRows = (rows ?? []).filter((r) => r.initial_read_at && r.reviewed_at);
  const avgSignoffMinutes =
    timedRows.length > 0
      ? Math.round(
          timedRows.reduce(
            (sum, r) => sum + (new Date(r.reviewed_at as string).getTime() - new Date(r.initial_read_at as string).getTime()),
            0
          ) /
            timedRows.length /
            60000
        )
      : null;

  return NextResponse.json({ total, notApplicable, divergenceRate, avgSignoffMinutes, timedCount: timedRows.length });
}
