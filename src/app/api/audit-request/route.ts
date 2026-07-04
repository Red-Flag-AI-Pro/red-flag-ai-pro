import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addContactToLoops } from "@/lib/loops";

// Where a new Done-For-You audit request lands. Kept as a plain constant so the
// destination is obvious and easy to change in one place.
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
    const website = String(body.website ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name) {
      return NextResponse.json({ error: "Please add your name." }, { status: 400 });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Build the notification email. Reply-to is set to the requester so James can
    // reply straight from his inbox with a payment link and next steps.
    const row = (label: string, val: string) =>
      val
        ? `<tr><td style="padding:6px 16px 6px 0;color:#666;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111;font-size:14px">${escapeHtml(val)}</td></tr>`
        : "";

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="margin:0 0 4px;font-size:18px">New Done-For-You audit request</h2>
        <p style="margin:0 0 20px;color:#888;font-size:13px">One-time compliance &amp; governance audit &middot; &pound;179</p>
        <table style="border-collapse:collapse;width:100%">
          ${row("Name", name)}
          ${row("Email", email)}
          ${row("Phone", phone)}
          ${row("Company", company)}
          ${row("Website / funnel", website)}
        </table>
        ${
          message
            ? `<p style="margin:20px 0 6px;color:#666;font-size:13px">Particular issues they mentioned</p>
               <div style="padding:14px 16px;background:#f6f6f7;border-radius:10px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
                 message
               )}</div>`
            : ""
        }
        <p style="margin:24px 0 0;color:#999;font-size:12px">Reply straight to this email to reach them. Send a secure payment link (&pound;179, one time) to start the 48 hour delivery.</p>
      </div>`;

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      // The Resend SDK resolves with { data, error } on API-level failures rather
      // than throwing — checking the response is required, not optional, or a
      // rejected send (bad from-address, rate limit, etc.) fails completely silently.
      const { data, error } = await resend.emails.send({
        from: "Red Flag AI Pro <audit@redflagaipro.com>",
        to: NOTIFY_TO,
        replyTo: email,
        subject: `New audit request — ${name}${company ? ` (${company})` : ""}`,
        html,
      });
      if (error) {
        console.error("audit-request Resend send failed:", error, { name, email });
      } else {
        console.log("audit-request email sent:", data?.id);
      }
    } else {
      // No mail provider configured — still log so the lead is visible in server logs.
      console.error("audit-request received but RESEND_API_KEY not set:", { name, email, phone, company, website });
    }

    // Best-effort: also drop the lead into Loops so it is captured and nurturable
    // even if the email ever fails. Never allowed to break the request.
    try {
      await addContactToLoops({ email, name, plan: "free", source: "audit-request" });
    } catch (loopsErr) {
      console.error("audit-request Loops capture failed:", loopsErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Audit request error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please email support@redflagaipro.com directly." },
      { status: 500 }
    );
  }
}
