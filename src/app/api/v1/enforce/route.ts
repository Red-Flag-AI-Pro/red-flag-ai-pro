import { NextResponse, after } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { SEVERITY_DEDUCTIONS } from "@/lib/constants";
import { logAuditEvent } from "@/lib/audit-log";
import { checkRateLimit } from "@/lib/rate-limit";
import { computePermissionFingerprint } from "@/lib/permission-fingerprint";
import { pulledForwardExpiry } from "@/lib/boundary-expiry";
import { getGovernedPopulationCount } from "@/lib/boundary-population";
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
    .select("id, user_id, approved_threshold, model_version, hard_enforcement, hard_enforcement_accepted_by, hard_enforcement_accepted_at")
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
  const requestedThreshold: number = Number.isFinite(body.threshold) ? Math.min(100, Math.max(0, body.threshold)) : DEFAULT_THRESHOLD;
  // A key with an approved threshold has a governed scope: callers may ask
  // for a STRICTER gate than approved (higher threshold) but never a looser
  // one — otherwise the caller-supplied parameter silently overrides what
  // was actually authorized. Keys with no approved threshold keep the
  // original trust-the-caller behaviour until one is set.
  const threshold: number =
    apiKey.approved_threshold !== null && apiKey.approved_threshold !== undefined
      ? Math.max(requestedThreshold, apiKey.approved_threshold)
      : requestedThreshold;

  if (!content || content.length < 20) {
    return NextResponse.json({ error: "content is required and must be at least 20 characters." }, { status: 400 });
  }

  const { flags } = analyzeContent(title, content);
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));
  let allowedDecision = score >= threshold;

  const serviceClient = await createServiceClient();

  // The evidence and the execution are the same chain, not two separate
  // systems: whichever boundary authorization record last sealed this key's
  // scope is the record that actually governs this decision, so it gets
  // named on the decision itself, not just checked for drift afterward.
  // Only an unexpired record counts as currently governing anything.
  const nowISO = new Date().toISOString();
  const { data: governingRecord } = await serviceClient
    .from("boundary_authorization_records")
    .select("id, decision, owner_name")
    .eq("api_key_id", apiKey.id)
    .eq("grant_type", "credential")
    .or(`expires_at.is.null,expires_at.gt.${nowISO}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Hard enforcement, opt-in per key (api_keys.hard_enforcement, off by
  // default): not the gate deciding for itself, it's the gate refusing to
  // keep acting on a permission a human already set an end date for. A key
  // owner has to choose this explicitly, since a lapsed record otherwise
  // only shows up as evidence, not as something that blocks a customer's
  // live traffic they never asked to have gated this way.
  let blockReason: string | null = null;
  if (!allowedDecision) {
    blockReason = "content_score";
  } else if (apiKey.hard_enforcement && !governingRecord) {
    allowedDecision = false;
    blockReason = "no_valid_authorization";
  }

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
      governing_record_id: governingRecord?.id ?? null,
      governing_record_decision: governingRecord?.decision ?? null,
      governing_record_owner_name: governingRecord?.owner_name ?? null,
      block_reason: blockReason,
      hard_enforcement_accepted_by: blockReason === "no_valid_authorization" ? apiKey.hard_enforcement_accepted_by : null,
      hard_enforcement_accepted_at: blockReason === "no_valid_authorization" ? apiKey.hard_enforcement_accepted_at : null,
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
        governing_record_id: governingRecord?.id ?? null,
        governing_record_decision: governingRecord?.decision ?? null,
        governing_record_owner_name: governingRecord?.owner_name ?? null,
        block_reason: blockReason,
        hard_enforcement_accepted_by: blockReason === "no_valid_authorization" ? apiKey.hard_enforcement_accepted_by : null,
        hard_enforcement_accepted_at: blockReason === "no_valid_authorization" ? apiKey.hard_enforcement_accepted_at : null,
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

  // Drift check: if a boundary authorization record sealed this key's
  // approved scope and the live scope no longer matches, the mismatch gets
  // sealed as its own event the moment a real call observes it — not when a
  // person happens to notice. Runs after the response so the gate stays
  // fast; sealed once per record per observed fingerprint, same once-only
  // pattern as the lapse check.
  after(async () => {
    const { data: record } = await serviceClient
      .from("boundary_authorization_records")
      .select("id, decision, permission_fingerprint, expires_at")
      .eq("api_key_id", apiKey.id)
      .eq("grant_type", "credential")
      .not("permission_fingerprint", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!record?.permission_fingerprint) return;

    const liveFingerprint = computePermissionFingerprint({ approvedThreshold: apiKey.approved_threshold ?? 50, modelVersion: apiKey.model_version });
    if (liveFingerprint === record.permission_fingerprint) return;

    const { data: existing } = await serviceClient
      .from("audit_log")
      .select("id")
      .eq("user_id", apiKey.user_id)
      .eq("action", "boundary_record.drifted")
      .contains("details", { record_id: record.id, observed_fingerprint: liveFingerprint })
      .maybeSingle();
    if (existing) return;

    // Detected drift pulls the expiry itself — a system observable condition
    // firing automatically, so the manual falsifier trigger stays the rare
    // exception, not the front door. Same only-ever-earlier rule as the
    // manual route and the daily sweep.
    const detectedAt = new Date().toISOString();
    const driftToday = detectedAt.slice(0, 10);
    const newExpiresAt = pulledForwardExpiry(record.expires_at, driftToday);
    if (newExpiresAt !== record.expires_at) {
      await serviceClient
        .from("boundary_authorization_records")
        .update({ expires_at: newExpiresAt })
        .eq("id", record.id);
    }

    // What existed under the terms this drift just superseded, captured at
    // the moment of change — includes the very decision that surfaced the
    // drift, since that decision was itself made under the terms now being
    // pulled forward. See src/lib/boundary-population.ts.
    const populationCount = await getGovernedPopulationCount(serviceClient, record.id, detectedAt);

    await logAuditEvent(
      apiKey.user_id,
      "boundary_record.drifted",
      {
        record_id: record.id,
        decision: record.decision,
        api_key_id: apiKey.id,
        sealed_fingerprint: record.permission_fingerprint,
        observed_fingerprint: liveFingerprint,
        observed_during: "enforce_call",
        detected_at: detectedAt,
        previous_expires_at: record.expires_at,
        new_expires_at: newExpiresAt,
        population_count: populationCount,
      },
      { timestamp: true }
    );
  });

  return NextResponse.json({
    decision_id: decision?.id,
    allowed: allowedDecision,
    block_reason: blockReason,
    hard_enforcement_accepted_by: blockReason === "no_valid_authorization" ? apiKey.hard_enforcement_accepted_by : undefined,
    hard_enforcement_accepted_at: blockReason === "no_valid_authorization" ? apiKey.hard_enforcement_accepted_at : undefined,
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
    governing_record: governingRecord
      ? { id: governingRecord.id, decision: governingRecord.decision, owner_name: governingRecord.owner_name }
      : null,
    checked_at: decision?.created_at ?? new Date().toISOString(),
  });
}
