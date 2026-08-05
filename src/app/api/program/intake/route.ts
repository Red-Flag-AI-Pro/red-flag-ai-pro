import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { runProgramGenerationPipeline } from "@/lib/program-generate";
import { PROGRAM_INTAKE_DEFAULTS, type ProgramIntake } from "@/lib/program-intake";

// Without this, the route falls back to Vercel's short default duration.
// Six documents plus an AI enhancement pass plus the seal call's own
// external RFC 3161 timestamp round-trip routinely runs past that —
// sealing was silently losing the race and failing on every real order.
export const maxDuration = 60;

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Saves the shared intake for a Full Governance Program order, then runs the
// full generation pipeline (documents, enhancement, financial snapshot,
// regulatory mapping, letter grade, sealing) before responding — the intake
// form waits on this call and redirects to the delivery page once it
// completes. Writes go through the service role client: program_orders has
// no client-writable RLS policy by design (see the migration), so ownership
// is checked first with the session-bound client, then the actual update
// happens with the service client.
export async function POST(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const { orderId, intake } = (body ?? {}) as { orderId?: unknown; intake?: unknown };
  if (typeof orderId !== "string" || !orderId || !intake || typeof intake !== "object") {
    return NextResponse.json({ error: "Expected orderId (string) and intake (object)." }, { status: 400 });
  }

  // Confirm this order belongs to the caller before touching it. The RLS
  // select policy already restricts this to the owner, so a non-owner id
  // simply comes back empty rather than needing a separate check.
  const { data: existing } = await supabase
    .from("program_orders")
    .select("id, status")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // Merge onto the defaults so a partial or stale payload can never save a
  // half formed intake shape, and so new fields (like annualTurnoverGBP)
  // always have a safe value even if the client hasn't updated yet.
  const merged: ProgramIntake = { ...PROGRAM_INTAKE_DEFAULTS, ...(intake as Partial<ProgramIntake>) };

  const admin = getAdminClient();
  const { error: updateError } = await admin
    .from("program_orders")
    .update({ intake: merged, status: "generating" })
    .eq("id", orderId);

  if (updateError) {
    return NextResponse.json({ error: "Could not save intake." }, { status: 500 });
  }

  const result = await runProgramGenerationPipeline(admin, orderId);

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Generation failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orderId });
}
