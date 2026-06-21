import type { Plan } from "@/types";

// Bump this date whenever a risk category, jurisdiction mapping, or regulatory
// reference is added/updated, so the site can show a real "last reviewed" date
// instead of an unbacked "always up to date" claim.
export const REGULATORY_MAPPING_LAST_REVIEWED = "21 June 2026";

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 1,
  pro: 10,
  enterprise: Infinity,
  sentinel: Infinity,
};

// Category tiers: Pro/Free see 16, Growth adds 4 more (20), Sentinel sees all 29.
export const GROWTH_PLUS_CATEGORIES = [
  "comparative_advertising",
  "contract_contradiction",
  "automated_decisions",
  "online_safety",
] as const;

export const SENTINEL_ONLY_CATEGORIES = [
  "claims_policy_mismatch",
  "ai_endorsement",
  "financial_promotion",
  "greenwashing",
  "subscription_trap",
  "influencer_disclosure",
  "crypto_promotion",
  "country_of_origin",
  "accessibility",
] as const;

// Returns the categories excluded from results for a given plan.
export function getExcludedCategories(plan: Plan): readonly string[] {
  if (plan === "sentinel") return [];
  if (plan === "enterprise") return SENTINEL_ONLY_CATEGORIES;
  return [...GROWTH_PLUS_CATEGORIES, ...SENTINEL_ONLY_CATEGORIES];
}

export const AUDIT_PRICE = {
  amount: 97,
  label: "Done-For-You Audit",
  priceId: process.env.STRIPE_PRICE_AUDIT_ID!,
};

export const PLAN_PRICES = {
  pro: {
    monthly: 29,
    label: "Pro",
    priceId: process.env.STRIPE_PRICE_PRO_ID!,
  },
  enterprise: {
    monthly: 99,
    label: "Growth",
    priceId: process.env.STRIPE_PRICE_ENTERPRISE_ID!,
  },
  sentinel: {
    monthly: 499,
    label: "Sentinel",
    priceId: process.env.STRIPE_PRICE_SENTINEL_ID!,
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
  claims_policy_mismatch: "Claims vs. Policy Mismatch",
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
  sms_marketing: "SMS Marketing Consent",
  online_safety: "Online Safety / UGC",
  fake_discounts: "Fake / Reference Discount",
  cookie_consent: "Cookie Consent",
  crypto_promotion: "Crypto Promotion",
  country_of_origin: "Country of Origin Claim",
  accessibility: "Web Accessibility Risk",
};
