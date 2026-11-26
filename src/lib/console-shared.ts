// Shared types, rules and wording for the sales console at /console.
// Everything here is plain data and pure functions with no server only
// imports, so the browser screen, the API routes and the printable letter
// can all use it and agree with each other.

export const ADMIN_EMAIL = "redflagaipro@gmail.com";

/** How a prospect reaches James from a letter. Change these in one place. */
export const CONTACT = {
  name: "James Stokes",
  business: "Red Flag AI Pro",
  email: "support@redflagaipro.com",
  website: "redflagaipro.com",
};

export const STAGES = ["new", "contacted", "replied", "flag_sent", "audit_sold", "lost"] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABEL: Record<Stage, string> = {
  new: "To contact",
  contacted: "Contacted",
  replied: "Replied",
  flag_sent: "Red flag sent",
  audit_sold: "Audit sold",
  lost: "Lost",
};

export const CALL_OUTCOMES = ["no_answer", "gatekeeper", "callback", "spoke_interested", "spoke_not_interested"] as const;
export type CallOutcome = (typeof CALL_OUTCOMES)[number];

export const CALL_OUTCOME_LABEL: Record<CallOutcome, string> = {
  no_answer: "No answer",
  gatekeeper: "Stopped at reception",
  callback: "Asked me to call back",
  spoke_interested: "Spoke, interested",
  spoke_not_interested: "Spoke, not interested",
};

export interface Prospect {
  id: string;
  created_at: string;
  updated_at: string;
  company: string;
  website: string | null;
  sector: string | null;
  source: string | null;
  contact_name: string | null;
  contact_role: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  postal_address: string | null;
  red_flag_quote: string | null;
  red_flag_where: string | null;
  red_flag_problem: string | null;
  red_flag_rule: string | null;
  more_count: number | null;
  stage: Stage;
  next_action: string | null;
  next_action_at: string | null;
  tps_checked_at: string | null;
  tps_registered: boolean | null;
  do_not_contact: boolean;
  notes: string | null;
}

export interface Activity {
  id: string;
  prospect_id: string;
  kind: string;
  outcome: string | null;
  detail: string | null;
  created_at: string;
}

export interface LeadRequestRow {
  id: string;
  kind: string;
  email: string;
  name: string | null;
  company: string | null;
  website: string | null;
  message: string | null;
  created_at: string;
}

/** The fields the console is allowed to write on a prospect. */
export const EDITABLE_FIELDS = [
  "company",
  "website",
  "sector",
  "source",
  "contact_name",
  "contact_role",
  "email",
  "phone",
  "linkedin_url",
  "postal_address",
  "red_flag_quote",
  "red_flag_where",
  "red_flag_problem",
  "red_flag_rule",
  "more_count",
  "next_action",
  "next_action_at",
  "tps_registered",
  "do_not_contact",
  "notes",
] as const;

