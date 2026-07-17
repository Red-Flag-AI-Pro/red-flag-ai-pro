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

  if (!decision) return NextResponse.json({ error: "Decision is required." }, { status: 400 });
  if (!ownerName) return NextResponse.json({ error: "Owner name is required." }, { status: 400 });
  if (!ownerRole) return NextResponse.json({ error: "Owner role is required." }, { status: 400 });
  if (!decisionDate) return NextResponse.json({ error: "Decision date is required." }, { status: 400 });

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
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create boundary record." }, { status: 500 });

  await logAuditEvent(result.user.id, "boundary_record.created", { id: data.id, decision: data.decision });

  return NextResponse.json({ record: data });
}
