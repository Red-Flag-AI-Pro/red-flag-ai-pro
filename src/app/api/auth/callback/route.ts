import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addContactToLoops, type ProductTrack } from "@/lib/loops";
import { convertDemoScanToFirstScan } from "@/lib/onboarding";

const VALID_TRACKS = new Set<ProductTrack>(["compliance", "governance", "both"]);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const trackParam = searchParams.get("track");
  const track = VALID_TRACKS.has(trackParam as ProductTrack) ? (trackParam as ProductTrack) : undefined;

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      const user = data.user;
      const name = user.user_metadata?.full_name ?? "";

      // Add to Loops for welcome email — track carries which product journey
      // (compliance scanner / governance audit / DFY audit) they signed up
      // from, so Loops can send a matching welcome instead of one generic
      // sequence for every new account regardless of intent.
      await addContactToLoops({ email: user.email!, name, plan: "free", track });

      // Carry over their demo scan as their first real scan, if they ran one
      if (user.email) {
        await convertDemoScanToFirstScan(user.id, user.email);
      }

      // Track referral if present
      const ref = searchParams.get("ref");
      if (ref) {
        await supabase
          .from("profiles")
          .update({ referred_by: ref.toUpperCase() })
          .eq("user_id", user.id);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
