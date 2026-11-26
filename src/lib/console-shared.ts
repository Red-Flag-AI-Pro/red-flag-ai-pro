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
  /** Also worth going back to for RecoverROI, and what was noticed. */
  recoverroi_fit: boolean;
  recoverroi_note: string | null;
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
  "recoverroi_fit",
  "recoverroi_note",
] as const;

/** Today in the UK as YYYY-MM-DD, optionally shifted by a number of days. */
/**
 * A UK date a number of days ahead, moved to the Monday if it lands on a
 * weekend, so follow ups never fall on a Saturday or Sunday.
 */
export function ukWorkday(offsetDays: number, from: Date = new Date()): string {
  const iso = ukDate(offsetDays, from);
  const day = new Date(`${iso}T12:00:00Z`).getUTCDay(); // 0 Sunday, 6 Saturday
  const shift = day === 6 ? 2 : day === 0 ? 1 : 0;
  return shift ? ukDate(offsetDays + shift, from) : iso;
}

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
      return { stage: moveOn("contacted"), nextAction: "No reply yet: follow up or post the letter", nextActionAt: ukWorkday(3) };
    case "email":
      return { stage: moveOn("contacted"), nextAction: "No reply yet: follow up", nextActionAt: ukWorkday(3) };
    case "connect":
      // A connection request is not a message: it does not count as contact,
      // it just sets a reminder to send the message once they accept.
      return { stage: current, nextAction: "If they accepted on LinkedIn, send the message", nextActionAt: ukWorkday(2) };
    case "letter":
      return { stage: moveOn("contacted"), nextAction: "Ring them about the letter", nextActionAt: ukWorkday(5) };
    case "call":
      switch (outcome) {
        case "spoke_interested":
          return { stage: "replied", nextAction: "Send their red flag", nextActionAt: ukDate(0) };
        case "spoke_not_interested":
          return { stage: "lost", nextAction: null, nextActionAt: null };
        case "callback":
          return { stage: moveOn("contacted"), nextAction: "Call back as agreed", nextActionAt: ukWorkday(1) };
        case "gatekeeper":
          return { stage: moveOn("contacted"), nextAction: "Ring again and ask for them by name", nextActionAt: ukWorkday(2) };
        default:
          return { stage: moveOn("contacted"), nextAction: "Ring again", nextActionAt: ukWorkday(2) };
      }
    case "stage":
      switch (outcome) {
        case "replied":
          return { stage: "replied", nextAction: "Send their red flag", nextActionAt: ukDate(0) };
        case "flag_sent":
          return { stage: "flag_sent", nextAction: "Ask if they want the full audit", nextActionAt: ukWorkday(3) };
        case "audit_sold":
          return { stage: "audit_sold", nextAction: "Deliver the audit within 48 hours", nextActionAt: ukWorkday(2) };
        case "lost":
          return { stage: "lost", nextAction: null, nextActionAt: null };
        case "new":
          return { stage: "new", nextAction: "Send the first message", nextActionAt: ukDate(0) };
        case "contacted":
          return { stage: "contacted", nextAction: "Follow up", nextActionAt: ukWorkday(3) };
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

/** "the Neo-Derm", but "The Skin Bothy" (never "the The Skin Bothy"). */
const theCompany = (p: Pick<Prospect, "company">) => {
  const c = (p.company ?? "").trim();
  return /^the\s/i.test(c) ? c : `the ${c}`;
};

/** How to greet them: "Dr Hussain" for a doctor (Dr in their role), otherwise their first name. */
const greetName = (p: Pick<Prospect, "contact_name" | "contact_role">) => {
  const parts = (p.contact_name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1 && /\bDr\b/.test(p.contact_role ?? "")) return `Dr ${parts[parts.length - 1]}`;
  return parts[0] || "there";
};

/** The opening message body shared by LinkedIn and email: their own line, the rule, and an offer. */
function openingLines(p: Prospect): string[] {
  const lines: string[] = [];
  lines.push(`Hello ${greetName(p)},`);
  lines.push("");
  lines.push(`I had a look at ${theCompany(p)} website.`);
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
  lines.push("I check what businesses say in public and how they use AI, covering compliance and AI governance, so they hear it from me before a regulator or a competitor.");
  return lines;
}

/** The opening LinkedIn message. */
export function linkedinMessage(p: Prospect): string {
  return [...openingLines(p), "", CONTACT.name, CONTACT.website].join("\n");
}

/** Subject line for the opening email. */
export function emailSubject(p: Pick<Prospect, "company">): string {
  return `Something on ${theCompany(p)} website`;
}

/**
 * The opening email: the same words as the LinkedIn message plus the line
 * that lets them opt out, which UK rules (PECR) expect in a business email.
 */
export function emailMessage(p: Prospect): string {
  return [
    ...openingLines(p),
    "",
    CONTACT.name,
    CONTACT.website,
    "",
    "If you would rather not hear from me again, just reply \"no thanks\" and I will not contact you again.",
  ].join("\n");
}

/** The body of the posted letter, one paragraph per entry. */
export function letterParagraphs(p: Prospect): string[] {
  const out: string[] = [];
  out.push(`I run ${CONTACT.business}. We check what businesses say in public and how they use AI, and tell them what could get them into trouble before a regulator, a competitor or a customer does.`);
  out.push(`I looked at ${theCompany(p)} website${p.website ? ` (${p.website.replace(/^https?:\/\//, "").replace(/\/$/, "")})` : ""} and found something you will want to know about.`);
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

export interface ScriptStep {
  title: string;
  /** What to say, one line per entry. */
  say: string[];
  /** A direction for James, not spoken. */
  note?: string;
}

export interface CallScript {
  steps: ScriptStep[];
  objections: { they: string; you: string }[];
  voicemail: string;
  rules: string[];
}

/**
 * The follow up call, written out with this prospect's own red flag in it.
 * Plain wording on purpose: it is a starting point to put into your own words,
 * not lines to read out.
 */
export function callScript(p: Prospect): CallScript {
  const first = firstName(p);
  const named = first !== "there";
  const them = named ? first : "the owner";
  const where = p.red_flag_where ? `On your ${p.red_flag_where.toLowerCase()} it` : "On your website it";
  const total = p.more_count && p.more_count > 0 ? p.more_count + 1 : null;
  const price = "£449";

  const flag: string[] = [];
  if (p.red_flag_quote) flag.push(`${where} says: "${p.red_flag_quote}"`);
  if (p.red_flag_problem) flag.push(p.red_flag_problem);
  if (p.red_flag_rule) flag.push(`That looks like it falls foul of this: ${p.red_flag_rule}`);
  if (flag.length === 0) flag.push("(Add their red flag in the details below and it will appear here.)");
  flag.push("Did you know that was on there?");

  return {
    steps: [
      {
        title: "Getting past reception",
        say: [
          `Hi, it's ${CONTACT.name}. I wrote to ${them} last week about ${named ? "their" : "the"} website. ${named ? `Is ${first} about?` : "Who's the best person to speak to?"}`,
          "If they ask what it is about: There's a line on the website that could cause a problem. They will want to hear it from me.",
        ],
      },
      {
        title: "The opening, ten seconds",
        say: [
          `${named ? `${first}, it's` : "It's"} ${CONTACT.name} from ${CONTACT.business}. I'll be quick. I check what businesses say on their websites and how they use AI. I looked at yours and found something. Have you got two minutes?`,
        ],
      },
      {
        title: "Their red flag",
        say: flag,
        note: "Say it, then stop talking and let them react.",
      },
      {
        title: "Get them talking",
        say: ["Who wrote that page?", "Has anyone ever checked the site against the rules?", "Are you using AI anywhere? A chatbot, or to write your content?"],
        note: "Ask one, listen, then ask the next. You are finding out how exposed they feel.",
      },
      {
        title: "The bridge",
        say: [total ? `That was the first of ${total} I found.` : "That is not the only thing I found."],
      },
      {
        title: "The offer",
        say: [
          `Here's what I do. For ${price}, one payment, I go through your whole site and how you use AI. You get every problem, why it matters and exactly what to change, on video and in writing, inside 48 hours.`,
          "If I find nothing worth fixing, you get your money back.",
        ],
      },
      {
        title: "The close",
        say: ["Shall I get started today?"],
        note: "Then wait. If it is a yes, send the payment link from redflagaipro.com/audit while you are still on the phone.",
      },
    ],
    objections: [
      {
        they: "Just send me an email.",
        you: "I will. What's the best address? And so I send the right thing: is it the wording on the site you're more worried about, or the AI side?",
      },
      {
        they: "How much is it? (before you have told them the flag)",
        you: `${price}, once. Let me tell you what I found first, then you can judge whether it's worth it.`,
      },
      {
        they: "We've got a solicitor. / Our agency handles that.",
        you: "Good. I'm not replacing them and this isn't legal advice. I find what's on the page today. Someone approved that line and it's still there. Most solicitors are glad of the list.",
      },
      {
        they: "How did you get my details?",
        you: `Fair question. Your website's public and directors are listed at Companies House. I'm at ${CONTACT.website}, have a look. If you'd rather I didn't ring again, say so and I won't.`,
      },
      {
        they: "I need to think about it.",
        you: "Of course. What would you need to see to decide? I'll put the first finding in writing today and ring you in a couple of days.",
      },
      {
        they: "Is this a scam?",
        you: `I'd ask the same. Look me up: ${CONTACT.website}. Everything I've told you is on your own website, so you can check it in a minute without taking my word for anything.`,
      },
      {
        they: "Not interested.",
        you: "No problem. Keep the one I found, it's yours either way. If you ever want the rest, you know where I am.",
      },
    ],
    voicemail: `${named ? `${first}, ` : ""}${CONTACT.name}, ${CONTACT.business}. I wrote to you about a line on your website. It's worth two minutes. I'll try you again in a couple of days, or find me at ${CONTACT.website}.`,
    rules: [
      "Say who you are in the first sentence.",
      'Say "looks like" or "could be" a breach. Never "you have broken the law" and never "you will be fined".',
      'If they say stop, stop, and tick "They asked not to be contacted again".',
      "Log the call before you make the next one.",
    ],
  };
}

// ---------------------------------------------------------------------------
// Checkpoints: the eight things to find out on a call. Four about what the
// business says in public, four about how it uses AI. Each answer carries the
// sentence that goes into the "what I heard" summary, and whether it is a gap
// worth raising. Eight on purpose: enough to diagnose, short enough that it
// stays a conversation.

export interface CheckpointOption {
  label: string;
  /** How this answer reads back to the prospect. */
  heard: string;
  /** True when the answer is a gap the audit would address. */
  gap?: boolean;
}

export interface Checkpoint {
  id: string;
  half: "said" | "did";
  question: string;
  /** More than one answer can be chosen. */
  multi?: boolean;
  options: CheckpointOption[];
}

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: "writer",
    half: "said",
    question: "Who writes the words on your website and in your ads?",
    options: [
      { label: "We do, in house", heard: "You write your own website and ad copy in house." },
      { label: "An agency", heard: "An agency writes your website and ad copy." },
      { label: "AI writes it", heard: "AI writes most of your copy.", gap: true },
      { label: "A mix", heard: "Your copy comes from a mix of people and AI." },
      { label: "Not sure", heard: "Nobody is quite sure who wrote what is on the site today.", gap: true },
    ],
  },
  {
    id: "checked",
    half: "said",
    question: "Does anyone check them against the rules before they go live?",
    options: [
      { label: "Yes, a named person", heard: "A named person checks copy against the rules before it goes live." },
      { label: "Informally", heard: "Copy gets an informal look before it goes live, with no set check.", gap: true },
      { label: "No", heard: "Nobody checks copy against the rules before it goes live.", gap: true },
      { label: "Not sure", heard: "You are not sure whether copy is checked before it goes live.", gap: true },
    ],
  },
  {
    id: "outside",
    half: "said",
    question: "When did someone outside the business last look at the site?",
    options: [
      { label: "In the last year", heard: "Someone outside the business has looked at the site in the last year." },
      { label: "Longer ago", heard: "It has been more than a year since anyone outside the business looked at the site.", gap: true },
      { label: "Never", heard: "Nobody outside the business has ever looked at the site.", gap: true },
      { label: "Not sure", heard: "You are not sure when the site was last looked at from outside.", gap: true },
    ],
  },
  {
    id: "evidence",
    half: "said",
    question: "You make claims about results, prices or reviews. If someone asked for the evidence tomorrow, could you show it?",
    options: [
      { label: "Yes, on file", heard: "You hold the evidence for the claims you make." },
      { label: "Some of it", heard: "You could show evidence for some of your claims, but not all.", gap: true },
      { label: "No", heard: "You could not show evidence for the claims on the site if asked.", gap: true },
      { label: "We make no claims", heard: "You do not think the site makes claims that need evidence." },
    ],
  },
  {
    id: "ai_where",
    half: "did",
    question: "Where are you using AI right now?",
    multi: true,
    options: [
      { label: "A chatbot", heard: "a chatbot" },
      { label: "Writing content", heard: "writing content" },
      { label: "Sorting applications or enquiries", heard: "sorting applications or enquiries" },
      { label: "Images or video", heard: "images or video" },
      { label: "Not using AI", heard: "" },
      { label: "Not sure", heard: "", gap: true },
    ],
  },
  {
    id: "ai_owner",
    half: "did",
    question: "Who decided to use it, and who answers for it if it gets something wrong?",
    options: [
      { label: "A named person", heard: "A named person is responsible for how AI is used." },
      { label: "The supplier, we assume", heard: "You are relying on the supplier to be responsible for the AI.", gap: true },
      { label: "Nobody in particular", heard: "Nobody in particular is responsible for how AI is used.", gap: true },
      { label: "Not sure", heard: "You are not sure who is responsible for how AI is used.", gap: true },
    ],
  },
  {
    id: "ai_told",
    half: "did",
    question: "Do your customers know when they are dealing with AI?",
    options: [
      { label: "Yes, we tell them", heard: "Customers are told when they are dealing with AI." },
      { label: "Sometimes", heard: "Customers are told about AI in some places but not others.", gap: true },
      { label: "No", heard: "Customers are not told when they are dealing with AI.", gap: true },
      { label: "No AI faces customers", heard: "No AI deals with your customers directly." },
    ],
  },
  {
    id: "ai_record",
    half: "did",
    question: "If a regulator, an insurer or a big client asked how your AI is used and checked, what would you hand them?",
    options: [
      { label: "A written record", heard: "You could hand over a written record of how AI is used and checked." },
      { label: "A policy document", heard: "You have a policy, but no record showing it was followed.", gap: true },
      { label: "Nothing", heard: "You would have nothing to hand over if asked how AI is used and checked.", gap: true },
      { label: "Not sure", heard: "You are not sure what you could hand over if asked how AI is used and checked.", gap: true },
    ],
  },
];

/** Answers keyed by checkpoint id. `answer` holds one label, or several joined with " | ". */
export type CheckpointAnswers = Record<string, { answer?: string; note?: string }>;

const picked = (a: string | undefined) => (a ? a.split(" | ").filter(Boolean) : []);

export function checkpointsCovered(answers: CheckpointAnswers): number {
  return CHECKPOINTS.filter((c) => picked(answers[c.id]?.answer).length > 0).length;
}

/**
 * A short "what I heard" note for a follow up message, built from the answers.
 * It plays the prospect's own words back and names the gaps, without telling
 * them they have broken anything.
 */
export function checkpointSummary(p: Pick<Prospect, "contact_name">, answers: CheckpointAnswers): string {
  const heard: string[] = [];
  let gaps = 0;
  for (const c of CHECKPOINTS) {
    const chosen = picked(answers[c.id]?.answer);
    if (chosen.length === 0) continue;
    const opts = c.options.filter((o) => chosen.includes(o.label));
    if (c.id === "ai_where") {
      const uses = opts.map((o) => o.heard).filter(Boolean);
      if (chosen.includes("Not using AI") && uses.length === 0) heard.push("You are not using AI at the moment.");
      else if (uses.length > 0) heard.push(`You use AI for ${uses.length === 1 ? uses[0] : `${uses.slice(0, -1).join(", ")} and ${uses[uses.length - 1]}`}.`);
      else heard.push("You are not sure where AI is being used in the business.");
    } else {
      heard.push(opts[0].heard);
    }
    if (opts.some((o) => o.gap)) gaps++;
    const note = (answers[c.id]?.note ?? "").trim();
    if (note) heard.push(`(${note})`);
  }
  if (heard.length === 0) return "";

  const name = (p.contact_name ?? "").trim().split(/\s+/)[0] || "there";
  const lines = [`Hi ${name},`, "", "Thanks for your time. So you can see I was listening, here is what I heard:", "", ...heard, ""];
  if (gaps > 0) {
    lines.push(
      gaps === 1
        ? "One of those is a gap I would want closed. It is exactly the kind of thing the full audit covers, alongside what I found on your site."
        : `${gaps} of those are gaps I would want closed. They are exactly what the full audit covers, alongside what I found on your site.`
    );
  } else {
    lines.push("That is a better position than most. The full audit would confirm it and give you something to show for it.");
  }
  lines.push("", CONTACT.name, CONTACT.website);
  return lines.join("\n");
}
