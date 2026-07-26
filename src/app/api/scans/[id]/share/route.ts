import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Toggles opt-in public sharing for one of the caller's OWN scans. Authed and
// scoped to user_id via the RLS-bound client, so a user can only ever change
// the share state of a report they own. Body: { isPublic: boolean }.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let isPublic = false;
  try {
    const body = await request.json();
    isPublic = body?.isPublic === true;
  } catch {
    // default false
  }

  // The .eq("user_id") plus RLS means this update can only ever touch the
  // caller's own row; a mismatched id updates nothing.
  const { data, error } = await supabase
    .from("scans")
    .update({ is_public: isPublic })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id, is_public")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Could not update sharing." }, { status: 400 });
  }

  return NextResponse.json({ isPublic: data.is_public === true });
}
