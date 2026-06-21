export type AnswerValue = "good" | "mid" | "bad";

export interface SurveyQuestion {
  id: string;
  question: string;
  help?: string;
  options: { value: AnswerValue; label: string }[];
  weight: number; // points deducted from 100 if "bad", weight/2 if "mid"
}

export const AI_VISIBILITY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "review_presence",
    question: "Does your business have a profile on at least one major review platform (Trustpilot, Google Reviews, G2, Capterra)?",
    options: [
      { value: "good", label: "Yes, on multiple platforms" },
      { value: "mid", label: "Yes, on one" },
      { value: "bad", label: "No" },
    ],
    weight: 16,
  },
  {
    id: "review_volume",
    question: "Roughly how many total reviews do you have across all platforms?",
    options: [
      { value: "good", label: "50+" },
      { value: "mid", label: "1-49" },
      { value: "bad", label: "0" },
    ],
    weight: 14,
  },
  {
    id: "review_recency",
    question: "When was your most recent review left?",
    options: [
      { value: "good", label: "Within the last month" },
      { value: "mid", label: "Within the last 6 months" },
      { value: "bad", label: "Longer than 6 months ago / never" },
    ],
    weight: 14,
  },
  {
    id: "cross_platform",
    question: "Is your business mentioned outside platforms you control — Reddit threads, forums, category publications, comparison sites?",
    options: [
      { value: "good", label: "Yes, in several places" },
      { value: "mid", label: "A little, here and there" },
      { value: "bad", label: "Not that I know of" },
    ],
    weight: 14,
  },
  {
    id: "sentiment",
    question: "If you read your recent reviews, would you say the overall tone is positive?",
    options: [
      { value: "good", label: "Mostly positive" },
      { value: "mid", label: "Mixed" },
      { value: "bad", label: "Mostly negative, or no reviews to judge" },
    ],
    weight: 14,
  },
  {
    id: "structured_data",
    question: "Does your website use structured data / schema markup (Organization, Product, Review schema)?",
    help: "This is what lets AI assistants and search engines reliably parse who you are and what you offer.",
    options: [
      { value: "good", label: "Yes" },
      { value: "mid", label: "Not sure" },
      { value: "bad", label: "No" },
    ],
    weight: 14,
  },
  {
    id: "brand_consistency",
    question: "Is your business name, description and category consistent across your website, listings and social profiles?",
    options: [
      { value: "good", label: "Yes, consistent everywhere" },
      { value: "mid", label: "Mostly, with a few inconsistencies" },
      { value: "bad", label: "No / never checked" },
    ],
    weight: 14,
  },
];

export interface SurveyFlag {
  questionId: string;
  title: string;
  severity: "high" | "medium";
  description: string;
}

const FLAG_COPY: Record<string, { title: string; description: string }> = {
  review_presence: {
    title: "No review platform presence",
    description: "AI assistants weight third-party review platforms heavily when deciding what to recommend. With zero presence, there's nothing for them to find.",
  },
  review_volume: {
    title: "Low review volume",
    description: "A handful of reviews reads as low-confidence signal to both AI assistants and customers comparing options. Volume matters as much as rating.",
  },
  review_recency: {
    title: "Reviews are stale or absent",
    description: "Recency signals that a business is still active and trusted. Old or missing reviews can make AI assistants treat your listing as outdated or defunct.",
  },
  cross_platform: {
    title: "No cross-platform mentions",
    description: "AI assistants cross-reference multiple sources before recommending a brand. If you only exist on your own website, there's no independent confirmation to draw on.",
  },
  sentiment: {
    title: "Negative or unclear sentiment",
    description: "Negative sentiment in recent reviews can suppress how confidently an AI assistant recommends you, even if older reviews were positive.",
  },
  structured_data: {
    title: "Missing structured data / schema markup",
    description: "Without Organization, Product or Review schema, AI crawlers have to guess at what your business does instead of reading it directly — a real, fixable technical gap.",
  },
  brand_consistency: {
    title: "Inconsistent brand presence",
    description: "Mismatched names, descriptions or categories across platforms make it harder for AI assistants to confirm they're looking at the same business in multiple sources.",
  },
};

export function scoreAIVisibilitySurvey(answers: Record<string, AnswerValue>): { score: number; flags: SurveyFlag[] } {
  let score = 100;
  const flags: SurveyFlag[] = [];

  for (const q of AI_VISIBILITY_QUESTIONS) {
    const answer = answers[q.id];
    if (!answer || answer === "good") continue;

    const deduction = answer === "bad" ? q.weight : q.weight / 2;
    score -= deduction;

    const copy = FLAG_COPY[q.id];
    flags.push({
      questionId: q.id,
      title: copy.title,
      severity: answer === "bad" ? "high" : "medium",
      description: copy.description,
    });
  }

  return { score: Math.max(0, Math.round(score)), flags };
}
