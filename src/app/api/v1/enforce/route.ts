import { NextResponse, after } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { SEVERITY_DEDUCTIONS } from "@/lib/constants";
import { logAuditEvent } from "@/lib/audit-log";
import { checkRateLimit } from "@/lib/rate-limit";
import { createHash } from "crypto";

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

const DEFAULT_THRESHOLD = 50;

// Real-Time Gate: a synchronous allow/block decision, called before content
// goes live rather than checked after the fact. This is deliberately NOT a
// network proxy or transparent gateway — it is a decision API your own code
// calls and acts on. analyzeContent is a pure, synchronous heuristic (no
// external API calls), which is what keeps this fast enough to sit in a
// live path at all — the AI-enhanced rewrite path used elsewhere on the
// site is intentionally not used here, since an LLM call would make this
// too slow to gate a real action.
export async function POST(request: Request) {
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

  const { allowed: withinRateLimit } = await checkRateLimit(`enforce:${apiKey.user_id}`, 120, 60);
  if (!withinRateLimit) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", apiKey.id);

  const body = await request.json();
  const content: string = (body.content ?? "").trim();
  const title: string = (body.title ?? "Real-Time Gate check").trim();
  const threshold: number = Number.isFinite(body.threshold) ? Math.min(100, Math.max(0, body.threshold)) : DEFAULT_THRESHOLD;

  if (!content || content.length < 20) {
    return NextResponse.json({ error: "content is required and must be at least 20 characters." }, { status: 400 });
  }

  const { flags } = analyzeContent(title, content);
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));
  const allowedDecision = score >= threshold;

  const serviceClient = await createServiceClient();
  const { data: decision } = await serviceClient
    .from("enforcement_decisions")
    .insert({
      user_id: apiKey.user_id,
      title,
      content: content.slice(0, 10000),
      score,
      threshold,
      allowed: allowedDecision,
      flag_count: flags.length,
      flags: flags.map((f) => ({ category: f.category, severity: f.severity, suggestion: f.suggestion })),
    })
    .select("id, created_at")
    .single();

  // Blocked decisions are the moments that matter — sealed with an
  // independent timestamp, unlike routine allowed checks, to avoid
  // flooding the chain while still proving the block happened when claimed.
  let verifyId: string | null = null;
  if (!allowedDecision) {
    verifyId = await logAuditEvent(
      apiKey.user_id,
      "enforcement.blocked",
      {
        decision_id: decision?.id,
        title,
        score,
        threshold,
        flag_count: flags.length,
        flag_categories: flags.map((f) => f.category),
      },
      { timestamp: true }
    );
  }

  if (!allowedDecision) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("webhook_url")
      .eq("user_id", apiKey.user_id)
      .single();

    if (profile?.webhook_url) {
      const webhookUrl = profile.webhook_url;
      after(() =>
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "enforcement.blocked",
            decision_id: decision?.id,
            title,
            score,
            threshold,
            flag_count: flags.length,
            blocked_at: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(8000),
        }).catch(() => {})
      );
    }
  }

  return NextResponse.json({
    decision_id: decision?.id,
    allowed: allowedDecision,
    score,
    threshold,
    risk: score >= 70 ? "low" : score >= 40 ? "medium" : "high",
    flag_count: flags.length,
    flags: flags.map((f) => ({
      category: f.category,
      severity: f.severity,
      text_excerpt: f.text_excerpt,
      description: f.flag_description,
      suggestion: f.suggestion,
    })),
    verify_url: verifyId ? `https://www.redflagaipro.com/verify?id=${verifyId}` : null,
    checked_at: decision?.created_at ?? new Date().toISOString(),
  });
}
