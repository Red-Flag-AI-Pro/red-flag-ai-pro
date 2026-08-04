import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScanResultCard } from "@/components/scans/ScanResultCard";
import { FlagList } from "@/components/scans/FlagList";
import { RegulatoryExposure } from "@/components/scans/RegulatoryExposure";
import { analyzeContent } from "@/lib/analyzer";
import { FREE_ONLY_EXCLUDED_CATEGORIES } from "@/lib/constants";
import type { Plan, Scan, ScanFlag } from "@/types";

export default async function ScanResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: scan }, { data: flags }, { data: profile }] =
    await Promise.all([
      supabase
        .from("scans")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single(),
      supabase.from("scan_flags").select("*").eq("scan_id", id),
      supabase
        .from("profiles")
        .select("plan")
        .eq("user_id", user.id)
        .single(),
    ]);

  if (!scan) notFound();

  const plan: Plan = (profile?.plan as Plan) ?? "free";

  // Free users see that a fix exists (blurred, teased in the UI) but the
  // actual fix text must never reach the client, or it's readable from the
  // page payload regardless of the blur. Swap in a placeholder so the tease
  // still renders without leaking the real suggestion.
  const visibleFlags = (flags ?? []).map((f) =>
    plan === "free" && f.suggestion
      ? { ...f, suggestion: "Unlock Pro to see the exact fix for this flag, rewritten and ready to use." }
      : f
  ) as ScanFlag[];

  // Free plans have flags in some categories withheld at creation time, and
  // the withheld flags are never stored. Run the pure keyword analyzer again
  // here on the server to count how many withheld categories this content
  // triggers. Only this integer may reach the browser. The recomputed flag
  // objects (categories, excerpts, suggestions) must never be passed to any
  // client component or they would be readable in the page payload. Bulk and
  // URL records lack the original source content, so skip those.
  // Categories already present in the stored flags are subtracted first:
  // records created while the account was on a paid plan store those flags
  // in full, and the band must never claim a category is hidden while its
  // flag sits visible in the list below. Distinct categories are counted,
  // not flags, so the number matches the wording of the claim.
  let hiddenCategoryCount = 0;
  if (
    plan === "free" &&
    typeof scan.content === "string" &&
    !scan.content.startsWith("[URL Scan]") &&
    !String(scan.title ?? "").startsWith("[Bulk]")
  ) {
    const excluded = new Set<string>(FREE_ONLY_EXCLUDED_CATEGORIES);
    const storedCategories = new Set((flags ?? []).map((f) => f.category as string));
    const { flags: allFlags } = analyzeContent(scan.title ?? "", scan.content);
    hiddenCategoryCount = new Set(
      allFlags
        .map((f) => f.category)
        .filter((c) => excluded.has(c) && !storedCategories.has(c))
    ).size;
  }

  return (
    <div className="space-y-6">
      <ScanResultCard
        scan={scan as Scan}
        flags={visibleFlags}
        plan={plan}
      />

      <RegulatoryExposure flags={visibleFlags} />

      {hiddenCategoryCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#102943] px-5 py-4">
          <p className="text-sm text-[rgba(244,241,234,0.8)]">
            {hiddenCategoryCount === 1
              ? "This content also triggered 1 risk category that is hidden on the free plan."
              : `This content also triggered ${hiddenCategoryCount} risk categories that are hidden on the free plan.`}
          </p>
          <a
            href="/billing?plan=scanner"
            className="shrink-0 text-sm font-semibold text-[#E5484D] hover:underline"
          >
            Unlock the full picture
          </a>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-lg font-bold text-[#F4F1EA]">
          Compliance Flags
        </h2>
        <FlagList flags={visibleFlags} score={scan.score} plan={plan} scanId={id} scanCreatedAt={scan.created_at} />
      </div>
    </div>
  );
}
