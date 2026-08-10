import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { computePermissionFingerprint } from "@/lib/permission-fingerprint";
import type { BoundaryOption, BoundaryRisk, BoundaryEvidence, BoundaryFalsifier, AuthorityMode } from "@/types";

const AUTHORITY_MODES: AuthorityMode[] = ["human_decides", "ai_recommends", "ai_decides"];

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" as const, status: 401 as const };
  return { supabase, user };
}

async function requireSentinelUser() {
  const result = await requireUser();
  if ("error" in result) return result;

  const { data: profile } = await result.supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", result.user.id)
    .single();

  if (profile?.plan !== "sentinel") {
    return { error: "Creating and editing boundary authorization records is a Sentinel feature." as const, status: 403 as const };
  }

  return result;
}

function sanitizeOptions(value: unknown): BoundaryOption[] {
  if (!Array.isArray(value)) return [];
  return (value as Record<string, unknown>[])
    .map((v) => ({ label: typeof v?.label === "string" ? v.label.trim() : "" }))
    .filter((v) => v.label.length > 0);
}

function sanitizeRisks(value: unknown): BoundaryRisk[] {
  if (!Array.isArray(value)) return [];
  return (value as Record<string, unknown>[])
    .map((v) => ({
      risk: typeof v?.risk === "string" ? v.risk.trim() : "",
      mitigation: typeof v?.mitigation === "string" ? v.mitigation.trim() : "",
    }))
    .filter((v) => v.risk.length > 0 || v.mitigation.length > 0);
}

function sanitizeEvidence(value: unknown): BoundaryEvidence[] {
  if (!Array.isArray(value)) return [];
  return (value as Record<string, unknown>[])
    .map((v) => ({ label: typeof v?.label === "string" ? v.label.trim() : "" }))
    .filter((v) => v.label.length > 0);
}

function sanitizeFalsifiers(value: unknown): BoundaryFalsifier[] {
  if (!Array.isArray(value)) return [];
  return (value as Record<string, unknown>[])
    .map((v) => ({ condition: typeof v?.condition === "string" ? v.condition.trim() : "" }))
    .filter((v) => v.condition.length > 0);
}

