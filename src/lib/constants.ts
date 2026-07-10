import type { Plan } from "@/types";

// Bump this date whenever a risk category, jurisdiction mapping, or regulatory
// reference is added/updated, so the site can show a real "last reviewed" date
// instead of an unbacked "always up to date" claim.
export const REGULATORY_MAPPING_LAST_REVIEWED = "21 June 2026";

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 1,
  scanner: 5,
  enterprise: 30,
  sentinel: Infinity,
};

// Category tiers: Free sees 16. Every paid plan (Pro/Growth/Sentinel) sees
// all 30 — paywalling individual categories felt punitive ("pay more to see
// what's wrong with your own ad"). Paid tiers are now differentiated by scan
// volume and governance features, not category count.
export const FREE_ONLY_EXCLUDED_CATEGORIES = [
  "comparative_advertising",
  "contract_contradiction",
  "automated_decisions",
  "online_safety",
  "age_assurance",
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
  if (plan === "free") return FREE_ONLY_EXCLUDED_CATEGORIES;
  return [];
}

// Price for the done-for-you audit. Instant checkout was re-enabled 10 Jul
// 2026: /api/stripe/checkout charges this amount inline via price_data, so the
// displayed price and the charged price share this single source of truth.
// The /audit request form remains as the talk-first path. priceId points at
// the legacy pre-4-Jul £149 Stripe object and is no longer used by checkout.
export const AUDIT_PRICE = {
  amount: 179,
  label: "Done-For-You Compliance & Governance Audit",
  priceId: process.env.STRIPE_PRICE_AUDIT_ID!,
};

// Founder's birthday sale: Pro at £149/mo for anyone who signs up before
// 1 Aug 2026. Existing-subscriber-grandfathering policy applies, same as any
// other price change, so sale signups keep £149/mo for as long as they stay
// subscribed rather than reverting after the sale window closes.
export const SCANNER_SALE_ENDS = "2026-08-01T00:00:00+01:00";
export const SCANNER_SALE_ACTIVE = new Date() < new Date(SCANNER_SALE_ENDS);

// Single source of truth for the Pro price. Upsell copy interpolates these
// so a future price change here cannot silently leave stale figures in the UI.
export const SCANNER_STANDARD_PRICE = 350;
export const SCANNER_SALE_PRICE = 149;

export const PLAN_PRICES = {
  scanner: {
    monthly: SCANNER_SALE_ACTIVE ? SCANNER_SALE_PRICE : SCANNER_STANDARD_PRICE,
    label: "Pro",
    priceId: SCANNER_SALE_ACTIVE
      ? process.env.STRIPE_PRICE_SCANNER_SALE_ID!
      : process.env.STRIPE_PRICE_SCANNER_ID!,
  },
  enterprise: {
    monthly: 1200,
    label: "Growth",
    priceId: process.env.STRIPE_PRICE_ENTERPRISE_ID!,
  },
  sentinel: {
    monthly: 5000,
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
  age_assurance: "Age Assurance / Under-16 Safety",
};
