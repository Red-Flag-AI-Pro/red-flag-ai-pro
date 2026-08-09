import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { pulledForwardExpiry } from "@/lib/boundary-expiry";
import { getGovernedPopulationCount } from "@/lib/boundary-population";
import type { BoundaryFalsifier } from "@/types";

const DISPOSITIONS = ["reprocess", "grandfather", "flag_for_review"] as const;
type Disposition = (typeof DISPOSITIONS)[number];

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" as const, status: 401 as const };
  return { supabase, user };
}

// Marking a falsifier condition as observed is deliberately not gated behind
// the Sentinel plan the way creating or editing a record is. The whole point
// of a falsifier is that anyone who notices the condition became true should
// be able to say so, without needing edit rights over the record itself —
// that is what keeps this from turning into a stop button only the owner
// would ever press. Still scoped to the record's own account via the .eq
// below (RLS-respecting client), never cross-account.
//
// The falsifier itself only ever pulls expires_at earlier, never later — this
// route cannot renew or extend a grant, only shorten one, which is the whole
// design point Brad Wolfe's exchange landed on: the human path stays a rare
// exception that can only close a gap, not reopen one.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const body = await request.json().catch(() => ({}));
  const index = typeof body.index === "number" ? body.index : -1;
  const disposition: Disposition | null = DISPOSITIONS.includes(body.disposition) ? body.disposition : null;

  const { data: record, error: fetchError } = await result.supabase
    .from("boundary_authorization_records")
    .select("id, user_id, decision, owner_name, owner_role, expires_at, expiry_conditions, api_key_id")
    .eq("id", id)
    .eq("user_id", result.user.id)
    .single();

  if (fetchError || !record) {
    return NextResponse.json({ error: "Boundary record not found." }, { status: 404 });
  }

  const conditions = (record.expiry_conditions ?? []) as BoundaryFalsifier[];
  if (index < 0 || index >= conditions.length) {
    return NextResponse.json({ error: "That condition doesn't exist on this record." }, { status: 400 });
  }
  if (conditions[index].triggered_at) {
    return NextResponse.json({ error: "Already triggered." }, { status: 409 });
  }

  const now = new Date();
  const nowISO = now.toISOString();
  const today = nowISO.slice(0, 10);
  const previousExpiresAt = record.expires_at;
  const newExpiresAt = pulledForwardExpiry(previousExpiresAt, today);

  // "A default is not a decision until somebody has counted" — a record with
  // nothing governed yet needs no disposition (nothing to reprocess,
  // grandfather, or flag). One that has governed real decisions can't move
  // until the trigger explicitly says what happens to them; grandfather only
  // gets to win if it was actually chosen, not because it needed no count.
  const populationCount = record.api_key_id
    ? await getGovernedPopulationCount(result.supabase, record.id, nowISO)
    : 0;
  if (populationCount > 0 && !disposition) {
    return NextResponse.json(
      {
        error: `This record has governed ${populationCount} decision${populationCount === 1 ? "" : "s"}. Choose a disposition before triggering.`,
        needs_disposition: true,
        population_count: populationCount,
      },
      { status: 409 }
    );
  }

  const updatedConditions = conditions.map((c, i) =>
    i === index ? { ...c, triggered_at: nowISO } : c
  );

  const { data: updated, error: updateError } = await result.supabase
    .from("boundary_authorization_records")
    .update({ expiry_conditions: updatedConditions, expires_at: newExpiresAt })
    .eq("id", id)
    .eq("user_id", result.user.id)
    .select()
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: "Failed to update boundary record." }, { status: 500 });
  }

  await logAuditEvent(
    result.user.id,
    "boundary_record.falsifier_triggered",
    {
      record_id: record.id,
      decision: record.decision,
      owner_name: record.owner_name,
      owner_role: record.owner_role,
      condition: conditions[index].condition,
      previous_expires_at: previousExpiresAt,
      new_expires_at: newExpiresAt,
      triggered_at: nowISO,
      population_count: populationCount,
      disposition: populationCount > 0 ? disposition : null,
    },
    { timestamp: true }
  );

  return NextResponse.json({ record: updated });
}
