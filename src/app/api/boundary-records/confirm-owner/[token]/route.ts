import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// Public by necessity, same reasoning as confirm/[token] and
// confirm-completion/[token]: the named owner has no Red Flag account, the
// token is the only gate.
//
// "naming someone without giving them anything to inspect makes them a
// scapegoat, not an accountable owner." Previously this selected almost
// nothing about the decision itself — the owner was asked to confirm
// accountability for something they couldn't see. Now returns everything
// the owner is meant to be accountable for, so confirming (or
// reconfirming) the seat means confirming after actually inspecting what it
// covers, not confirming blind.
//
// owner_confirmed_at already set is also the signal the page and the POST
// handler below use to tell a first-time confirmation link from a
// reconfirmation one — no separate mode flag, one source of truth.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { allowed } = await checkRateLimit(`boundary_owner_view:${clientIp(request)}`, 20, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const { token } = await params;
  const service = await createServiceClient();

  const { data: record } = await service
    .from("boundary_authorization_records")
    .select(
      "decision, owner_name, owner_role, owner_confirmed_at, owner_confirmed_name, owner_reconfirmed_at, owner_reconfirmed_name, options_considered, risks_accepted, warnings_overridden, external_dependencies, expires_at, expiry_conditions, completion_condition, stop_authority_name, stop_authority_role"
    )
    .eq("owner_confirmed_token", token)
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
  const { allowed } = await checkRateLimit(`boundary_owner_submit:${clientIp(request)}`, 5, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const { token } = await params;
  const body = await request.json().catch(() => ({}));
  const confirmedName: string = typeof body.name === "string" ? body.name.trim() : "";
  const confirmedEmail: string = typeof body.email === "string" ? body.email.trim() : "";
  const confirmedRole: string = typeof body.role === "string" ? body.role.trim() : "";

  if (!confirmedName) {
    return NextResponse.json({ error: "Your name is required to confirm this." }, { status: 400 });
  }

  const service = await createServiceClient();

  const { data: record } = await service
    .from("boundary_authorization_records")
    .select("id, user_id, decision, owner_name, owner_role, owner_confirmed_at, owner_reconfirmed_at")
    .eq("owner_confirmed_token", token)
    .maybeSingle();

  if (!record) {
    return NextResponse.json({ error: "This confirmation link is invalid or has expired." }, { status: 404 });
  }

  // owner_confirmed_at already set is what makes this a reconfirmation
  // rather than a first confirmation — the same signal the GET handler and
  // request-owner-confirmation route use, so there's one source of truth
  // rather than a mode passed around and possibly out of sync with it.
  const isReconfirm = Boolean(record.owner_confirmed_at);

  if (isReconfirm) {
    if (record.owner_reconfirmed_at) {
      return NextResponse.json({ error: "This has already been reconfirmed." }, { status: 409 });
    }
  } else if (record.owner_confirmed_at) {
    return NextResponse.json({ error: "This has already been confirmed." }, { status: 409 });
  }

  const nowISO = new Date().toISOString();

  const { data: updated, error: updateError } = await service
    .from("boundary_authorization_records")
    .update(
      isReconfirm
        ? {
            owner_reconfirmed_at: nowISO,
            owner_reconfirmed_name: confirmedName,
            owner_reconfirmed_role: confirmedRole || null,
          }
        : {
            owner_confirmed_at: nowISO,
            owner_confirmed_name: confirmedName,
            owner_confirmed_email: confirmedEmail || null,
            owner_confirmed_role: confirmedRole || null,
          }
    )
    .eq("id", record.id)
    .select()
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: "Failed to record the confirmation." }, { status: 500 });
  }

  const verifyId = await logAuditEvent(
    record.user_id,
    isReconfirm ? "boundary_record.owner_reconfirmed" : "boundary_record.owner_confirmed",
    {
      record_id: record.id,
      decision: record.decision,
      owner_name: record.owner_name,
      owner_role: record.owner_role,
      confirmed_name: confirmedName,
      confirmed_role: confirmedRole || null,
      ...(isReconfirm ? {} : { confirmed_email: confirmedEmail || null }),
      confirmed_at: nowISO,
    },
    { timestamp: true }
  );

  return NextResponse.json({
    confirmed: true,
    reconfirmed: isReconfirm,
    verify_url: verifyId ? `https://www.redflagaipro.com/verify?id=${verifyId}` : null,
  });
}
