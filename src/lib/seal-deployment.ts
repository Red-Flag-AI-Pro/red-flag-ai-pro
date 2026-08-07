import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { WITNESS_CHAIN_USER_ID } from "@/lib/witness";

// Sealing used to depend on somebody remembering to POST /api/admin/seal-document
// after shipping. That works right up until a long night ends without it, and
// then a fortnight of work has no dated record at all — which is precisely the
// failure this company sells against. Publication is now the trigger: every
// production deployment gets sealed on its own, keyed to the commit that
// produced it, whether or not anyone remembers.
//
// Deliberately driven by the hourly cron rather than by instrumentation.ts.
// A boot hook fires once per serverless instance, so a burst of cold starts on
// a fresh deployment would run several seals at once, each reading the same
// previous hash and writing a sibling off it. That forks the chain, and a
// forked chain fails our own verification. Cron invocations do not overlap,
// so the write stays serial and the worst case is a seal an hour late rather
// than a chain that cannot be verified.

const SEALED_BY_NAME = "James Stokes";
const SEALED_BY_ORG = "Red Flag AI Pro";

export type DeploymentSealResult = {
  sealed: boolean;
  reason: "sealed" | "already-sealed" | "not-production" | "no-commit" | "write-failed";
  commitSha: string | null;
  entryId?: string;
  verify?: string;
  hoursSinceLastSeal: number | null;
};

// The commit subject line only. Vercel exposes the full message including body
// text, and a multi-paragraph commit body would make an unreadable seal title.
function commitSubject(message: string): string {
  const firstLine = message.split("\n")[0].trim();
  return firstLine.length > 180 ? `${firstLine.slice(0, 177)}...` : firstLine;
}

// How long since anything at all was sealed. Reported on every run so a
// silently broken sealer shows up as a growing number in the cron response
// rather than as a gap nobody notices until it is weeks wide.
async function hoursSinceLastSeal(): Promise<number | null> {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("audit_log")
    .select("created_at")
    .eq("action", "concept.sealed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.created_at) return null;
  return (Date.now() - new Date(data.created_at).getTime()) / 3_600_000;
}

export async function sealCurrentDeployment(): Promise<DeploymentSealResult> {
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA ?? null;
  const stale = await hoursSinceLastSeal();

  // Preview and development deployments are not publications. Sealing them
  // would fill the public record with commits that never reached a customer.
  if (process.env.VERCEL_ENV !== "production") {
    return { sealed: false, reason: "not-production", commitSha, hoursSinceLastSeal: stale };
  }

  if (!commitSha) {
    return { sealed: false, reason: "no-commit", commitSha: null, hoursSinceLastSeal: stale };
  }

  // Idempotency is keyed on the commit, not on the clock. The cron runs every
  // hour against a deployment that may sit unchanged for days; only the first
  // run after a new commit goes live writes anything.
  const supabase = await createServiceClient();
  const { data: existing } = await supabase
    .from("audit_log")
    .select("id")
    .eq("action", "concept.sealed")
    .eq("details->>commit_sha", commitSha)
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    return {
      sealed: false,
      reason: "already-sealed",
      commitSha,
      entryId: existing.id,
      verify: `https://www.redflagaipro.com/verify?id=${existing.id}`,
      hoursSinceLastSeal: stale,
    };
  }

  const message = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "";
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? "unknown";
  const subject = commitSubject(message) || `Deployment of ${commitSha.slice(0, 7)}`;

  // Hashed over the commit identity rather than over a prose summary, so
  // anyone holding the repository can recompute this exact digest from the
  // commit itself and confirm the seal refers to the code they are reading.
  const content = `commit:${commitSha}\nbranch:${branch}\nmessage:${message}`;
  const contentHash = createHash("sha256").update(content, "utf8").digest("hex");

  const entryId = await logAuditEvent(
    WITNESS_CHAIN_USER_ID,
    "concept.sealed",
    {
      title: subject,
      url: "https://www.redflagaipro.com",
      category: "deployment",
      content_sha256: contentHash,
      commit_sha: commitSha,
      commit_branch: branch,
      sealed_by_name: SEALED_BY_NAME,
      sealed_by_org: SEALED_BY_ORG,
    },
    { timestamp: true }
  );

  if (!entryId) {
    return { sealed: false, reason: "write-failed", commitSha, hoursSinceLastSeal: stale };
  }

  return {
    sealed: true,
    reason: "sealed",
    commitSha,
    entryId,
    verify: `https://www.redflagaipro.com/verify?id=${entryId}`,
    hoursSinceLastSeal: stale,
  };
}
