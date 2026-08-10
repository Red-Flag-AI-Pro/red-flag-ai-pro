import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { DOCUMENT_LABELS, type ProgramDocumentBundle } from "@/lib/program-documents";

// Task #281, corrected 10 Aug 2026 per Brad Wolfe: sealing and dependency are
// opposite instincts and shouldn't be one flag on one artifact. The sealed
// six document columns plus seal_id/seal_content_sha256 never change again
// after delivery -- that's the frozen half, proof of what was true on the
// day. This route is the live half: confirming that the current version
// still matches the sealed original (the common case, resets the review
// clock same as before) or, new, marking that it has actually diverged --
// something changed since delivery -- which writes to current_documents
// instead of quietly pretending the sealed original is still accurate.
// See src/lib/program-document-review.ts and the Data Room export.
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

  const { documentKey, changed, note } = (body ?? {}) as {
    documentKey?: unknown;
    changed?: unknown;
    note?: unknown;
  };
  const validKeys = DOCUMENT_LABELS.map((d) => d.key);
  if (typeof documentKey !== "string" || !validKeys.includes(documentKey as keyof ProgramDocumentBundle)) {
    return NextResponse.json({ error: "Invalid documentKey." }, { status: 400 });
  }
  const hasChanged = changed === true;
  if (hasChanged && (typeof note !== "string" || !note.trim())) {
    return NextResponse.json({ error: "Say what changed since the sealed original — that's what makes this a real divergence, not a guess." }, { status: 400 });
  }

  const { data: order } = await supabase
    .from("program_orders")
    .select("id, document_reviews, current_documents")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const nowIso = new Date().toISOString();
  const documentReviews = { ...(order.document_reviews as Record<string, { reviewed_at: string }> ?? {}) };
  documentReviews[documentKey] = { reviewed_at: nowIso };

  const currentDocuments = { ...(order.current_documents as Record<string, { note: string; updated_at: string }> ?? {}) };
  if (hasChanged) {
    currentDocuments[documentKey] = { note: (note as string).trim(), updated_at: nowIso };
  }

  const service = await createServiceClient();
  const { error: updateError } = await service
    .from("program_orders")
    .update({ document_reviews: documentReviews, current_documents: currentDocuments })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Could not save the confirmation." }, { status: 500 });
  }

  // Not independently timestamped -- routine, expected activity, not a
  // sign-off event. Logged so the confirmation itself has a record.
  await logAuditEvent(
    user.id,
    hasChanged ? "program_document.diverged" : "program_document.reviewed",
    { program_order_id: id, document_key: documentKey, ...(hasChanged ? { note } : {}) }
  );

  return NextResponse.json({ ok: true, reviewedAt: nowIso, diverged: hasChanged });
}
