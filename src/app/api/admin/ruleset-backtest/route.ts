import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { RULESET_VERSION } from "@/lib/analyzer";

const ADMIN_EMAIL = "redflagaipro@gmail.com";

// Admin-only. Records a back-test: real, externally sourced incidents
// (regulator rulings, not our own scan history) checked against the current
// category list, distinct from a ruleset_review — a review is a person
// looking at the rules again, a back-test is evidence the rules actually
// catch what they claim to catch. Always logs against the live
// RULESET_VERSION so a back-test can't be misattributed to a version it
// wasn't actually run against.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const { sampleSource, sampleSize, catches, misses, missExamples, performedBy } = (body ?? {}) as {
    sampleSource?: unknown;
    sampleSize?: unknown;
    catches?: unknown;
    misses?: unknown;
    missExamples?: unknown;
    performedBy?: unknown;
  };

  if (
    typeof sampleSource !== "string" || !sampleSource.trim() ||
    typeof sampleSize !== "number" ||
    typeof catches !== "number" ||
    typeof misses !== "number" ||
    typeof performedBy !== "string" || !performedBy.trim()
  ) {
    return NextResponse.json(
      { error: "Expected sampleSource (string), sampleSize/catches/misses (numbers), performedBy (string). missExamples optional array." },
      { status: 400 }
    );
  }

  const service = await createServiceClient();
  const { data, error } = await service
    .from("ruleset_backtests")
    .insert({
      ruleset_version: RULESET_VERSION,
      sample_source: sampleSource.trim(),
      sample_size: sampleSize,
      catches,
      misses,
      miss_examples: Array.isArray(missExamples) ? missExamples : [],
      performed_by: performedBy.trim(),
    })
    .select("id, ruleset_version, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Could not record the back-test. Try again." }, { status: 502 });
  }

  return NextResponse.json({ recorded: true, ...data });
}

export async function GET() {
  const service = await createServiceClient();
  const { data: latest } = await service
    .from("ruleset_backtests")
    .select("id, ruleset_version, sample_source, sample_size, catches, misses, miss_examples, performed_by, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const missRate = latest && latest.sample_size > 0 ? latest.misses / latest.sample_size : null;

  return NextResponse.json({
    current_ruleset_version: RULESET_VERSION,
    latest_backtest: latest ?? null,
    miss_rate: missRate,
  });
}
