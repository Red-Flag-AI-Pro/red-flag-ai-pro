import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { runProgramGenerationPipeline } from "@/lib/program-generate";

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Runs (or re-runs) the Full Governance Program generation pipeline for an
// existing order id: reads its saved intake, produces all six documents,
// enhances them, computes the financial snapshot, regulatory mapping and
// letter grade, and seals the bundle. The intake submission route
// (src/app/api/program/intake/route.ts) calls the same pipeline directly
// after first saving a new intake — this route is what lets that same
// pipeline be re-triggered afterwards, either by the owning customer (if
// something needs regenerating) or by an internal caller authenticated with
// CRON_SECRET, the same header pattern used by every other internal route.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const { orderId } = (body ?? {}) as { orderId?: unknown };
  if (typeof orderId !== "string" || !orderId) {
    return NextResponse.json({ error: "Expected orderId (string)." }, { status: 400 });
  }

  const cronSecret = process.env.CRON_SECRET;
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  const isInternalCaller = Boolean(cronSecret && bearer && bearer === cronSecret);

  const admin = getAdminClient();

  if (!isInternalCaller) {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: owned } = await supabase
      .from("program_orders")
      .select("id")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!owned) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
  }

  const result = await runProgramGenerationPipeline(admin, orderId);

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Generation failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orderId });
}
