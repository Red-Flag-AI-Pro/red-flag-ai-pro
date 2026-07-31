import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(`witness_apply:${clientIp(request)}`, 5, 3600);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many applications from this address. Try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const company = String(body.company ?? "").trim();
  const website = String(body.website ?? "").trim();
  const contactName = String(body.contactName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const recordsKept = String(body.recordsKept ?? "").trim();
  const whyJoin = String(body.whyJoin ?? "").trim();

  if (!company || company.length > 200) {
    return NextResponse.json({ error: "Company name is required." }, { status: 400 });
  }
  if (!website || website.length > 300) {
    return NextResponse.json({ error: "Website is required." }, { status: 400 });
  }
  if (!contactName || contactName.length > 200) {
    return NextResponse.json({ error: "Your name is required." }, { status: 400 });
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!recordsKept || recordsKept.length > 2000) {
    return NextResponse.json(
      { error: "Tell us what records your company keeps." },
      { status: 400 }
    );
  }
  if (whyJoin.length > 2000) {
    return NextResponse.json({ error: "Keep the last answer under 2000 characters." }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { error } = await supabase.from("witness_applications").insert({
    company,
    website,
    contact_name: contactName,
    email,
    records_kept: recordsKept,
    why_join: whyJoin || null,
  });

  if (error) {
    console.error("witness application insert failed:", error.message);
    return NextResponse.json(
      { error: "Could not save your application. Try again in a minute." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
