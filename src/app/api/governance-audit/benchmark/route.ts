import { createClient } from "@supabase/supabase-js";
import { PEER_BENCHMARK } from "@/lib/governance-audit";

export const revalidate = 3600; // recompute at most once an hour

// Below this many real completed assessments, the percentile math is too
// noisy/identifying to show — fall back to the static estimate instead.
const MIN_SAMPLE_SIZE = 20;

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

export async function GET() {
  try {
    const supabase = getAdminClient();

    // Only ever select the numeric score — anonymous aggregate, no PII,
    // no email, no answers, no red flags leave this function.
    const { data, error } = await supabase
      .from("governance_audit_emails")
      .select("score");

    if (error || !data || data.length < MIN_SAMPLE_SIZE) {
      return Response.json({
        ...PEER_BENCHMARK.overall,
        sampleSize: data?.length ?? 0,
        source: "estimate",
      });
    }

    const scores = data
      .map((row) => row.score as number)
      .filter((s) => typeof s === "number")
      .sort((a, b) => a - b);

    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const q1 = Math.round(percentile(scores, 25));
    const q2 = Math.round(percentile(scores, 50));
    const q3 = Math.round(percentile(scores, 75));

    return Response.json({
      average,
      quartile: { q1, q2, q3, q4: q3 }, // q4 kept for compatibility: the top-quartile entry threshold = p75
      sampleSize: scores.length,
      source: "real",
    });
  } catch (err) {
    console.error("Governance benchmark error:", err);
    return Response.json({
      ...PEER_BENCHMARK.overall,
      sampleSize: 0,
      source: "estimate",
    });
  }
}
