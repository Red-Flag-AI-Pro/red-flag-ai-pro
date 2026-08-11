import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import type { BoundaryOption, BoundaryRisk, BoundaryEvidence, ExternalDependency, BoundaryWarning } from "@/types";

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
    return { error: "Editing boundary authorization records is a Sentinel feature." as const, status: 403 as const };
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

// Same sanitizers as POST (route.ts) — kept in sync, see there for the
// reasoning behind added_at/override_reason.
function sanitizeExternalDependencies(value: unknown): ExternalDependency[] {
  if (!Array.isArray(value)) return [];
  return (value as Record<string, unknown>[])
    .map((v) => ({
      name: typeof v?.name === "string" ? v.name.trim() : "",
      organisation: typeof v?.organisation === "string" && v.organisation.trim() ? v.organisation.trim() : null,
      fallback_tested: v?.fallback_tested === true,
      fallback_note: typeof v?.fallback_note === "string" && v.fallback_note.trim() ? v.fallback_note.trim() : null,
      added_at: typeof v?.added_at === "string" && v.added_at ? v.added_at : new Date().toISOString(),
    }))
    .filter((v) => v.name.length > 0);
}

function sanitizeWarnings(value: unknown): BoundaryWarning[] {
  if (!Array.isArray(value)) return [];
  return (value as Record<string, unknown>[])
    .map((v) => ({
      source_name: typeof v?.source_name === "string" ? v.source_name.trim() : "",
      source_role: typeof v?.source_role === "string" && v.source_role.trim() ? v.source_role.trim() : null,
      warning_text: typeof v?.warning_text === "string" ? v.warning_text.trim() : "",
      overridden_at: typeof v?.overridden_at === "string" && v.overridden_at ? v.overridden_at : new Date().toISOString(),
      override_reason: typeof v?.override_reason === "string" ? v.override_reason.trim() : "",
    }))
    .filter((v) => v.warning_text.length > 0 && v.override_reason.length > 0);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { data, error } = await result.supabase
    .from("boundary_authorization_records")
    .select("*")
    .eq("id", id)
    .eq("user_id", result.user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Boundary record not found." }, { status: 404 });
  return NextResponse.json({ record: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireSentinelUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if ("decision" in body) {
    const decision = (body.decision ?? "").trim();
    if (!decision) return NextResponse.json({ error: "Decision is required." }, { status: 400 });
    updates.decision = decision;
  }
  if ("owner_name" in body) {
    const ownerName = (body.owner_name ?? "").trim();
    if (!ownerName) return NextResponse.json({ error: "Owner name is required." }, { status: 400 });
    updates.owner_name = ownerName;
  }
  if ("owner_role" in body) {
    const ownerRole = (body.owner_role ?? "").trim();
    if (!ownerRole) return NextResponse.json({ error: "Owner role is required." }, { status: 400 });
    updates.owner_role = ownerRole;
  }
  if ("decision_date" in body) {
    const decisionDate = (body.decision_date ?? "").trim();
    if (!decisionDate) return NextResponse.json({ error: "Decision date is required." }, { status: 400 });
    updates.decision_date = decisionDate;
  }
  if ("options_considered" in body) updates.options_considered = sanitizeOptions(body.options_considered);
  if ("risks_accepted" in body) updates.risks_accepted = sanitizeRisks(body.risks_accepted);
  if ("external_dependencies" in body) updates.external_dependencies = sanitizeExternalDependencies(body.external_dependencies);
  if ("warnings_overridden" in body) updates.warnings_overridden = sanitizeWarnings(body.warnings_overridden);
  if ("evidence" in body) updates.evidence = sanitizeEvidence(body.evidence);

  const { data, error } = await result.supabase
    .from("boundary_authorization_records")
    .update(updates)
    .eq("id", id)
    .eq("user_id", result.user.id)
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: "Failed to update boundary record." }, { status: 500 });

  await logAuditEvent(result.user.id, "boundary_record.updated", { id: data.id, decision: data.decision }, { timestamp: true });

  return NextResponse.json({ record: data });
}
