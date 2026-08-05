import { NextResponse } from "next/server";
import { sealCompletenessCheckpoint } from "@/lib/audit-proofs";

export const maxDuration = 30;

// Called by Vercel Cron once a day — secured with CRON_SECRET header, same
// pattern as the other cron routes. Seals the day's first record-count
// checkpoint for Red Flag's own public chain; a second call the same UTC
// day is a no-op (sealCompletenessCheckpoint is idempotent per period).
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checkpoint = await sealCompletenessCheckpoint();
  return NextResponse.json({ ok: !!checkpoint, checkpoint });
}
