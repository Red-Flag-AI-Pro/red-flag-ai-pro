import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import type { BoundaryOption, BoundaryRisk, BoundaryEvidence } from "@/types";

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireSentinelUser();
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
