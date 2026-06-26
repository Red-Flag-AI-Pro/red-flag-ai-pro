import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { RoadmapStatus, TrackedRoadmapAction } from "@/lib/governance-audit";

const VALID_STATUSES: RoadmapStatus[] = ["not_started", "in_progress", "done"];

export async function PATCH(
  request: Request,
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

  const body = await request.json();
  const actionId: string = body.actionId ?? "";
  const status: RoadmapStatus = body.status;

  if (!actionId || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid actionId or status" }, { status: 400 });
  }

  const { data: assessment } = await supabase
    .from("governance_assessments")
    .select("id, roadmap")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  const roadmap = (assessment.roadmap as TrackedRoadmapAction[]).map((action) =>
    action.id === actionId ? { ...action, status } : action
  );

  const { error: updateError } = await supabase
    .from("governance_assessments")
    .update({ roadmap })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: "Failed to update roadmap" }, { status: 500 });
  }

  return NextResponse.json({ roadmap });
}
