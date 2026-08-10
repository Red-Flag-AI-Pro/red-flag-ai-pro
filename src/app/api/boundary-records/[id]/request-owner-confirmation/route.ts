import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";

async function requireSentinelUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" as const, status: 401 as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  if (profile?.plan !== "sentinel") {
    return { error: "Sending a boundary record for independent owner confirmation is a Sentinel feature." as const, status: 403 as const };
  }

  return { supabase, user };
}

// Brad Wolfe, 10 Aug 2026: naming a seat is not the same as the named person
// knowing they hold it. Same shape as required_by and completion
// confirmation, a link only the named owner acts on, sent by the account
// holder themselves, never emailed by Red Flag.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireSentinelUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { data: record, error: fetchError } = await result.supabase
    .from("boundary_authorization_records")
    .select("id, user_id, owner_name, owner_confirmed_at, owner_confirmed_token")
    .eq("id", id)
    .eq("user_id", result.user.id)
    .single();

  if (fetchError || !record) {
    return NextResponse.json({ error: "Boundary record not found." }, { status: 404 });
  }

  if (record.owner_confirmed_at) {
    return NextResponse.json({ error: "This has already been confirmed." }, { status: 409 });
  }

  const token = record.owner_confirmed_token ?? randomBytes(16).toString("hex");

  if (!record.owner_confirmed_token) {
    const { error: updateError } = await result.supabase
      .from("boundary_authorization_records")
      .update({ owner_confirmed_token: token })
      .eq("id", id)
      .eq("user_id", result.user.id);
    if (updateError) {
      return NextResponse.json({ error: "Failed to prepare the confirmation link." }, { status: 500 });
    }
  }

  return NextResponse.json({
    confirm_url: `https://www.redflagaipro.com/confirm-boundary-owner/${token}`,
  });
}
