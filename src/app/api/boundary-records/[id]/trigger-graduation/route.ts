import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" as const, status: 401 as const };
  return { supabase, user };
}

// Marking the graduation condition observed is deliberately not gated
// behind the Sentinel plan, same reasoning as trigger-falsifier: anyone who
// notices a pilot has outgrown its approval should be able to say so
// without needing edit rights over the record. Unlike a falsifier, this
// never touches expires_at -- the grant stays exactly as valid as it was.
// The point is not to shut anything off, it is to put a dated fact on
// record that the named graduation_owner is now obliged to act on.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { data: record, error: fetchError } = await result.supabase
    .from("boundary_authorization_records")
    .select("id, user_id, decision, owner_name, owner_role, graduation_condition, graduation_owner_name, graduation_owner_role, graduation_triggered_at")
    .eq("id", id)
    .eq("user_id", result.user.id)
    .single();

  if (fetchError || !record) {
    return NextResponse.json({ error: "Boundary record not found." }, { status: 404 });
  }

  if (!record.graduation_condition) {
    return NextResponse.json({ error: "This record has no graduation condition to observe." }, { status: 400 });
  }

  if (record.graduation_triggered_at) {
    return NextResponse.json({ error: "Already marked observed." }, { status: 409 });
  }

  const nowISO = new Date().toISOString();

  const { data: updated, error: updateError } = await result.supabase
    .from("boundary_authorization_records")
    .update({ graduation_triggered_at: nowISO })
    .eq("id", id)
    .eq("user_id", result.user.id)
    .select()
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: "Failed to update boundary record." }, { status: 500 });
  }

  await logAuditEvent(
    result.user.id,
    "boundary_record.graduation_triggered",
    {
      record_id: record.id,
      decision: record.decision,
      owner_name: record.owner_name,
      owner_role: record.owner_role,
      graduation_condition: record.graduation_condition,
      graduation_owner_name: record.graduation_owner_name,
      graduation_owner_role: record.graduation_owner_role,
      triggered_at: nowISO,
    },
    { timestamp: true }
  );

  return NextResponse.json({ record: updated });
}
