import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Divergence rate: of everything this user has signed off, how often did
// they actually push back on the flag (not_applicable) rather than just
// accept it. A reviewer who never diverges is producing exactly the
// clean-looking, unexamined record the sentence-vs-gate limit warns about.
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
    .select("disposition, scans!inner(user_id)")
    .eq("scans.user_id", user.id)
    .not("disposition", "is", null);

  if (error) {
    return NextResponse.json({ error: "Failed to load reviewer stats." }, { status: 500 });
  }

  const total = rows?.length ?? 0;
  const notApplicable = rows?.filter((r) => r.disposition === "not_applicable").length ?? 0;
  const divergenceRate = total > 0 ? Math.round((notApplicable / total) * 100) : null;

  return NextResponse.json({ total, notApplicable, divergenceRate });
}
