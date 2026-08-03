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
  const ownerName: string = (body.owner_name ?? "").trim();
  const ownerRole: string = (body.owner_role ?? "").trim();
  const decisionDate: string = (body.decision_date ?? "").trim();
  const expiresAt: string = (body.expires_at ?? "").trim();

  if (!decision) return NextResponse.json({ error: "Decision is required." }, { status: 400 });
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
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create boundary record." }, { status: 500 });

  // The expiry and its falsifiers are part of what gets sealed: the grant's
  // shelf life must be provably part of the original record, not a later edit.
  // supersedes_id is sealed too — the chain of custody is part of the record,
  // not something added after the fact.
  await logAuditEvent(
    result.user.id,
    "boundary_record.created",
    { id: data.id, decision: data.decision, expires_at: data.expires_at, expiry_conditions: data.expiry_conditions, supersedes_id: data.supersedes_id },
    { timestamp: true }
  );

  return NextResponse.json({ record: data });
}
