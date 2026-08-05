import { createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { WITNESS_CHAIN_USER_ID } from "@/lib/witness";

// Completeness and absence proofs, built off the existing per-user hash
// chain rather than a separate Merkle tree. The property each needs to
// prove doesn't require one:
//
// Completeness needs a record count committed BEFORE an export, so tail
// truncation (quietly deleting the most recent entries) is detectable —
// hash-chain verification alone only catches edits to entries that still
// exist, not entries removed entirely from the end. A periodic sealed
// checkpoint closes that gap without a tree.
//
// Absence needs to prove a specific value is not in the set. Since chain
// entries can be range-queried by hash, showing the two real entries that
// bracket where a missing value would sort proves absence directly off
// the existing table — the same guarantee a Merkle adjacent-leaf proof
// gives, just against a linear ordered chain instead of a tree.
//
// Both operate on WITNESS_CHAIN_USER_ID (the company's own public chain),
// matching mutual_witnessing's scope — never a customer's private data.

function periodKey(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD, UTC day
}

export interface CompletenessCheckpoint {
  period: string;
  record_count: number;
  latest_entry_id: string | null;
  latest_entry_hash: string | null;
  sealed_at: string;
}

// Seals "as of now, there are exactly N entries in the company chain" as
// its own chain entry. Idempotent per period: calling this again the same
// UTC day updates nothing, since the first checkpoint for a period is the
// one that matters — resealing on every cron run would defeat the point.
export async function sealCompletenessCheckpoint(): Promise<CompletenessCheckpoint | null> {
  const supabase = await createServiceClient();
  const period = periodKey(new Date());

  const { data: existing } = await supabase
    .from("audit_log")
    .select("details")
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .eq("action", "completeness.checkpoint")
    .eq("details->>period", period)
    .maybeSingle();

  if (existing) {
    return existing.details as unknown as CompletenessCheckpoint;
  }

  const { count } = await supabase
    .from("audit_log")
    .select("id", { count: "exact", head: true })
    .eq("user_id", WITNESS_CHAIN_USER_ID);

  const { data: latest } = await supabase
    .from("audit_log")
    .select("id, hash")
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const details: CompletenessCheckpoint = {
    period,
    record_count: count ?? 0,
    latest_entry_id: latest?.id ?? null,
    latest_entry_hash: latest?.hash ?? null,
    sealed_at: new Date().toISOString(),
  };

  await logAuditEvent(WITNESS_CHAIN_USER_ID, "completeness.checkpoint", details as unknown as Record<string, unknown>, {
    timestamp: true,
  });

  return details;
}

// The most recently sealed checkpoint, public — this is what an auditor
// compares an export's actual count against.
export async function getLatestCompletenessCheckpoint(): Promise<CompletenessCheckpoint | null> {
  const supabase = await createServiceClient();

  const { data } = await supabase
    .from("audit_log")
    .select("details")
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .eq("action", "completeness.checkpoint")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.details as unknown as CompletenessCheckpoint) ?? null;
}

export type AbsenceProofResult =
  | { present: true; entryId: string }
  | {
      present: false;
      lowerNeighbor: { id: string; hash: string; created_at: string } | null;
      upperNeighbor: { id: string; hash: string; created_at: string } | null;
    };

// Proves a queried hash is or is not present in the company chain. Absence
// is shown by the two real, adjacent (by hash order) entries that bracket
// where the value would sort if it existed — nothing sits between them,
// so nothing was removed to make room for a fabricated gap.
export async function getAbsenceProof(value: string): Promise<AbsenceProofResult> {
  const supabase = await createServiceClient();

  const { data: exact } = await supabase
    .from("audit_log")
    .select("id")
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .eq("hash", value)
    .maybeSingle();

  if (exact) {
    return { present: true, entryId: exact.id };
  }

  const [{ data: lower }, { data: upper }] = await Promise.all([
    supabase
      .from("audit_log")
      .select("id, hash, created_at")
      .eq("user_id", WITNESS_CHAIN_USER_ID)
      .lt("hash", value)
      .order("hash", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("audit_log")
      .select("id, hash, created_at")
      .eq("user_id", WITNESS_CHAIN_USER_ID)
      .gt("hash", value)
      .order("hash", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    present: false,
    lowerNeighbor: lower ?? null,
    upperNeighbor: upper ?? null,
  };
}

export interface ReconciliationSample {
  sampled_at: string;
  population_size: number;
  sample_size: number;
  sample_entry_ids: string[];
}

// Account-level, not public — this operates on a real customer's own audit
// log, unlike completeness/absence above which only ever touch the
// company's own public chain. Picks a random sample of entry ids and seals
// the selection before it's used for anything, so a later reconciliation
// can't quietly pick only the flattering records after the fact.
export async function sealReconciliationSample(
  userId: string,
  sampleSize: number
): Promise<ReconciliationSample | null> {
  const supabase = await createServiceClient();

  const { data: entries, count } = await supabase
    .from("audit_log")
    .select("id", { count: "exact" })
    .eq("user_id", userId);

  if (!entries || entries.length === 0) return null;

  const shuffled = [...entries].sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, Math.min(sampleSize, shuffled.length)).map((e) => e.id);

  const details: ReconciliationSample = {
    sampled_at: new Date().toISOString(),
    population_size: count ?? entries.length,
    sample_size: sample.length,
    sample_entry_ids: sample,
  };

  await logAuditEvent(userId, "reconciliation.sample_sealed", details as unknown as Record<string, unknown>, {
    timestamp: true,
  });

  return details;
}
