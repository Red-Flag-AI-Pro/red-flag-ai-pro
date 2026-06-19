import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export const maxDuration = 300;

function scoreColor(score: number) {
  if (score >= 70) return "#16a34a";
  if (score >= 40) return "#d97706";
  return "#dc2626";
}

function riskLabel(score: number) {
  if (score >= 70) return "Low Risk";
  if (score >= 40) return "Medium Risk";
  return "High Risk";
}

function buildEmail(userName: string, urls: { url: string; label: string | null; last_score: number | null; last_scanned_at: string | null }[]): string {
  const rows = urls.map((u) => {
    const score = u.last_score ?? 0;
    const color = scoreColor(score);
    const label = riskLabel(score);
    const displayLabel = u.label || u.url;
    const date = u.last_scanned_at
      ? new Date(u.last_scanned_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      : "Not yet scanned";

    return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;">
          <div style="font-weight:600;color:#111827;font-size:14px;">${displayLabel}</div>
          <div style="color:#9ca3af;font-size:12px;margin-top:2px;">${u.url}</div>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;text-align:center;">
          <span style="font-size:22px;font-weight:800;color:${color};">${score}</span>
          <div style="font-size:11px;color:${color};font-weight:600;">${label}</div>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;color:#9ca3af;font-size:12px;text-align:right;">${date}</td>
      </tr>`;
  }).join("");

  const highRisk = urls.filter((u) => (u.last_score ?? 100) < 40).length;
  const alertBanner = highRisk > 0
    ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
        <strong style="color:#b91c1c;">⚠️ ${highRisk} high risk page${highRisk > 1 ? "s" : ""} detected</strong>
        <div style="color:#dc2626;font-size:13px;margin-top:4px;">Review and fix these before your next campaign goes live.</div>
       </div>`
    : `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
        <strong style="color:#15803d;">✅ All monitored pages are low risk this week</strong>
       </div>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <div style="background:#0E1C30;border-radius:12px;padding:24px 28px;margin-bottom:24px;">
      <div style="font-size:20px;font-weight:800;color:#ffffff;">Red Flag AI Pro</div>
      <div style="font-size:13px;color:#6b7280;margin-top:2px;">Weekly compliance digest</div>
    </div>

    <div style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:24px 28px;margin-bottom:24px;">
      <p style="color:#374151;font-size:15px;margin:0 0 20px;">Hi ${userName},</p>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Here is your weekly compliance summary for your monitored pages.</p>

      ${alertBanner}

      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Page</th>
            <th style="text-align:center;padding:10px 16px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Score</th>
            <th style="text-align:right;padding:10px 16px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Checked</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div style="text-align:center;padding:0 0 24px;">
      <a href="https://redflagaipro.com/monitor" style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
        View monitoring dashboard →
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
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 503 });
  }

  const supabase = await createClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Get all users who have monitored URLs
  const { data: monitoredUrls } = await supabase
    .from("monitored_urls")
    .select("user_id, url, label, last_score, last_scanned_at")
    .not("last_scanned_at", "is", null);

  if (!monitoredUrls || monitoredUrls.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  // Group by user
  const byUser: Record<string, typeof monitoredUrls> = {};
  for (const u of monitoredUrls) {
    if (!byUser[u.user_id]) byUser[u.user_id] = [];
    byUser[u.user_id].push(u);
  }

  let sent = 0;

  for (const [userId, urls] of Object.entries(byUser)) {
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);
    if (!user?.email) continue;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .single();

    const name = profile?.full_name?.split(" ")[0] || "there";
    const html = buildEmail(name, urls);

    await resend.emails.send({
      from: "Red Flag AI Pro <digest@redflagaipro.com>",
      to: user.email,
      subject: `Your weekly compliance digest - ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
      html,
    });

    sent++;
  }

  return NextResponse.json({ sent });
}
