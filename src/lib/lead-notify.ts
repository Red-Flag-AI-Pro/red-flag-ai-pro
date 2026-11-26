import { Resend } from "resend";

// Two emails around a visitor's request: a notice to James that it arrived,
// and a confirmation to the visitor that it is in hand.
//
// Both are best effort. The request itself is already stored in the database
// before either is attempted (see lead-requests.ts), so a failed send can
// never lose a lead. Failures are logged with enough detail to act on.
//
// As of 26 Nov 2026 the sending domain is not verified with Resend, so these
// fail and log. They start working, with no code change, the moment a working
// key and a verified domain are in place.

const NOTIFY_TO = ["redflagaipro@gmail.com", "support@redflagaipro.com"];
const REPLY_TO = "redflagaipro@gmail.com";
const FROM = "Red Flag AI Pro <hello@redflagaipro.com>";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  return key ? new Resend(key) : null;
}

export interface NewLead {
  kind: "site-check" | "audit" | "sentinel";
  email: string;
  website?: string;
  name?: string;
  company?: string;
  phone?: string;
  message?: string;
}

const KIND_LABEL: Record<NewLead["kind"], string> = {
  "site-check": "Free red flag request",
  audit: "Full audit request",
  sentinel: "Sentinel enquiry",
};

/** Tells James a request has arrived. Reply goes straight to the visitor. */
export async function notifyNewLead(lead: NewLead): Promise<void> {
  const resend = client();
  if (!resend) {
    console.error("lead notice not sent, RESEND_API_KEY not set:", lead.kind, lead.email);
    return;
  }
  const row = (label: string, val?: string) =>
    val && val.trim()
      ? `<tr><td style="padding:6px 16px 6px 0;color:#666;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111;font-size:14px">${esc(val.trim())}</td></tr>`
      : "";
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#111">
      <h2 style="margin:0 0 4px;font-size:18px">${KIND_LABEL[lead.kind]}</h2>
      <p style="margin:0 0 18px;color:#888;font-size:13px">From the form on redflagaipro.com</p>
      <table style="border-collapse:collapse;width:100%">
        ${row("Website", lead.website)}
        ${row("Email", lead.email)}
        ${row("Name", lead.name)}
        ${row("Company", lead.company)}
        ${row("Phone", lead.phone)}
        ${row(lead.kind === "site-check" ? "Where they use AI" : "Message", lead.message)}
      </table>
      <p style="margin:22px 0 0;color:#999;font-size:12px">Reply to this email to reach them directly.${
        lead.kind === "site-check" ? " They have been told to expect their red flag, usually within one working day." : ""
      }</p>
    </div>`;
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: lead.email,
      subject: `${KIND_LABEL[lead.kind]}: ${lead.website || lead.company || lead.email}`,
      html,
    });
    if (error) console.error("lead notice send failed:", error.message, { kind: lead.kind, email: lead.email });
  } catch (err) {
    console.error("lead notice send threw:", err);
  }
}

/** Confirms to the visitor that their free red flag request is in hand. */
export async function confirmSiteCheckToVisitor(email: string, website: string): Promise<void> {
  const resend = client();
  if (!resend) return;
  const html = `
    <div style="font-family:Georgia,'Times New Roman',serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <div style="padding:22px 24px;background:#0A1628;border-radius:10px;margin:0 0 20px">
        <p style="margin:0;color:#F4F1EA;font-size:22px">Got it. <em style="color:#E5484D">Leave it with us.</em></p>
      </div>
      <p style="font-size:15px;line-height:1.7">Thanks for sending us <strong>${esc(website)}</strong>.</p>
      <p style="font-size:15px;line-height:1.7">I will check what it says and how you use AI, and reply to this address with your red flag: the one problem most likely to cost you, the rule it breaks, and how many more there are. That usually takes one working day. If I find nothing, I will tell you that too.</p>
      <p style="font-size:15px;line-height:1.7">You do not need to do anything. If there is a page you are particularly worried about, just reply and tell me.</p>
      <p style="font-size:14px;color:#555;line-height:1.6;margin-top:24px">James Stokes<br/>Red Flag AI Pro<br/><a href="https://www.redflagaipro.com" style="color:#555">redflagaipro.com</a></p>
      <p style="font-size:12px;color:#999;line-height:1.6;margin-top:20px">You are getting this because this address was entered at redflagaipro.com. If that was not you, ignore this email and nothing further will be sent.</p>
    </div>`;
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      replyTo: REPLY_TO,
      subject: "We have your website. Your red flag is on its way.",
      html,
    });
    if (error) console.error("visitor confirmation send failed:", error.message);
  } catch (err) {
    console.error("visitor confirmation send threw:", err);
  }
}
