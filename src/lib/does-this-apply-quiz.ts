import type { QuizWizardQuestion } from "@/components/tools/QuizWizard";

export type AnswerValue = "a" | "b" | "c" | "d";

export const APPLIES_QUESTIONS: QuizWizardQuestion<AnswerValue>[] = [
  {
    id: "marketing",
    question: "Do you run ads, funnels, sales pages or social posts to sell something?",
    options: [
      { value: "a", label: "Yes, regularly" },
      { value: "b", label: "Sometimes, a few campaigns a year" },
      { value: "c", label: "Rarely, mostly word of mouth" },
      { value: "d", label: "No marketing at all right now" },
    ],
  },
  {
    id: "claims",
    question: "Does your marketing make any income, health or results claims?",
    help: "\"Lose weight fast\", \"earn £5k a month\", \"clinically proven\", guarantees, before/after photos.",
    options: [
      { value: "a", label: "Yes, regularly" },
      { value: "b", label: "Occasionally, in some campaigns" },
      { value: "c", label: "Not that I'm aware of" },
      { value: "d", label: "No, we stick to plain facts" },
    ],
  },
  {
    id: "ai_use",
    question: "Does anyone at your business use AI tools for work?",
    help: "ChatGPT, an AI chatbot on your site, AI generated content or images, AI used in hiring or screening customers.",
    options: [
      { value: "a", label: "Yes, it's built into how we operate" },
      { value: "b", label: "Yes, a few people use it informally" },
      { value: "c", label: "Not that I know of" },
      { value: "d", label: "Definitely not, we've checked" },
    ],
  },
  {
    id: "customers",
    question: "Where are your customers based?",
    options: [
      { value: "a", label: "Multiple countries, including the EU or US" },
      { value: "b", label: "One country outside where I'm based" },
      { value: "c", label: "Just my home country" },
      { value: "d", label: "I don't have customers yet" },
    ],
  },
  {
    id: "signoff",
    question: "Before marketing or AI use goes live, does anyone check it first?",
    options: [
      { value: "a", label: "No, it's just me, whatever I write goes out" },
      { value: "b", label: "Whoever's free glances at it" },
      { value: "c", label: "Yes, one named person reviews it" },
      { value: "d", label: "Yes, there's a documented sign off process" },
    ],
  },
];

export interface ApplyVerdict {
  level: "applies" | "watch" | "not_yet";
  headline: string;
  explanation: string;
  reasons: string[];
}

const WEIGHTS: Record<string, Record<AnswerValue, number>> = {
  marketing: { a: 3, b: 2, c: 1, d: 0 },
  claims: { a: 3, b: 2, c: 1, d: 0 },
  ai_use: { a: 3, b: 2, c: 0, d: 0 },
  customers: { a: 3, b: 2, c: 1, d: 0 },
  signoff: { a: 2, b: 1, c: 0, d: 0 },
};

export function scoreApplyQuiz(answers: Record<string, AnswerValue>): ApplyVerdict {
  let score = 0;
  for (const q of APPLIES_QUESTIONS) {
    const a = answers[q.id];
    if (a) score += WEIGHTS[q.id][a];
  }

  const reasons: string[] = [];
  if (answers.marketing === "a" || answers.marketing === "b") reasons.push("You run marketing that regulators (ASA, FTC, CMA and equivalents) actively check.");
  if (answers.claims === "a" || answers.claims === "b") reasons.push("Income, health or results claims are one of the most commonly enforced categories.");
  if (answers.ai_use === "a" || answers.ai_use === "b") reasons.push("AI use in a business, even informal, is now covered by the EU AI Act if any customer is in the EU.");
  if (answers.customers === "a") reasons.push("Selling into multiple countries usually means multiple regulators, not one.");
  if (answers.signoff === "a" || answers.signoff === "b") reasons.push("Nothing gets checked before it goes live, so if something's wrong, nobody catches it until a complaint does.");

  if (score >= 9) {
    return {
      level: "applies",
      headline: "Yes. This applies to you now.",
      explanation: "On what you've told us, you're already inside the areas regulators check most: live marketing claims, AI use, and more than one jurisdiction. That doesn't mean anything is wrong today. It means the parts of your business regulators actually look at are already running.",
      reasons,
    };
  }

  if (score >= 4) {
    return {
      level: "watch",
      headline: "Not fully exposed yet, but worth watching.",
      explanation: "Some of the areas that draw regulatory attention exist in your business, just not all of them at once. This is the easiest point to build good habits, before volume or complexity picks up and catching problems gets harder.",
      reasons,
    };
  }

  return {
    level: "not_yet",
    headline: "Genuinely, probably not you. Not yet.",
    explanation: "Based on what you've told us, you don't have much live marketing, you're not using AI in ways that are currently covered, and you're not selling across borders. That can change fast, so it's worth a two minute recheck if any of that shifts, but there's no reason to worry about this today.",
    reasons,
  };
}
