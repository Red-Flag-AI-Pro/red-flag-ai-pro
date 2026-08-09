// Review-due dependency for the £497 program's six documents (task #281).
//
// Brad Wolfe, "every system implementation leaves a folder behind," 9 Aug
// 2026: whether a document is self-correcting or silently stale has
// nothing to do with quality, it's decided by whether anything depends on
// it. The six documents were sealed once at completion and handed over --
// sealing proves nobody edited them, it does not make anything break if
// they go stale. Boundary authorization records already escape this via
// expires_at; this extends the same discipline to the program documents,
// with the AI Governance Data Room export (task #265) as the thing that
// actually gates: a document past its review date is excluded from an
// export bundle unless it's been freshly confirmed, a visible symptom
// instead of a stale document quietly reaching a diligence package.

import type { ProgramDocumentBundle } from "./program-documents";

// Rajashri Pattanaik, LinkedIn 9 Aug 2026, "AI Governance Beyond Approval":
// different governance assumptions decay at different rates -- a document
// tied to the live system's current behavior goes stale faster than one
// tied to organizational or legal context that rarely shifts. A single
// flat clock for all six documents (the previous version of this file)
// treated a post-market monitoring plan, which describes what the system
// is doing right now, the same as a DPIA, which describes what data it
// processes and barely moves month to month.
//
// Not an external standard, there isn't one -- a judgment call about what
// each document actually depends on, same as the flat twelve months it
// replaces was. The monitoring plan and the Annex IV technical
// documentation describe the system as it currently runs (the
// documentation goes stale exactly when the model does, the same thing
// api_keys.model_version started tracking as detectable drift a few
// hours earlier tonight). The other four describe legal or organizational
// context that moves slower.
const REVIEW_PERIOD_MONTHS: Record<keyof ProgramDocumentBundle, number> = {
  monitoring_plan: 6,
  documentation: 6,
  dpia: 12,
  fria: 12,
  ai_use_policy: 12,
  incident_checklist: 12,
};

export type DocumentReviews = Partial<Record<keyof ProgramDocumentBundle, { reviewed_at: string }>>;

export interface DocumentReviewStatus {
  dueAt: string;
  stale: boolean;
  lastReviewedAt: string;
}

function addMonths(iso: string, months: number): string {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

export function getDocumentReviewStatus(
  documentKey: keyof ProgramDocumentBundle,
  deliveredAt: string,
  documentReviews: DocumentReviews | null | undefined
): DocumentReviewStatus {
  const lastReviewedAt = documentReviews?.[documentKey]?.reviewed_at ?? deliveredAt;
  const dueAt = addMonths(lastReviewedAt, REVIEW_PERIOD_MONTHS[documentKey]);
  return { dueAt, stale: new Date(dueAt) < new Date(), lastReviewedAt };
}
