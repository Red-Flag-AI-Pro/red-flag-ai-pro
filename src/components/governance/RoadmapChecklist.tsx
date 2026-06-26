"use client";

import { useState } from "react";
import type { RoadmapStatus, TrackedRoadmapAction } from "@/lib/governance-audit";

const PHASE_LABELS: Record<TrackedRoadmapAction["phase"], string> = {
  quick_wins: "90-day quick wins",
  medium_term: "6-month medium term",
  strategic: "12-month strategic",
};

const STATUS_LABELS: Record<RoadmapStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
};

const STATUS_STYLES: Record<RoadmapStatus, string> = {
  not_started: "border-white/15 bg-[#0A1628] text-[rgba(244,241,234,0.5)]",
  in_progress: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  done: "border-green-400/40 bg-green-400/10 text-green-300",
};

const NEXT_STATUS: Record<RoadmapStatus, RoadmapStatus> = {
  not_started: "in_progress",
  in_progress: "done",
  done: "not_started",
};

interface Props {
  assessmentId: string;
  roadmap: TrackedRoadmapAction[];
}

export function RoadmapChecklist({ assessmentId, roadmap: initial }: Props) {
  const [roadmap, setRoadmap] = useState(initial);
  const [savingId, setSavingId] = useState<string | null>(null);

  const doneCount = roadmap.filter((a) => a.status === "done").length;

  async function cycleStatus(action: TrackedRoadmapAction) {
    const nextStatus = NEXT_STATUS[action.status];
    setSavingId(action.id);
    setRoadmap((prev) => prev.map((a) => (a.id === action.id ? { ...a, status: nextStatus } : a)));

    try {
      const res = await fetch(`/api/governance/assessments/${assessmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId: action.id, status: nextStatus }),
      });
      if (!res.ok) {
        // Revert on failure
        setRoadmap((prev) => prev.map((a) => (a.id === action.id ? { ...a, status: action.status } : a)));
      }
    } catch {
      setRoadmap((prev) => prev.map((a) => (a.id === action.id ? { ...a, status: action.status } : a)));
    } finally {
      setSavingId(null);
    }
  }

  const phases: TrackedRoadmapAction["phase"][] = ["quick_wins", "medium_term", "strategic"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#102943] px-5 py-3">
        <p className="text-sm font-semibold text-[#F4F1EA]">Remediation roadmap</p>
        <p className="text-sm text-[rgba(244,241,234,0.5)]">
          {doneCount} / {roadmap.length} actions done
        </p>
      </div>

      {phases.map((phase) => {
        const actions = roadmap.filter((a) => a.phase === phase);
        if (actions.length === 0) return null;

        return (
          <div key={phase}>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[rgba(244,241,234,0.4)]">
              {PHASE_LABELS[phase]}
            </p>
            <div className="space-y-2">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-[#102943] px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#F4F1EA]">{action.title}</p>
                    <p className="mt-1 text-sm text-[rgba(244,241,234,0.5)]">{action.description}</p>
                    <p className="mt-2 text-xs text-[rgba(244,241,234,0.35)]">
                      Owner: {action.owner} · Timeline: {action.timeline}
                    </p>
                  </div>
                  <button
                    onClick={() => cycleStatus(action)}
                    disabled={savingId === action.id}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${STATUS_STYLES[action.status]}`}
                  >
                    {STATUS_LABELS[action.status]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
