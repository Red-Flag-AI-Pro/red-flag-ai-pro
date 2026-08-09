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

// One year is the ordinary review cadence for a compliance document with
// no faster-moving trigger of its own (unlike a boundary record, which
// carries its own falsifier conditions). Not tuned per document — all six
// were generated together from one intake and share one review clock.
const REVIEW_PERIOD_MONTHS = 12;

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
  const dueAt = addMonths(lastReviewedAt, REVIEW_PERIOD_MONTHS);
  return { dueAt, stale: new Date(dueAt) < new Date(), lastReviewedAt };
}
