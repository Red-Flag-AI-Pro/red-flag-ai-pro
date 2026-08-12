import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { DOCUMENT_LABELS, type ProgramDocumentBundle } from "@/lib/program-documents";
import { generateCanary, isTrueCatch, type CanaryEvent } from "@/lib/canary-check";

// Task #137. Two-step flow, owner initiated, per document:
//
//   start   -- the server plants one known material error in the document's
//              own generated content and returns the altered text for the
//              reviewer to read. What changed stays server-side, recorded on
//              the pending event, never sent to the client -- the reviewer
//              can only "know" the answer by reading.
//   respond -- the reviewer either certifies the canary as accurate (missed)
//              or flags it (caught). A flag only grades as a true catch when
//              the note names what was actually wrong, checked against the
//              planted alteration -- the same specificity bar sign-off notes
//              are held to.
//
// The outcome is a sealed audit event, independently timestamped. That's the
// point of the whole exercise: not a score on a dashboard but a dated fact
// about whether a named reviewer's certification behavior survives contact
// with a document that is known to be wrong. The real document of record is
// never touched -- the canary exists only in the review presentation and
// in the evidence about it.
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

  const { action, documentKey, response, note, respondedByName, respondedByRole } = (body ?? {}) as {
    action?: unknown;
    documentKey?: unknown;
    response?: unknown;
    note?: unknown;
    respondedByName?: unknown;
    respondedByRole?: unknown;
  };

  const validKeys = DOCUMENT_LABELS.map((d) => d.key);
  if (typeof documentKey !== "string" || !validKeys.includes(documentKey as keyof ProgramDocumentBundle)) {
    return NextResponse.json({ error: "Invalid documentKey." }, { status: 400 });
  }
  const key = documentKey as keyof ProgramDocumentBundle;

  const { data: order } = await supabase
    .from("program_orders")
    .select("id, canary_checks")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const events: CanaryEvent[] = Array.isArray(order.canary_checks) ? order.canary_checks : [];
  const service = await createServiceClient();

  if (action === "start") {
    const pending = events.find((e) => e.document_key === key && e.status === "pending");
    if (pending) {
      return NextResponse.json(
        { error: "A canary check is already open on this document. Respond to it first." },
        { status: 409 }
      );
    }

    // Content fetched server-side from the row, same as the sign-off hash --
    // the canary is planted in what the document actually says right now,
    // not in anything the client supplied.
    const { data: fullOrder } = await service
      .from("program_orders")
      .select(key)
      .eq("id", id)
      .maybeSingle();
    const docContent = (fullOrder as Record<string, { content?: string }> | null)?.[key]?.content;
    if (!docContent) {
      return NextResponse.json({ error: "This document has no content to check." }, { status: 400 });
    }

    const canary = generateCanary(docContent);
    if (!canary) {
      return NextResponse.json(
        { error: "No alterable anchor found in this document." },
        { status: 400 }
      );
    }

    const event: CanaryEvent = {
      document_key: key,
      kind: canary.alteration.kind,
      original_excerpt: canary.alteration.original,
      altered_excerpt: canary.alteration.altered,
      canary_sha256: createHash("sha256").update(canary.alteredContent).digest("hex"),
      presented_at: new Date().toISOString(),
      status: "pending",
    };

    const { error: updateError } = await service
      .from("program_orders")
      .update({ canary_checks: [...events, event] })
      .eq("id", id);
    if (updateError) {
      return NextResponse.json({ error: "Could not start the canary check." }, { status: 500 });
    }

    // The altered content goes to the client; what changed does not.
    return NextResponse.json({ ok: true, alteredContent: canary.alteredContent, presentedAt: event.presented_at });
  }

  if (action === "respond") {
    const pendingIndex = events.findIndex((e) => e.document_key === key && e.status === "pending");
    if (pendingIndex === -1) {
      return NextResponse.json({ error: "No open canary check on this document." }, { status: 404 });
    }
    if (response !== "confirmed" && response !== "flagged") {
      return NextResponse.json({ error: "response must be 'confirmed' or 'flagged'." }, { status: 400 });
    }
    const nameText = typeof respondedByName === "string" ? respondedByName.trim() : "";
    const roleText = typeof respondedByRole === "string" ? respondedByRole.trim() : "";
    if (!nameText || !roleText) {
      // Frozen text, same rule as sign-offs: the record captures who they
      // were at this moment, never a lookup that could read differently
      // later.
      return NextResponse.json(
        { error: "Name and role of who's responding are both required." },
        { status: 400 }
      );
    }
    const noteText = typeof note === "string" ? note.trim() : "";

    const pending = events[pendingIndex];
    const respondedAt = new Date().toISOString();
    const alteration = {
      kind: pending.kind,
      original: pending.original_excerpt,
      altered: pending.altered_excerpt,
    };
    const caught = response === "flagged";
    const completed: CanaryEvent = {
      ...pending,
      status: caught ? "caught" : "missed",
      responded_at: respondedAt,
      responded_by_name: nameText,
      responded_by_role: roleText,
      response_note: noteText || null,
      true_catch: caught ? isTrueCatch(noteText, alteration) : false,
      dwell_seconds: Math.max(
        0,
        Math.round((new Date(respondedAt).getTime() - new Date(pending.presented_at).getTime()) / 1000)
      ),
    };

    const nextEvents = [...events];
    nextEvents[pendingIndex] = completed;
    const { error: updateError } = await service
      .from("program_orders")
      .update({ canary_checks: nextEvents })
      .eq("id", id);
    if (updateError) {
      return NextResponse.json({ error: "Could not record the response." }, { status: 500 });
    }

    const verifyId = await logAuditEvent(
      user.id,
      "program_document.canary_check",
      { program_order_id: id, ...completed },
      { timestamp: true }
    );

    return NextResponse.json({
      ok: true,
      status: completed.status,
      trueCatch: completed.true_catch,
      originalExcerpt: pending.original_excerpt,
      alteredExcerpt: pending.altered_excerpt,
      dwellSeconds: completed.dwell_seconds,
      verify_url: verifyId ? `https://www.redflagaipro.com/verify?id=${verifyId}` : null,
    });
  }

  return NextResponse.json({ error: "action must be 'start' or 'respond'." }, { status: 400 });
}
