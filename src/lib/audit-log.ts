import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { requestTimestamp } from "@/lib/audit-timestamp";

const GENESIS_HASH = "0".repeat(64);

function computeHash(prevHash: string, entry: {
  user_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}): string {
  const payload = `${prevHash}|${entry.user_id}|${entry.action}|${JSON.stringify(entry.details)}|${entry.created_at}`;
  return createHash("sha256").update(payload).digest("hex");
}

// Writes always go through the service role, bypassing RLS, so a logged-in
// user can never insert or edit their own audit trail — only read it.
// Each row is chained to the previous one via a SHA-256 hash, so altering
// or deleting a past row is detectable by verifyAuditChain below.
export async function logAuditEvent(
  userId: string,
  action: string,
  details: Record<string, unknown> = {},
  // High-value Sentinel events (sign-offs, boundary authorizations) pass
  // timestamp:true to also seal the entry with an RFC 3161 trusted timestamp
  // from a third-party authority. Off by default so routine, high-frequency
  // logging stays instant.
  options: { timestamp?: boolean } = {}
): Promise<void> {
  try {
    const supabase = await createServiceClient();

    const { data: last } = await supabase
      .from("audit_log")
      .select("hash")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const prevHash = last?.hash ?? GENESIS_HASH;
    const createdAt = new Date().toISOString();
    const hash = computeHash(prevHash, { user_id: userId, action, details, created_at: createdAt });

    // Best-effort third-party timestamp. Never blocks or breaks logging: a
    // TSA outage just leaves ts_* null and the internal hash chain still holds.
    let ts: { tsa: string; token: string; time: string } | null = null;
    if (options.timestamp) {
      ts = await requestTimestamp(hash);
    }

    await supabase.from("audit_log").insert({
      user_id: userId,
      action,
      details,
      created_at: createdAt,
      prev_hash: prevHash,
      hash,
      ts_token: ts?.token ?? null,
      ts_time: ts?.time ?? null,
      ts_tsa: ts?.tsa ?? null,
    });
  } catch {
    // Audit logging must never break the action it's logging.
  }
}

export interface AuditChainVerification {
  valid: boolean;
  checkedEntries: number;
  brokenAtEntryId: string | null;
}

// Re-walks a user's full audit trail in chronological order and recomputes
// each hash from scratch, confirming it matches the prev_hash of the next
// entry and the stored hash of its own row. Any edited, deleted, or
// reordered row breaks the chain from that point forward.
export async function verifyAuditChain(userId: string): Promise<AuditChainVerification> {
  const supabase = await createServiceClient();

  const { data: entries } = await supabase
    .from("audit_log")
    .select("id, action, details, created_at, prev_hash, hash")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (!entries || entries.length === 0) {
    return { valid: true, checkedEntries: 0, brokenAtEntryId: null };
  }

  let expectedPrevHash = GENESIS_HASH;

  for (const entry of entries) {
    if (entry.prev_hash !== expectedPrevHash) {
      return { valid: false, checkedEntries: entries.length, brokenAtEntryId: entry.id };
    }

    const recomputed = computeHash(expectedPrevHash, {
      user_id: userId,
      action: entry.action,
      details: entry.details,
      created_at: entry.created_at,
    });

    if (recomputed !== entry.hash) {
      return { valid: false, checkedEntries: entries.length, brokenAtEntryId: entry.id };
    }

    expectedPrevHash = entry.hash;
  }

  return { valid: true, checkedEntries: entries.length, brokenAtEntryId: null };
}

export interface PublicVerificationResult {
  found: boolean;
  intact: boolean;
  action?: string;
  createdAt?: string;
  // Present when the entry was sealed with a third-party RFC 3161 timestamp.
  timestampedAt?: string;
  timestampAuthority?: string;
}

// Public, unauthenticated check on a single audit log entry by id. Recomputes
// its hash from its own stored data and prev_hash and compares to the stored
// hash, proving this specific record hasn't been altered since it was sealed.
// Deliberately does not expose the user_id, other entries, or the full chain,
// so this can be safely exposed to anyone with the entry id printed on a report.
export async function verifyPublicEntry(entryId: string): Promise<PublicVerificationResult> {
  const supabase = await createServiceClient();

  const { data: entry } = await supabase
    .from("audit_log")
    .select("user_id, action, details, created_at, prev_hash, hash, ts_time, ts_tsa")
    .eq("id", entryId)
    .maybeSingle();

  if (!entry) {
    return { found: false, intact: false };
  }

  const recomputed = computeHash(entry.prev_hash ?? GENESIS_HASH, {
    user_id: entry.user_id,
    action: entry.action,
    details: entry.details,
    created_at: entry.created_at,
  });

  return {
    found: true,
    intact: recomputed === entry.hash,
    action: entry.action,
    createdAt: entry.created_at,
    timestampedAt: (entry as { ts_time?: string }).ts_time ?? undefined,
    timestampAuthority: (entry as { ts_tsa?: string }).ts_tsa ?? undefined,
  };
}
