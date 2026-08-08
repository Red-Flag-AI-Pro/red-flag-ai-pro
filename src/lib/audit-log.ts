import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { requestTimestamp } from "@/lib/audit-timestamp";

const GENESIS_HASH = "0".repeat(64);

// Postgres returns timestamptz as "+00:00" while JS writes "Z", and jsonb
// returns object keys in its own storage order rather than insertion order.
// Hashing must survive that round trip, so both sides reduce to one canonical
// form: millisecond-precision ISO with Z, and recursively key-sorted JSON.
function canonicalTimestamp(ts: string): string {
  const parsed = new Date(ts);
  return isNaN(parsed.getTime()) ? ts : parsed.toISOString();
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>).sort();
    const body = keys
      .filter((k) => (value as Record<string, unknown>)[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${canonicalJson((value as Record<string, unknown>)[k])}`)
      .join(",");
    return `{${body}}`;
  }
  return JSON.stringify(value) ?? "null";
}

function computeHash(prevHash: string, entry: {
  user_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}): string {
  const payload = `${prevHash}|${entry.user_id}|${entry.action}|${canonicalJson(entry.details)}|${canonicalTimestamp(entry.created_at)}`;
  return createHash("sha256").update(payload).digest("hex");
}

// Entries written before canonicalization were hashed from the raw JS values
// of their day: Z-form timestamps and insertion-order JSON.stringify. After a
// database round trip those exact strings may no longer be reproducible, so
// verification accepts a stored hash if it matches the canonical form or
// either legacy reconstruction. New writes always use the canonical form.
function hashMatches(storedHash: string, prevHash: string, entry: {
  user_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}): boolean {
  if (computeHash(prevHash, entry) === storedHash) return true;

  const legacyPayloads = [
    // Raw values exactly as returned by the database (pre-fix repair form).
    `${prevHash}|${entry.user_id}|${entry.action}|${JSON.stringify(entry.details)}|${entry.created_at}`,
    // Database key order with the original Z-form write timestamp.
    `${prevHash}|${entry.user_id}|${entry.action}|${JSON.stringify(entry.details)}|${canonicalTimestamp(entry.created_at)}`,
  ];
  return legacyPayloads.some(
    (p) => createHash("sha256").update(p).digest("hex") === storedHash
  );
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
): Promise<string | null> {
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

    const { data: inserted } = await supabase
      .from("audit_log")
      .insert({
        user_id: userId,
        action,
        details,
        created_at: createdAt,
        prev_hash: prevHash,
        hash,
        ts_token: ts?.token ?? null,
        ts_time: ts?.time ?? null,
        ts_tsa: ts?.tsa ?? null,
      })
      .select("id")
      .single();

    return inserted?.id ?? null;
  } catch {
    // Audit logging must never break the action it's logging.
    return null;
  }
}

export interface AuditChainVerification {
  valid: boolean;
  checkedEntries: number;
  brokenAtEntryId: string | null;
  // Entries whose content was legitimately redacted under GDPR Article 17.
  // Their stored hash no longer matches a recompute of their (now redacted)
  // details by design — that mismatch is expected, not tampering, and is
  // reported here rather than as a broken chain.
  redactedEntries: string[];
}

// Re-walks a user's full audit trail in chronological order and recomputes
// each hash from scratch, confirming it matches the prev_hash of the next
// entry and the stored hash of its own row. Any edited, deleted, or
// reordered row breaks the chain from that point forward.
//
// The one designed exception is a tombstoned (GDPR Article 17 redacted)
// entry: tombstoneAuditEntry overwrites `details` in place but freezes the
// stored `hash` and `prev_hash` at their original values, so the chain
// LINKAGE (later entries' prev_hash still pointing at this row's unchanged
// hash) stays intact while a recompute of the current, redacted details no
// longer matches that frozen hash. That specific, single-row mismatch is
// treated as an expected redaction rather than a break, and is what makes
// erasure possible at all on a hash-chained log without destroying the
// chain for every entry that came after it.
export async function verifyAuditChain(userId: string): Promise<AuditChainVerification> {
  const supabase = await createServiceClient();

  const { data: entries } = await supabase
    .from("audit_log")
    .select("id, action, details, created_at, prev_hash, hash, redacted_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (!entries || entries.length === 0) {
    return { valid: true, checkedEntries: 0, brokenAtEntryId: null, redactedEntries: [] };
  }

  let expectedPrevHash = GENESIS_HASH;
  const redactedEntries: string[] = [];

  for (const entry of entries) {
    if (entry.prev_hash !== expectedPrevHash) {
      return { valid: false, checkedEntries: entries.length, brokenAtEntryId: entry.id, redactedEntries };
    }

    if (entry.redacted_at) {
      redactedEntries.push(entry.id);
      // Chain linkage still advances off the frozen, unchanged hash — only
      // the content-matches-hash check is skipped for this one row.
      expectedPrevHash = entry.hash;
      continue;
    }

    const matches = hashMatches(entry.hash, expectedPrevHash, {
      user_id: userId,
      action: entry.action,
      details: entry.details,
      created_at: entry.created_at,
    });

    if (!matches) {
      return { valid: false, checkedEntries: entries.length, brokenAtEntryId: entry.id, redactedEntries };
    }

    expectedPrevHash = entry.hash;
  }

  return { valid: true, checkedEntries: entries.length, brokenAtEntryId: null, redactedEntries };
}

export interface TombstoneResult {
  id: string;
  action: string;
  redactedAt: string;
  certificateEntryId: string | null;
}

// Erases the personal content of one entry under GDPR Article 17 while
// keeping the hash chain verifiable. `details` is overwritten with a stub
// that preserves only what's structurally needed (the original action name)
// — the stored `hash` and `prev_hash` are left untouched, so later entries'
// linkage to this row is unaffected. A separate certificate entry is then
// APPENDED (not mutated) to the same chain, itself fully hash verifiable,
// documenting which entry was redacted, when, by whom and why — this is
// what lets an erasure be proved to have happened, not just claimed.
export async function tombstoneAuditEntry(
  userId: string,
  entryId: string,
  reason: string,
  redactedBy: string
): Promise<TombstoneResult | null> {
  const supabase = await createServiceClient();

  const { data: entry } = await supabase
    .from("audit_log")
    .select("id, action, redacted_at")
    .eq("id", entryId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!entry) return null;
  if (entry.redacted_at) {
    return { id: entry.id, action: entry.action, redactedAt: entry.redacted_at, certificateEntryId: null };
  }

  const redactedAt = new Date().toISOString();

  const { error } = await supabase
    .from("audit_log")
    .update({
      details: { redacted: true, original_action: entry.action },
      redacted_at: redactedAt,
      redaction_reason: reason,
      redacted_by: redactedBy,
    })
    .eq("id", entryId);

  if (error) return null;

  const certificateEntryId = await logAuditEvent(
    userId,
    "gdpr.erasure_certificate",
    {
      redacted_entry_id: entryId,
      redacted_entry_action: entry.action,
      redacted_at: redactedAt,
      reason,
      redacted_by: redactedBy,
    },
    { timestamp: true }
  );

  return { id: entry.id, action: entry.action, redactedAt, certificateEntryId };
}

export interface PublicVerificationResult {
  found: boolean;
  intact: boolean;
  action?: string;
  // A short, plain English line describing what this specific record was,
  // not just its category. Only populated for action types where the
  // underlying details are safe to show publicly — deliberately not a
  // blanket dump of `details`, since some action types (scans, vendors)
  // carry business content that shouldn't be exposed just from an id.
  description?: string;
  // A specific label for what kind of thing this was (e.g. "Security fix",
  // "Legal document", "Product decision"), set at seal time. Only present
  // on concept.sealed entries that supplied one — lets the verify page show
  // something more useful than the same generic action label for every entry.
  category?: string;
  // The stored SHA-256 of the original document content, present only for
  // concept.sealed entries. Lets a visitor hash their own copy of the same
  // document in their browser and compare it themselves, the same
  // self-serve check the seal-document route makes possible.
  contentSha256?: string;
  // Who sealed this specific record and which company they sealed it for.
  // Present on every concept.sealed entry going forward — a name attached to
  // the record itself, not just implied by the site it's hosted on.
  sealedByName?: string;
  sealedByOrg?: string;
  createdAt?: string;
  // Present when the entry was sealed with a third-party RFC 3161 timestamp.
  timestampedAt?: string;
  timestampAuthority?: string;
  // Present only on account_coverage_lapsed entries — the continuity
  // certificate's underlying numbers, frozen at the moment coverage ended.
  memberSince?: string;
  totalChecks?: number;
  sealedEvents?: number;
  fromPlan?: string;
}

function buildPublicDescription(action: string, details: Record<string, unknown>): string | undefined {
  const str = (key: string): string | undefined => (typeof details[key] === "string" ? (details[key] as string) : undefined);

  switch (action) {
    case "concept.sealed": {
      const title = str("title");
      return title ? `"${title}"` : undefined;
    }
    case "boundary_record.lapsed": {
      const decision = str("decision");
      const owner = str("owner_name");
      const continuityOwner = str("continuity_owner_name");
      const base = decision ? `Authorization lapsed: ${decision}${owner ? ` (${owner})` : ""}` : undefined;
      if (!base) return undefined;
      return continuityOwner ? `${base}. Cover was ${continuityOwner}'s responsibility.` : base;
    }
    case "account_coverage_lapsed": {
      const fromPlan = str("from_plan");
      const reason = str("reason");
      if (!fromPlan) return undefined;
      return reason === "cancelled"
        ? `${fromPlan} coverage ended (subscription cancelled)`
        : `${fromPlan} coverage ended (plan changed)`;
    }
    case "enforcement.blocked": {
      const title = str("title");
      const governingDecision = str("governing_record_decision");
      const governingOwner = str("governing_record_owner_name");
      const base = title ? `Real Time Gate blocked "${title}"` : `Real Time Gate blocked a submission`;
      if (!governingDecision) return `${base}. No boundary authorization record currently governs this key.`;
      return `${base}, under the boundary authorization approved by ${governingOwner ?? "an unnamed owner"}: "${governingDecision}"`;
    }
    case "witness.anchor_sent": {
      const peer = str("peer_chain");
      return peer ? `Sent our tip to ${peer}` : undefined;
    }
    case "witness.anchor_received": {
      const peer = str("peer_chain");
      return peer ? `Received and sealed a tip from ${peer}` : undefined;
    }
    case "gdpr.erasure_certificate": {
      const originalAction = str("redacted_entry_action");
      return originalAction
        ? `Certifies that a "${originalAction}" record was redacted under GDPR Article 17`
        : `Certifies a record was redacted under GDPR Article 17`;
    }
    default:
      return undefined;
  }
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
    .select("user_id, action, details, created_at, prev_hash, hash, ts_time, ts_tsa, redacted_at")
    .eq("id", entryId)
    .maybeSingle();

  if (!entry) {
    return { found: false, intact: false };
  }

  // A redacted entry's stored hash will never again match a recompute of its
  // (now redacted) details — that is by design, not a broken record. Report
  // it as intact with a redaction notice rather than as tampered.
  const isRedacted = Boolean((entry as { redacted_at?: string }).redacted_at);
  const intact = isRedacted
    ? true
    : hashMatches(entry.hash, entry.prev_hash ?? GENESIS_HASH, {
        user_id: entry.user_id,
        action: entry.action,
        details: entry.details,
        created_at: entry.created_at,
      });

  if (isRedacted) {
    return {
      found: true,
      intact: true,
      action: entry.action,
      description: "This record was redacted under GDPR Article 17. A separate certificate entry on the same chain documents when and why.",
      createdAt: entry.created_at,
    };
  }

  const details = entry.details ?? {};
  const contentSha256 = typeof details["content_sha256"] === "string" ? (details["content_sha256"] as string) : undefined;
  const category = typeof details["category"] === "string" ? (details["category"] as string) : undefined;
  const sealedByName = typeof details["sealed_by_name"] === "string" ? (details["sealed_by_name"] as string) : undefined;
  const sealedByOrg = typeof details["sealed_by_org"] === "string" ? (details["sealed_by_org"] as string) : undefined;
  const memberSince = typeof details["member_since"] === "string" ? (details["member_since"] as string) : undefined;
  const totalChecks = typeof details["total_checks"] === "number" ? (details["total_checks"] as number) : undefined;
  const sealedEvents = typeof details["sealed_events"] === "number" ? (details["sealed_events"] as number) : undefined;
  const fromPlan = typeof details["from_plan"] === "string" ? (details["from_plan"] as string) : undefined;

  return {
    found: true,
    intact,
    action: entry.action,
    description: buildPublicDescription(entry.action, details),
    category,
    contentSha256,
    sealedByName,
    sealedByOrg,
    createdAt: entry.created_at,
    timestampedAt: (entry as { ts_time?: string }).ts_time ?? undefined,
    timestampAuthority: (entry as { ts_tsa?: string }).ts_tsa ?? undefined,
    memberSince,
    totalChecks,
    sealedEvents,
    fromPlan,
  };
}
