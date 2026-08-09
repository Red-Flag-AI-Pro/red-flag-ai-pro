import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { WITNESS_CHAIN_USER_ID } from "@/lib/witness";

// Public, unauthenticated, deliberately narrow: only the company's own
// deployment/document seals on the one fixed public chain, never a general
// audit_log query. Task #270: a first-time visitor to /verify has no report
// of their own with an ID printed on it, so nothing to paste. This gives
// them 3 real, already-public seals to click, the same idea a competitor's
// verify page uses — except these are our own genuine entries, not staged
// examples, so the list is whatever actually shipped most recently.
export async function GET() {
  const supabase = await createServiceClient();

  const { data: entries } = await supabase
    .from("audit_log")
    .select("id, details, created_at, ts_time")
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .eq("action", "concept.sealed")
    .order("created_at", { ascending: false })
    .limit(3);

  const samples = (entries ?? []).map((e) => {
    const details = (e.details ?? {}) as Record<string, unknown>;
    return {
      id: e.id,
      title: (details.title as string) ?? "Sealed record",
      createdAt: e.created_at,
      timestamped: Boolean(e.ts_time),
    };
  });

  return NextResponse.json({ samples });
}
