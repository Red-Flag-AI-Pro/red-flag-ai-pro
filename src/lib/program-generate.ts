// Orchestrates the full £497 Full Governance Program pipeline for one order:
// generate the six documents, run the AI enhancement pass, compute the
// financial snapshot, the regulatory mapping, and the letter grade, save all
// of it, then seal the bundle. Called from the intake submission route
// (src/app/api/program/intake/route.ts) and re-callable from
// src/app/api/program/generate/route.ts for a manual retry.
//
// Uses the service role client throughout — this runs after Stripe payment
// has already been confirmed, driven by the order id, not by an
// RLS-visible session.

import type { SupabaseClient } from "@supabase/supabase-js";
import { generateAllProgramDocuments, DOCUMENT_LABELS } from "./program-documents";
import { enhanceProgramDocuments } from "./program-enhance";
import { computeFinancialSnapshot } from "./program-financial";
import { computeRegulatoryMapping } from "./program-regulatory-mapping";
import { calculateProgramScore } from "./program-grade";
import { sealProgramBundle } from "./program-seal";
import { PROGRAM_INTAKE_DEFAULTS, type ProgramIntake } from "./program-intake";

export interface ProgramGenerationResult {
  ok: boolean;
  error?: string;
}

// The intake column is read back from Supabase jsonb — merge onto the
// defaults so a partially saved intake (or one predating a field addition
// like annualTurnoverGBP) never crashes generation on a missing key.
function normalizeIntake(raw: unknown): ProgramIntake {
  return { ...PROGRAM_INTAKE_DEFAULTS, ...(raw && typeof raw === "object" ? raw : {}) } as ProgramIntake;
}

export async function runProgramGenerationPipeline(
  supabase: SupabaseClient,
  orderId: string
): Promise<ProgramGenerationResult> {
  const { data: order, error: fetchError } = await supabase
    .from("program_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return { ok: false, error: "Order not found." };
  }

  const intake = normalizeIntake(order.intake);
  if (!intake.systemName.trim() && !intake.companyName.trim()) {
    return { ok: false, error: "Intake has not been completed yet." };
  }

  await supabase.from("program_orders").update({ status: "generating" }).eq("id", orderId);

  try {
    const templateDocs = generateAllProgramDocuments(intake);
    const documents = await enhanceProgramDocuments(templateDocs, intake);

    const financialSnapshot = computeFinancialSnapshot(intake);
    const regulatoryMapping = computeRegulatoryMapping(intake);
    const { score, grade } = calculateProgramScore(intake);

    const { error: saveError } = await supabase
      .from("program_orders")
      .update({
        dpia: { content: documents.dpia },
        fria: { content: documents.fria },
        ai_use_policy: { content: documents.ai_use_policy },
        incident_checklist: { content: documents.incident_checklist },
        monitoring_plan: { content: documents.monitoring_plan },
        documentation: { content: documents.documentation },
        financial_snapshot: financialSnapshot,
        regulatory_mapping: regulatoryMapping,
        letter_grade: grade,
        letter_grade_score: score,
        status: "delivered",
        delivered_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (saveError) {
      console.error("program generation save failed:", saveError);
      await supabase.from("program_orders").update({ status: "error" }).eq("id", orderId);
      return { ok: false, error: "Could not save generated documents." };
    }

    // Sealing is best effort and non-blocking: a customer's bundle is fully
    // delivered whether or not the seal succeeds. seal_id/sealed_at stay
    // null on failure so it can be retried later without regenerating
    // anything.
    const seal = await sealProgramBundle({
      companyName: intake.companyName,
      systemName: intake.systemName,
      letterGrade: grade,
      letterGradeScore: score,
      maxExposureGBP: financialSnapshot.maxExposureGBP,
      jurisdictionLabel: financialSnapshot.jurisdictionLabel,
      documents: DOCUMENT_LABELS.map((d) => ({ label: d.label })),
    });

    if (seal) {
      await supabase
        .from("program_orders")
        .update({
          seal_id: seal.id,
          seal_content_sha256: seal.content_sha256,
          sealed_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    }

    return { ok: true };
  } catch (err) {
    console.error("program generation pipeline failed:", err);
    await supabase.from("program_orders").update({ status: "error" }).eq("id", orderId);
    return { ok: false, error: "Generation failed." };
  }
}
