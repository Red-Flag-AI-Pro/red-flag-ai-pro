import type { ScanFlag } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { FLAG_CATEGORY_LABELS } from "@/lib/constants";

interface FlagListProps {
  flags: ScanFlag[];
  score?: number;
}

export function FlagList({ flags, score }: FlagListProps) {
  if (flags.length === 0) {
    return (
      <div className="rounded-xl border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] p-6 text-center">
        <p className="text-2xl">✅</p>
        <p className="mt-2 font-semibold text-green-300">No flags detected</p>
        <p className="text-sm text-green-400">
          This content passed all compliance checks.
        </p>
      </div>
    );
  }

  const sorted = [...flags].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  const highFlags = sorted.filter((f) => f.severity === "high");
  const showActionPlan = score !== undefined && score < 70 && highFlags.length > 0;

  return (
    <div className="space-y-3">
      {showActionPlan && (
        <div className="rounded-xl border border-[rgba(229,72,77,0.3)] bg-[rgba(229,72,77,0.1)] p-5 mb-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎯</span>
            <p className="text-sm font-bold text-red-800">Priority action plan — fix these first</p>
          </div>
          <div className="space-y-3">
            {highFlags.slice(0, 3).map((f, i) => (
              <div key={f.id} className="flex items-start gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-red-900">{FLAG_CATEGORY_LABELS[f.category] ?? f.category}</p>
                  {f.suggestion && <p className="text-xs text-[#ff9b9e] mt-0.5">{f.suggestion.slice(0, 120)}…</p>}
                </div>
              </div>
            ))}
          </div>
          {score < 40 && (
            <p className="mt-3 text-xs font-semibold text-[#ff9b9e] border-t border-[rgba(229,72,77,0.3)] pt-3">
              ⚠️ Score below 40 — do not publish or spend on ads until high severity flags are resolved.
            </p>
          )}
        </div>
      )}
      {sorted.map((flag) => (
        <div
          key={flag.id}
          className="rounded-xl border border-white/10 bg-[#102943] overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <span className="text-sm font-semibold text-[#F4F1EA]">
              {FLAG_CATEGORY_LABELS[flag.category] ?? flag.category}
            </span>
            <Badge variant={flag.severity}>
              {flag.severity.toUpperCase()}
            </Badge>
          </div>

          <div className="px-5 py-4 space-y-3">
            <p className="text-sm text-[rgba(244,241,234,0.8)]">{flag.flag_description}</p>

            {flag.text_excerpt && (
              <blockquote className="rounded-md border-l-4 border-amber-400 bg-[rgba(245,158,11,0.1)] px-4 py-2 text-sm italic text-amber-300">
                {flag.text_excerpt}
              </blockquote>
            )}

            {flag.suggestion && (
              <div className="rounded-md bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] px-4 py-2">
                <p className="text-xs font-semibold text-green-300 mb-1">
                  Suggested fix
                </p>
                <p className="text-sm text-green-300">{flag.suggestion}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
