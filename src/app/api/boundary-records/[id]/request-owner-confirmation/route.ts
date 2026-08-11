import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";

async function requireSentinelUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" as const, status: 401 as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  if (profile?.plan !== "sentinel") {
    return { error: "Sending a boundary record for independent owner confirmation is a Sentinel feature." as const, status: 403 as const };
  }

  return { supabase, user };
}

// Brad Wolfe, 10 Aug 2026: naming a seat is not the same as the named person
// knowing they hold it. Same shape as required_by and completion
// confirmation, a link only the named owner acts on, sent by the account
// holder themselves, never emailed by Red Flag.
//
// A second, later gap Brad Wolfe's rule doesn't cover on its own:
// owner_confirmed_at only ever answers "did they once know they held this
// seat" — nothing re-checks later whether they still do, and roles change.
// Once owner_confirmed_at is set, this same endpoint switches to
// reconfirmation mode rather than refusing outright: it mints a fresh token
// (reusing an already-confirmed one would let someone confirm off an
// old link, and the original token was already spent) and stamps
// owner_reconfirmation_requested_at. The confirm-owner page and route infer
// reconfirmation mode from owner_confirmed_at already being set, the same
// signal this route uses, so there's one source of truth, not a flag passed
// around separately.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireSentinelUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { data: record, error: fetchError } = await result.supabase
    .from("boundary_authorization_records")
    .select("id, user_id, owner_name, owner_confirmed_at, owner_confirmed_token, owner_reconfirmation_requested_at, owner_reconfirmed_at")
    .eq("id", id)
    .eq("user_id", result.user.id)
    .single();

  if (fetchError || !record) {
    return NextResponse.json({ error: "Boundary record not found." }, { status: 404 });
  }

  const isReconfirm = Boolean(record.owner_confirmed_at);

  if (isReconfirm && record.owner_reconfirmed_at) {
    return NextResponse.json({ error: "This seat has already been reconfirmed." }, { status: 409 });
  }

  let token: string;
  if (!isReconfirm) {
    // First-time confirmation — unchanged behaviour: reuse an existing
    // unconfirmed token rather than minting a new one on every request.
    token = record.owner_confirmed_token ?? randomBytes(16).toString("hex");
    if (!record.owner_confirmed_token) {
      const { error: updateError } = await result.supabase
        .from("boundary_authorization_records")
        .update({ owner_confirmed_token: token })
        .eq("id", id)
        .eq("user_id", result.user.id);
      if (updateError) {
        return NextResponse.json({ error: "Failed to prepare the confirmation link." }, { status: 500 });
      }
    }
  } else if (record.owner_reconfirmation_requested_at && record.owner_confirmed_token) {
    // A reconfirmation link was already generated and hasn't been used yet —
    // reuse it rather than invalidating a link that may already be sent.
    token = record.owner_confirmed_token;
  } else {
    // First reconfirmation request on this record: mint a fresh token. The
    // old, already-confirmed token is overwritten — it did its job once and
    // reusing it here would let the original (possibly long-circulated)
    // link double as a reconfirmation link, which is not what it was sent as.
    token = randomBytes(16).toString("hex");
    const { error: updateError } = await result.supabase
      .from("boundary_authorization_records")
      .update({ owner_confirmed_token: token, owner_reconfirmation_requested_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", result.user.id);
    if (updateError) {
      return NextResponse.json({ error: "Failed to prepare the reconfirmation link." }, { status: 500 });
    }
  }

  return NextResponse.json({
    confirm_url: `https://www.redflagaipro.com/confirm-boundary-owner/${token}`,
  });
}
