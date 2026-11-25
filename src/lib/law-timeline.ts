// One list of dated legal events, used by the homepage "law today" section.
//
// The point of keeping dates as data: the site decides at render time whether
// an event is "in force now" or "landing next", so copy never needs a tense
// change by hand. The old approach wrote "enforcement begins August 2026"
// into page text, and it was still there in late November.
//
// Rules for this file:
// - Only final, adopted law. No proposals, no bills that have not passed.
// - Every entry carries the official source it was checked against.
// - When you add or change an entry, bump REGULATORY_MAPPING_LAST_REVIEWED
//   in constants.ts.

export interface LawEvent {
  /** ISO date the obligation applies from. */
  date: string;
  region: string;
  law: string;
  headline: string;
  detail: string;
  /** Which half of Red Flag covers it. */
  side: "compliance" | "governance" | "both";
  source: string;
}

export const LAW_TIMELINE: LawEvent[] = [
  {
    date: "2025-04-06",
    region: "UK",
    law: "Digital Markets, Competition and Consumers Act 2024",
    headline: "The CMA fines you directly. No court needed.",
    detail:
      "Fake reviews, hidden fees and misleading sales tactics. Up to 10% of global turnover. The CMA says it has already imposed more than £12 million in fines under these powers.",
    side: "compliance",
    source: "https://www.gov.uk/government/news/cma-fines-firms-6-million-for-misleading-sales-tactics",
  },
  {
    date: "2026-02-05",
    region: "UK",
    law: "UK GDPR Articles 22A to 22D (Data (Use and Access) Act 2025, section 80)",
    headline: "Automated decisions carry new duties.",
    detail:
      "If software makes significant decisions about people, you must tell them, let them challenge it and put a human within reach. A statutory code on AI is on its way from the regulator.",
    side: "governance",
    source: "https://www.legislation.gov.uk/uksi/2026/82/regulation/2/made",
  },
  {
    date: "2026-08-02",
    region: "EU",
    law: "EU AI Act, Article 50",
    headline: "AI transparency is enforceable.",
    detail:
      "Chatbots must say they are AI. Deepfakes must be labelled. AI written text on matters of public interest must be disclosed unless a human reviewed it and takes responsibility. Up to €15 million or 3% of worldwide turnover.",
    side: "both",
    source: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  },
  {
    date: "2026-12-02",
    region: "EU",
    law: "EU AI Act, Article 50(2) and Article 5, as amended by Regulation (EU) 2026/1744",
    headline: "The grace period for marking AI output ends.",
    detail:
      "Generative AI tools that were on the market before August must mark what they produce in a machine readable way. New bans on AI that makes intimate images of real people without consent start the same day.",
    side: "governance",
    source: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj",
  },
  {
    date: "2026-12-09",
    region: "EU",
    law: "Product Liability Directive (EU) 2024/2853",
    headline: "Software counts as a product. AI included.",
    detail:
      "The deadline for EU countries to apply the new product liability rules. Defects carry strict liability, courts can order you to disclose your evidence, and failing to produce it counts against you.",
    side: "governance",
    source: "https://eur-lex.europa.eu/eli/dir/2024/2853/oj",
  },
  {
    date: "2026-12-10",
    region: "Australia",
    law: "Privacy Act 1988, APP 1.7 to 1.9",
    headline: "Privacy policies must disclose automated decisions.",
    detail:
      "If a computer program makes, or substantially helps make, decisions that could significantly affect people, your privacy policy has to say so.",
    side: "governance",
    source: "https://www.oaic.gov.au/news/media-centre/new-resources-on-transparency-for-use-of-ai-and-automated-decision-making",
  },
  {
    date: "2027-01-01",
    region: "Colorado, US",
    law: "Colorado SB 26-189",
    headline: "Colorado's rewritten AI law starts to bite.",
    detail:
      "Notice, an explanation of adverse outcomes, data correction and human review wherever automated tools are used in decisions on jobs, housing, lending, insurance and health care.",
    side: "governance",
    source: "https://leg.colorado.gov/bills/SB26-189",
  },
  {
    date: "2027-12-02",
    region: "EU",
    law: "EU AI Act, Annex III, as amended by Regulation (EU) 2026/1744",
    headline: "High risk AI rules apply.",
    detail:
      "Hiring, credit scoring, insurance pricing and similar uses. Delayed from August 2026, not cancelled.",
    side: "governance",
    source: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj",
  },
];

const DAY_MS = 86_400_000;

// The date as people in the UK experience it, so a countdown does not tick
// over at one in the morning in summer.
function londonDay(now: Date): string {
  return now.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
}

export function daysUntil(isoDate: string, now: Date = new Date()): number {
  const target = Date.parse(`${isoDate}T00:00:00Z`);
  const today = Date.parse(`${londonDay(now)}T00:00:00Z`);
  return Math.round((target - today) / DAY_MS);
}

export function formatLawDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Splits the timeline around today. "In force" shows the most recent first,
 * "next" shows the soonest first. An event is in force from its own date.
 */
export function splitLawTimeline(
  now: Date = new Date(),
  limits: { inForce: number; next: number } = { inForce: 3, next: 4 }
): { inForce: LawEvent[]; next: LawEvent[] } {
  const sorted = [...LAW_TIMELINE].sort((a, b) => a.date.localeCompare(b.date));
  const inForce = sorted.filter((e) => daysUntil(e.date, now) <= 0).reverse().slice(0, limits.inForce);
  const next = sorted.filter((e) => daysUntil(e.date, now) > 0).slice(0, limits.next);
  return { inForce, next };
}
