import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GOVERNANCE_DIMENSIONS, type Dimension, type TrackedRoadmapAction } from "@/lib/governance-audit";
import { GOVERNANCE_DOCUMENTS, SENTINEL_REPORTING_DOCUMENTS } from "@/lib/governance-documents";
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
  const isGrowth = plan === "enterprise";
  const isSentinel = plan === "sentinel";

  if (!isGrowth && !isSentinel) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#102943] p-8 text-center">
        <h1 className="text-xl font-bold text-[#F4F1EA]">Governance tracking is a Growth+ feature</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[rgba(244,241,234,0.5)]">
          The free assessment scores your AI governance. Growth shows you every gap in full, plus one
          free fix-it document. Sentinel manages the whole roadmap for you as a tracked checklist.
        </p>
        <Link
          href="/pricing"
          className="mt-5 inline-block rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          See plans →
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
          Take the assessment while signed in and it will save here automatically
          {isSentinel ? " with a tracked remediation roadmap you can manage over time." : "."}
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

  // Growth's one free document: whichever dimension scored worst (most urgent gap).
  const worstDimension = (Object.keys(GOVERNANCE_DIMENSIONS) as Dimension[]).reduce((worst, dim) =>
    (dimensionScores[dim] ?? 0) < (dimensionScores[worst] ?? 0) ? dim : worst
  );

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

      {isSentinel ? (
        <RoadmapChecklist assessmentId={assessment.id} roadmap={roadmap} />
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#102943] p-6">
          <h2 className="text-lg font-bold text-[#F4F1EA]">Remediation roadmap</h2>
          <p className="mt-1 text-sm text-[rgba(244,241,234,0.5)]">
            {roadmap.length} action{roadmap.length === 1 ? "" : "s"} identified across 90 days, 6 months and 12
            months. Sentinel turns this into a tracked checklist — assign owners, mark progress, prove it's
            actually happening.
          </p>
          <Link
            href="/pricing"
            className="mt-3 inline-block text-sm font-semibold text-[#E5484D] hover:underline"
          >
            Upgrade to Sentinel to track it →
          </Link>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-[#102943] p-6">
        <h2 className="text-lg font-bold text-[#F4F1EA]">Fix it: Governance Documents</h2>
        <p className="mt-1 text-sm text-[rgba(244,241,234,0.5)]">
          {isSentinel
            ? "The roadmap tells you what to do. These are the actual documents — drafted from your assessment, ready to review and adopt, not just a reminder to go write one yourself."
            : "One free document, drafted from your worst-scoring dimension. Sentinel unlocks all 6."}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GOVERNANCE_DOCUMENTS.map((doc) => {
            const score = dimensionScores[doc.dimension] ?? 0;
            const max = GOVERNANCE_DIMENSIONS[doc.dimension].maxScore;
            const unlocked = isSentinel || doc.dimension === worstDimension;
            return unlocked ? (
              <a
                key={doc.type}
                href={`/api/governance/documents/${doc.type}`}
                className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-[#0A1628] p-4 hover:border-white/20 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-[#F4F1EA]">{doc.title}</p>
                  <p className="mt-1 text-xs text-[rgba(244,241,234,0.5)]">{doc.description}</p>
                  <p className="mt-2 text-xs text-[rgba(244,241,234,0.35)]">
                    Your score in this dimension: {score}/{max}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[#E5484D]">Download →</span>
              </a>
            ) : (
              <Link
                key={doc.type}
                href="/pricing"
                className="flex items-start justify-between gap-3 rounded-lg border border-dashed border-white/15 bg-[#0A1628] p-4 opacity-60 hover:opacity-90 transition-opacity"
              >
                <div>
                  <p className="text-sm font-semibold text-[#F4F1EA]">{doc.title}</p>
                  <p className="mt-1 text-xs text-[rgba(244,241,234,0.5)]">{doc.description}</p>
                  <p className="mt-2 text-xs text-[rgba(244,241,234,0.35)]">
                    Your score in this dimension: {score}/{max}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[rgba(244,241,234,0.5)]">Sentinel →</span>
              </Link>
            );
          })}
        </div>
      </div>

      {isSentinel && (
        <div className="rounded-xl border border-white/10 bg-[#102943] p-6">
          <h2 className="text-lg font-bold text-[#F4F1EA]">Reporting</h2>
          <p className="mt-1 text-sm text-[rgba(244,241,234,0.5)]">
            Drafts for your quarterly advisor call — financial exposure for budget conversations,
            a board-ready memo. Review and customise with your advisor before sending either on.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SENTINEL_REPORTING_DOCUMENTS.map((doc) => (
              <a
                key={doc.type}
                href={`/api/governance/documents/${doc.type}`}
                className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-[#0A1628] p-4 hover:border-white/20 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-[#F4F1EA]">{doc.title}</p>
                  <p className="mt-1 text-xs text-[rgba(244,241,234,0.5)]">{doc.description}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[#E5484D]">Download →</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
