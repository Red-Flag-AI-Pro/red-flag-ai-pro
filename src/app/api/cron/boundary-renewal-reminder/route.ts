import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { Resend } from "resend";
import { sendDecayAlert } from "@/lib/decay-notifications";

export const maxDuration = 300;

// Whether a boundary authorization gets revisited before it lapses currently
// depends entirely on whether someone remembers to ask — the same gap a real
// SOC 2 practitioner (Dasha Gorovenco-Gillespie, EY) confirmed exists in
// mainstream audit practice: scope is fixed at engagement start, and nothing
// forces a mid cycle revisit. boundary-lapse-check already proves a lapse
// happened after the fact. This closes the other half: it puts the question
// in front of the named owner WHILE there's still time to act, at 30, 14, 7
// and 1 day out, so the answer no longer depends on anyone's memory.
const REMINDER_THRESHOLDS_DAYS = [30, 14, 7, 1] as const;

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function urgencyColor(daysLeft: number): string {
  if (daysLeft <= 1) return "#dc2626";
  if (daysLeft <= 7) return "#d97706";
  return "#2563eb";
}

function buildEmail(opts: {
  recipientLabel: string;
  daysLeft: number;
  decision: string;
  ownerName: string;
  ownerRole: string;
  continuityOwnerName: string | null;
  continuityOwnerRole: string | null;
  expiresAt: string;
}): string {
  const color = urgencyColor(opts.daysLeft);
  const dayLabel = opts.daysLeft === 1 ? "tomorrow" : `in ${opts.daysLeft} days`;
  const continuityLine = opts.continuityOwnerName
    ? `<p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Named as responsible for what happens next, renewing this or letting it lapse: <strong style="color:#374151;">${opts.continuityOwnerName}</strong>${opts.continuityOwnerRole ? ` (${opts.continuityOwnerRole})` : ""}.</p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:#0E1C30;border-radius:12px;padding:24px 28px;margin-bottom:24px;">
      <div style="font-size:20px;font-weight:800;color:#ffffff;">Red Flag AI Pro</div>
      <div style="font-size:13px;color:#6b7280;margin-top:2px;">Boundary authorization renewal reminder</div>
    </div>

    <div style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:24px 28px;margin-bottom:24px;">
      <p style="color:#374151;font-size:15px;margin:0 0 16px;">Hi ${opts.recipientLabel},</p>

      <div style="background:${color}1a;border:1px solid ${color}55;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
        <strong style="color:${color};">This authorization expires ${dayLabel} (${opts.expiresAt})</strong>
      </div>

      <p style="color:#6b7280;font-size:14px;margin:0 0 8px;"><strong style="color:#374151;">Decision:</strong> ${opts.decision}</p>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;"><strong style="color:#374151;">Authority holder:</strong> ${opts.ownerName} (${opts.ownerRole})</p>

      ${continuityLine}

      <p style="color:#6b7280;font-size:14px;margin:0;">This is the question a lapsed authorization never gets asked: does this authority still reach the decision it was scoped for, or does it need renewing, narrowing, or handing to a successor before the date above? Answering it now, while there's still time, is what turns "someone should have caught that" into a provable, dated decision.</p>
    </div>

    <div style="text-align:center;padding:0 0 24px;">
      <a href="https://redflagaipro.com/boundary-records" style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
        Review and renew →
      </a>
    </div>

    <p style="text-align:center;color:#9ca3af;font-size:12px;">
      Red Flag AI Pro · <a href="https://redflagaipro.com/settings" style="color:#9ca3af;">Manage preferences</a>
    </p>
  </div>
</body>
</html>`;
}

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 503 });
  }

  // Service client, not the session-cookie client: a cron invocation has no
  // logged-in user, so the RLS-respecting client would silently see zero
  // rows for every user's records, the same bug boundary-lapse-check hit.
  const supabase = await createServiceClient();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const today = new Date();

  let checked = 0;
  let sent = 0;

  for (const daysLeft of REMINDER_THRESHOLDS_DAYS) {
    const targetDate = addDays(today, daysLeft);

    const { data: due, error } = await supabase
      .from("boundary_authorization_records")
      .select("id, user_id, decision, owner_name, owner_role, expires_at, continuity_owner_name, continuity_owner_role, continuity_owner_email")
      .eq("expires_at", targetDate);

    if (error) continue;
    if (!due || due.length === 0) continue;

    checked += due.length;

    for (const record of due) {
      // One reminder per record per threshold, not one per run: check the
      // audit log rather than a mutable "last reminded" column, so the
      // record it's about stays exactly what was sealed at creation.
      const { data: existing } = await supabase
        .from("audit_log")
        .select("id")
        .eq("user_id", record.user_id)
        .eq("action", "boundary_record.renewal_reminder_sent")
        .contains("details", { record_id: record.id, threshold_days: daysLeft })
        .maybeSingle();

      if (existing) continue;

      let recipientEmail: string | null = record.continuity_owner_email;
      let recipientLabel = record.continuity_owner_name || record.owner_name;

      if (!recipientEmail) {
        const { data: userData } = await supabase.auth.admin.getUserById(record.user_id);
        recipientEmail = userData?.user?.email ?? null;
        recipientLabel = record.continuity_owner_name || "there";
      }

      if (!recipientEmail) continue;

      const html = buildEmail({
        recipientLabel,
        daysLeft,
        decision: record.decision,
        ownerName: record.owner_name,
        ownerRole: record.owner_role,
        continuityOwnerName: record.continuity_owner_name,
        continuityOwnerRole: record.continuity_owner_role,
        expiresAt: record.expires_at,
      });

      const subject = daysLeft === 1
        ? `Expires tomorrow: an AI authorization needs a decision`
        : `${daysLeft} days left: an AI authorization needs a decision`;

      try {
        await resend.emails.send({
          from: "Red Flag AI Pro <governance@redflagaipro.com>",
          to: recipientEmail,
          subject,
          html,
        });
      } catch {
        continue;
      }

      const entryId = await logAuditEvent(
        record.user_id,
        "boundary_record.renewal_reminder_sent",
        {
          record_id: record.id,
          threshold_days: daysLeft,
          expires_at: record.expires_at,
          sent_to: recipientEmail,
          sent_at: new Date().toISOString(),
        },
        { timestamp: true }
      );

      if (entryId) sent++;

      const { data: profile } = await supabase
        .from("profiles")
        .select("decay_webhook_url")
        .eq("user_id", record.user_id)
        .maybeSingle();

      const when = daysLeft === 1 ? "tomorrow" : `in ${daysLeft} days`;
      await sendDecayAlert(
        (profile as { decay_webhook_url?: string | null } | null)?.decay_webhook_url,
        `Boundary authorization expires ${when}: "${record.decision}" (owner: ${record.owner_name}, ${record.owner_role}). https://www.redflagaipro.com/boundary-records`
      );
    }
  }

  return NextResponse.json({ checked, sent });
}
