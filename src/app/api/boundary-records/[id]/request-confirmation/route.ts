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
    return { error: "Sending a boundary record for external confirmation is a Sentinel feature." as const, status: 403 as const };
  }

  return { supabase, user };
}

// Generates the link the account holder actually sends to whoever they named
// in required_by_name/organisation. Deliberately does NOT email it — Red
// Flag never has the external party's real inbox, and a link the account
// holder copies and sends themselves is honest about who's vouching for its
// delivery. The token itself is the only thing that gates the public
// confirmation page, so it has to be unguessable: 128 bits via
// crypto.randomBytes, the same reasoning as the team invite code fix.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireSentinelUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { data: record, error: fetchError } = await result.supabase
    .from("boundary_authorization_records")
    .select("id, user_id, required_by_name, required_by_organisation, required_by_confirmed_at, required_by_token")
    .eq("id", id)
    .eq("user_id", result.user.id)
    .single();

  if (fetchError || !record) {
    return NextResponse.json({ error: "Boundary record not found." }, { status: 404 });
  }

  if (!record.required_by_name && !record.required_by_organisation) {
    return NextResponse.json({ error: "Name who required this boundary before requesting their confirmation." }, { status: 400 });
  }
  if (record.required_by_confirmed_at) {
    return NextResponse.json({ error: "This has already been confirmed." }, { status: 409 });
  }

  // Reuse an existing unconfirmed token rather than minting a new one each
  // time — a record can only have one live link, so re-requesting just
  // returns the same one instead of quietly invalidating a link already sent.
  const token = record.required_by_token ?? randomBytes(16).toString("hex");

  if (!record.required_by_token) {
    const { error: updateError } = await result.supabase
      .from("boundary_authorization_records")
      .update({ required_by_token: token })
      .eq("id", id)
      .eq("user_id", result.user.id);
    if (updateError) {
      return NextResponse.json({ error: "Failed to prepare the confirmation link." }, { status: 500 });
    }
  }

  return NextResponse.json({
    confirm_url: `https://www.redflagaipro.com/confirm-boundary/${token}`,
  });
}
