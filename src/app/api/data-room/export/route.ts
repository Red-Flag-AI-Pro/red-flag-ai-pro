import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent, verifyAuditChain } from "@/lib/audit-log";

// Sentinel-only, same gate as /api/audit-log/verify. A Data Room export is a
// board/investor/auditor deliverable, the same "compliance evidence, board
// readiness" promise Sentinel already makes elsewhere, not a new SKU.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  if (profile?.plan !== "sentinel") {
    return NextResponse.json({ error: "Sentinel plan required" }, { status: 403 });
  }

  // enforcement_decisions has RLS with no select policy (service-role writes
  // only, same pattern as audit_log) — the account-wide aggregate needs the
  // service client, not the cookie-scoped one.
  const service = await createServiceClient();

  const [boundaryRecordsRes, programOrdersRes, assessmentRes, decisionsRes, chain] = await Promise.all([
    supabase
      .from("boundary_authorization_records")
      .select("id, decision, owner_name, expires_at, created_at")
      .eq("user_id", user.id),
    supabase
      .from("program_orders")
      .select("id, letter_grade, letter_grade_score, delivered_at, seal_id")
      .eq("user_id", user.id)
      .eq("status", "delivered"),
    supabase
      .from("governance_assessments")
      .select("score, risk_level, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    service
      .from("enforcement_decisions")
      .select("allowed")
      .eq("user_id", user.id),
    verifyAuditChain(user.id),
  ]);

  const boundaryRecords = boundaryRecordsRes.data ?? [];
  const now = new Date();
  const activeCount = boundaryRecords.filter((r) => new Date(r.expires_at) > now).length;
  const expiredCount = boundaryRecords.length - activeCount;

  const programOrders = programOrdersRes.data ?? [];
  const decisions = decisionsRes.data ?? [];
  const decisionsBlocked = decisions.filter((d) => d.allowed === false).length;

  const summary = {
    generated_at: now.toISOString(),
    boundary_records_count: boundaryRecords.length,
    boundary_records_active: activeCount,
    boundary_records_expired: expiredCount,
    program_orders_count: programOrders.length,
    program_orders: programOrders.map((o) => ({
      letter_grade: o.letter_grade,
      delivered_at: o.delivered_at,
      sealed: Boolean(o.seal_id),
    })),
    governance_assessment: assessmentRes.data
      ? { score: assessmentRes.data.score, risk_level: assessmentRes.data.risk_level, completed_at: assessmentRes.data.created_at }
      : null,
    real_time_gate_decisions_count: decisions.length,
    real_time_gate_decisions_blocked: decisionsBlocked,
    audit_chain_intact: chain.valid,
    audit_chain_checked_entries: chain.checkedEntries,
  };

  const contentSha256 = createHash("sha256").update(JSON.stringify(summary)).digest("hex");

  const entryId = await logAuditEvent(
    user.id,
    "data_room.exported",
    { ...summary, content_sha256: contentSha256 },
    { timestamp: true }
  );

  if (!entryId) {
    return NextResponse.json({ error: "Could not seal the export. Try again." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    summary,
    contentSha256,
    entryId,
    verify: `/verify?id=${entryId}`,
  });
}
