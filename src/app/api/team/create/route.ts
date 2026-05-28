import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, organisation_id")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";

  if (plan !== "sentinel") {
    return NextResponse.json(
      { error: "Team seats are available on the Sentinel plan only." },
      { status: 403 }
    );
  }

  if (profile?.organisation_id) {
    return NextResponse.json(
      { error: "You already have an organisation." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const name: string = body.name?.trim() || "My Organisation";

  // Create organisation
  const { data: org, error: orgError } = await supabase
    .from("organisations")
    .insert({ owner_id: user.id, name })
    .select()
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: "Failed to create organisation." }, { status: 500 });
  }

  // Link owner to organisation
  await supabase
    .from("profiles")
    .update({ organisation_id: org.id })
    .eq("user_id", user.id);

  return NextResponse.json({ organisation: org });
}
