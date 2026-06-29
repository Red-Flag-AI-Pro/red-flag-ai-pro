"use client";

import { useState } from "react";
import type { ScanFlag, Disposition, Plan } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { FLAG_CATEGORY_LABELS } from "@/lib/constants";

interface FlagListProps {
  flags: ScanFlag[];
  score?: number;
  plan?: Plan;
  scanId?: string;
}

const DISPOSITION_LABELS: Record<Disposition, string> = {
  resolved: "Resolved",
  accepted_risk: "Risk accepted",
  not_applicable: "Not applicable",
};

const DISPOSITION_COLORS: Record<Disposition, string> = {
  resolved: "bg-green-900/40 border-green-500/40 text-green-300",
  accepted_risk: "bg-amber-900/40 border-amber-500/40 text-amber-300",
  not_applicable: "bg-white/5 border-white/20 text-white/50",
};

function DispositionPanel({
  flag,
  scanId,
  onUpdate,
}: {
  flag: ScanFlag;
  scanId: string;
  onUpdate: (updated: ScanFlag) => void;
}) {
  const [open, setOpen] = useState(false);
  const [disposition, setDisposition] = useState<Disposition>("resolved");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/scans/${scanId}/flags/${flag.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disposition, reviewer_note: note || undefined }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to save");
      }
      const { flag: updated } = await res.json();
      onUpdate(updated);
      setOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (flag.disposition) {
    return (
      <div className={`mt-3 rounded-lg border px-4 py-2.5 flex items-center justify-between gap-3 ${DISPOSITION_COLORS[flag.disposition]}`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">Signed off</span>
          <span className="text-xs font-semibold">{DISPOSITION_LABELS[flag.disposition]}</span>
          {flag.reviewer_note && (
            <span className="text-xs opacity-70 truncate">&ldquo;{flag.reviewer_note}&rdquo;</span>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs opacity-60">{flag.reviewed_by}</p>
          {flag.reviewed_at && (
            <p className="text-xs opacity-40">{new Date(flag.reviewed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-xs font-semibold text-[rgba(244,241,234,0.5)] hover:text-[#F4F1EA] border border-white/10 hover:border-white/25 rounded-lg px-3 py-1.5 transition-colors"
        >
          Sign off this flag
        </button>
      ) : (
        <div className="rounded-xl border border-white/15 bg-[rgba(16,41,67,0.7)] p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.5)]">Disposition sign-off</p>

          <div className="flex gap-2 flex-wrap">
            {(["resolved", "accepted_risk", "not_applicable"] as Disposition[]).map((d) => (
              <button
                key={d}
                onClick={() => setDisposition(d)}
                className={`text-xs font-semibold rounded-lg px-3 py-1.5 border transition-colors ${
                  disposition === d
                    ? "bg-[#E5484D]/20 border-[#E5484D]/50 text-[#E5484D]"
                    : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
                }`}
              >
                {DISPOSITION_LABELS[d]}
              </button>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            rows={2}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 resize-none focus:outline-none focus:border-white/25"
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={saving}
              className="text-sm font-semibold rounded-lg px-4 py-1.5 bg-[#E5484D] text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Confirm sign-off"}
            </button>
            <button
              onClick={() => { setOpen(false); setError(null); }}
              className="text-sm font-semibold rounded-lg px-4 py-1.5 border border-white/10 text-white/50 hover:border-white/25 hover:text-white/70 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FlagList({ flags, score, plan, scanId }: FlagListProps) {
  const [localFlags, setLocalFlags] = useState<ScanFlag[]>(flags);

  function handleUpdate(updated: ScanFlag) {
    setLocalFlags((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  }

  if (localFlags.length === 0) {
    return (
      <div className="rounded-xl border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] p-6 text-center">
        <p className="text-2xl"></p>
        <p className="mt-2 font-semibold text-green-300">No flags detected</p>
        <p className="text-sm text-green-400">
          This content passed all compliance checks.
        </p>
      </div>
    );
  }

  const sorted = [...localFlags].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  const highFlags = sorted.filter((f) => f.severity === "high");
  const showActionPlan = score !== undefined && score < 70 && highFlags.length > 0;

  const reviewedCount = sorted.filter((f) => f.disposition).length;
  const isSentinel = plan === "sentinel";
  const isGrowth = plan === "enterprise";

  return (
    <div className="space-y-3">
      {showActionPlan && (
        <div className="rounded-xl border border-[rgba(229,72,77,0.3)] bg-[rgba(229,72,77,0.1)] p-5 mb-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg"></span>
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
               Score below 40 — do not publish or spend on ads until high severity flags are resolved.
            </p>
          )}
        </div>
      )}

      {(isSentinel || isGrowth) && sorted.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-2.5">
          <span className="text-xs text-[rgba(244,241,234,0.5)]">
            {reviewedCount} of {sorted.length} flags signed off
          </span>
          {!isSentinel && (
            <span className="text-xs text-[rgba(244,241,234,0.35)]">Sign-off requires Sentinel</span>
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
            <div className="flex items-center gap-2">
              {flag.disposition && (
                <span className={`text-xs font-semibold rounded-full px-2 py-0.5 border ${DISPOSITION_COLORS[flag.disposition]}`}>
                  {DISPOSITION_LABELS[flag.disposition]}
                </span>
              )}
              <Badge variant={flag.severity}>
                {flag.severity.toUpperCase()}
              </Badge>
            </div>
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

            {isSentinel && scanId && (
              <DispositionPanel flag={flag} scanId={scanId} onUpdate={handleUpdate} />
            )}

            {isGrowth && !flag.disposition && (
              <div className="mt-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-[rgba(244,241,234,0.4)]">Disposition sign-off available on Sentinel</span>
                <a href="/pricing" className="text-xs font-semibold text-[#E5484D] hover:underline">Upgrade</a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
