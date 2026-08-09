import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";

// Brad Wolfe, "standby capacity is not an asset you buy, it's a subscription,"
// 9 Aug 2026: reviewed and exercised are different facts, and only running a
// plan end to end produces a real finding. Restricted to incident_checklist
// server-side (not just in the UI) -- it's the one document among the six
// that's genuinely a standby capability rather than context, the other five
// don't have anything to "run."
const EXERCISABLE_DOCUMENT_KEY = "incident_checklist";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const { documentKey, note, exercisedBy, firstTime } = (body ?? {}) as {
    documentKey?: unknown;
    note?: unknown;
    exercisedBy?: unknown;
    firstTime?: unknown;
  };
  if (documentKey !== EXERCISABLE_DOCUMENT_KEY) {
    return NextResponse.json({ error: "Only the incident checklist can be exercised." }, { status: 400 });
  }
  if (typeof note !== "string" || !note.trim()) {
    return NextResponse.json({ error: "Say briefly what happened when you ran it — a finding is the point." }, { status: 400 });
  }
  // Brad Wolfe, 9 Aug 2026 follow-up: who ran it is the cheapest proxy for
  // whether the exercise resembled the real event. The document's regular
  // author running their own checklist tests their memory, not the document.
  if (typeof exercisedBy !== "string" || !exercisedBy.trim()) {
    return NextResponse.json({ error: "Name who actually ran it — testing your own memory isn't the same as testing the document." }, { status: 400 });
  }
  if (typeof firstTime !== "boolean") {
    return NextResponse.json({ error: "Say whether this is the first time that person has run it." }, { status: 400 });
  }

  const { data: order } = await supabase
    .from("program_orders")
    .select("id, document_reviews")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const nowIso = new Date().toISOString();
  const documentReviews = {
    ...(order.document_reviews as Record<
      string,
      { reviewed_at?: string; exercised_at?: string; exercise_note?: string; exercised_by?: string; exercised_first_time?: boolean }
    > ?? {}),
  };
  const existing = documentReviews[EXERCISABLE_DOCUMENT_KEY] ?? { reviewed_at: nowIso };
  documentReviews[EXERCISABLE_DOCUMENT_KEY] = {
    ...existing,
    exercised_at: nowIso,
    exercise_note: note.trim().slice(0, 2000),
    exercised_by: exercisedBy.trim().slice(0, 200),
    exercised_first_time: firstTime,
  };

  const service = await createServiceClient();
  const { error: updateError } = await service
    .from("program_orders")
    .update({ document_reviews: documentReviews })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Could not save the exercise record." }, { status: 500 });
  }

  // Independently timestamped, unlike a routine review confirmation -- an
  // exercise is a real finding about whether the plan works, worth being
  // able to prove happened on the date claimed.
  const verifyId = await logAuditEvent(
    user.id,
    "program_document.exercised",
    {
      program_order_id: id,
      document_key: EXERCISABLE_DOCUMENT_KEY,
      note: note.trim().slice(0, 2000),
      exercised_by: exercisedBy.trim().slice(0, 200),
      exercised_first_time: firstTime,
    },
    { timestamp: true }
  );

  return NextResponse.json({ ok: true, exercisedAt: nowIso, verifyId });
}
