import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendGovernanceSummaryEmail } from "@/lib/governance-email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sends the respondent their stored assessment summary. The client may POST
// a whole results object, but only the email is read from it — everything in
// the message body comes from the server side record, so this endpoint
// cannot be used to send arbitrary content to arbitrary addresses.
export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = (body?.response?.email ?? body?.email ?? "").trim().toLowerCase();
  } catch {
    // fall through to validation
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { data: record } = await supabase
    .from("governance_audit_emails")
    .select("email, score, risk_level, red_flags")
    .eq("email", email)
    .maybeSingle();

  if (!record) {
    return NextResponse.json({ error: "No assessment found for this email" }, { status: 404 });
  }

  const flags = (record.red_flags ?? []) as Array<{ title?: string; dimension?: string }>;
  const topGaps = flags
    .slice(0, 3)
    .map((f) => f.title ?? f.dimension ?? "")
    .filter(Boolean);

  await sendGovernanceSummaryEmail({
    email: record.email,
    score: record.score,
    riskLevel: record.risk_level,
    topGaps,
  });

  return NextResponse.json({ ok: true });
}
