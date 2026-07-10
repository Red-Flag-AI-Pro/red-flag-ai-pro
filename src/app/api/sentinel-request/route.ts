import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addContactToLoops } from "@/lib/loops";

// Where a new Sentinel enquiry lands. Replaces the old Calendly booking flow
// (unused — nobody booked through it, and the free trial was ending), so
// every Sentinel touchpoint now converges on this one form instead.
const NOTIFY_TO = "support@redflagaipro.com";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const company = String(body.company ?? "").trim();
    const teamSize = String(body.teamSize ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name) {
      return NextResponse.json({ error: "Please add your name." }, { status: 400 });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const row = (label: string, val: string) =>
      val
        ? `<tr><td style="padding:6px 16px 6px 0;color:#666;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111;font-size:14px">${escapeHtml(val)}</td></tr>`
        : "";

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="margin:0 0 4px;font-size:18px">New Sentinel enquiry</h2>
        <p style="margin:0 0 20px;color:#888;font-size:13px">Managed governance &amp; compliance &middot; custom pricing</p>
        <table style="border-collapse:collapse;width:100%">
          ${row("Name", name)}
          ${row("Email", email)}
          ${row("Phone", phone)}
          ${row("Company", company)}
          ${row("Team size", teamSize)}
        </table>
        ${
          message
            ? `<p style="margin:20px 0 6px;color:#666;font-size:13px">What they told us</p>
               <div style="padding:14px 16px;background:#f6f6f7;border-radius:10px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
                 message
               )}</div>`
            : ""
        }
        <p style="margin:24px 0 0;color:#999;font-size:12px">Reply straight to this email to reach them.</p>
      </div>`;

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: "Red Flag AI Pro <sentinel@redflagaipro.com>",
        to: NOTIFY_TO,
        replyTo: email,
        subject: `New Sentinel enquiry from ${name}${company ? ` (${company})` : ""}`,
        html,
      });
      if (error) {
        console.error("sentinel-request Resend send failed:", error, { name, email });
      } else {
        console.log("sentinel-request email sent:", data?.id);
      }
    } else {
      console.error("sentinel-request received but RESEND_API_KEY not set:", { name, email, phone, company, teamSize });
    }

    try {
      await addContactToLoops({ email, name, plan: "free", source: "sentinel-request", track: "both" });
    } catch (loopsErr) {
      console.error("sentinel-request Loops capture failed:", loopsErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Sentinel request error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please email support@redflagaipro.com directly." },
      { status: 500 }
    );
  }
}
