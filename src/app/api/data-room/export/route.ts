import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent, verifyAuditChain } from "@/lib/audit-log";
import { getDocumentReviewStatus, type DocumentReviews } from "@/lib/program-document-review";
import { DOCUMENT_LABELS } from "@/lib/program-documents";
import { applyStalenessCeiling, type LetterGrade } from "@/lib/program-grade";

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
      .select("id, letter_grade, letter_grade_score, letter_grade_capped, letter_grade_not_started_count, delivered_at, seal_id, document_reviews")
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
    // Task #281: sealing a document at delivery proves nobody edited it, it
    // does not stop it going stale. A document past its review date without
    // a fresh confirmation is excluded from this export by name -- a
    // visible symptom in the diligence package, rather than a stale
    // document quietly reaching whoever reads this.
    //
    // Task #288 (Evelyne-Claudia Y., LinkedIn 9 Aug 2026): a stale document
    // used to only drop out of the list above -- the letter_grade sitting
    // next to it was still whatever was struck at generation, potentially
    // overstated. applyStalenessCeiling recomputes it live from the same
    // staleness this export already has to compute for the exclusion list,
    // so the headline grade in a board/investor deliverable can't outlive
    // the evidence it was based on.
    program_orders: programOrders.map((o) => {
      const reviews = o.document_reviews as DocumentReviews | null;
      const current: string[] = [];
      const excludedStale: string[] = [];
      if (o.delivered_at) {
        for (const doc of DOCUMENT_LABELS) {
          const status = getDocumentReviewStatus(doc.key, o.delivered_at, reviews);
          (status.stale ? excludedStale : current).push(doc.label);
        }
      }
      const liveGrade =
        o.letter_grade && o.letter_grade_score != null
          ? applyStalenessCeiling(
              {
                score: o.letter_grade_score,
                grade: o.letter_grade as LetterGrade,
                breakdown: [],
                capped: Boolean(o.letter_grade_capped),
                notStartedCount: o.letter_grade_not_started_count ?? 0,
              },
              excludedStale.length
            )
          : null;
      return {
        letter_grade: liveGrade?.grade ?? o.letter_grade,
        letter_grade_capped_by_staleness: excludedStale.length > 0 && Boolean(liveGrade?.capped),
        delivered_at: o.delivered_at,
        sealed: Boolean(o.seal_id),
        documents_included: current,
        documents_excluded_stale: excludedStale,
      };
    }),
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
