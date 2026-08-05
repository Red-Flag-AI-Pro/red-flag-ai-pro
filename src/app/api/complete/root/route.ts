import { NextResponse } from "next/server";
import { getLatestCompletenessCheckpoint } from "@/lib/audit-proofs";

// Public, unauthenticated by design — same reasoning as the witness
// endpoints. Returns the most recent sealed record-count checkpoint for
// Red Flag's own public chain, committed before any export could reference
// it, so an export claiming a different count is checkably wrong.
export async function GET() {
  const checkpoint = await getLatestCompletenessCheckpoint();

  if (!checkpoint) {
    return NextResponse.json(
      { error: "no_checkpoint_sealed_yet", message: "No completeness checkpoint has been sealed yet." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...checkpoint,
    verify: checkpoint.latest_entry_id
      ? `https://www.redflagaipro.com/verify?id=${checkpoint.latest_entry_id}`
      : null,
    why: "This count was committed before any export was requested. Compare it against an export's actual entry count for the same period.",
  });
}
