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
    return { error: "Sending a boundary record for independent completion confirmation is a Sentinel feature." as const, status: 403 as const };
  }

  return { supabase, user };
}

// Same shape as request-confirmation (required_by), same reasoning: the link
// the account holder sends is the only thing gating the public confirmation
// page, so it has to be unguessable. Deliberately not emailed by Red Flag,
// the account holder sends it themselves to whoever they're actually asking
// to confirm the objective was met.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireSentinelUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { data: record, error: fetchError } = await result.supabase
    .from("boundary_authorization_records")
    .select("id, user_id, completion_condition, completion_confirmed_at, completion_token")
    .eq("id", id)
    .eq("user_id", result.user.id)
    .single();

  if (fetchError || !record) {
    return NextResponse.json({ error: "Boundary record not found." }, { status: 404 });
  }

  if (!record.completion_condition) {
    return NextResponse.json({ error: "Set what completion looks like before requesting confirmation of it." }, { status: 400 });
  }
  if (record.completion_confirmed_at) {
    return NextResponse.json({ error: "This has already been confirmed." }, { status: 409 });
  }

  const token = record.completion_token ?? randomBytes(16).toString("hex");

  if (!record.completion_token) {
    const { error: updateError } = await result.supabase
      .from("boundary_authorization_records")
      .update({ completion_token: token })
      .eq("id", id)
      .eq("user_id", result.user.id);
    if (updateError) {
      return NextResponse.json({ error: "Failed to prepare the confirmation link." }, { status: 500 });
    }
  }

  return NextResponse.json({
    confirm_url: `https://www.redflagaipro.com/confirm-boundary-completion/${token}`,
  });
}
