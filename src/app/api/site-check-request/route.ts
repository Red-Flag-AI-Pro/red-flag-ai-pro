import { NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { normaliseWebsite, saveLeadRequest } from "@/lib/lead-requests";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "Check my site for me." The visitor gives a website and an email, and we do
// the work and reply personally. The request is only confirmed to them once
// it is stored, because a thank you for a request nobody can see is worse
// than an honest error.
export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(`site_check:${clientIp(request)}`, 5, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company_site === "string" && body.company_site.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const website = normaliseWebsite(String(body.website ?? ""));
  if (!website) {
    return NextResponse.json({ error: "Please enter your website address, for example yourcompany.com." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const saved = await saveLeadRequest({
    kind: "site-check",
    email,
    website,
    name: String(body.name ?? ""),
    message: String(body.aiUse ?? ""),
  });

  if (!saved) {
    return NextResponse.json(
      { error: "Something went wrong saving your request. Please email support@redflagaipro.com with your website address." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
