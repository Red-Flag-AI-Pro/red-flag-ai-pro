import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { addContactToLoops } from "@/lib/loops";
import { analyzeContent } from "@/lib/analyzer";
import { SEVERITY_DEDUCTIONS, getExcludedCategories } from "@/lib/constants";

// If this person already ran the free demo scan with this email, convert
// that scan into their first real (fully unlocked) scan — so their
// dashboard isn't empty on first load and they don't have to redo work
// they already did to get the same result.
async function convertDemoScanToFirstScan(userId: string, email: string) {
  try {
    const service = await createServiceClient();
    const { data: demoRow } = await service
      .from("demo_scan_emails")
      .select("content")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    const content = (demoRow as { content?: string | null } | null)?.content;
    if (!content || !content.trim()) return;

    const { flags: allFlags } = analyzeContent("Your demo scan", content);
    const excludedCategories = getExcludedCategories("free");
    const flags = allFlags.filter((f) => !excludedCategories.includes(f.category));
    const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

    const { data: scan } = await service
      .from("scans")
      .insert({ user_id: userId, title: "Your demo scan", content, score, status: "complete" })
      .select()
      .single();

    if (scan && flags.length > 0) {
      await service.from("scan_flags").insert(
        flags.map((f) => ({ ...f, scan_id: scan.id }))
      );
    }

    // Clear the stored content so it's only ever converted once
    await service.from("demo_scan_emails").update({ content: null }).eq("email", email.toLowerCase());
  } catch {
    // Best-effort — never block account creation over this
  }
}

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
