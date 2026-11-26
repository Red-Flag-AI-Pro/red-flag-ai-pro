import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { CALL_OUTCOMES, STAGES, followUp, getAdminUser, type Stage } from "@/lib/console";

const KINDS = ["linkedin", "connect", "letter", "call", "email", "note", "stage", "checkpoints"];

// Log something that happened with a prospect. Logging always sets the next
// step and its date, so nothing is left without a follow up. Admin only.
export async function POST(request: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const prospectId = typeof body.prospect_id === "string" ? body.prospect_id : "";
  const kind = typeof body.kind === "string" ? body.kind : "";
  const outcome = typeof body.outcome === "string" ? body.outcome : null;
  // Checkpoint answers are stored as JSON in the detail, so they get more room.
  const detail = typeof body.detail === "string" ? body.detail.trim().slice(0, kind === "checkpoints" ? 8000 : 2000) : null;

  if (!prospectId || !KINDS.includes(kind)) {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }
  if (kind === "call" && !(CALL_OUTCOMES as readonly string[]).includes(outcome ?? "")) {
    return NextResponse.json({ error: "Choose how the call went." }, { status: 400 });
  }
  if (kind === "stage" && !(STAGES as readonly string[]).includes(outcome ?? "")) {
    return NextResponse.json({ error: "Unknown stage." }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { data: prospect, error: readError } = await supabase
    .from("prospects")
    .select("id, stage, tps_checked_at, tps_registered, do_not_contact")
    .eq("id", prospectId)
    .single();
  if (readError || !prospect) {
    return NextResponse.json({ error: "Prospect not found." }, { status: 404 });
  }

  if (prospect.do_not_contact && ["linkedin", "connect", "letter", "call", "email"].includes(kind)) {
    return NextResponse.json({ error: "This prospect asked not to be contacted." }, { status: 400 });
  }
  // A sales call needs the number checked against the TPS and CTPS registers
  // first, and a registered number must not be rung.
  if (kind === "call" && (!prospect.tps_checked_at || prospect.tps_registered === true)) {
    return NextResponse.json(
      { error: prospect.tps_registered ? "This number is on the do not call register." : "Check the number against the do not call register first." },
      { status: 400 }
    );
  }

  const { error: insertError } = await supabase
    .from("prospect_activity")
    .insert({ prospect_id: prospectId, kind, outcome, detail: detail || null });
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  // Notes and checkpoint answers are a record, not a step: they do not move
  // the prospect on or change what happens next.
  if (kind === "note" || kind === "checkpoints") {
    return NextResponse.json({ ok: true });
  }
  // A connection request only sets a reminder while nothing else is under way;
  // once a message, email or letter has gone, that step keeps its own follow up.
  if (kind === "connect" && prospect.stage !== "new") {
    const { data: same } = await supabase.from("prospects").select("*").eq("id", prospectId).single();
    return NextResponse.json({ ok: true, prospect: same });
  }

  const next = followUp(kind, outcome, prospect.stage as Stage);
  const overrideDate = typeof body.next_action_at === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.next_action_at) ? body.next_action_at : null;
  const { data: updated, error: updateError } = await supabase
    .from("prospects")
    .update({
      stage: next.stage,
      next_action: next.nextAction,
      next_action_at: next.nextAction ? overrideDate ?? next.nextActionAt : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", prospectId)
    .select("*")
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ ok: true, prospect: updated });
}
