import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";
import {
  ALERT_FROM,
  alertSubject,
  buildLawAlertEmail,
  eventKey,
  listUnsubscribeHeaders,
  pickAlertBatch,
} from "@/lib/law-alerts";

export const maxDuration = 300;

// Daily. When a date in the law timeline is three days away, everyone on the
// alert list gets one email covering it and any other dates in the next two
// weeks. Each date is recorded in law_alert_sends BEFORE sending, so a rerun
// or a retry can never email the same date twice. The trade is deliberate: a
// run that dies halfway misses some people rather than double sending.
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 503 });
  }

  const supabase = await createServiceClient();
  const now = new Date();

  const { data: sentRows, error: sentError } = await supabase.from("law_alert_sends").select("event_key");
  if (sentError) {
    return NextResponse.json({ error: sentError.message }, { status: 500 });
  }
  const alreadySent = new Set((sentRows ?? []).map((r) => r.event_key as string));

  const batch = pickAlertBatch(now, alreadySent);
  if (batch.length === 0) {
    return NextResponse.json({ due: 0, sent: 0 });
  }

  const { data: subscribers, error: subError } = await supabase
    .from("law_alert_subscribers")
    .select("email, token")
    .is("unsubscribed_at", null);
  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }

  // Claim the dates first. If another run already claimed them, stop.
  const { error: claimError } = await supabase
    .from("law_alert_sends")
    .insert(batch.map((e) => ({ event_key: eventKey(e), recipients: (subscribers ?? []).length })));
  if (claimError) {
    return NextResponse.json({ due: batch.length, sent: 0, skipped: "already claimed" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const subject = alertSubject(batch, now);
  let sent = 0;
  let failed = 0;

  for (const s of subscribers ?? []) {
    try {
      const { error } = await resend.emails.send({
        from: ALERT_FROM,
        to: s.email as string,
        subject,
        html: buildLawAlertEmail({ kind: "alert", events: batch, now, token: s.token as string }),
        headers: listUnsubscribeHeaders(s.token as string),
      });
      if (error) failed++;
      else sent++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ due: batch.length, sent, failed });
}
