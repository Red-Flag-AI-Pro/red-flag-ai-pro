import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { RULESET_VERSION } from "@/lib/analyzer";

const ADMIN_EMAIL = "redflagaipro@gmail.com";

// Admin-only. Records that a named person actually looked at the current
// ruleset again — the thing RULESET_VERSION alone can't prove. Always logs
// against the live RULESET_VERSION, never a value passed in, so a review
// can't be backdated to a version that no longer matches the real rules.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const { reviewedBy, reviewerRole, contextNote, nextReviewDue } = (body ?? {}) as {
    reviewedBy?: unknown;
    reviewerRole?: unknown;
    contextNote?: unknown;
    nextReviewDue?: unknown;
  };

  if (typeof reviewedBy !== "string" || !reviewedBy.trim() || typeof reviewerRole !== "string" || !reviewerRole.trim()) {
    return NextResponse.json(
      { error: "Expected reviewedBy (string) and reviewerRole (string). contextNote and nextReviewDue are optional." },
      { status: 400 }
    );
  }

  const service = await createServiceClient();
  const { data, error } = await service
    .from("ruleset_reviews")
    .insert({
      ruleset_version: RULESET_VERSION,
      reviewed_by: reviewedBy.trim(),
      reviewer_role: reviewerRole.trim(),
      context_note: typeof contextNote === "string" && contextNote.trim() ? contextNote.trim() : null,
      next_review_due: typeof nextReviewDue === "string" && nextReviewDue.trim() ? nextReviewDue.trim() : null,
    })
    .select("id, ruleset_version, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Could not record the review. Try again." }, { status: 502 });
  }

  return NextResponse.json({ recorded: true, ...data });
}

export async function GET() {
  const service = await createServiceClient();
  const { data: latest } = await service
    .from("ruleset_reviews")
    .select("id, ruleset_version, reviewed_by, reviewer_role, context_note, next_review_due, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const isCurrent = latest?.ruleset_version === RULESET_VERSION;
  const dueDate = latest?.next_review_due ? new Date(latest.next_review_due) : null;
  const isOverdue = dueDate ? dueDate.getTime() < Date.now() : false;

  return NextResponse.json({
    current_ruleset_version: RULESET_VERSION,
    latest_review: latest ?? null,
    stale: !latest || !isCurrent || isOverdue,
    stale_reason: !latest
      ? "never_reviewed"
      : !isCurrent
        ? "ruleset_changed_since_review"
        : isOverdue
          ? "review_overdue"
          : null,
  });
}
