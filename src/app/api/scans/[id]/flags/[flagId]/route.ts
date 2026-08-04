import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { RULESET_VERSION } from "@/lib/analyzer";
import type { Disposition, InitialRead } from "@/types";

// Commit before reveal, step one: the reviewer records their own read of the
// flag BEFORE the AI's reasoning is shown to them. Sealed immediately as its
// own event, so the ordering (human judgment first, machine reasoning second)
// is provable rather than a UI promise. A commit cannot be redone: the first
// read is the honest one, and overwriting it would defeat the whole point.
export async function POST(
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
    return NextResponse.json({ error: "Flag review requires a Sentinel plan." }, { status: 403 });
  }

  const body = await request.json();
  const initialRead: InitialRead = body.initial_read;
  const initialReadNote: string | undefined = body.initial_read_note;

  if (!["real_issue", "unsure", "not_applicable"].includes(initialRead)) {
    return NextResponse.json({ error: "Invalid initial read." }, { status: 400 });
  }

  const { data: scan } = await supabase
    .from("scans")
    .select("id")
    .eq("id", scanId)
    .eq("user_id", user.id)
    .single();
  if (!scan) return NextResponse.json({ error: "Scan not found." }, { status: 404 });

  const { data: existing } = await supabase
    .from("scan_flags")
    .select("id, initial_read, disposition, category, severity")
    .eq("id", flagId)
    .eq("scan_id", scanId)
    .single();
  if (!existing) return NextResponse.json({ error: "Flag not found." }, { status: 404 });
  if (existing.initial_read) {
    return NextResponse.json({ error: "Initial read already recorded. The first read is the one that counts." }, { status: 409 });
  }
  if (existing.disposition) {
    return NextResponse.json({ error: "This flag is already signed off." }, { status: 409 });
  }

  const initialReadAt = new Date().toISOString();
  const { data: updated, error } = await supabase
    .from("scan_flags")
    .update({
      initial_read: initialRead,
      initial_read_note: initialReadNote ?? null,
      initial_read_at: initialReadAt,
    })
    .eq("id", flagId)
    .eq("scan_id", scanId)
    .select()
    .single();

  if (error || !updated) {
    return NextResponse.json({ error: "Failed to record initial read." }, { status: 500 });
  }

  await logAuditEvent(user.id, "flag_initial_read", {
    scanId,
    flagId,
    initialRead,
    initialReadNote: initialReadNote ?? null,
    recordedBy: profile.full_name ?? user.email ?? user.id,
    category: existing.category,
    severity: existing.severity,
    rulesetVersion: RULESET_VERSION,
  }, { timestamp: true });

  return NextResponse.json({ flag: updated });
}

// Remediation: a distinct, later confirmation that the underlying issue was
// actually fixed, not the same event as the original disposition. A reviewer
// marking a flag "resolved" is a judgment call made at review time; this is
// a separate, dated claim that the fix genuinely happened, sealed on its own
// so the two can never be collapsed into one event that overstates either.
export async function PUT(
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
    return NextResponse.json({ error: "Remediation tracking requires a Sentinel plan." }, { status: 403 });
  }

  const body = await request.json();
  const remediatedNote: string = (body.remediated_note ?? "").trim();
  if (!remediatedNote) {
    return NextResponse.json({ error: "Describe what was actually fixed." }, { status: 400 });
  }

  const { data: scan } = await supabase
    .from("scans")
    .select("id")
    .eq("id", scanId)
    .eq("user_id", user.id)
    .single();
  if (!scan) return NextResponse.json({ error: "Scan not found." }, { status: 404 });

  const { data: currentFlag } = await supabase
    .from("scan_flags")
    .select("disposition, remediated_at, category, severity")
    .eq("id", flagId)
    .eq("scan_id", scanId)
    .single();
  if (!currentFlag) return NextResponse.json({ error: "Flag not found." }, { status: 404 });
  if (!currentFlag.disposition) {
    return NextResponse.json({ error: "Sign off on this flag before marking it remediated." }, { status: 409 });
  }
  if (currentFlag.remediated_at) {
    return NextResponse.json({ error: "Already marked remediated. That record doesn't get overwritten." }, { status: 409 });
  }

  const remediatedAt = new Date().toISOString();
  const remediatedBy = profile.full_name ?? user.email ?? user.id;

  const { data: updated, error } = await supabase
    .from("scan_flags")
    .update({ remediated_at: remediatedAt, remediated_note: remediatedNote })
    .eq("id", flagId)
    .eq("scan_id", scanId)
    .select()
    .single();

  if (error || !updated) {
    return NextResponse.json({ error: "Failed to record remediation." }, { status: 500 });
  }

  await logAuditEvent(user.id, "flag_remediated", {
    scanId,
    flagId,
    remediatedNote,
    remediatedBy,
    disposition: currentFlag.disposition,
    category: currentFlag.category,
    severity: currentFlag.severity,
  }, { timestamp: true });

  return NextResponse.json({ flag: updated });
}

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
  const reviewerRole: string | undefined = body.reviewer_role;
  const reviewerMandate: string | undefined = body.reviewer_mandate;

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

  // Commit before reveal, step two: no disposition without a committed
  // initial read. Enforced here, not just hidden in the UI, so the ordering
  // guarantee holds even against a direct API call.
  const { data: currentFlag } = await supabase
    .from("scan_flags")
    .select("initial_read, initial_read_at")
    .eq("id", flagId)
    .eq("scan_id", scanId)
    .single();
  if (!currentFlag) return NextResponse.json({ error: "Flag not found." }, { status: 404 });
  if (!currentFlag.initial_read) {
    return NextResponse.json(
      { error: "Record your own read of this flag before signing off. The reasoning reveals after you commit." },
      { status: 409 }
    );
  }

  const reviewedAt = new Date().toISOString();
  const reviewerName = profile.full_name ?? user.email ?? user.id;

  const { data: updated, error } = await supabase
    .from("scan_flags")
    .update({
      disposition,
      reviewed_by: reviewerName,
      reviewed_at: reviewedAt,
      reviewer_note: reviewerNote ?? null,
      reviewer_role: reviewerRole ?? null,
      reviewer_mandate: reviewerMandate ?? null,
    })
    .eq("id", flagId)
    .eq("scan_id", scanId)
    .select()
    .single();

  if (error || !updated) {
    return NextResponse.json({ error: "Failed to update flag." }, { status: 500 });
  }

  // The ruleset version in force at the moment of sign-off is part of the
  // sealed decision: later reconstruction can say what the rules say NOW,
  // only this can say what the reviewer was actually judging against THEN.
  await logAuditEvent(user.id, "flag_reviewed", {
    scanId,
    flagId,
    disposition,
    reviewedBy: reviewerName,
    reviewerRole: reviewerRole ?? null,
    reviewerMandate: reviewerMandate ?? null,
    reviewerNote: reviewerNote ?? null,
    category: updated.category,
    severity: updated.severity,
    rulesetVersion: RULESET_VERSION,
    // The committed pre-reveal read travels with the final sign-off, so one
    // sealed event shows both what the reviewer thought before seeing the
    // AI's reasoning and what they concluded after.
    initialRead: currentFlag.initial_read,
    initialReadAt: currentFlag.initial_read_at,
  }, { timestamp: true });

  return NextResponse.json({ flag: updated });
}
