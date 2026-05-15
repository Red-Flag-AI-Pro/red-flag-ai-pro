import type { ScanFlag } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { FLAG_CATEGORY_LABELS } from "@/lib/constants";

interface FlagListProps {
  flags: ScanFlag[];
}

export function FlagList({ flags }: FlagListProps) {
  if (flags.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-2xl">✅</p>
        <p className="mt-2 font-semibold text-green-800">No flags detected</p>
        <p className="text-sm text-green-600">
          This content passed all compliance checks.
        </p>
      </div>
    );
  }

  const sorted = [...flags].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="space-y-3">
      {sorted.map((flag) => (
        <div
          key={flag.id}
          className="rounded-xl border border-gray-200 bg-white overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <span className="text-sm font-semibold text-gray-900">
              {FLAG_CATEGORY_LABELS[flag.category] ?? flag.category}
            </span>
            <Badge variant={flag.severity}>
              {flag.severity.toUpperCase()}
            </Badge>
          </div>

          <div className="px-5 py-4 space-y-3">
            <p className="text-sm text-gray-700">{flag.flag_description}</p>

            {flag.text_excerpt && (
              <blockquote className="rounded-md border-l-4 border-amber-400 bg-amber-50 px-4 py-2 text-sm italic text-amber-800">
                {flag.text_excerpt}
              </blockquote>
            )}

            {flag.suggestion && (
              <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2">
                <p className="text-xs font-semibold text-green-700 mb-1">
                  Suggested fix
                </p>
                <p className="text-sm text-green-800">{flag.suggestion}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
