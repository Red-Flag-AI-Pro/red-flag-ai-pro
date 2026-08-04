import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import type { BoundaryOption, BoundaryRisk, BoundaryEvidence, BoundaryFalsifier } from "@/types";

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
    return { error: "Boundary authorization records are available on Sentinel." as const, status: 403 as const };
  }

  return { supabase, user };
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
  const result = await requireSentinelUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { data, error } = await result.supabase
    .from("boundary_authorization_records")
    .select("*")
    .order("decision_date", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to load boundary records." }, { status: 500 });
  return NextResponse.json({ records: data ?? [] });
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
  const ownerName: string = (body.owner_name ?? "").trim();
  const ownerRole: string = (body.owner_role ?? "").trim();
  const decisionDate: string = (body.decision_date ?? "").trim();
  const expiresAt: string = (body.expires_at ?? "").trim();
  // Who is on the hook for renewing this or arranging a successor before it
  // lapses, not the authority holder themselves. Optional, since not every
  // record has a distinct continuity duty, but nameable when it does.
  const continuityOwnerName: string | null = typeof body.continuity_owner_name === "string" && body.continuity_owner_name.trim() ? body.continuity_owner_name.trim() : null;
  const continuityOwnerRole: string | null = typeof body.continuity_owner_role === "string" && body.continuity_owner_role.trim() ? body.continuity_owner_role.trim() : null;

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

  // If this record replaces an earlier one, the record it supersedes must
  // actually belong to this user — otherwise a chain of custody could be
  // forged by pointing at someone else's record.
  const supersedesId: string | null = typeof body.supersedes_id === "string" && body.supersedes_id.trim() ? body.supersedes_id.trim() : null;
  if (supersedesId) {
    const { data: priorRecord } = await result.supabase
      .from("boundary_authorization_records")
      .select("id")
      .eq("id", supersedesId)
      .eq("user_id", result.user.id)
      .maybeSingle();
    if (!priorRecord) return NextResponse.json({ error: "The record you're superseding was not found." }, { status: 400 });
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
      grant_type: grantType,
      credential_reference: credentialReference,
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
  const isComplete = Boolean(continuityOwnerName) && sanitizeFalsifiers(body.expiry_conditions).length > 0;

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
    },
    { timestamp: true }
  );

  return NextResponse.json({ record: data });
}
