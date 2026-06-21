import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export const maxDuration = 300;

function buildEmail(name: string, vendorCount: number, unreviewedCount: number): string {
  const vendorLine = vendorCount === 0
    ? `<p style="color:#6b7280;font-size:14px;margin:0 0 20px;">You haven't logged any AI vendors yet. Add the AI tools your business uses so you have proof of oversight when someone asks.</p>`
    : unreviewedCount > 0
    ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
        <strong style="color:#b91c1c;">${unreviewedCount} vendor${unreviewedCount > 1 ? "s" : ""} awaiting review</strong>
        <div style="color:#dc2626;font-size:13px;margin-top:4px;">Mark them reviewed once you've checked the contract and data handling.</div>
      </div>`
    : `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
        <strong style="color:#15803d;">All ${vendorCount} tracked vendors are up to date</strong>
      </div>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:#0E1C30;border-radius:12px;padding:24px 28px;margin-bottom:24px;">
      <div style="font-size:20px;font-weight:800;color:#ffffff;">Red Flag AI Pro</div>
      <div style="font-size:13px;color:#6b7280;margin-top:2px;">Monthly governance check-in</div>
    </div>

    <div style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:24px 28px;margin-bottom:24px;">
      <p style="color:#374151;font-size:15px;margin:0 0 16px;">Hi ${name},</p>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">It's been a month — time for your governance check-in. Two minutes now is the evidence you'll want later.</p>

      ${vendorLine}

      <p style="color:#6b7280;font-size:14px;margin:20px 0 0;">Worth doing this month:</p>
      <ul style="color:#6b7280;font-size:14px;padding-left:20px;margin:8px 0 0;">
        <li>Review your vendor tracker for anything new or changed</li>
        <li>Re-run your governance assessment if anything's shifted</li>
        <li>Check off any contracts due for review</li>
      </ul>
    </div>

    <div style="text-align:center;padding:0 0 24px;">
      <a href="https://redflagaipro.com/vendors" style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
        Open vendor tracker →
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

  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, plan")
    .in("plan", ["pro", "enterprise", "sentinel"]);

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;

  for (const profile of profiles) {
    const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id);
    if (!user?.email) continue;

    const { data: vendors } = await supabase
      .from("vendors")
      .select("contract_reviewed")
      .eq("user_id", profile.user_id);

    const vendorCount = vendors?.length ?? 0;
    const unreviewedCount = vendors?.filter((v) => !v.contract_reviewed).length ?? 0;

    const name = profile.full_name?.split(" ")[0] || "there";
    const html = buildEmail(name, vendorCount, unreviewedCount);

    await resend.emails.send({
      from: "Red Flag AI Pro <governance@redflagaipro.com>",
      to: user.email,
      subject: "Your monthly governance check-in",
      html,
    });

    sent++;
  }

  return NextResponse.json({ sent });
}
