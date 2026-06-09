import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { PLAN_LIMITS, SENTINEL_ONLY_CATEGORIES, SEVERITY_DEDUCTIONS } from "@/lib/constants";
import { sendLoopsEvent } from "@/lib/loops";
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
    .select("plan, webhook_url")
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
      const upgradeMessage = plan === "pro"
        ? `You've used all ${limit} scans this month. Upgrade to Growth for unlimited scans.`
        : `You've reached your scan limit. Please upgrade to continue.`;
      return NextResponse.json(
        { error: upgradeMessage },
        { status: 403 }
      );
    }
  }

  const body = await request.json();
  const title: string = body.title ?? "Untitled Scan";
  const content: string = body.content ?? "";
  const selectedJurisdictions = body.jurisdictions ?? [];

  if (!content.trim()) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  const { flags: allFlags } = analyzeContent(
    title,
    content,
    selectedJurisdictions.length > 0 ? selectedJurisdictions : undefined
  );

  // Sentinel-only categories are filtered out for all plans except sentinel
  const flags = plan === "sentinel"
    ? allFlags
    : allFlags.filter((f) => !(SENTINEL_ONLY_CATEGORIES as readonly string[]).includes(f.category));

  // Recalculate score from the allowed flags only
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

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

  // Nudge good scorers to embed their compliance badge — fires a Loops event
  // so a "show off your badge" email can be triggered from the Loops dashboard
  // (best-effort, never blocks the response).
  if (score >= 70 && user.email) {
    sendLoopsEvent({
      email: user.email,
      eventName: "scan_good_score",
      properties: { scanId: scan.id, score, title },
    }).catch(() => {});
  }

  // Fire webhook if configured
  const webhookUrl = (profile as { webhook_url?: string | null })?.webhook_url;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "scan.completed",
        scan_id: scan.id,
        title,
        score,
        flag_count: flags.length,
        flags: flags.map((f) => ({ category: f.category, severity: f.severity, suggestion: f.suggestion })),
        scanned_at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {});
  }

  return NextResponse.json({ id: scan.id });
}
