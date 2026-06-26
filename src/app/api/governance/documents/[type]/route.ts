import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateGovernanceDocument, GOVERNANCE_DOCUMENTS, SENTINEL_REPORTING_DOCUMENTS, type DocumentType } from "@/lib/governance-documents";
import { GOVERNANCE_DIMENSIONS, type Dimension, type RedFlag, type RoadmapAction } from "@/lib/governance-audit";
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
  if (plan !== "enterprise" && plan !== "sentinel") {
    return NextResponse.json(
      { error: "Governance documents are a Growth feature." },
      { status: 403 }
    );
  }

  const isDimensionDoc = GOVERNANCE_DOCUMENTS.some((d) => d.type === type);
  const isReportingDoc = SENTINEL_REPORTING_DOCUMENTS.some((d) => d.type === type);
  if (!isDimensionDoc && !isReportingDoc) {
    return NextResponse.json({ error: "Unknown document type" }, { status: 400 });
  }

  // Financial Exposure Summary and Board Memo are cross-dimension and feed
  // the human Sentinel deliverables (financial modeling, board reporting) —
  // not eligible for Growth's one-free-document allowance.
  if (isReportingDoc && plan !== "sentinel") {
    return NextResponse.json(
      { error: "This document is a Sentinel feature." },
      { status: 403 }
    );
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

  // Growth only gets one document — whichever dimension scored worst. The
  // other 5 require Sentinel. Enforced here, not just hidden in the UI.
  if (plan === "enterprise") {
    const dimensionScores = assessment.dimension_scores as Record<Dimension, number>;
    const worstDimension = (Object.keys(GOVERNANCE_DIMENSIONS) as Dimension[]).reduce((worst, dim) =>
      (dimensionScores[dim] ?? 0) < (dimensionScores[worst] ?? 0) ? dim : worst
    );
    const requestedDoc = GOVERNANCE_DOCUMENTS.find((d) => d.type === type);

    if (requestedDoc?.dimension !== worstDimension) {
      return NextResponse.json(
        { error: "This document is a Sentinel feature. Growth includes one free document for your worst-scoring dimension." },
        { status: 403 }
      );
    }
  }

  const companyName = (profile as { agency_name?: string | null })?.agency_name ?? "[Your Organisation]";

  const { title, content } = generateGovernanceDocument(type as DocumentType, {
    companyName,
    dimensionScores: assessment.dimension_scores as Record<Dimension, number>,
    redFlags: assessment.red_flags as RedFlag[],
    roadmap: assessment.roadmap as RoadmapAction[],
    generatedAt: new Date(),
    overallScore: assessment.score as number,
    riskLevel: assessment.risk_level as string,
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
