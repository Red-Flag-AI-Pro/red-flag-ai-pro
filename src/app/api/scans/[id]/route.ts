import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: scan } = await supabase
    .from("scans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  const { data: flags } = await supabase
    .from("scan_flags")
    .select("*")
    .eq("scan_id", id);

  return NextResponse.json({ scan, flags: flags ?? [] });
}
