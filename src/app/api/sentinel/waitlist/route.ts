import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { email, company, role } = await request.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase.from("sentinel_waitlist").upsert(
    { email: email.toLowerCase().trim(), company: company || null, role: role || null },
    { onConflict: "email" }
  );

  if (error) {
    console.error("Waitlist insert error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
