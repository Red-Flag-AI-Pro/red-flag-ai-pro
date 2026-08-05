import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sealReconciliationSample } from "@/lib/audit-proofs";

// Sentinel-gated, not public — reconciliation needs a real sample of a real
// customer's own data, so unlike completeness/absence there's no honest way
// to demonstrate it without an account. Seals a fresh sample of the
// caller's own audit log before returning it, so the selection itself is
// provably not chosen to look good after the fact.
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  if (profile?.plan !== "sentinel") {
    return NextResponse.json({ error: "Reconciliation sampling requires a Sentinel plan." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const requestedSize = typeof body.sample_size === "number" ? body.sample_size : 25;
  const sampleSize = Math.min(Math.max(Math.round(requestedSize), 1), 100);

  const sample = await sealReconciliationSample(user.id, sampleSize);

  if (!sample) {
    return NextResponse.json({ error: "No audit log entries to sample yet." }, { status: 404 });
  }

  return NextResponse.json(sample);
}
