import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import {
  ALERT_FROM,
  buildLawAlertEmail,
  listUnsubscribeHeaders,
  upcomingEvents,
  welcomeSubject,
} from "@/lib/law-alerts";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sign up for law date alerts. Deliberately does NOT add the address to the
// general marketing list: the form promises one email before each date and
// no newsletter, so that is all this address is used for.
export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(`law_alerts:${clientIp(request)}`, 5, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field. Answer as if it
  // worked so a bot learns nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  let supabase: Awaited<ReturnType<typeof createServiceClient>>;
  try {
    supabase = await createServiceClient();
  } catch (err) {
    console.error("law-alerts database client failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  const { data: existing, error: lookupError } = await supabase
    .from("law_alert_subscribers")
    .select("id, token, unsubscribed_at")
    .eq("email", email)
    .maybeSingle();
  if (lookupError) {
    console.error("law-alerts lookup failed:", lookupError.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  let token: string | null = null;
  let sendWelcome = false;

  if (!existing) {
    const { data: created, error: insertError } = await supabase
      .from("law_alert_subscribers")
      .insert({ email })
      .select("token")
      .single();
    if (insertError || !created) {
      console.error("law-alerts insert failed:", insertError?.message);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
    token = created.token as string;
    sendWelcome = true;
  } else if (existing.unsubscribed_at) {
    // Someone who left and has now asked again: switch them back on.
    await supabase.from("law_alert_subscribers").update({ unsubscribed_at: null }).eq("id", existing.id);
    token = existing.token as string;
    sendWelcome = true;
  }
  // Already subscribed: nothing to do, and no second welcome email. The
  // response is identical either way, so the form never reveals whether an
  // address was already on the list.

  if (sendWelcome && token && process.env.RESEND_API_KEY) {
    const now = new Date();
    const events = upcomingEvents(now);
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: ALERT_FROM,
        to: email,
        subject: welcomeSubject(events),
        html: buildLawAlertEmail({ kind: "welcome", events, now, token }),
        headers: listUnsubscribeHeaders(token),
      });
      if (error) console.error("law-alerts welcome send failed:", error.message);
    } catch (err) {
      console.error("law-alerts welcome send threw:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
