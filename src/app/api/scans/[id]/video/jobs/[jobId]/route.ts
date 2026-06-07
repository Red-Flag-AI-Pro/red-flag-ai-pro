import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { checkScanVideoRender } from "@/lib/video/render-scan-video";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; jobId: string }> }
) {
  const { id, jobId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: job } = await supabase
    .from("video_jobs")
    .select("id, status, video_url, error, sandbox_id, cmd_id")
    .eq("id", jobId)
    .eq("scan_id", id)
    .eq("user_id", user.id)
    .single();

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // If we're mid-render, check the sandbox for fresh progress
  if (job.status === "processing" && job.sandbox_id && job.cmd_id) {
    try {
      const progress = await checkScanVideoRender(job.sandbox_id, job.cmd_id);

      if (progress.stage === "done" && progress.url) {
        const service = await createServiceClient();
        await service
          .from("video_jobs")
          .update({
            status: "complete",
            video_url: progress.url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", jobId);

        return NextResponse.json({ ...job, status: "complete", video_url: progress.url });
      }

      if (progress.stage === "error" || progress.stage === "expired") {
        const service = await createServiceClient();
        const errorMessage =
          progress.stage === "error" ? progress.message : "Render session expired";
        await service
          .from("video_jobs")
          .update({
            status: "error",
            error: errorMessage,
            updated_at: new Date().toISOString(),
          })
          .eq("id", jobId);

        return NextResponse.json({ ...job, status: "error", error: errorMessage });
      }
    } catch {
      // Transient errors checking progress shouldn't fail the poll —
      // the client will just try again on the next interval.
    }
  }

  return NextResponse.json(job);
}
