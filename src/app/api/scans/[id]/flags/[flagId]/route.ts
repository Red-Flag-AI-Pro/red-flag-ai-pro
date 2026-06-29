import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import type { Disposition } from "@/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; flagId: string }> }
) {
  const { id: scanId, flagId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, full_name")
    .eq("user_id", user.id)
    .single();

  if (profile?.plan !== "sentinel") {
    return NextResponse.json(
      { error: "Disposition sign-off requires a Sentinel plan." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const disposition: Disposition = body.disposition;
  const reviewerNote: string | undefined = body.reviewer_note;

  if (!["resolved", "accepted_risk", "not_applicable"].includes(disposition)) {
    return NextResponse.json({ error: "Invalid disposition." }, { status: 400 });
  }

  const { data: scan } = await supabase
    .from("scans")
    .select("id")
    .eq("id", scanId)
    .eq("user_id", user.id)
    .single();

  if (!scan) return NextResponse.json({ error: "Scan not found." }, { status: 404 });

  const reviewedAt = new Date().toISOString();
  const reviewerName = profile.full_name ?? user.email ?? user.id;

  const { data: updated, error } = await supabase
    .from("scan_flags")
    .update({
      disposition,
      reviewed_by: reviewerName,
      reviewed_at: reviewedAt,
      reviewer_note: reviewerNote ?? null,
    })
    .eq("id", flagId)
    .eq("scan_id", scanId)
    .select()
    .single();

  if (error || !updated) {
    return NextResponse.json({ error: "Failed to update flag." }, { status: 500 });
  }

  await logAuditEvent(user.id, "flag_reviewed", {
    scanId,
    flagId,
    disposition,
    reviewedBy: reviewerName,
    reviewerNote: reviewerNote ?? null,
    category: updated.category,
    severity: updated.severity,
  });

  return NextResponse.json({ flag: updated });
}
