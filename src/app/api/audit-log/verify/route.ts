import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAuditChain } from "@/lib/audit-log";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  if (profile?.plan !== "sentinel") {
    return NextResponse.json({ error: "Sentinel plan required" }, { status: 403 });
  }

  const result = await verifyAuditChain(user.id);
  return NextResponse.json(result);
}
