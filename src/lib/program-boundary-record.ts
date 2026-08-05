// Creates the boundary authorization record included with the £297 Full
// Governance Program (task #243). Everywhere else on the site, creating one
// of these is Sentinel-only (requireSentinelUser in the boundary-records
// API); this is the one place a non-Sentinel customer gets one, because the
// program purchase itself is the authorization event being recorded.
//
// Uses the service role client directly rather than the gated API route —
// the program pipeline already runs as an internal, order-id-driven process
// after payment is confirmed, the same pattern as program-seal.ts.

import type { SupabaseClient } from "@supabase/supabase-js";
import { logAuditEvent } from "./audit-log";
import type { ProgramIntake } from "./program-intake";
import { DOCUMENT_LABELS } from "./program-documents";

export interface ProgramBoundaryRecordResult {
  id: string;
  ownerName: string;
  ownerRole: string;
  expiresAt: string;
}

export async function createProgramBoundaryRecord(
  supabase: SupabaseClient,
  userId: string,
  intake: ProgramIntake
): Promise<ProgramBoundaryRecordResult | null> {
  // Named to the company itself if no approver was given, rather than
  // inventing a person nobody told us about.
  const ownerName = intake.approverName.trim() || intake.companyName.trim() || "Unnamed company";
  const ownerRole = intake.approverRole.trim() || "Authorized signatory";

  const decisionDate = new Date().toISOString().slice(0, 10);
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  const expiresAt = expiry.toISOString().slice(0, 10);

  const decision = intake.purpose.trim()
    ? `Approved use of ${intake.systemName.trim() || "this AI system"}: ${intake.purpose.trim()}`
    : `Approved use of ${intake.systemName.trim() || "this AI system"}`;

  const evidence = DOCUMENT_LABELS.map((d) => ({ label: d.label }));

  const { data, error } = await supabase
    .from("boundary_authorization_records")
    .insert({
      user_id: userId,
      decision,
      owner_name: ownerName,
      owner_role: ownerRole,
      options_considered: [],
      risks_accepted: [],
      evidence,
      decision_date: decisionDate,
      expires_at: expiresAt,
      expiry_conditions: [],
      grant_type: "decision",
    })
    .select()
    .single();

  if (error || !data) {
    console.error("program boundary record creation failed:", error);
    return null;
  }

  // Same event shape as the real Sentinel-only creation route, so this
  // record is indistinguishable in the chain from one a Sentinel customer
  // made by hand — same seal, same RFC 3161 timestamp mechanism.
  await logAuditEvent(
    userId,
    "boundary_record.created",
    {
      id: data.id,
      decision: data.decision,
      expires_at: data.expires_at,
      expiry_conditions: data.expiry_conditions,
      supersedes_id: null,
      continuity_owner_name: null,
      continuity_owner_role: null,
      // Honestly false: no continuity owner, no falsifier conditions, and
      // no authority mode were given here, same completeness test the real
      // route applies to a record left just as sparse by hand.
      is_complete: false,
      recorded_by_user_id: userId,
      recorded_by_email: null,
      grant_type: data.grant_type,
      credential_reference: null,
      authority_mode: null,
      source: "program_purchase",
    },
    { timestamp: true }
  );

  return { id: data.id, ownerName, ownerRole, expiresAt };
}
