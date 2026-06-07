import { NextResponse, after } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { startScanVideoRender, type ScanVideoFlag } from "@/lib/video/render-scan-video";

export const runtime = "nodejs";
export const maxDuration = 60;

function humanizeCategory(category: string) {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function kickOffRender(jobId: string, scanId: string) {
  const supabase = await createServiceClient();

  try {
    const [{ data: scan }, { data: flags }] = await Promise.all([
      supabase.from("scans").select("*").eq("id", scanId).single(),
      supabase
        .from("scan_flags")
        .select("*")
        .eq("scan_id", scanId)
        .order("severity", { ascending: false })
        .limit(6),
    ]);

    if (!scan) throw new Error("Scan not found");

    const redFlags: ScanVideoFlag[] = (flags ?? []).map((flag) => ({
      title: humanizeCategory(flag.category),
      severity: flag.severity,
    }));

    const { sandboxId, cmdId } = await startScanVideoRender({
      companyName: scan.title,
      documentName: scan.title,
      redFlags:
        redFlags.length > 0
          ? redFlags
          : [{ title: "No red flags detected", severity: "low" }],
    });

    await supabase
      .from("video_jobs")
      .update({
        status: "processing",
        sandbox_id: sandboxId,
        cmd_id: cmdId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);
  } catch (err) {
    await supabase
      .from("video_jobs")
      .update({
        status: "error",
        error: err instanceof Error ? err.message : "Could not start render",
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: scan } = await supabase
    .from("scans")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  const { data: job, error } = await supabase
    .from("video_jobs")
    .insert({ scan_id: id, user_id: user.id, status: "pending" })
    .select()
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "Could not create job" }, { status: 500 });
  }

  after(() => kickOffRender(job.id, id));

  return NextResponse.json({ jobId: job.id, status: job.status });
}
