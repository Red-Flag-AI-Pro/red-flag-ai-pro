import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { DOCUMENT_LABELS, type ProgramDocumentBundle } from "@/lib/program-documents";
import type { DocumentException } from "@/lib/document-exceptions";

// Brad Wolfe, 12-13 Aug 2026: a rejection has a counterparty, and the
// exceptions worth counting are raised by somebody whose own results move
// with the answer. Both facts are captured here as frozen text at the moment
// of the event -- raiser, stake, and counterparty on raise; resolver and
// outcome on resolve -- and both moments are sealed as independently
// timestamped audit events. An exception that can quietly disappear, or
// quietly resolve itself, is not evidence of a working review process.
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

  const {
    action, documentKey, note, stake,
    raisedByName, raisedByRole, counterpartyName, counterpartyRole,
    exceptionIndex, outcome, resolvedByName, resolvedByRole, resolutionNote,
  } = (body ?? {}) as Record<string, unknown>;

  const { data: order } = await supabase
    .from("program_orders")
    .select("id, document_exceptions")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const exceptions: DocumentException[] = Array.isArray(order.document_exceptions)
    ? order.document_exceptions
    : [];
  const service = await createServiceClient();

  if (action === "raise") {
    const validKeys = DOCUMENT_LABELS.map((d) => d.key);
    if (typeof documentKey !== "string" || !validKeys.includes(documentKey as keyof ProgramDocumentBundle)) {
      return NextResponse.json({ error: "Invalid documentKey." }, { status: 400 });
    }
    const noteText = typeof note === "string" ? note.trim() : "";
    const stakeText = typeof stake === "string" ? stake.trim() : "";
    const raiserName = typeof raisedByName === "string" ? raisedByName.trim() : "";
    const raiserRole = typeof raisedByRole === "string" ? raisedByRole.trim() : "";
    const cpName = typeof counterpartyName === "string" ? counterpartyName.trim() : "";
    const cpRole = typeof counterpartyRole === "string" ? counterpartyRole.trim() : "";

    if (!noteText) {
      return NextResponse.json({ error: "Say what is wrong — an exception without content is a click." }, { status: 400 });
    }
    if (!stakeText) {
      return NextResponse.json(
        { error: "Stake is required — what of yours gets worse if this answer is wrong? An exception from someone with nothing riding on the answer is not the kind worth counting." },
        { status: 400 }
      );
    }
    if (!raiserName || !raiserRole || !cpName || !cpRole) {
      return NextResponse.json(
        { error: "Raiser and counterparty name and role are all required — a disagreement without a receiver is a note to self." },
        { status: 400 }
      );
    }

    const event: DocumentException = {
      document_key: documentKey,
      raised_by_name: raiserName,
      raised_by_role: raiserRole,
      stake: stakeText,
      counterparty_name: cpName,
      counterparty_role: cpRole,
      note: noteText,
      raised_at: new Date().toISOString(),
      status: "open",
    };

    const { error: updateError } = await service
      .from("program_orders")
      .update({ document_exceptions: [...exceptions, event] })
      .eq("id", id);
    if (updateError) {
      return NextResponse.json({ error: "Could not record the exception." }, { status: 500 });
    }

    const verifyId = await logAuditEvent(
      user.id,
      "program_document.exception_raised",
      { program_order_id: id, ...event },
      { timestamp: true }
    );

    return NextResponse.json({
      ok: true,
      verify_url: verifyId ? `https://www.redflagaipro.com/verify?id=${verifyId}` : null,
    });
  }

  if (action === "resolve") {
    const idx = typeof exceptionIndex === "number" ? exceptionIndex : -1;
    if (idx < 0 || idx >= exceptions.length || exceptions[idx].status !== "open") {
      return NextResponse.json({ error: "No open exception at that index." }, { status: 404 });
    }
    if (outcome !== "document_corrected" && outcome !== "exception_declined") {
      return NextResponse.json(
        { error: "outcome must be 'document_corrected' or 'exception_declined'." },
        { status: 400 }
      );
    }
    const resolverName = typeof resolvedByName === "string" ? resolvedByName.trim() : "";
    const resolverRole = typeof resolvedByRole === "string" ? resolvedByRole.trim() : "";
    if (!resolverName || !resolverRole) {
      return NextResponse.json({ error: "Resolver name and role are both required." }, { status: 400 });
    }
    const resolutionText = typeof resolutionNote === "string" ? resolutionNote.trim() : "";
    // Declining someone's exception without saying why is the same empty
    // certification this whole chain of features exists to expose.
    if (outcome === "exception_declined" && !resolutionText) {
      return NextResponse.json(
        { error: "Declining an exception requires a reason." },
        { status: 400 }
      );
    }

    const resolved: DocumentException = {
      ...exceptions[idx],
      status: outcome,
      resolved_by_name: resolverName,
      resolved_by_role: resolverRole,
      resolution_note: resolutionText || null,
      resolved_at: new Date().toISOString(),
    };
    const next = [...exceptions];
    next[idx] = resolved;

    const { error: updateError } = await service
      .from("program_orders")
      .update({ document_exceptions: next })
      .eq("id", id);
    if (updateError) {
      return NextResponse.json({ error: "Could not record the resolution." }, { status: 500 });
    }

    const verifyId = await logAuditEvent(
      user.id,
      "program_document.exception_resolved",
      { program_order_id: id, ...resolved },
      { timestamp: true }
    );

    return NextResponse.json({
      ok: true,
      verify_url: verifyId ? `https://www.redflagaipro.com/verify?id=${verifyId}` : null,
    });
  }

  return NextResponse.json({ error: "action must be 'raise' or 'resolve'." }, { status: 400 });
}
