import type { SupabaseClient } from "@supabase/supabase-js";

// How many enforcement_decisions a boundary record has governed (see
// governing_record_id, set in /api/v1/enforce) up to the moment its terms
// change. Brad Wolfe, "a default is not a decision until somebody has
// counted": grandfather wins by default only because it's the one option
// that needs no count. This is a boundary count as of the change, not a
// running lifetime total — everything governed before this moment, under
// the terms actually being superseded.
export async function getGovernedPopulationCount(
  supabase: SupabaseClient,
  recordId: string,
  asOf: string
): Promise<number> {
  const { count } = await supabase
    .from("enforcement_decisions")
    .select("id", { count: "exact", head: true })
    .eq("governing_record_id", recordId)
    .lt("created_at", asOf);
  return count ?? 0;
}
