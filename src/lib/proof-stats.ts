import { createServiceClient } from "@/lib/supabase/server";
import { WITNESS_CHAIN_USER_ID } from "@/lib/witness";

// The homepage proof figures: how long the hourly witness exchange has run,
// how many records sit in the sealed chain, and how many days it missed.
//
// Every figure is computed from the audit_log itself on each revalidation.
// Nothing here is typed in by hand, because the whole pitch is "do not take
// our word for it". If the chain ever misses a day, this says so in public.
// If the database cannot be reached, it returns null and the page shows no
// figures at all rather than a stale or invented one.

export interface ProofStats {
  /** Calendar days (UTC) from the first hourly send to today, inclusive. */
  daysRunning: number;
  /** Rows in the sealed chain, the same count /api/witness/tip publishes. */
  recordsSealed: number;
  /** Completed days since the first send with no send at all. */
  daysMissed: number;
  /** ISO date (YYYY-MM-DD) of the first hourly send. */
  since: string;
}

const PAGE = 1000;
const MAX_PAGES = 100;
const DAY_MS = 86_400_000;

const dayOf = (iso: string) => iso.slice(0, 10);

export async function getProofStats(): Promise<ProofStats | null> {
  // Local preview only: lets the layout be reviewed on a machine that has no
  // database keys. Ignored in production so a stray variable can never put a
  // hand typed number on the live site.
  if (process.env.NODE_ENV !== "production" && process.env.PROOF_STATS_PREVIEW) {
    const [d, r, m, since] = process.env.PROOF_STATS_PREVIEW.split(",");
    return { daysRunning: Number(d), recordsSealed: Number(r), daysMissed: Number(m), since: since ?? "2026-08-02" };
  }

  try {
    const supabase = await createServiceClient();

    const { count: recordsSealed, error: countError } = await supabase
      .from("audit_log")
      .select("id", { count: "exact", head: true })
      .eq("user_id", WITNESS_CHAIN_USER_ID);
    if (countError || typeof recordsSealed !== "number") return null;

    // One timestamp per send. Paged because the API returns at most 1,000
    // rows per request. At two sends an hour this is a handful of small
    // requests, once an hour, when the page revalidates.
    const sendDays = new Set<string>();
    for (let page = 0; page < MAX_PAGES; page++) {
      const { data, error } = await supabase
        .from("audit_log")
        .select("created_at")
        .eq("user_id", WITNESS_CHAIN_USER_ID)
        .eq("action", "witness.anchor_sent")
        .order("created_at", { ascending: true })
        .range(page * PAGE, page * PAGE + PAGE - 1);
      if (error || !data) return null;
      for (const row of data) sendDays.add(dayOf(row.created_at as string));
      if (data.length < PAGE) break;
    }
    if (sendDays.size === 0) return null;

    const since = [...sendDays].sort()[0];
    const first = Date.parse(`${since}T00:00:00Z`);
    const today = Date.parse(`${dayOf(new Date().toISOString())}T00:00:00Z`);
    const daysRunning = Math.round((today - first) / DAY_MS) + 1;

    // Today is still in progress, so it only counts as missed once it is over.
    let daysMissed = 0;
    for (let t = first; t < today; t += DAY_MS) {
      if (!sendDays.has(dayOf(new Date(t).toISOString()))) daysMissed++;
    }

    return { daysRunning, recordsSealed, daysMissed, since };
  } catch {
    return null;
  }
}

export function formatProofDate(isoDay: string): string {
  return new Date(`${isoDay}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
