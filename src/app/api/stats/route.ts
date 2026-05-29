import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300; // cache 5 minutes

export async function GET() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true });

  return NextResponse.json({ scans: count ?? 0 }, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
  });
}
