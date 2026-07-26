import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addContactToLoops, type ProductTrack } from "@/lib/loops";
import { convertDemoScanToFirstScan } from "@/lib/onboarding";

const VALID_TRACKS = new Set<ProductTrack>(["compliance", "governance", "both"]);

// Runs the post signup side effects for the instant session path (email
// confirmation disabled), which never touches /api/auth/callback: Loops
// contact creation, referral attribution, and demo check carry over. Safe
// to call more than once — Loops upserts by email and the demo conversion
// clears its source row after the first run.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { track?: string | null; ref?: string | null } = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine
  }

  const track = VALID_TRACKS.has(body.track as ProductTrack)
    ? (body.track as ProductTrack)
    : undefined;
  const name = user.user_metadata?.full_name ?? "";

  await addContactToLoops({ email: user.email, name, plan: "free", track });
  await convertDemoScanToFirstScan(user.id, user.email);

  if (body.ref && typeof body.ref === "string") {
    await supabase
      .from("profiles")
      .update({ referred_by: body.ref.toUpperCase() })
      .eq("user_id", user.id);
  }

  return NextResponse.json({ ok: true });
}
