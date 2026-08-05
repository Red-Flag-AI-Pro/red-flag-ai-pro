import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { analyzeContent, RULESET_VERSION } from "@/lib/analyzer";
import type { JurisdictionCode } from "@/lib/analyzer";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// Public, unauthenticated. Resubmit the exact {title, content, jurisdictions}
// from an earlier /api/replay/challenge call along with the ticket it
// returned. Recomputes the analysis fresh and confirms the ticket still
// matches — the actual reproducibility proof, not just a claim of it.
export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(`replay_verify:${clientIp(request)}`, 20, 60);
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
  const ticket = typeof b.ticket === "string" ? b.ticket : "";

  if (!content.trim() || !ticket) {
    return NextResponse.json({ error: "Expected content and the ticket from a prior /api/replay/challenge call." }, { status: 400 });
  }

  const result = analyzeContent(title, content, jurisdictions);
  const outputSummary = result.flags
    .map((f) => `${f.category}:${f.severity}`)
    .sort();

  const recomputed = createHash("sha256")
    .update(JSON.stringify({ title, content, jurisdictions: jurisdictions ?? null, ruleset: RULESET_VERSION, score: result.score, flags: outputSummary }))
    .digest("hex");

  const matches = recomputed === ticket;

  return NextResponse.json({
    matches,
    submitted_ticket: ticket,
    recomputed_ticket: recomputed,
    ruleset_version: RULESET_VERSION,
    why: matches
      ? "The verdict reproduced exactly under the current ruleset."
      : "The recomputed ticket doesn't match. Either the input differs from what was originally submitted, or the ruleset has changed since — check ruleset_version.",
  });
}