/** Today in the UK as YYYY-MM-DD, optionally shifted by a number of days. */
export function ukDate(offsetDays = 0, from: Date = new Date()): string {
  const today = from.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
  const t = Date.parse(`${today}T12:00:00Z`) + offsetDays * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * What happens to a prospect after something is logged: the stage it moves
 * to (if any), the next thing to do, and when. This is the daily habit in
 * code: nothing is ever logged without the next step being set.
 */
export function followUp(
  kind: string,
  outcome: string | null,
  current: Stage
): { stage: Stage; nextAction: string | null; nextActionAt: string | null } {
  const moveOn = (to: Stage): Stage => (current === "new" ? to : current);
  switch (kind) {
    case "linkedin":
      return { stage: moveOn("contacted"), nextAction: "No reply yet: follow up or post the letter", nextActionAt: ukDate(3) };
    case "email":
      return { stage: moveOn("contacted"), nextAction: "No reply yet: follow up", nextActionAt: ukDate(3) };
    case "letter":
      return { stage: moveOn("contacted"), nextAction: "Ring them about the letter", nextActionAt: ukDate(5) };
    case "call":
      switch (outcome) {
        case "spoke_interested":
          return { stage: "replied", nextAction: "Send their red flag", nextActionAt: ukDate(0) };
        case "spoke_not_interested":
          return { stage: "lost", nextAction: null, nextActionAt: null };
        case "callback":
          return { stage: moveOn("contacted"), nextAction: "Call back as agreed", nextActionAt: ukDate(1) };
        case "gatekeeper":
          return { stage: moveOn("contacted"), nextAction: "Ring again and ask for them by name", nextActionAt: ukDate(2) };
        default:
          return { stage: moveOn("contacted"), nextAction: "Ring again", nextActionAt: ukDate(2) };
      }
    case "stage":
      switch (outcome) {
        case "replied":
          return { stage: "replied", nextAction: "Send their red flag", nextActionAt: ukDate(0) };
        case "flag_sent":
          return { stage: "flag_sent", nextAction: "Ask if they want the full audit", nextActionAt: ukDate(3) };
        case "audit_sold":
          return { stage: "audit_sold", nextAction: "Deliver the audit within 48 hours", nextActionAt: ukDate(2) };
        case "lost":
          return { stage: "lost", nextAction: null, nextActionAt: null };
        case "new":
          return { stage: "new", nextAction: "Send the first message", nextActionAt: ukDate(0) };
        case "contacted":
          return { stage: "contacted", nextAction: "Follow up", nextActionAt: ukDate(3) };
        default:
          return { stage: current, nextAction: null, nextActionAt: null };
      }
    default:
      return { stage: current, nextAction: null, nextActionAt: null };
  }
}

const firstName = (p: Pick<Prospect, "contact_name">) => (p.contact_name ?? "").trim().split(/\s+/)[0] || "there";

const others = (n: number | null) => {
  if (!n || n < 1) return null;
  return n === 1 ? "one more" : `${n} more`;
};

/** The opening LinkedIn message: their own line, the rule, and an offer. */
export function linkedinMessage(p: Prospect): string {
  const lines: string[] = [];
  lines.push(`Hi ${firstName(p)},`);
  lines.push("");
  lines.push(`I had a look at the ${p.company} website.`);
  if (p.red_flag_quote) {
    lines.push("");
    lines.push(`${p.red_flag_where ? `On your ${p.red_flag_where.toLowerCase()} it` : "It"} says: "${p.red_flag_quote}"`);
  }
  if (p.red_flag_problem || p.red_flag_rule) {
    lines.push("");
    lines.push([p.red_flag_problem, p.red_flag_rule].filter(Boolean).join(" "));
  }
  const rest = others(p.more_count);
  lines.push("");
  lines.push(
    rest
      ? `I found ${rest} like it. Want me to tell you what they are?`
      : "Want me to take a proper look at the rest of the site for you?"
  );
  lines.push("");
  lines.push("I check what businesses say in public and how they use AI, so they hear it from me before a regulator or a competitor.");
  lines.push("");
  lines.push(CONTACT.name);
  lines.push(CONTACT.website);
  return lines.join("\n");
}

/** The body of the posted letter, one paragraph per entry. */
export function letterParagraphs(p: Prospect): string[] {
  const out: string[] = [];
  out.push(`I run ${CONTACT.business}. We check what businesses say in public and how they use AI, and tell them what could get them into trouble before a regulator, a competitor or a customer does.`);
  out.push(`I looked at the ${p.company} website${p.website ? ` (${p.website.replace(/^https?:\/\//, "").replace(/\/$/, "")})` : ""} and found something you will want to know about.`);
  if (p.red_flag_quote) {
    out.push(`${p.red_flag_where ? `On your ${p.red_flag_where.toLowerCase()} it` : "It"} says: "${p.red_flag_quote}"`);
  }
  if (p.red_flag_problem) out.push(p.red_flag_problem);
  if (p.red_flag_rule) out.push(p.red_flag_rule);
  const rest = others(p.more_count);
  out.push(
    rest
      ? `That is the first thing I found. There ${p.more_count === 1 ? "is" : "are"} ${rest}. If you would like to know what they are, email me or visit ${CONTACT.website} and I will tell you, free and with no obligation.`
      : `If you would like me to look at the rest of the site, email me or visit ${CONTACT.website}. The first finding is always free.`
  );
  out.push("This is a heads up from someone who reads the rules for a living. It is not legal advice, and nothing here has been sent to anyone but you.");
  return out;
}