export async function GET() {
  const result = await requireUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { data, error } = await result.supabase
    .from("boundary_authorization_records")
    .select("*")
    .order("decision_date", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to load boundary records." }, { status: 500 });

  // For credential records with a sealed fingerprint, recompute the linked
  // key's live fingerprint on every read — drift status is a comparison, not
  // a stored flag someone could forget to update. fingerprint_intact: null
  // means not applicable (no fingerprint at all — a decision-type record),
  // true/false is the live answer.
  //
  // Seam defect, found and fixed 8 Aug 2026: this used to gate on
  // `r.api_key_id && r.permission_fingerprint`, so the moment a linked key
  // was actually deleted (api_key_id goes NULL via the FK's on-delete-set-
  // null), the whole check short-circuited to null — "not applicable" —
  // instead of "drifted". The comment below describing the deleted-key case
  // was unreachable the entire time. permission_fingerprint alone is the
  // real signal a record needs checking; api_key_id being null IS the
  // deleted-key case, not an exemption from one.
  const records = data ?? [];
  const linkedKeyIds = records
    .filter((r) => r.api_key_id && r.permission_fingerprint)
    .map((r) => r.api_key_id as string);
  const liveFingerprints = new Map<string, string>();
  if (linkedKeyIds.length > 0) {
    const { data: keys } = await result.supabase
      .from("api_keys")
      .select("id, approved_threshold, model_version")
      .in("id", linkedKeyIds);
    for (const key of keys ?? []) {
      liveFingerprints.set(key.id, computePermissionFingerprint({ approvedThreshold: key.approved_threshold ?? 50, modelVersion: key.model_version }));
    }
  }
  // What a record has actually produced, not just how much time has passed
  // since it was signed. Only credential records ever get a governing_record_id
  // written to them (see /api/v1/enforce), so only those can have a track
  // record at all. Split into first half vs second half of the record's own
  // life so a trend direction is visible, not just a single lifetime number.
  const performanceMap = new Map<string, { total: number; blocked: number; block_rate: number; trend: "up" | "down" | "flat" | null }>();
  const trackedRecordIds = records.filter((r) => r.api_key_id).map((r) => r.id);
  if (trackedRecordIds.length > 0) {
    const { data: decisions } = await result.supabase
      .from("enforcement_decisions")
      .select("governing_record_id, allowed, created_at")
      .in("governing_record_id", trackedRecordIds)
      .order("created_at", { ascending: true });

    const byRecord = new Map<string, { allowed: boolean }[]>();
    for (const d of decisions ?? []) {
      if (!d.governing_record_id) continue;
      const list = byRecord.get(d.governing_record_id) ?? [];
      list.push({ allowed: d.allowed });
      byRecord.set(d.governing_record_id, list);
    }
    for (const [recordId, list] of byRecord) {
      const total = list.length;
      const blocked = list.filter((d) => !d.allowed).length;
      const block_rate = total > 0 ? blocked / total : 0;
      let trend: "up" | "down" | "flat" | null = null;
      // Fewer than 4 decisions isn't enough to say anything about direction —
      // a null trend is honest, a confident one from two data points is not.
      if (total >= 4) {
        const mid = Math.floor(total / 2);
        const firstHalf = list.slice(0, mid);
        const secondHalf = list.slice(mid);
        const firstRate = firstHalf.filter((d) => !d.allowed).length / firstHalf.length;
        const secondRate = secondHalf.filter((d) => !d.allowed).length / secondHalf.length;
        const delta = secondRate - firstRate;
        trend = delta > 0.05 ? "up" : delta < -0.05 ? "down" : "flat";
      }
      performanceMap.set(recordId, { total, blocked, block_rate, trend });
    }
  }

  // Declining falsifier firing rate across a record's renewal lineage. Brad
  // Wolfe, 6 Aug 2026, round four: the failure mode that only shows up once
  // a falsifier actually fires — not refusal to use it, but a threshold
  // quietly loosened at the next renewal after a few real firings, so it
  // stops firing and gets described as "tuning out noise." A record that
  // fired three times in its first year and zero in its second either had a
  // quieter year or had its condition loosened, and only one of those is
  // likely. Uses the existing supersedes_id chain, no new data needed —
  // only ever computed for a record with a predecessor to compare against.
  function firingRatePerYear(record: { decision_date: string; expires_at: string; expiry_conditions: BoundaryFalsifier[] }): number {
    const start = new Date(record.decision_date).getTime();
    const end = new Date(record.expires_at).getTime();
    const days = Math.max(1, (end - start) / 86400000);
    const years = days / 365.25;
    const triggered = (record.expiry_conditions ?? []).filter((c) => c.triggered_at).length;
    return triggered / years;
  }
  const byId = new Map(records.map((r) => [r.id, r]));
  const firingRateTrendMap = new Map<string, { current_rate: number; previous_rate: number }>();
  for (const r of records) {
    if (!r.supersedes_id) continue;
    const predecessor = byId.get(r.supersedes_id);
    if (!predecessor) continue;
    const currentRate = firingRatePerYear(r);
    const previousRate = firingRatePerYear(predecessor);
    // Only flag an actual decline from a nonzero base — two quiet records in
    // a row is not evidence of anything, and a rate that rose or held is not
    // the pattern being watched for.
    if (previousRate > 0 && currentRate < previousRate) {
      firingRateTrendMap.set(r.id, { current_rate: currentRate, previous_rate: previousRate });
    }
  }

  const withStatus = records.map((r) => ({
    ...r,
    fingerprint_intact: !r.permission_fingerprint
      ? null
      : r.api_key_id && liveFingerprints.has(r.api_key_id)
        ? liveFingerprints.get(r.api_key_id) === r.permission_fingerprint
        : false, // no live key found — deleted or otherwise gone — that is drift, not silence
    performance: performanceMap.get(r.id) ?? null,
    firing_rate_declined: firingRateTrendMap.get(r.id) ?? null,
  }));

  return NextResponse.json({ records: withStatus });
}

export async function POST(request: Request) {
  const result = await requireSentinelUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const body = await request.json();

  const decision: string = (body.decision ?? "").trim();
  // A credential grant is the same record shape as a decision grant; the
  // reference names WHICH credential (key name/last four), never the secret.
  const grantType: "decision" | "credential" = body.grant_type === "credential" ? "credential" : "decision";
  const credentialReference: string | null =
    grantType === "credential" && typeof body.credential_reference === "string" && body.credential_reference.trim()
      ? body.credential_reference.trim()
      : null;
  // Where authority actually sits. Optional, but never silently defaulted:
  // an unstated authority mode is a real gap the map is built to surface,
  // and inventing an answer nobody gave would hide exactly what matters.
  const authorityMode: AuthorityMode | null = AUTHORITY_MODES.includes(body.authority_mode)
    ? body.authority_mode
    : null;
  const ownerName: string = (body.owner_name ?? "").trim();
  const ownerRole: string = (body.owner_role ?? "").trim();
  const decisionDate: string = (body.decision_date ?? "").trim();
  const expiresAt: string = (body.expires_at ?? "").trim();
  // Who is on the hook for what happens at expiry, not the authority holder
  // themselves — Brad Wolfe, "the bridge always wins": renewal keeps a
  // temporary grant alive, but somebody also has to be the one who lets it
  // die on schedule rather than by default. One field covers both jobs since
  // they're the same decision point, just opposite outcomes. Optional, since
  // not every record has a distinct continuity duty, but nameable when it does.
  const continuityOwnerName: string | null = typeof body.continuity_owner_name === "string" && body.continuity_owner_name.trim() ? body.continuity_owner_name.trim() : null;
  const continuityOwnerRole: string | null = typeof body.continuity_owner_role === "string" && body.continuity_owner_role.trim() ? body.continuity_owner_role.trim() : null;
  // Lets the renewal reminder cron reach the continuity owner directly rather
  // than only the account holder — optional, since not every continuity
  // owner has their own inbox worth targeting separately.
  const continuityOwnerEmail: string | null = typeof body.continuity_owner_email === "string" && body.continuity_owner_email.trim() ? body.continuity_owner_email.trim() : null;
  // Who, if anyone, actually required this boundary to exist — a lender, an
  // insurer, a board resolution. Null means self imposed. Optional and self
  // reported, not a countersignature, but a named, sealed fact rather than
  // an unspoken assumption either way.
  const requiredByName: string | null = typeof body.required_by_name === "string" && body.required_by_name.trim() ? body.required_by_name.trim() : null;
  const requiredByOrganisation: string | null = typeof body.required_by_organisation === "string" && body.required_by_organisation.trim() ? body.required_by_organisation.trim() : null;
  // What success looks like, not just how this stops. Optional, one
  // statement — expiry_conditions already cover the plural "how it dies" case.
  const completionCondition: string | null = typeof body.completion_condition === "string" && body.completion_condition.trim() ? body.completion_condition.trim() : null;
  // Three distinct roles Brad Wolfe and Dr. David Marco independently named,
  // none of them the owner (who approved) or the continuity owner (whose job
  // is renewal): who has standing to halt this before its natural expiry
  // without asking permission from whoever depends on the timeline, who is
  // obligated to defend the decision if it's challenged, and where the
  // escalation chain ends. Optional — often nobody distinct exists to name.
  const stopAuthorityName: string | null = typeof body.stop_authority_name === "string" && body.stop_authority_name.trim() ? body.stop_authority_name.trim() : null;
  const stopAuthorityRole: string | null = typeof body.stop_authority_role === "string" && body.stop_authority_role.trim() ? body.stop_authority_role.trim() : null;
  const defendAuthorityName: string | null = typeof body.defend_authority_name === "string" && body.defend_authority_name.trim() ? body.defend_authority_name.trim() : null;
  const defendAuthorityRole: string | null = typeof body.defend_authority_role === "string" && body.defend_authority_role.trim() ? body.defend_authority_role.trim() : null;
  const escalationCeiling: string | null = typeof body.escalation_ceiling === "string" && body.escalation_ceiling.trim() ? body.escalation_ceiling.trim() : null;
  // Brad Wolfe, "The CEO's New Job," LinkedIn 10 Aug 2026: owner_name is who
  // holds the seat, not who named them to it. "A seat that assigns its own
  // accountability is just marking its own homework" -- his exact line. For a
  // solo founder there's often no apex above the owner to name it, and that's
  // an honest answer, not a gap: leaving this blank, or writing "self
  // assigned," says exactly that rather than hiding it behind owner_name alone.
  // Brad Wolfe, follow-up 10 Aug 2026: blank reads as missing data three
  // years later, "self assigned" reads as a disclosed fact -- stronger
  // written than left empty. So a blank field writes the literal fact at
  // submission time rather than storing null and only inferring it at
  // render time, same discipline as everything else tonight: the record
  // states what's true, it doesn't leave a reader to guess why a field is
  // empty.
  const namedByNameRaw = typeof body.named_by_name === "string" ? body.named_by_name.trim() : "";
  const namedByName: string = namedByNameRaw || "Self assigned";
  const namedByRole: string | null = namedByNameRaw && typeof body.named_by_role === "string" && body.named_by_role.trim() ? body.named_by_role.trim() : null;

  if (!decision) return NextResponse.json({ error: "Decision is required." }, { status: 400 });
  if (grantType === "credential" && !credentialReference) {
    return NextResponse.json({ error: "A credential grant needs a reference identifying which credential (a key name or last four characters, never the secret itself)." }, { status: 400 });
  }
  // Never let an actual secret get sealed into a permanent record.
  if (credentialReference && credentialReference.length > 60) {
    return NextResponse.json({ error: "The credential reference looks like it might be the credential itself. Use a short name or the last four characters, never the full secret." }, { status: 400 });
  }
  if (!ownerName) return NextResponse.json({ error: "Owner name is required." }, { status: 400 });
  if (!ownerRole) return NextResponse.json({ error: "Owner role is required." }, { status: 400 });
  if (!decisionDate) return NextResponse.json({ error: "Decision date is required." }, { status: 400 });
  // An unbounded grant means unbounded ownership: if you never said what would
  // make this stop being safe, you own everything the system does from here on.
  // So the expiry is required, not optional — a grant needs a shelf life stamped
  // on it the same way a signature needs a name.
  if (!expiresAt) return NextResponse.json({ error: "Authority expiry date is required. An authorization without an expiry never stops being your risk." }, { status: 400 });
  if (expiresAt <= decisionDate) return NextResponse.json({ error: "Authority expiry must be after the decision date." }, { status: 400 });

  // Linking a real key upgrades the free text credential_reference to a
  // provable claim: the record is about THIS key, and the fingerprint seals
  // what the key's approved scope actually was at the moment of approval.
  // If the key has no approved threshold yet, approval stamps the default —
  // creating the authorization record IS the approval moment, so that is
  // exactly when the approved scope becomes real rather than implied.
  const apiKeyId: string | null =
    grantType === "credential" && typeof body.api_key_id === "string" && body.api_key_id.trim()
      ? body.api_key_id.trim()
      : null;
  let permissionFingerprint: string | null = null;
  if (apiKeyId) {
    const { data: linkedKey } = await result.supabase
      .from("api_keys")
      .select("id, approved_threshold, model_version")
      .eq("id", apiKeyId)
      .eq("user_id", result.user.id)
      .maybeSingle();
    if (!linkedKey) {
      return NextResponse.json({ error: "The API key you're linking was not found on this account." }, { status: 400 });
    }
    let approvedThreshold: number = linkedKey.approved_threshold ?? 50;
    if (linkedKey.approved_threshold === null || linkedKey.approved_threshold === undefined) {
      await result.supabase
        .from("api_keys")
        .update({ approved_threshold: approvedThreshold })
        .eq("id", apiKeyId)
        .eq("user_id", result.user.id);
    }
    permissionFingerprint = computePermissionFingerprint({ approvedThreshold, modelVersion: linkedKey.model_version });
  }

  // If this record replaces an earlier one, the record it supersedes must
  // actually belong to this user — otherwise a chain of custody could be
  // forged by pointing at someone else's record.
  const supersedesId: string | null = typeof body.supersedes_id === "string" && body.supersedes_id.trim() ? body.supersedes_id.trim() : null;
  if (supersedesId) {
    const { data: priorRecord } = await result.supabase
      .from("boundary_authorization_records")
      .select("id, expiry_conditions")
      .eq("id", supersedesId)
      .eq("user_id", result.user.id)
      .maybeSingle();
    if (!priorRecord) return NextResponse.json({ error: "The record you're superseding was not found." }, { status: 400 });

    // Brad Wolfe, round three of the authorship thread: confirming a
    // condition someone else drafted proves who typed, not who chose. The
    // only version of that risk a single-session form can actually produce
    // is a renewal that just retypes the prior record's conditions
    // verbatim, so at renewal at least one condition must be genuinely
    // reconsidered, not carried forward unchanged. A first-time record has
    // nothing to carry forward, so this only applies when superseding.
    const newConditions = sanitizeFalsifiers(body.expiry_conditions);
    const priorConditionTexts = new Set(
      ((priorRecord.expiry_conditions ?? []) as BoundaryFalsifier[]).map((c) => c.condition.trim().toLowerCase())
    );
    if (newConditions.length > 0 && priorConditionTexts.size > 0) {
      const allCarriedForward = newConditions.every((c) => priorConditionTexts.has(c.condition.trim().toLowerCase()));
      if (allCarriedForward) {
        return NextResponse.json(
          {
            error:
              "Every falsifier condition here is identical to the record being superseded. A renewal needs at least one condition genuinely reconsidered, not just retyped — confirming what was already there proves you typed it, not that you chose it.",
          },
          { status: 400 }
        );
      }
    }
  }

  const { data, error } = await result.supabase
    .from("boundary_authorization_records")
    .insert({
      user_id: result.user.id,
      decision,
      owner_name: ownerName,
      owner_role: ownerRole,
      options_considered: sanitizeOptions(body.options_considered),
      risks_accepted: sanitizeRisks(body.risks_accepted),
      evidence: sanitizeEvidence(body.evidence),
      decision_date: decisionDate,
      expires_at: expiresAt,
      expiry_conditions: sanitizeFalsifiers(body.expiry_conditions),
      supersedes_id: supersedesId,
      continuity_owner_name: continuityOwnerName,
      continuity_owner_role: continuityOwnerRole,
      continuity_owner_email: continuityOwnerEmail,
      grant_type: grantType,
      credential_reference: credentialReference,
      api_key_id: apiKeyId,
      permission_fingerprint: permissionFingerprint,
      authority_mode: authorityMode,
      required_by_name: requiredByName,
      required_by_organisation: requiredByOrganisation,
      completion_condition: completionCondition,
      stop_authority_name: stopAuthorityName,
      stop_authority_role: stopAuthorityRole,
      defend_authority_name: defendAuthorityName,
      defend_authority_role: defendAuthorityRole,
      escalation_ceiling: escalationCeiling,
      named_by_name: namedByName,
      named_by_role: namedByRole,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create boundary record." }, { status: 500 });

  // The expiry and its falsifiers are part of what gets sealed: the grant's
  // shelf life must be provably part of the original record, not a later edit.
  // supersedes_id is sealed too — the chain of custody is part of the record,
  // not something added after the fact. Same for the continuity owner: who
  // was on the hook for renewal is fixed at creation, not assigned in hindsight
  // once a lapse has already happened.
  // Fail-closed on completeness, not just on the required fields: a record
  // with no continuity owner or no falsifier conditions still saves (owners
  // genuinely differ, and forcing a fake one in would be worse than leaving
  // it blank), but the seal itself must say so honestly. Silently sealing an
  // incomplete record as if it were finished is exactly the "clean signature,
  // nobody actually looked" failure this field exists to prevent.
  // Authority mode joins the completeness test: a record that never states
  // where authority sits cannot answer the question the whole map exists for.
  const isComplete =
    Boolean(continuityOwnerName) &&
    sanitizeFalsifiers(body.expiry_conditions).length > 0 &&
    Boolean(authorityMode);

  // Authorship is provable, not just asserted: owner_name is whatever was
  // typed, but the authenticated account that recorded it is bound into the
  // sealed event. A typed name can claim anything; the session identity that
  // sealed the claim cannot be edited into the record after the fact.
  await logAuditEvent(
    result.user.id,
    "boundary_record.created",
    {
      id: data.id,
      decision: data.decision,
      expires_at: data.expires_at,
      expiry_conditions: data.expiry_conditions,
      supersedes_id: data.supersedes_id,
      continuity_owner_name: data.continuity_owner_name,
      continuity_owner_role: data.continuity_owner_role,
      is_complete: isComplete,
      recorded_by_user_id: result.user.id,
      recorded_by_email: result.user.email ?? null,
      grant_type: data.grant_type,
      credential_reference: data.credential_reference,
      api_key_id: data.api_key_id,
      permission_fingerprint: data.permission_fingerprint,
      authority_mode: data.authority_mode,
      required_by_name: data.required_by_name,
      required_by_organisation: data.required_by_organisation,
      completion_condition: data.completion_condition,
      stop_authority_name: data.stop_authority_name,
      stop_authority_role: data.stop_authority_role,
      defend_authority_name: data.defend_authority_name,
      defend_authority_role: data.defend_authority_role,
      escalation_ceiling: data.escalation_ceiling,
      named_by_name: data.named_by_name,
      named_by_role: data.named_by_role,
    },
    { timestamp: true }
  );

  return NextResponse.json({ record: data });
}
