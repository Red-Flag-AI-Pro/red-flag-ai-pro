import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addContactToLoops } from "@/lib/loops";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      const user = data.user;
      const name = user.user_metadata?.full_name ?? "";

      // Add to Loops for welcome email
      await addContactToLoops({ email: user.email!, name, plan: "free" });

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
