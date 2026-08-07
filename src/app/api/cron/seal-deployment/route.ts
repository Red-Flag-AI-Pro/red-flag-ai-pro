import { NextResponse } from "next/server";
import { sealCurrentDeployment } from "@/lib/seal-deployment";

export const maxDuration = 60;

// Runs hourly. Seals whatever commit is currently live in production, once,
// so shipping something is enough to get it on the record — nobody has to
// remember a second step afterwards.
export async function GET(request: Request) {
  // Fail closed, same as every other cron route here: a missing CRON_SECRET
  // would otherwise compare undefined to undefined and let anyone through.
  const expected = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sealCurrentDeployment();

  // Always 200, even when nothing was sealed. "Already sealed" is the normal
  // steady state, not a failure, and a non-2xx would just make Vercel retry a
  // write we deliberately skipped.
  return NextResponse.json(result);
}
