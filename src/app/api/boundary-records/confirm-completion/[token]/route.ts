import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// Public by necessity, same reasoning as confirm/[token]: the person
// confirming completion has no Red Flag account, the token is the only gate.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { allowed } = await checkRateLimit(`boundary_completion_view:${clientIp(request)}`, 20, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const { token } = await params;
  const service = await createServiceClient();

  const { data: record } = await service
    .from("boundary_authorization_records")
    .select("decision, owner_name, owner_role, completion_condition, completion_confirmed_at, completion_confirmed_name, completion_confirmed_role")
    .eq("completion_token", token)
    .maybeSingle();

  if (!record) {
    return NextResponse.json({ error: "This confirmation link is invalid or has expired." }, { status: 404 });
  }

  return NextResponse.json({ record });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { allowed } = await checkRateLimit(`boundary_completion_submit:${clientIp(request)}`, 5, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const { token } = await params;
  const body = await request.json().catch(() => ({}));
  const confirmedName: string = typeof body.name === "string" ? body.name.trim() : "";
  const confirmedEmail: string = typeof body.email === "string" ? body.email.trim() : "";
  const confirmedRole: string = typeof body.role === "string" ? body.role.trim() : "";
  const confirmedNote: string = typeof body.note === "string" ? body.note.trim() : "";

  if (!confirmedName) {
    return NextResponse.json({ error: "Your name is required to confirm this." }, { status: 400 });
  }
  // The note is what makes this evidence rather than a diary entry with a
  // timestamp -- Michael H.'s exact distinction. A name and a click confirm
  // nothing on their own.
  if (!confirmedNote) {
    return NextResponse.json({ error: "Say briefly how you know this was actually met, that's what makes this evidence rather than a name on a form." }, { status: 400 });
  }

  const service = await createServiceClient();

  const { data: record } = await service
    .from("boundary_authorization_records")
    .select("id, user_id, decision, owner_name, owner_role, completion_condition, completion_confirmed_at")
    .eq("completion_token", token)
    .maybeSingle();

  if (!record) {
    return NextResponse.json({ error: "This confirmation link is invalid or has expired." }, { status: 404 });
  }
  if (record.completion_confirmed_at) {
    return NextResponse.json({ error: "This has already been confirmed." }, { status: 409 });
  }

  const nowISO = new Date().toISOString();

  const { data: updated, error: updateError } = await service
    .from("boundary_authorization_records")
    .update({
      completion_confirmed_at: nowISO,
      completion_confirmed_name: confirmedName,
      completion_confirmed_email: confirmedEmail || null,
      completion_confirmed_role: confirmedRole || null,
      completion_confirmed_note: confirmedNote,
    })
    .eq("id", record.id)
    .select()
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: "Failed to record the confirmation." }, { status: 500 });
  }

  const verifyId = await logAuditEvent(
    record.user_id,
    "boundary_record.completion_confirmed",
    {
      record_id: record.id,
      decision: record.decision,
      owner_name: record.owner_name,
      owner_role: record.owner_role,
      completion_condition: record.completion_condition,
      confirmed_name: confirmedName,
      confirmed_email: confirmedEmail || null,
      confirmed_role: confirmedRole || null,
      confirmed_note: confirmedNote,
      confirmed_at: nowISO,
    },
    { timestamp: true }
  );

  return NextResponse.json({
    confirmed: true,
    verify_url: verifyId ? `https://www.redflagaipro.com/verify?id=${verifyId}` : null,
  });
}
