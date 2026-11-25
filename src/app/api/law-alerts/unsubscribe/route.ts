import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function unsubscribe(token: string | null): Promise<boolean> {
  if (!token || !UUID_REGEX.test(token)) return false;
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("law_alert_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("token", token)
      .select("id");
    return !error && Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

function page(title: string, message: string, action?: string): NextResponse {
  const button = action
    ? `<form method="post" action="${action}" style="margin:0 0 28px;"><button type="submit" style="font:inherit;font-weight:700;font-size:1rem;color:#fff;background:#E5484D;border:0;border-radius:9999px;padding:14px 32px;cursor:pointer;">Yes, unsubscribe me</button></form>`
    : "";
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | Red Flag AI Pro</title></head>
<body style="margin:0;background:#0A1628;color:#F4F1EA;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:20vh 24px 0;text-align:center;">
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:2rem;margin:0 0 16px;">${title}</h1>
    <p style="font-size:1rem;line-height:1.7;color:rgba(244,241,234,0.75);margin:0 0 28px;">${message}</p>
    ${button}
    <a href="https://www.redflagaipro.com" style="color:#E5484D;font-weight:700;text-decoration:none;">Back to redflagaipro.com &rarr;</a>
  </div>
</body>
</html>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

// The link in every alert email. Opening it only shows a confirm button.
// Nothing changes until the button is pressed, because mail security tools
// open every link in an email to check it, and a link that unsubscribed on
// open would quietly remove people who never asked to leave.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("t");
  if (!token || !UUID_REGEX.test(token)) {
    return page("That link didn't work", "We could not read that unsubscribe link. Reply to any alert email and we will remove you by hand.");
  }
  return page(
    "Stop law date alerts?",
    "Press the button and no more alerts will be sent to this address.",
    `/api/law-alerts/unsubscribe?t=${encodeURIComponent(token)}`
  );
}

// The confirm button above, and the unsubscribe control that mail apps show
// next to the sender name (RFC 8058), both arrive here.
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("t");
  const done = await unsubscribe(token);
  return done
    ? page("You're unsubscribed", "No more law date alerts will be sent to this address. If that was a mistake, you can sign up again on the homepage at any time.")
    : page("That link didn't work", "We could not match that unsubscribe link. Reply to any alert email and we will remove you by hand.");
}
