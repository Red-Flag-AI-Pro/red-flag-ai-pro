import type { SignoffEvent } from "@/lib/program-documents";

// Brad Wolfe, 12 Aug 2026, on the artifact sign-off feature built for him two
// nights ago: a finer signature doesn't close the gap on its own. "People
// sign the instance and rely on the framework... nothing in the record
// distinguishes the two." His own diagnostic: read a signer's reasoning
// across a population of sign-offs. Identical reasoning every time is a
// framework certification wearing an instance label -- the signer checked
// that the process ran, not that this specific item was right.
//
// Reworked 12 Aug 2026, same day, after Brad reviewed the first version: text
// similarity is a defeatable proxy. A signer who sees "identical reasoning"
// flagged just rewords next time -- the detector stops firing while the
// underlying habit is unchanged. It was also blind to the harder case all
// along: two notes worded completely differently that are both still empty.
// What a note needs to prove engagement isn't difference from the signer's
// other notes, it's specificity to the one document it certifies -- content
// that traces back to that document's own generated text and to none of its
// siblings in the same order. Boilerplate this product writes into every
// document regardless of a customer's answers (headings, the fixed sign-off
// block, the boundary-authorization cross-link three of the six share
// verbatim) falls out on its own, because it's never unique to one document.
// What survives is the part that actually depends on this customer's own
// intake: a cited article number that differs per document type, a selected
// data category, a specific risk or affected party -- the kind of thing a
// signer could only reference by having looked at this document, not by
// having a habit.
//
// Second rework, same conversation: the unit was wrong too. One flagged note
// is noise, forgivable as a single lapse. The finding that means something is
// what proportion of a signer's notes carry no document-specific content at
// all, and per Brad, that rate has exactly one correct scope -- the
// customer's own orders. Aggregating the same signer name across customers
// turns a finding about how one company's certification process runs into a
// claim about a named individual, built on data none of those companies
// agreed to pool, and accepted_by_name is frozen text by design, not a
// resolvable identity to aggregate against in the first place.

export interface GenericReasoningFinding {
  signerName: string;
  note: string;
  documentKey: string;
}

export interface SignerSpecificityRate {
  signerName: string;
  totalNotes: number;
  genericNotes: number;
  // genericNotes / totalNotes. Left for the caller to format and to decide
  // whether totalNotes is large enough to be worth showing at all.
  rate: number;
}

// A short general-English stopword list plus this product's own recurring
// template language (its name, section headings, boilerplate verbs) --
// filtered out so ordinary connective words and phrases every document
// contains regardless of a customer's actual answers never register as
// "distinctive." What's left after filtering is content this product wrote
// specifically because of what the customer told it, not because of the
// template itself.
const STOPWORDS = new Set([
  "the", "and", "for", "that", "this", "with", "from", "your", "will", "are",
  "was", "were", "has", "have", "had", "not", "but", "any", "all", "can",
  "who", "what", "when", "where", "why", "how", "into", "onto", "over",
  "under", "than", "then", "them", "they", "their", "its", "it's", "you",
  "our", "out", "per", "via", "etc", "each", "such", "does", "did", "done",
  "may", "might", "must", "should", "would", "could", "shall", "also",
  "before", "after", "during", "within", "without", "about", "above",
  "below", "between", "against", "based", "used", "using", "use",
  "red", "flag", "pro", "generated", "prepared", "draft", "date", "name",
  "system", "process", "processes", "processing", "review", "reviewed",
  "sign", "signed", "signature", "signoff", "sign-off", "assessed",
  "governance", "compliance", "assessment", "document", "documents",
  "record", "records", "policy", "policies", "report", "reporting",
  "risk", "risks", "measure", "measures", "requirement", "requirements",
  "applicable", "article", "section", "annex", "act", "gdpr", "gov", "uk",
  "eu", "ai", "org", "team", "role", "owner", "version", "www",
  "redflagaipro", "com", "http", "https",
]);

