import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { DOCUMENT_LABELS, type ProgramDocumentBundle } from "@/lib/program-documents";

// Brad Wolfe, 10 Aug 2026: signoffs are append-only, so a withdrawal is its
// own dated event with its own name, never a deletion of the original. "The
// one somebody wants later is always the one that was reversed" -- his
// point, kept: the original signed event stays in the array exactly as it
// was, this just appends a newer event on top of it.
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

  const { documentKey, withdrawnByName, withdrawnByRole, reason } = (body ?? {}) as {
    documentKey?: unknown;
    withdrawnByName?: unknown;
    withdrawnByRole?: unknown;
    reason?: unknown;
  };

  const validKeys = DOCUMENT_LABELS.map((d) => d.key);
  if (typeof documentKey !== "string" || !validKeys.includes(documentKey as keyof ProgramDocumentBundle)) {
    return NextResponse.json({ error: "Invalid documentKey." }, { status: 400 });
  }
  const key = documentKey as keyof ProgramDocumentBundle;

  const nameText = typeof withdrawnByName === "string" ? withdrawnByName.trim() : "";
  const roleText = typeof withdrawnByRole === "string" ? withdrawnByRole.trim() : "";
  const reasonText = typeof reason === "string" ? reason.trim() : "";

  if (!nameText || !roleText) {
    return NextResponse.json({ error: "Name and role of who's withdrawing this are both required." }, { status: 400 });
  }
  if (!reasonText) {
    return NextResponse.json({ error: "Say why this is being withdrawn — a withdrawal with no reason is as thin as a signoff with no note." }, { status: 400 });
  }

  const { data: order } = await supabase
    .from("program_orders")
    .select("id, artifact_signoffs")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const signoffs = { ...(order.artifact_signoffs as Record<string, { type: string }[]> ?? {}) };
  const existing = Array.isArray(signoffs[key]) ? signoffs[key] : [];
  const latest = existing[existing.length - 1];

  if (!latest || latest.type !== "signed") {
    return NextResponse.json({ error: "There's no active certification on this document to withdraw." }, { status: 409 });
  }

  const nowIso = new Date().toISOString();
  const event = {
    type: "withdrawn" as const,
    withdrawn_by_name: nameText,
    withdrawn_by_role: roleText,
    reason: reasonText,
    at: nowIso,
  };
  signoffs[key] = [...existing, event];

  const service = await createServiceClient();
  const { error: updateError } = await service
    .from("program_orders")
    .update({ artifact_signoffs: signoffs })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Could not save the withdrawal." }, { status: 500 });
  }

  const verifyId = await logAuditEvent(
    user.id,
    "program_document.artifact_signoff_withdrawn",
    { program_order_id: id, document_key: key, ...event },
    { timestamp: true }
  );

  return NextResponse.json({
    ok: true,
    withdrawnAt: nowIso,
    verify_url: verifyId ? `https://www.redflagaipro.com/verify?id=${verifyId}` : null,
  });
}
