import { NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { performWitnessPush } from "@/lib/witness-push";

// Triggered by the button on /witness-network. The actual work lives in
// lib/witness-push so the button and the hourly cron stay identical.
async function handlePush(request: Request) {
  const { allowed } = await checkRateLimit(`witness_push:${clientIp(request)}`, 5, 60);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Wait a minute and try again." }, { status: 429 });
  }

  const result = await performWitnessPush("manual");
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

export async function POST(request: Request) {
  return handlePush(request);
}

// Some free cron schedulers (cron-job.org's default) only send GET, so
// accept both rather than depend on every scheduler exposing a method
// picker.
export async function GET(request: Request) {
  return handlePush(request);
}
