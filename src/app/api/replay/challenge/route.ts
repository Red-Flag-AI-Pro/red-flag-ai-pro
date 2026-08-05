import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { analyzeContent, RULESET_VERSION } from "@/lib/analyzer";
import type { JurisdictionCode } from "@/lib/analyzer";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// Public, unauthenticated reproducibility demo. The scanner's core scoring
// is pure keyword-matching with no model call and no randomness, so the
// same input under the same ruleset version always produces the same
// output — this endpoint lets a stranger prove that themselves rather than
// take it on our word. Nothing is stored: the "seal" is the ticket itself,
// a hash of the fixed inputs and outputs, not a database row. Resubmit the
// exact same body to /api/replay/verify later and the ticket must match.
export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(`replay_challenge:${clientIp(request)}`, 20, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const title = typeof b.title === "string" ? b.title : "";
  const content = typeof b.content === "string" ? b.content : "";
  const jurisdictions = Array.isArray(b.jurisdictions) ? (b.jurisdictions as JurisdictionCode[]) : undefined;

  if (!content.trim()) {
    return NextResponse.json({ error: "Expected a non-empty content field." }, { status: 400 });
  }
  if (content.length > 20000) {
    return NextResponse.json({ error: "Content too long for the demo endpoint (20,000 char limit)." }, { status: 400 });
  }

  const result = analyzeContent(title, content, jurisdictions);
  const outputSummary = result.flags
    .map((f) => `${f.category}:${f.severity}`)
    .sort();

  const ticket = createHash("sha256")
    .update(JSON.stringify({ title, content, jurisdictions: jurisdictions ?? null, ruleset: RULESET_VERSION, score: result.score, flags: outputSummary }))
    .digest("hex");

  return NextResponse.json({
    ticket,
    ruleset_version: RULESET_VERSION,
    score: result.score,
    flag_count: result.flags.length,
    how_to_verify:
      "POST the exact same {title, content, jurisdictions} to /api/replay/verify along with this ticket. " +
      "If the ruleset hasn't changed, the recomputed ticket will match exactly.",
  });
}
