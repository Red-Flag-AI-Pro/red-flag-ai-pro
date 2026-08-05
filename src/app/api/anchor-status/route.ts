import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { WITNESS_CHAIN_USER_ID } from "@/lib/witness";

// Public. External anchoring answers a different question than consistency:
// consistency shows the log only ever grew; this shows the time itself was
// fixed somewhere the operator doesn't control. Red Flag anchors via RFC
// 3161 (a third-party timestamp authority), not OpenTimestamps/Bitcoin —
// same category of external authority, different mechanism, both named
// explicitly rather than assumed.
export async function GET() {
  const supabase = await createServiceClient();

  const { data: latest } = await supabase
    .from("audit_log")
    .select("id, action, created_at, ts_time, ts_tsa")
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .not("ts_time", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest) {
    return NextResponse.json({
      anchored: false,
      mechanism: "rfc3161",
      message: "No externally timestamped entry found yet.",
    });
  }

  return NextResponse.json({
    anchored: true,
    mechanism: "rfc3161",
    authority: latest.ts_tsa,
    entry_id: latest.id,
    timestamped_at: latest.ts_time,
    verify: `https://www.redflagaipro.com/verify?id=${latest.id}`,
    why: "This entry's hash was submitted to an external RFC 3161 timestamp authority we don't control, fixing when it existed independently of our own clock or database.",
  });
}
