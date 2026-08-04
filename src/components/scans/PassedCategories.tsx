import type { ScanFlag, Plan } from "@/types";
import { FLAG_CATEGORY_LABELS, getExcludedCategories } from "@/lib/constants";

/**
 * Every report so far only ever showed what was wrong. A clean scan is silent
 * proof, not a stated one — the same "we never publish what passed" gap
 * task #195 was raised to close. Shows the categories that were actually
 * checked and came back clean, scoped to what this plan tier checks at all,
 * so a free account is never shown a category it was never eligible to see.
 */
export function PassedCategories({ flags, plan }: { flags: ScanFlag[]; plan: Plan }) {
  const excluded = new Set(getExcludedCategories(plan));
  const flagged = new Set(flags.map((f) => f.category));

  const checked = Object.keys(FLAG_CATEGORY_LABELS).filter((c) => !excluded.has(c));
  const passed = checked.filter((c) => !flagged.has(c));

  if (passed.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0A1628] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(244,241,234,0.55)]">
        Passed clean
      </p>
      <p className="mt-2 text-2xl font-bold text-[#F4F1EA] leading-tight">
        {passed.length} of {checked.length} categories
      </p>
      <div className="my-3 h-[3px] w-12 bg-[#4ADE80]" />

      <div className="mt-4 flex flex-wrap gap-2">
        {passed.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(74,222,128,0.25)] bg-[rgba(74,222,128,0.08)] px-3 py-1 text-xs font-medium text-[rgba(244,241,234,0.75)]"
          >
            <span className="text-[#4ADE80]">✓</span>
            {FLAG_CATEGORY_LABELS[c]}
          </span>
        ))}
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-[rgba(244,241,234,0.38)]">
        No keyword or pattern match found for these categories in this content. A clean result here means nothing detectable was flagged, not a guarantee nothing exists.
      </p>
    </div>
  );
}