function tokenize(text: string): Set<string> {
  const matches = text.toLowerCase().match(/[a-z0-9£€%.]+/g) ?? [];
  return new Set(matches.filter((t) => t.length >= 3 && !STOPWORDS.has(t)));
}

// Tokens present in this document's own content but absent from every
// sibling document in the same order. Shared template language falls out by
// construction; what survives is specific to this document because it's
// specific to what the customer answered for it.
function distinctiveTokens(
  documentKey: string,
  documents: Partial<Record<string, string>>
): Set<string> {
  const ownContent = documents[documentKey];
  if (!ownContent) return new Set();

  const siblingTokens = new Set<string>();
  for (const [key, content] of Object.entries(documents)) {
    if (key === documentKey || !content) continue;
    for (const t of tokenize(content)) siblingTokens.add(t);
  }

  const distinctive = new Set<string>();
  for (const t of tokenize(ownContent)) {
    if (!siblingTokens.has(t)) distinctive.add(t);
  }
  return distinctive;
}

function noteIsSpecific(note: string, distinctive: Set<string>): boolean {
  if (distinctive.size === 0) return false;
  for (const t of tokenize(note)) {
    if (distinctive.has(t)) return true;
  }
  return false;
}

// Findings scoped to one order: which of its currently-signed documents carry
// a note with nothing specific to that document in it. Documents without
// content, or without a "signed" event with a note, are silently skipped --
// there's nothing to assess yet.
export function detectGenericReasoning(
  documents: Partial<Record<string, string>>,
  signoffsByDocument: Record<string, SignoffEvent[]> | null | undefined
): GenericReasoningFinding[] {
  if (!signoffsByDocument) return [];

  const findings: GenericReasoningFinding[] = [];
  for (const [documentKey, events] of Object.entries(signoffsByDocument)) {
    if (!Array.isArray(events) || events.length === 0) continue;
    const latest = events[events.length - 1];
    if (latest.type !== "signed" || !latest.note) continue;

    const distinctive = distinctiveTokens(documentKey, documents);
    if (!noteIsSpecific(latest.note, distinctive)) {
      findings.push({
        signerName: latest.accepted_by_name.trim(),
        note: latest.note.trim(),
        documentKey,
      });
    }
  }
  return findings;
}

// Per-tenant only. Callers must only ever pass orders belonging to the same
// customer -- never mix orders across users_id here. See the file header:
// this rate is a finding about one company's certification control, not a
// claim about a named individual, and that distinction lives entirely in
// what's allowed to be aggregated together.
export function computeSignerSpecificityRates(
  orders: Array<{
    documents: Partial<Record<string, string>>;
    signoffsByDocument: Record<string, SignoffEvent[]> | null | undefined;
  }>
): SignerSpecificityRate[] {
  const bySigner = new Map<string, { displayName: string; total: number; generic: number }>();

  for (const { documents, signoffsByDocument } of orders) {
    if (!signoffsByDocument) continue;
    for (const [documentKey, events] of Object.entries(signoffsByDocument)) {
      if (!Array.isArray(events) || events.length === 0) continue;
      const latest = events[events.length - 1];
      if (latest.type !== "signed" || !latest.note) continue;

      const signerName = latest.accepted_by_name.trim();
      const signerKey = signerName.toLowerCase();
      const entry = bySigner.get(signerKey) ?? { displayName: signerName, total: 0, generic: 0 };

      entry.total += 1;
      const distinctive = distinctiveTokens(documentKey, documents);
      if (!noteIsSpecific(latest.note, distinctive)) entry.generic += 1;

      bySigner.set(signerKey, entry);
    }
  }

  return Array.from(bySigner.values()).map(({ displayName, total, generic }) => ({
    signerName: displayName,
    totalNotes: total,
    genericNotes: generic,
    rate: generic / total,
  }));
}
