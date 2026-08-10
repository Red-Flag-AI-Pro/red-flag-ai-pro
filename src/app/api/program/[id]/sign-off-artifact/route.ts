import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { DOCUMENT_LABELS, type ProgramDocumentBundle } from "@/lib/program-documents";

// Brad Wolfe, "How to let finance use AI and still be able to sign," 10 Aug
// 2026: this is a different fact from confirm-review. Confirming a document
// still matches the sealed original says the paperwork holds up. This says
// a specific named person is certifying this specific document as the
// source for something they're signing off on elsewhere -- his "class two."
// His explicit warning kept: this must stay a light, deliberate stamp a
// customer applies to the few documents that actually feed a number they
// certify, not routine activity on every document. His follow-up
// correction, also kept: accepted_by_name/role are frozen text captured
// now, never a lookup against a user_id that could read wrong later.
//
// Second follow-up, same day: a signoff without a content hash says a person
// certified A document, not that they certified THIS content -- three years
// out that's an argument, not an answer. content_sha256 is computed here,
// server-side, from the actual document content at this exact moment, never
// supplied by the client. And signoffs are append-only: each document key
// holds an array of events, never overwritten. A signoff that can silently
// disappear on a second call isn't evidence, his exact point.
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

  const { documentKey, source, modelVersion, acceptedByName, acceptedByRole, note } = (body ?? {}) as {
    documentKey?: unknown;
    source?: unknown;
    modelVersion?: unknown;
    acceptedByName?: unknown;
    acceptedByRole?: unknown;
    note?: unknown;
  };

  const validKeys = DOCUMENT_LABELS.map((d) => d.key);
  if (typeof documentKey !== "string" || !validKeys.includes(documentKey as keyof ProgramDocumentBundle)) {
    return NextResponse.json({ error: "Invalid documentKey." }, { status: 400 });
  }
  const key = documentKey as keyof ProgramDocumentBundle;

  const sourceText = typeof source === "string" ? source.trim() : "";
  const acceptedByNameText = typeof acceptedByName === "string" ? acceptedByName.trim() : "";
  const acceptedByRoleText = typeof acceptedByRole === "string" ? acceptedByRole.trim() : "";
  const modelVersionText = typeof modelVersion === "string" ? modelVersion.trim() : "";
  const noteText = typeof note === "string" ? note.trim() : "";

  // His three-field minimum: what source it came from, which model/version
  // produced it, and the name of the person who accepted it. Role travels
  // with the name so the record freezes what they were at the time, not
  // just who -- the whole point of not resolving by pointer.
  if (!sourceText) {
    return NextResponse.json({ error: "Say what source this came from." }, { status: 400 });
  }
  if (!acceptedByNameText || !acceptedByRoleText) {
    return NextResponse.json({ error: "Name and role of who's certifying this are both required — the role is what gets frozen at this moment, not looked up later." }, { status: 400 });
  }

  const { data: order } = await supabase
    .from("program_orders")
    .select("id, artifact_signoffs")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  // Fetch the document content separately (service client, needs the actual
  // column) so the hash reflects what's on the row right now, not something
  // the client could claim.
  const service = await createServiceClient();
  const { data: fullOrder } = await service
    .from("program_orders")
    .select(key)
    .eq("id", id)
    .maybeSingle();
  const docContent = (fullOrder as Record<string, { content?: string }> | null)?.[key]?.content;
  if (!docContent) {
    return NextResponse.json({ error: "This document has no content to certify." }, { status: 400 });
  }
  const contentSha256 = createHash("sha256").update(docContent).digest("hex");

  const nowIso = new Date().toISOString();
  const signoffs = { ...(order.artifact_signoffs as Record<string, unknown[]> ?? {}) };
  const existing = Array.isArray(signoffs[key]) ? signoffs[key] : [];
  const event = {
    type: "signed" as const,
    source: sourceText,
    model_version: modelVersionText || null,
    content_sha256: contentSha256,
    accepted_by_name: acceptedByNameText,
    accepted_by_role: acceptedByRoleText,
    note: noteText || null,
    at: nowIso,
  };
  signoffs[key] = [...existing, event];

  const { error: updateError } = await service
    .from("program_orders")
    .update({ artifact_signoffs: signoffs })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Could not save the sign off." }, { status: 500 });
  }

  // A certification is a sign-off event, same tier as a completion
  // confirmation, not routine document activity -- independently timestamped.
  const verifyId = await logAuditEvent(
    user.id,
    "program_document.artifact_signed_off",
    { program_order_id: id, document_key: key, ...event },
    { timestamp: true }
  );

  return NextResponse.json({
    ok: true,
    acceptedAt: nowIso,
    contentSha256,
    verify_url: verifyId ? `https://www.redflagaipro.com/verify?id=${verifyId}` : null,
  });
}
