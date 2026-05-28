import type { Plan } from "@/types";

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 0,
  pro: 20,
  enterprise: Infinity,
  sentinel: Infinity,
};

// These 4 categories are exclusive to Sentinel. All other plans see the original 17.
export const SENTINEL_ONLY_CATEGORIES = [
  "financial_promotion",
  "greenwashing",
  "subscription_trap",
  "influencer_disclosure",
] as const;

export const PLAN_PRICES = {
  pro: {
    monthly: 29,
    label: "Pro",
    priceId: process.env.STRIPE_PRICE_PRO_ID!,
  },
  enterprise: {
    monthly: 199,
    label: "Growth",
    priceId: process.env.STRIPE_PRICE_ENTERPRISE_ID!,
  },
};

export const SEVERITY_DEDUCTIONS: Record<string, number> = {
  high: 20,
  medium: 10,
  low: 5,
};

export const FLAG_CATEGORY_LABELS: Record<string, string> = {
  income_claim: "Income Claim",
  urgency: "False Urgency",
  scarcity: "Artificial Scarcity",
  testimonial: "Unsubstantiated Testimonial",
  guarantee: "Misleading Guarantee",
  health_claim: "Health Claim",
  legal_disclaimer: "Missing Disclaimer",
  contract_contradiction: "Claim vs. Contract",
  data_privacy: "Data Privacy Violation",
  hidden_fees: "Hidden Fees / Drip Pricing",
  fake_reviews: "Fake Review Claim",
  comparative_advertising: "Unverified Comparison",
  email_compliance: "Email Marketing Consent",
  dark_patterns: "Dark Pattern",
  ai_disclosure: "AI Content — No Disclosure",
  ai_endorsement: "AI Endorsement Violation",
  automated_decisions: "Automated Decision Making",
  financial_promotion: "FCA Financial Promotion",
  greenwashing: "Greenwashing",
  subscription_trap: "Subscription Trap",
  influencer_disclosure: "Influencer Disclosure",
};
