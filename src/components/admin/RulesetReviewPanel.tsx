"use client";

import { useEffect, useState } from "react";

interface ReviewRecord {
  id: string;
  ruleset_version: string;
  reviewed_by: string;
  reviewer_role: string;
  context_note: string | null;
  next_review_due: string | null;
  created_at: string;
}

interface StatusResponse {
  current_ruleset_version: string;
  latest_review: ReviewRecord | null;
  stale: boolean;
  stale_reason: "never_reviewed" | "ruleset_changed_since_review" | "review_overdue" | null;
}

const STALE_LABEL: Record<string, string> = {
  never_reviewed: "Never reviewed",
  ruleset_changed_since_review: "Rules changed since last review",
  review_overdue: "Review is overdue",
};

export function RulesetReviewPanel() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewedBy, setReviewedBy] = useState("James Stokes");
  const [reviewerRole, setReviewerRole] = useState("Founder");
  const [contextNote, setContextNote] = useState("");
  const [nextReviewDue, setNextReviewDue] = useState("");

  async function loadStatus() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ruleset-review");
      const data = await res.json();
      setStatus(data);
    } catch {
      setError("Could not load ruleset review status.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ruleset-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewedBy,
          reviewerRole,
          contextNote: contextNote.trim() || undefined,
          nextReviewDue: nextReviewDue || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not record the review.");
        return;
      }
      setContextNote("");
      setNextReviewDue("");
      await loadStatus();
    } catch {
      setError("Could not record the review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Ruleset review</h2>
        {!loading && status && (
          <span
            className={[
              "inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
              status.stale ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300",
            ].join(" ")}
          >
            {status.stale ? (STALE_LABEL[status.stale_reason ?? ""] ?? "Stale") : "Current"}
          </span>
        )}
      </div>

      <div className="px-6 py-4 space-y-4">
        {loading ? (
          <p className="text-sm text-[rgba(244,241,234,0.4)]">Loading…</p>
        ) : status ? (
          <div className="text-xs text-[rgba(244,241,234,0.5)] space-y-1">
            <p>
              Current ruleset version:{" "}
              <span className="font-mono text-[rgba(244,241,234,0.8)]">{status.current_ruleset_version}</span>
            </p>
            {status.latest_review ? (
              <>
                <p>
                  Last reviewed by <span className="text-white">{status.latest_review.reviewed_by}</span> (
                  {status.latest_review.reviewer_role}) on{" "}
                  {new Date(status.latest_review.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                {status.latest_review.next_review_due && (
                  <p>Next review due: {status.latest_review.next_review_due}</p>
                )}
                {status.latest_review.context_note && (
                  <p className="italic">"{status.latest_review.context_note}"</p>
                )}
              </>
            ) : (
              <p>No review has ever been logged for this ruleset.</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[rgba(244,241,234,0.5)] mb-1">Reviewed by</label>
              <input
                type="text"
                value={reviewedBy}
                onChange={(e) => setReviewedBy(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-[rgba(244,241,234,0.5)] mb-1">Role</label>
              <input
                type="text"
                value={reviewerRole}
                onChange={(e) => setReviewerRole(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[rgba(244,241,234,0.5)] mb-1">
              What changed or was checked (optional)
            </label>
            <input
              type="text"
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder="e.g. checked against the latest ASA CAP Code update, no changes needed"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-[rgba(244,241,234,0.5)] mb-1">Next review due (optional)</label>
            <input
              type="date"
              value={nextReviewDue}
              onChange={(e) => setNextReviewDue(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {submitting ? "Recording…" : "Log this review"}
          </button>
        </form>
      </div>
    </div>
  );
}
