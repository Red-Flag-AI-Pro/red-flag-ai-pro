import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { PLAN_LIMITS } from "@/lib/constants";
import type { Plan } from "@/types";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch profile for plan info
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  const limit = PLAN_LIMITS[plan];

  // Quota check
  if (limit !== Infinity) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("scans")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    if ((count ?? 0) >= limit) {
      const upgradeMessage = plan === "free"
        ? `You've used your 1 free scan this month. Upgrade to Pro for 30 scans per month.`
        : `You've used all ${limit} scans this month. Upgrade to Enterprise for unlimited scans.`;
      return NextResponse.json(
        { error: upgradeMessage },
        { status: 403 }
      );
    }
  }

  const body = await request.json();
  const title: string = body.title ?? "Untitled Scan";
  const content: string = body.content ?? "";

  if (!content.trim()) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  const { score, flags } = analyzeContent(title, content);

  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .insert({ user_id: user.id, title, content, score, status: "complete" })
    .select()
    .single();

  if (scanError || !scan) {
    return NextResponse.json(
      { error: "Failed to save scan." },
      { status: 500 }
    );
  }

  if (flags.length > 0) {
    await supabase.from("scan_flags").insert(
      flags.map((f) => ({ ...f, scan_id: scan.id }))
    );
  }

  return NextResponse.json({ id: scan.id });
}
