import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { SEVERITY_DEDUCTIONS } from "@/lib/constants";
import { createHash } from "crypto";

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function POST(request: Request) {
  // Auth via API key in Authorization header: Bearer rfp_xxx
  const authHeader = request.headers.get("authorization") ?? "";
  const rawKey = authHeader.replace("Bearer ", "").trim();

  if (!rawKey.startsWith("rfp_")) {
    return NextResponse.json(
      { error: "Invalid API key. Include your key as: Authorization: Bearer rfp_your_key" },
      { status: 401 }
    );
  }

  const supabase = await createClient();
  const keyHash = hashKey(rawKey);

  const { data: apiKey } = await supabase
    .from("api_keys")
    .select("id, user_id")
    .eq("key_hash", keyHash)
    .single();

  if (!apiKey) {
    return NextResponse.json({ error: "Invalid or revoked API key." }, { status: 401 });
  }

  // Update last_used_at
  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", apiKey.id);

  const body = await request.json();
  const content: string = (body.content ?? "").trim();
  const title: string = (body.title ?? "API Scan").trim();

  if (!content || content.length < 20) {
    return NextResponse.json({ error: "content is required and must be at least 20 characters." }, { status: 400 });
  }

  const { flags } = analyzeContent(title, content);
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

  // Save scan
  const { data: scan } = await supabase
    .from("scans")
    .insert({
      user_id: apiKey.user_id,
      title: `[API] ${title}`,
      content: content.slice(0, 10000),
      score,
      status: "complete",
    })
    .select()
    .single();

  if (scan && flags.length > 0) {
    await supabase.from("scan_flags").insert(flags.map((f) => ({ ...f, scan_id: scan.id })));
  }

  // Fire webhook if configured
  const { data: profile } = await supabase
    .from("profiles")
    .select("webhook_url")
    .eq("user_id", apiKey.user_id)
    .single();

  if (profile?.webhook_url && scan) {
    fetch(profile.webhook_url, {
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
    }).catch(() => {}); // fire and forget
  }

  return NextResponse.json({
    scan_id: scan?.id,
    title,
    score,
    risk: score >= 70 ? "low" : score >= 40 ? "medium" : "high",
    flag_count: flags.length,
    flags: flags.map((f) => ({
      category: f.category,
      severity: f.severity,
      text_excerpt: f.text_excerpt,
      description: f.flag_description,
      suggestion: f.suggestion,
    })),
    scanned_at: new Date().toISOString(),
  });
}
