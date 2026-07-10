import type { ScanFlag } from "@/types";
import { computeScanExposure } from "@/lib/penalty-exposure";

/**
 * Maximum regulatory exposure panel for a compliance report. Turns the findings
 * into the statutory ceiling attached to the regimes they engage — the "what it
 * could cost" the report otherwise never states. Diagnosis, not the fix, so it
 * shows on every tier (the fix stays gated in FlagList). Renders nothing when
 * there are no findings.
 */
export function RegulatoryExposure({ flags }: { flags: ScanFlag[] }) {
  const { regimes, headline } = computeScanExposure(flags.map((f) => f.category));

  if (!headline || regimes.length === 0) return null;

  const shown = regimes.slice(0, 5);
  const more = regimes.length - shown.length;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0A1628] p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(244,241,234,0.55)]">
            Maximum regulatory exposure
          </p>
          <p className="mt-2 text-2xl font-bold text-[#F4F1EA] leading-tight">
            {headline.ceiling}
          </p>
          <div className="my-3 h-[3px] w-12 bg-[#E5484D]" />
          <p className="text-xs text-[#C9A66B]">
            {headline.market} · {headline.law}
            {regimes.length > 1
              ? ` · plus ${regimes.length - 1} other regime${regimes.length - 1 === 1 ? "" : "s"} engaged`
              : ""}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4 space-y-3">
        {shown.map((r) => (
          <div key={r.code} className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-[rgba(244,241,234,0.7)]">
              {r.market}{" "}
              <span className="text-[rgba(244,241,234,0.4)]">· {r.law}</span>
            </span>
            <span className="text-sm text-[#F4F1EA] text-right">{r.ceiling}</span>
          </div>
        ))}
        {more > 0 && (
          <p className="text-xs text-[rgba(244,241,234,0.4)]">
            plus {more} further regime{more === 1 ? "" : "s"} engaged by these findings
          </p>
        )}
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-[rgba(244,241,234,0.38)]">
        Statutory maximum exposure, the legal ceiling attached to the rules these findings engage, not a prediction. Actual penalties are at each regulator&apos;s discretion and depend on your turnover, markets and conduct. Figures verified June 2026.
      </p>
    </div>
  );
}
