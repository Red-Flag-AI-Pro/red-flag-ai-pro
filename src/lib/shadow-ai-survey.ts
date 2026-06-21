export type AnswerValue = "good" | "mid" | "bad";

export interface SurveyQuestion {
  id: string;
  question: string;
  help?: string;
  options: { value: AnswerValue; label: string }[];
  weight: number; // points deducted from 100 if "bad", weight/2 if "mid"
}

export const SHADOW_AI_QUESTIONS: SurveyQuestion[] = [
  {
    id: "policy",
    question: "Do you have a written policy covering employee use of AI tools (ChatGPT, Copilot, etc.)?",
    options: [
      { value: "good", label: "Yes, documented and shared with the team" },
      { value: "mid", label: "Informal guidance, nothing written" },
      { value: "bad", label: "No policy at all" },
    ],
    weight: 18,
  },
  {
    id: "visibility",
    question: "Do you know which AI tools your employees actually use day-to-day?",
    options: [
      { value: "good", label: "Yes, we track this" },
      { value: "mid", label: "Roughly — we have a general idea" },
      { value: "bad", label: "No idea" },
    ],
    weight: 16,
  },
  {
    id: "data_paste",
    question: "To your knowledge, has anyone pasted company or customer data into a public AI tool?",
    options: [
      { value: "good", label: "Never, as far as we know" },
      { value: "mid", label: "Possibly, we're not sure" },
      { value: "bad", label: "Yes, this has happened" },
    ],
    weight: 18,
  },
  {
    id: "discovery",
    question: "Can IT or leadership see which new SaaS/AI tools employees are signing up for?",
    options: [
      { value: "good", label: "Yes — SSO, CASB or expense review catches this" },
      { value: "mid", label: "Partially — only for some tools" },
      { value: "bad", label: "No visibility at all" },
    ],
    weight: 14,
  },
  {
    id: "onboarding",
    question: "Do new hires get any guidance on acceptable AI tool use during onboarding?",
    options: [
      { value: "good", label: "Yes, it's part of onboarding" },
      { value: "mid", label: "Mentioned informally" },
      { value: "bad", label: "No" },
    ],
    weight: 10,
  },
  {
    id: "proof",
    question: "If a regulator or client asked exactly which AI tools touch customer data, could you answer confidently today?",
    options: [
      { value: "good", label: "Yes, confidently" },
      { value: "mid", label: "Probably, with some digging" },
      { value: "bad", label: "No" },
    ],
    weight: 16,
  },
  {
    id: "vendor_terms",
    question: "Do you review an AI tool's data-retention and training-use terms before approving it for work use?",
    options: [
      { value: "good", label: "Yes, every time" },
      { value: "mid", label: "Sometimes" },
      { value: "bad", label: "No / don't know" },
    ],
    weight: 8,
  },
];

export interface SurveyFlag {
  questionId: string;
  title: string;
  severity: "high" | "medium";
  description: string;
}

const FLAG_COPY: Record<string, { title: string; description: string }> = {
  policy: {
    title: "No written AI usage policy",
    description: "Without a written policy, employees set their own rules for what's safe to share with AI tools — and you have nothing to show a regulator or client who asks.",
  },
  visibility: {
    title: "No visibility into AI tool usage",
    description: "You can't govern what you can't see. Most companies in this position have 5-10x more AI tools in active use than leadership is aware of.",
  },
  data_paste: {
    title: "Customer or company data has likely been exposed",
    description: "Once data is pasted into a public AI tool, you generally can't get it back or control how it's used in training — this is the single highest-severity shadow AI risk.",
  },
  discovery: {
    title: "No way to detect new AI tools being adopted",
    description: "Without SSO, CASB or expense-report review, new AI tools get adopted silently, one employee at a time, with no record anywhere.",
  },
  onboarding: {
    title: "AI usage expectations aren't set from day one",
    description: "New hires default to whatever AI habits they bring from their last job unless you tell them otherwise on day one.",
  },
  proof: {
    title: "Can't currently prove AI data handling to a regulator or client",
    description: "EU AI Act, SEC and FTC enforcement all expect you to be able to answer this — 'we don't really know' is treated the same as having no governance at all.",
  },
  vendor_terms: {
    title: "AI vendor terms aren't reviewed before approval",
    description: "Many AI tools' default terms allow your data to be used for model training. Skipping this review is how companies end up with their data inside someone else's model.",
  },
};

export function scoreShadowAISurvey(answers: Record<string, AnswerValue>): { score: number; flags: SurveyFlag[] } {
  let score = 100;
  const flags: SurveyFlag[] = [];

  for (const q of SHADOW_AI_QUESTIONS) {
    const answer = answers[q.id];
    if (!answer || answer === "good") continue;

    const deduction = answer === "bad" ? q.weight : q.weight / 2;
    score -= deduction;

    if (answer === "bad") {
      const copy = FLAG_COPY[q.id];
      flags.push({ questionId: q.id, title: copy.title, severity: "high", description: copy.description });
    } else {
      const copy = FLAG_COPY[q.id];
      flags.push({ questionId: q.id, title: copy.title, severity: "medium", description: copy.description });
    }
  }

  return { score: Math.max(0, Math.round(score)), flags };
}
