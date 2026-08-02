import { NextResponse } from "next/server";
import { performWitnessPush } from "@/lib/witness-push";

export const maxDuration = 60;

// Called by Vercel Cron every hour — secured with CRON_SECRET header.
// Keeps our side of the witness network on a fixed cadence rather than
// depending on somebody pressing the button, so a gap in the public log
// means something actually went wrong rather than nobody being at a desk.
export async function GET(request: Request) {
  // Fail closed: if CRON_SECRET is missing, an absent header would otherwise
  // compare undefined to undefined and let anyone through.
  const expected = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await performWitnessPush("cron");

  // Always 200 back to the cron runner, even on a failed push. The failure is
  // reported in the body; a non-2xx here would just make Vercel retry a peer
  // that is already known to be down.
  return NextResponse.json(result);
}
