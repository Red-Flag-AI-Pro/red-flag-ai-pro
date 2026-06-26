import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GOVERNANCE_DIMENSIONS, type Dimension, type TrackedRoadmapAction } from "@/lib/governance-audit";
import { RoadmapChecklist } from "@/components/governance/RoadmapChecklist";
import type { Plan } from "@/types";

const RISK_COLORS: Record<string, string> = {
  critical: "text-red-400",
  moderate: "text-amber-300",
  managed: "text-blue-300",
  mature: "text-green-300",
};

export default async function GovernancePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";

  if (plan !== "sentinel") {
    return (
      <div className="rounded-xl border border-white/10 bg-[#102943] p-8 text-center">
        <h1 className="text-xl font-bold text-[#F4F1EA]">Managed governance is a Sentinel feature</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[rgba(244,241,234,0.5)]">
          The free assessment scores your AI governance and hands you a roadmap. Sentinel turns that
          roadmap into a tracked checklist here in your dashboard, so it actually gets managed instead
          of sitting in a PDF.
        </p>
        <Link
          href="/sentinel"
          className="mt-5 inline-block rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          See Sentinel →
        </Link>
      </div>
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
    const email = user.email ?? "";
    return (
      <div className="rounded-xl border border-white/10 bg-[#102943] p-8 text-center">
        <h1 className="text-xl font-bold text-[#F4F1EA]">No governance assessment yet</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[rgba(244,241,234,0.5)]">
          Take the assessment while signed in and it will save here automatically with a tracked
          remediation roadmap you can manage over time.
        </p>
        <Link
          href={`/governance-audit${email ? `?email=${encodeURIComponent(email)}` : ""}`}
          className="mt-5 inline-block rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Take the assessment →
        </Link>
      </div>
    );
  }

  const dimensionScores = assessment.dimension_scores as Record<Dimension, number>;
  const roadmap = assessment.roadmap as TrackedRoadmapAction[];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-[#102943] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#F4F1EA]">AI Governance Maturity</h1>
            <p className="text-sm text-[rgba(244,241,234,0.5)]">
              Assessed {new Date(assessment.created_at).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#F4F1EA]">{assessment.score}<span className="text-base text-[rgba(244,241,234,0.4)]">/100</span></p>
            <p className={`text-sm font-semibold uppercase tracking-wide ${RISK_COLORS[assessment.risk_level] ?? ""}`}>
              {assessment.risk_level}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(Object.keys(GOVERNANCE_DIMENSIONS) as Dimension[]).map((dim) => {
            const score = dimensionScores[dim] ?? 0;
            const max = GOVERNANCE_DIMENSIONS[dim].maxScore;
            return (
              <div key={dim} className="rounded-lg border border-white/10 bg-[#0A1628] p-3">
                <p className="text-xs text-[rgba(244,241,234,0.5)]">{GOVERNANCE_DIMENSIONS[dim].title}</p>
                <p className="mt-1 text-lg font-bold text-[#F4F1EA]">{score}/{max}</p>
              </div>
            );
          })}
        </div>

        <Link
          href="/governance-audit"
          className="mt-5 inline-block text-sm font-medium text-[#E5484D] hover:underline"
        >
          Retake the assessment →
        </Link>
      </div>

      <RoadmapChecklist assessmentId={assessment.id} roadmap={roadmap} />
    </div>
  );
}
