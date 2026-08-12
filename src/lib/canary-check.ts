// Task #137, built 13 Aug 2026. The day's thread with Brad Wolfe ended at the
// wall every text-based review check hits: anything a reviewer can write, a
// model can write, so the only evidence of review that stays expensive to
// fake is behavior against ground truth nobody gets to invent after the
// fact. A canary is that ground truth, manufactured: present the reviewer a
// version of their own document with one known material error planted in it,
// and record whether they catch it or certify it anyway. Approving a
// known-wrong document is not an inference from note text, it's an observed
// fact -- and the system can grade a catch honestly because it knows exactly
// what it changed.
//
// AILeash ships a cousin of this (their "probe" method feeds reviewers
// deliberately wrong verdicts and reports agreement rate and dwell time).
// The difference here is the output: not a metric on a dashboard but a
// sealed, dated event tied to a named person and a specific document.
//
// Alterations are deterministic string surgery on the generated document
// content -- no AI in the loop, so the canary itself can never hallucinate a
// second, unintended error. Each kind is chosen because it's material to
// what the document certifies (a statutory citation, a deadline, an
// obligation) rather than cosmetic, and small enough that only someone
// actually reading would spot it.

export type CanaryKind = "citation" | "duration" | "obligation" | "year";

export interface CanaryAlteration {
  kind: CanaryKind;
  original: string;
  altered: string;
}

export interface CanaryEvent {
  document_key: string;
  kind: CanaryKind;
  original_excerpt: string;
  altered_excerpt: string;
  canary_sha256: string;
  presented_at: string;
  status: "pending" | "caught" | "missed";
  responded_at?: string;
  responded_by_name?: string;
  responded_by_role?: string;
  response_note?: string | null;
  // A flag only counts as a true catch when the note names what was actually
  // wrong. "Something looks off" clears the reviewer without proving they
  // found the error -- the same specificity bar the sign-off notes are held
  // to in signoff-genericity.ts.
  true_catch?: boolean;
  dwell_seconds?: number;
}

function flipNumber(n: string): string {
  // Two distinct digits reverse cleanly (35 -> 53); anything else shifts by
  // a small odd amount so the result is plausible but wrong.
  if (n.length === 2 && n[0] !== n[1]) return n[1] + n[0];
  const asNum = parseInt(n, 10);
  return String(asNum + 3);
}

export function generateCanary(
  content: string
): { alteredContent: string; alteration: CanaryAlteration } | null {
  // First matching kind wins, in order of how material the alteration is to
  // what these six documents actually certify.
  const citation = content.match(/Article\s+(\d+)(\(\d+\))?/);
  if (citation && citation.index !== undefined) {
    const original = citation[0];
    const altered = `Article ${flipNumber(citation[1])}${citation[2] ?? ""}`;
    return {
      alteredContent:
        content.slice(0, citation.index) + altered + content.slice(citation.index + original.length),
      alteration: { kind: "citation", original, altered },
    };
  }

  const duration = content.match(/(\d+)\s+(hour|day|week|month)(s?)\b/i);
  if (duration && duration.index !== undefined) {
    const original = duration[0];
    const unitSwap: Record<string, string> = {
      hour: "day",
      day: "month",
      week: "month",
      month: "week",
    };
    const unit = duration[2].toLowerCase();
    const altered = `${duration[1]} ${unitSwap[unit]}${duration[3]}`;
    return {
      alteredContent:
        content.slice(0, duration.index) + altered + content.slice(duration.index + original.length),
      alteration: { kind: "duration", original, altered },
    };
  }

  const obligation = content.match(/\bmust\b/);
  if (obligation && obligation.index !== undefined) {
    return {
      alteredContent:
        content.slice(0, obligation.index) + "may" + content.slice(obligation.index + 4),
      alteration: { kind: "obligation", original: "must", altered: "may" },
    };
  }

  const year = content.match(/\b(20\d{2})\b/);
  if (year && year.index !== undefined) {
    const altered = String(parseInt(year[1], 10) - 2);
    return {
      alteredContent:
        content.slice(0, year.index) + altered + content.slice(year.index + year[1].length),
      alteration: { kind: "year", original: year[1], altered },
    };
  }

  return null;
}

const NOTE_STOPWORDS = new Set(["the", "and", "was", "has", "this", "that", "with", "should"]);

function noteTokens(text: string): Set<string> {
  const matches = text.toLowerCase().match(/[a-z0-9()]+/g) ?? [];
  return new Set(matches.filter((t) => t.length >= 2 && !NOTE_STOPWORDS.has(t)));
}

// True only when the flag note references something from the actual
// alteration -- the changed text or what it should have said. Knowing the
// document was wrong and knowing WHAT was wrong are different claims, and
// only the second one proves the error was found rather than guessed at.
export function isTrueCatch(note: string, alteration: CanaryAlteration): boolean {
  if (!note.trim()) return false;
  const noted = noteTokens(note);
  const target = noteTokens(`${alteration.original} ${alteration.altered}`);
  for (const t of target) {
    if (noted.has(t)) return true;
  }
  return false;
}
