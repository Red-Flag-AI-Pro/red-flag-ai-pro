import type { Plan } from "@/types";

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 1,
  pro: Infinity,
  enterprise: Infinity,
};

export const PLAN_PRICES = {
  pro: {
    monthly: 49,
    label: "Pro",
    priceId: process.env.STRIPE_PRICE_PRO_ID!,
  },
  enterprise: {
    monthly: 199,
    label: "Enterprise",
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
};
