import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";

// A boundary authorization's expiry is currently only checked lazily, in the
// browser, as a date-string comparison for display. That means a real lapse
// in coverage — a period where nobody actually held valid authority — is
// never itself a recorded fact, only something reconstructible later by
// comparing timestamps, if anyone thinks to look. This closes that gap: once
// a day, find every record whose expiry has passed and seal the lapse itself
// as its own event, at the moment it's detected, before any successor exists.
// Called by Vercel Cron — secured with CRON_SECRET header, fails closed if
// either side of the comparison is missing.
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: expired, error } = await supabase
    .from("boundary_authorization_records")
    .select("id, user_id, decision, owner_name, owner_role, expires_at")
    .lt("expires_at", today);

  if (error) return NextResponse.json({ error: "Failed to read boundary records." }, { status: 500 });
  if (!expired || expired.length === 0) return NextResponse.json({ checked: 0, sealed: 0 });

  let sealed = 0;

  for (const record of expired) {
    // Has this lapse already been sealed? Check once per record, not once
    // per run — a lapse is a single event, not something to re-seal daily.
    const { data: existing } = await supabase
      .from("audit_log")
      .select("id")
      .eq("user_id", record.user_id)
      .eq("action", "boundary_record.lapsed")
      .contains("details", { record_id: record.id })
      .maybeSingle();

    if (existing) continue;

    const entryId = await logAuditEvent(
      record.user_id,
      "boundary_record.lapsed",
      {
        record_id: record.id,
        decision: record.decision,
        owner_name: record.owner_name,
        owner_role: record.owner_role,
        expires_at: record.expires_at,
        detected_at: new Date().toISOString(),
      },
      { timestamp: true }
    );

    if (entryId) sealed++;
  }

  return NextResponse.json({ checked: expired.length, sealed });
}
