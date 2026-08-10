import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { computePermissionFingerprint } from "@/lib/permission-fingerprint";
import { signDecisionBundle, type DecisionBundle, type DecisionBundleGoverningRecord } from "@/lib/decision-bundle";

async function requireSentinelUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" as const, status: 401 as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  if (profile?.plan !== "sentinel") {
    return { error: "Signed decision bundles are a Sentinel feature." as const, status: 403 as const };
  }

  return { user };
}

// Exports one Real-Time Gate decision as a signed, offline verifiable
// bundle: the decision itself plus the full authority state that governed
// it, captured at export time, Ed25519 signed so a verifier with no network
// access and no trust in Red Flag's server can still confirm the bundle
// wasn't altered after the fact. See src/lib/decision-bundle.ts.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireSentinelUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  // enforcement_decisions has RLS with no select policy for logged-in users
  // (service-role writes only, same as audit_log) — ownership is enforced
  // here by filtering on user_id explicitly, same pattern as the Data Room
  // export route.
  const service = await createServiceClient();

  const { data: decision, error: decisionError } = await service
    .from("enforcement_decisions")
    .select("id, user_id, title, score, threshold, allowed, block_reason, flag_count, flags, governing_record_id, created_at")
    .eq("id", id)
    .eq("user_id", result.user.id)
    .maybeSingle();

  if (decisionError || !decision) {
    return NextResponse.json({ error: "Decision not found." }, { status: 404 });
  }

  let governingRecord: DecisionBundleGoverningRecord | null = null;

  if (decision.governing_record_id) {
    const { data: record } = await service
      .from("boundary_authorization_records")
      .select("id, decision, owner_name, owner_role, authority_mode, expires_at, permission_fingerprint, api_key_id")
      .eq("id", decision.governing_record_id)
      .maybeSingle();

    if (record) {
      let fingerprintIntact: boolean | null = null;
      if (record.permission_fingerprint) {
        if (record.api_key_id) {
          const { data: apiKey } = await service
            .from("api_keys")
            .select("approved_threshold, model_version")
            .eq("id", record.api_key_id)
            .maybeSingle();
          fingerprintIntact = apiKey
            ? computePermissionFingerprint({ approvedThreshold: apiKey.approved_threshold ?? 50, modelVersion: apiKey.model_version }) === record.permission_fingerprint
            : false; // linked key gone — that is drift, not "not applicable"
        } else {
          fingerprintIntact = false;
        }
      }

      governingRecord = {
        id: record.id,
        decision: record.decision,
        owner_name: record.owner_name,
        owner_role: record.owner_role,
        authority_mode: record.authority_mode,
        expires_at: record.expires_at,
        permission_fingerprint: record.permission_fingerprint,
        fingerprint_intact_at_export: fingerprintIntact,
      };
    }
  }

  const bundle: DecisionBundle = {
    version: 1,
    decision_id: decision.id,
    checked_at: decision.created_at,
    title: decision.title,
    score: decision.score,
    threshold: decision.threshold,
    allowed: decision.allowed,
    block_reason: decision.block_reason,
    flag_count: decision.flag_count,
    flags: Array.isArray(decision.flags) ? decision.flags : [],
    governing_record: governingRecord,
    exported_at: new Date().toISOString(),
    exported_by: "redflagaipro.com",
  };

  return NextResponse.json(signDecisionBundle(bundle));
}
