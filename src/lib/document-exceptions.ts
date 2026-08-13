// Brad Wolfe, 12-13 Aug 2026, the thread that started at "identical
// reasoning" and ended here. Text-based review evidence dies the moment a
// model can write it, and what stays expensive to fake is a review that
// changed something: "you cannot generate a disagreement alone at a desk."
// A real exception has a counterparty -- somebody received it, argued about
// it, and had to redo the work or defend it.
//
// His second cut, 13 Aug, answers who had a reason to mean it: ask whose
// number gets worse if the answer turns out to be wrong. A credit committee
// approving a customer carries the write off; a peer reviewer carries a
// memory. The exceptions worth counting are raised by somebody whose own
// results move with the answer -- the rest is a population of agreements
// between people who were fine either way. So every exception here carries a
// stake field, frozen text captured at raise time, because whose number
// moves is itself a fact that drifts (comp plans change, portfolios
// reassign) and reconstructing it from the org chart later is exactly the
// failure this whole system exists to prevent.
//
// And his corollary, the one the display below has to honor: if nobody in
// the chain gets a worse quarter for being wrong, zero exceptions is not
// evidence, it is the expected result. Zero only reads as clean when
// somebody with stake was actually in a position to object.

export interface DocumentException {
  document_key: string;
  raised_by_name: string;
  raised_by_role: string;
  // What of the raiser's own results moves if this answer is wrong, in
  // their words, frozen at raise time.
  stake: string;
  // The person who received the exception and has to act on it. A
  // disagreement without a receiver is a note to self.
  counterparty_name: string;
  counterparty_role: string;
  note: string;
  raised_at: string;
  status: "open" | "document_corrected" | "exception_declined";
  resolved_by_name?: string;
  resolved_by_role?: string;
  resolution_note?: string | null;
  resolved_at?: string;
}

export interface RaiserExceptionStats {
  raiserName: string;
  raised: number;
  corrected: number;
  declined: number;
  open: number;
}

export function computeExceptionStats(
  orders: Array<{ exceptions: DocumentException[] | null | undefined }>
): { byRaiser: RaiserExceptionStats[]; total: number } {
  const byName = new Map<string, RaiserExceptionStats>();
  let total = 0;

  for (const { exceptions } of orders) {
    if (!Array.isArray(exceptions)) continue;
    for (const e of exceptions) {
      total += 1;
      const key = e.raised_by_name.trim().toLowerCase();
      const entry = byName.get(key) ?? {
        raiserName: e.raised_by_name.trim(),
        raised: 0,
        corrected: 0,
        declined: 0,
        open: 0,
      };
      entry.raised += 1;
      if (e.status === "document_corrected") entry.corrected += 1;
      else if (e.status === "exception_declined") entry.declined += 1;
      else entry.open += 1;
      byName.set(key, entry);
    }
  }

  return { byRaiser: Array.from(byName.values()), total };
}
