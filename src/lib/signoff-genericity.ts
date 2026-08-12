import type { SignoffEvent } from "@/lib/program-documents";

// Brad Wolfe, 12 Aug 2026, on the artifact sign-off feature built for him two
// nights ago: a finer signature doesn't close the gap on its own. "People
// sign the instance and rely on the framework... nothing in the record
// distinguishes the two." His own diagnostic: read a signer's reasoning
// across a population of sign-offs. Identical reasoning every time is a
// framework certification wearing an instance label -- the signer checked
// that the process ran, not that this specific item was right.
//
// Implemented at the scope this page already has data for: one signer
// certifying more than one of the six documents inside a single program
// order. If their note is the same word for word across documents that are
// nothing alike -- a risk register and a financial snapshot don't share a
// reason to be correct -- that repetition is itself the fact, not something
// inferred from it.
export interface GenericReasoningFinding {
  signerName: string;
  note: string;
  documentKeys: string[];
}

export function detectGenericReasoning(
  signoffsByDocument: Record<string, SignoffEvent[]> | null | undefined
): GenericReasoningFinding[] {
  if (!signoffsByDocument) return [];

  // Only the most recent "signed" event per document reflects the current
  // certification -- a withdrawn or superseded note shouldn't count toward
  // whether today's reasoning is generic.
  const latestByDocument: { documentKey: string; signerName: string; note: string }[] = [];
  for (const [documentKey, events] of Object.entries(signoffsByDocument)) {
    if (!Array.isArray(events) || events.length === 0) continue;
    const latest = events[events.length - 1];
    if (latest.type !== "signed" || !latest.note) continue;
    latestByDocument.push({
      documentKey,
      signerName: latest.accepted_by_name.trim(),
      note: latest.note.trim(),
    });
  }

  // Group by signer (case-insensitive), then by their exact note text.
  const bySigner = new Map<string, { displayName: string; byNote: Map<string, string[]> }>();
  for (const entry of latestByDocument) {
    const signerKey = entry.signerName.toLowerCase();
    if (!bySigner.has(signerKey)) {
      bySigner.set(signerKey, { displayName: entry.signerName, byNote: new Map() });
    }
    const signer = bySigner.get(signerKey)!;
    const noteKey = entry.note.toLowerCase();
    const existing = signer.byNote.get(noteKey) ?? [];
    signer.byNote.set(noteKey, [...existing, entry.documentKey]);
  }

  const findings: GenericReasoningFinding[] = [];
  for (const { displayName, byNote } of bySigner.values()) {
    for (const documentKeys of byNote.values()) {
      if (documentKeys.length < 2) continue;
      // Recover the original-cased note text from whichever entry produced
      // this group -- all entries in the group share the same lowercased key.
      const noteText = latestByDocument.find((e) => e.documentKey === documentKeys[0])?.note ?? "";
      findings.push({ signerName: displayName, note: noteText, documentKeys });
    }
  }
  return findings;
}
