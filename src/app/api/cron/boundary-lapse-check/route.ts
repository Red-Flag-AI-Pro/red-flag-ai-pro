import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { sendDecayAlert } from "@/lib/decay-notifications";
import { computePermissionFingerprint } from "@/lib/permission-fingerprint";

// A boundary authorization's expiry is currently only checked lazily, in the
// browser, as a date-string comparison for display. That means a real lapse
// in coverage — a period where nobody actually held valid authority — is
// never itself a recorded fact, only something reconstructible later by
// comparing timestamps, if anyone thinks to look. This closes that gap: once
// a day, find every record whose expiry has passed and seal the lapse itself
// as its own event, at the moment it's detected, before any successor exists.
// Called by Vercel Cron — secured with CRON_SECRET header, fails closed if
// either side of the comparison is missing.
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // A cron invocation has no logged-in user, so the RLS-respecting client
  // (session cookie based) silently sees zero rows for every user's records —
  // this bug meant the check never actually found a real lapse in production.
  // The service client bypasses RLS by design, same pattern as every other
  // cron route and the seal-document route.
  const supabase = await createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: expired, error } = await supabase
    .from("boundary_authorization_records")
    .select("id, user_id, decision, owner_name, owner_role, expires_at, continuity_owner_name, continuity_owner_role")
    .lt("expires_at", today);

  if (error) return NextResponse.json({ error: "Failed to read boundary records." }, { status: 500 });

  let sealed = 0;
  const webhookCache = new Map<string, string | null>();

  // No early return on zero expired records — the drift sweep below must
  // still run even on a day when nothing has lapsed.
  for (const record of expired ?? []) {
    // Has this lapse already been sealed? Check once per record, not once
    // per run — a lapse is a single event, not something to re-seal daily.
    const { data: existing } = await supabase
      .from("audit_log")
      .select("id")
      .eq("user_id", record.user_id)
      .eq("action", "boundary_record.lapsed")
      .contains("details", { record_id: record.id })
      .maybeSingle();

    if (existing) continue;

    const entryId = await logAuditEvent(
      record.user_id,
      "boundary_record.lapsed",
      {
        record_id: record.id,
        decision: record.decision,
        owner_name: record.owner_name,
        owner_role: record.owner_role,
        // Naming this directly closes the gap Ivan Roche raised: the lapse
        // fixes when the mandate went vacant, this fixes who was on the
        // hook for it going vacant, so it isn't left as an inference.
        continuity_owner_name: record.continuity_owner_name,
        continuity_owner_role: record.continuity_owner_role,
        expires_at: record.expires_at,
        detected_at: new Date().toISOString(),
      },
      { timestamp: true }
    );

    if (entryId) sealed++;

    if (!webhookCache.has(record.user_id)) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("decay_webhook_url")
        .eq("user_id", record.user_id)
        .maybeSingle();
      webhookCache.set(record.user_id, (profile as { decay_webhook_url?: string | null } | null)?.decay_webhook_url ?? null);
    }

    await sendDecayAlert(
      webhookCache.get(record.user_id),
      `Boundary authorization lapsed: "${record.decision}" (owner: ${record.owner_name}, ${record.owner_role}) expired ${record.expires_at} with no successor recorded. https://www.redflagaipro.com/boundary-records`
    );
  }

  // Second sweep, same run: permission drift on credential records. The
  // live /enforce path catches drift the moment a real call observes it,
  // but a key whose scope changed and then never got called would drift
  // silently forever — this daily pass closes that window. Same once-only
  // seal (per record per observed fingerprint) and same alert path as the
  // lapse sweep above.
  //
  // Seam defect, found and fixed 8 Aug 2026 (Brad Wolfe's method: write down
  // what each side of a handoff believes separately, then compare — see
  // [[project_brad_wolfe_book_citation]]). The migration's own comment calls
  // api_key_id going NULL on key deletion "the deleted key counts as drift
  // too" case, but this query used to filter `.not("api_key_id", "is",
  // null)` — which excludes exactly that case the moment it happens. A
  // deleted key, the single most severe drift, was silently un-checkable.
  // permission_fingerprint not null is the real signal a record needs
  // checking; api_key_id is allowed to be null, that IS the deleted-key case.
  const { data: credentialRecords } = await supabase
    .from("boundary_authorization_records")
    .select("id, user_id, decision, permission_fingerprint, api_key_id")
    .eq("grant_type", "credential")
    .not("permission_fingerprint", "is", null);

  let driftSealed = 0;
  if (credentialRecords && credentialRecords.length > 0) {
    const keyIds = credentialRecords.map((r) => r.api_key_id).filter((id): id is string => Boolean(id));
    const { data: keys } = keyIds.length > 0
      ? await supabase.from("api_keys").select("id, approved_threshold").in("id", keyIds)
      : { data: [] as { id: string; approved_threshold: number | null }[] };
    const keyMap = new Map((keys ?? []).map((k) => [k.id, k]));

    for (const record of credentialRecords) {
      const key = record.api_key_id ? keyMap.get(record.api_key_id) : null;
      // A deleted key is drift too: the approved credential no longer
      // exists, which is a scope change nobody re-approved. This branch is
      // the fix — record.api_key_id is null here whenever the key was
      // deleted, and that is now reachable instead of filtered out above.
      const liveFingerprint = key
        ? computePermissionFingerprint({ approvedThreshold: key.approved_threshold ?? 50 })
        : "pf-key-deleted";
      if (liveFingerprint === record.permission_fingerprint) continue;

      const { data: existing } = await supabase
        .from("audit_log")
        .select("id")
        .eq("user_id", record.user_id)
        .eq("action", "boundary_record.drifted")
        .contains("details", { record_id: record.id, observed_fingerprint: liveFingerprint })
        .maybeSingle();
      if (existing) continue;

      const entryId = await logAuditEvent(
        record.user_id,
        "boundary_record.drifted",
        {
          record_id: record.id,
          decision: record.decision,
          api_key_id: record.api_key_id,
          sealed_fingerprint: record.permission_fingerprint,
          observed_fingerprint: liveFingerprint,
          observed_during: "daily_sweep",
          detected_at: new Date().toISOString(),
        },
        { timestamp: true }
      );
      if (entryId) driftSealed++;

      if (!webhookCache.has(record.user_id)) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("decay_webhook_url")
          .eq("user_id", record.user_id)
          .maybeSingle();
        webhookCache.set(record.user_id, (profile as { decay_webhook_url?: string | null } | null)?.decay_webhook_url ?? null);
      }

      await sendDecayAlert(
        webhookCache.get(record.user_id),
        `Boundary authorization drifted: "${record.decision}" — the linked API key's live permissions no longer match what was approved and sealed. Nobody re-approved this change. https://www.redflagaipro.com/boundary-records`
      );
    }
  }

  return NextResponse.json({ checked: expired?.length ?? 0, sealed, drift_checked: credentialRecords?.length ?? 0, drift_sealed: driftSealed });
}
