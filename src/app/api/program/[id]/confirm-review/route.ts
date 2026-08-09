import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { DOCUMENT_LABELS, type ProgramDocumentBundle } from "@/lib/program-documents";

// Task #281: the actual gate a stale program document depends on. Confirming
// here is what resets a document's review clock (see
// src/lib/program-document-review.ts) -- without ever calling this, a
// document goes stale and the AI Governance Data Room export (task #265)
// excludes it rather than silently including something nobody has looked
// at again since delivery.
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

  const { documentKey } = (body ?? {}) as { documentKey?: unknown };
  const validKeys = DOCUMENT_LABELS.map((d) => d.key);
  if (typeof documentKey !== "string" || !validKeys.includes(documentKey as keyof ProgramDocumentBundle)) {
    return NextResponse.json({ error: "Invalid documentKey." }, { status: 400 });
  }

  const { data: order } = await supabase
    .from("program_orders")
    .select("id, document_reviews")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const nowIso = new Date().toISOString();
  const documentReviews = { ...(order.document_reviews as Record<string, { reviewed_at: string }> ?? {}) };
  documentReviews[documentKey] = { reviewed_at: nowIso };

  const service = await createServiceClient();
  const { error: updateError } = await service
    .from("program_orders")
    .update({ document_reviews: documentReviews })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Could not save the confirmation." }, { status: 500 });
  }

  // Not independently timestamped -- routine, expected activity, not a
  // sign-off event. Logged so the confirmation itself has a record.
  await logAuditEvent(user.id, "program_document.reviewed", { program_order_id: id, document_key: documentKey });

  return NextResponse.json({ ok: true, reviewedAt: nowIso });
}
