import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { addContactToLoops, sendLoopsEvent } from "@/lib/loops";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Client-readable (not httpOnly) on purpose: ResultsGate needs to read it
// from document.cookie to recognise a returning visitor before rendering,
// the same low-sensitivity pattern as any marketing "known visitor" cookie.
const RECOGNITION_COOKIE = "rfap_known_email";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function POST(request: Request) {
  const body = await request.json();
  const email: string = (body.email ?? "").trim().toLowerCase();
  const tool: string = (body.tool ?? "").trim();
  // Set when ResultsGate already recognised this visitor (cookie or shared
  // localStorage) and is just reporting a new tool visited, not collecting a
  // fresh email — this is the cross-tool progress signal: Loops learns this
  // known contact also touched a second tool, without asking them again.
  const recognized: boolean = body.recognized === true;

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!tool) {
    return NextResponse.json({ error: "Tool is required." }, { status: 400 });
  }

  if (!recognized) {
    const supabase = await createServiceClient();
    await supabase.from("tool_leads").insert({ email, tool });
    await addContactToLoops({ email, source: `tool:${tool}` });
  }

  // Fires either way: a fresh unlock and a recognised repeat visit are both
  // real signal that this contact is engaging with the free tools, which is
  // exactly what an activation/nurture automation in Loops should see.
  await sendLoopsEvent({ email, eventName: "free_tool_used", properties: { tool, recognized } });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(RECOGNITION_COOKIE, email, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: ONE_YEAR_SECONDS,
    path: "/",
  });
  return response;
}
