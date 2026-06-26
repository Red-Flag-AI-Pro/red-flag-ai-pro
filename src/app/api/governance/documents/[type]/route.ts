import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateGovernanceDocument, GOVERNANCE_DOCUMENTS, type DocumentType } from "@/lib/governance-documents";
import type { Dimension, RedFlag, RoadmapAction } from "@/lib/governance-audit";
import type { Plan } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, agency_name")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  if (plan !== "sentinel") {
    return NextResponse.json(
      { error: "Governance documents are a Sentinel feature." },
      { status: 403 }
    );
  }

  const isValidType = GOVERNANCE_DOCUMENTS.some((d) => d.type === type);
  if (!isValidType) {
    return NextResponse.json({ error: "Unknown document type" }, { status: 400 });
  }

  const { data: assessment } = await supabase
    .from("governance_assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!assessment) {
    return NextResponse.json(
      { error: "No governance assessment found. Take the assessment first." },
      { status: 404 }
    );
  }

  const companyName = (profile as { agency_name?: string | null })?.agency_name ?? "[Your Organisation]";

  const { title, content } = generateGovernanceDocument(type as DocumentType, {
    companyName,
    dimensionScores: assessment.dimension_scores as Record<Dimension, number>,
    redFlags: assessment.red_flags as RedFlag[],
    roadmap: assessment.roadmap as RoadmapAction[],
    generatedAt: new Date(),
  });

  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
