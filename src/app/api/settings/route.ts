import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const full_name: string = (body.full_name ?? "").trim();
  const agency_name: string = (body.agency_name ?? "").trim();
  const webhook_url: string = (body.webhook_url ?? "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({
      ...(full_name && { full_name }),
      ...(agency_name !== undefined && { agency_name: agency_name || null }),
      ...(webhook_url !== undefined && { webhook_url: webhook_url || null }),
    })
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
