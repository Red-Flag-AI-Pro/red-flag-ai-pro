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

  const [{ data: flags }, { data: profile }] = await Promise.all([
    supabase.from("scan_flags").select("*").eq("scan_id", id),
    supabase.from("profiles").select("plan").eq("user_id", user.id).single(),
  ]);

  const plan = (profile?.plan as string) ?? "free";

  // Free accounts have the fix text gated in the UI, and this JSON route must
  // apply the same gate or fetching the raw response would hand every
  // suggestion over in full. Same placeholder swap as the results page.
  const visibleFlags = (flags ?? []).map((f) =>
    plan === "free" && f.suggestion
      ? { ...f, suggestion: "Unlock Pro to see the exact fix for this flag, rewritten and ready to use." }
      : f
  );

  return NextResponse.json({ scan, flags: visibleFlags });
}
