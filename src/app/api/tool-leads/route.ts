import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const email: string = (body.email ?? "").trim().toLowerCase();
  const tool: string = (body.tool ?? "").trim();

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!tool) {
    return NextResponse.json({ error: "Tool is required." }, { status: 400 });
  }

  const supabase = await createServiceClient();
  await supabase.from("tool_leads").insert({ email, tool });

  return NextResponse.json({ ok: true });
}
