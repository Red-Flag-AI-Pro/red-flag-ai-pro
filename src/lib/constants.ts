import type { Plan } from "@/types";
// Type only import, erased at build time, so this adds no runtime dependency
// and cannot create a cycle. It exists purely so the jurisdiction list below
// fails to compile if it drifts from the analyzer's own definition.
import type { JurisdictionCode } from "@/lib/analyzer";

// Bump this date whenever a risk category, jurisdiction mapping, or regulatory
// reference is added/updated, so the site can show a real "last reviewed" date
// instead of an unbacked "always up to date" claim.
export const REGULATORY_MAPPING_LAST_REVIEWED = "26 July 2026";

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
//
// Repriced 199 -> 449 on 7 Aug 2026 as part of the Blue Ocean Offer decision:
// the buyer this is now aimed at (a regulated firm defending the record to a
// regulator or insurer) reads a sub-£200 price as evidence the instrument
// isn't serious. See brain project notes on the Blue Ocean Offer for the full
// reasoning; this was the recommended figure, not a range.
export const AUDIT_PRICE = {
  amount: 449,
  label: "Done-For-You Compliance & Governance Audit",
  priceId: process.env.STRIPE_PRICE_AUDIT_ID!,
};

// The upper tier above AUDIT_PRICE. Same inline price_data pattern, so no
// Stripe dashboard object is needed. Where the audit covers two stages of
// the governance lifecycle (compliance checking and the six dimension
// governance score), this covers all eight: the documents themselves are
// drafted and tailored per client rather than left to the free self-serve
// tools, which is what justifies the step up in both price and delivery time.
//
// Repriced 297 -> 1200 on 7 Aug 2026, same Blue Ocean Offer decision. The
// recommendation was a 1,200-1,500 range with no single figure chosen; 1,200
// was picked as the number to ship because it already creates real
// separation from the audit tier and a credible step toward Sentinel's
// roughly 5,000 anchor, and it's easier to raise later than to walk back.
export const PROGRAM_PRICE = {
  amount: 1200,
  label: "Full Governance Program (8 stage, done for you)",
};

// One-time report purchase, same inline price_data pattern as AUDIT_PRICE —
// no Stripe dashboard Product/Price needed, the displayed and charged amount
// share this single source of truth.
export const REPORT_PRICE = {
  amount: 4.99,
  label: "The Mystery of AI Governance (report)",
  slug: "mystery-of-ai-governance",
};

// Enforcement week pricing, extended from the founder's birthday sale:
// Article 50 transparency obligations bite on 2 Aug 2026 and the PLD lands in
// December, so both discounted prices hold until 8 Aug 2026. Existing
// subscriber grandfathering applies, same as any other price change, so sale
// signups keep their price for as long as they stay subscribed rather than
// reverting after the window closes.
export const SCANNER_SALE_ENDS = "2026-08-08T00:00:00+01:00";
export const GROWTH_SALE_ENDS = SCANNER_SALE_ENDS;

// Evaluated per call, never captured once at module load. A module level
// `const ... = new Date() < end` is fixed for the whole life of the process,
// so a serverless instance that cold started before the deadline would carry
// on selling at the sale price, and quoting it in the UI, until that instance
// happened to recycle. The window is small but it is silent and it is money,
// which is exactly the kind of thing nobody notices until reconciliation.
export function isScannerSaleActive(): boolean {
  return new Date() < new Date(SCANNER_SALE_ENDS);
}
export function isGrowthSaleActive(): boolean {
  return new Date() < new Date(GROWTH_SALE_ENDS);
}

// Single source of truth for plan prices. Upsell copy interpolates these
// so a future price change here cannot silently leave stale figures in the UI.
export const SCANNER_STANDARD_PRICE = 350;
export const SCANNER_SALE_PRICE = 149;
export const GROWTH_STANDARD_PRICE = 1200;
export const GROWTH_SALE_PRICE = 999;

// Getters, not plain values, so every read re-checks the clock. Call sites are
// unchanged (PLAN_PRICES.scanner.monthly still works exactly as before), but
// the sale can no longer be frozen open by a long lived process.
export const PLAN_PRICES = {
  scanner: {
    get monthly() {
      return isScannerSaleActive() ? SCANNER_SALE_PRICE : SCANNER_STANDARD_PRICE;
    },
    label: "Pro",
    get priceId() {
      return isScannerSaleActive()
        ? process.env.STRIPE_PRICE_SCANNER_SALE_ID!
        : process.env.STRIPE_PRICE_SCANNER_ID!;
    },
  },
  enterprise: {
    get monthly() {
      return isGrowthSaleActive() ? GROWTH_SALE_PRICE : GROWTH_STANDARD_PRICE;
    },
    label: "Growth",
    // Falls back to the standard price id until STRIPE_PRICE_ENTERPRISE_SALE_ID
    // exists in Vercel, so checkout never breaks; the fallback charges the old
    // £1,200, which is why the env var must be set before promoting £999.
    get priceId() {
      return isGrowthSaleActive() && process.env.STRIPE_PRICE_ENTERPRISE_SALE_ID
        ? process.env.STRIPE_PRICE_ENTERPRISE_SALE_ID
        : process.env.STRIPE_PRICE_ENTERPRISE_ID!;
    },
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

// ─── CANONICAL PUBLIC FIGURES ────────────────────────────────────────────────
// Every number that appears in marketing copy is derived here, once, from the
// data it actually describes. Before this existed the same facts were retyped
// page by page and drifted apart: "ten jurisdictions" survived in three places
// for weeks after China took the real count to eleven, and the LinkedIn profile
// still said ten after that.
//
// That matters more here than at most companies. The whole pitch is "do not
// take my word for it, check". A prospect who finds our own pages disagreeing
// about how many jurisdictions we cover has disproved the central claim using
// nothing but our own marketing. So: import these, never retype them.

// The canonical jurisdiction list.
export const JURISDICTIONS = [
  "us", "gb", "eu", "au", "ca", "br", "in", "sg", "ae", "ng", "cn",
] as const satisfies readonly JurisdictionCode[];

// `satisfies` above only proves every entry IS a valid code. It does not prove
// the list covers them all, so on its own it would happily let someone add a
// twelfth jurisdiction to the analyzer and forget this file, which is exactly
// the drift that produced "ten jurisdictions" in live copy for weeks.
//
// This line closes that. If any JurisdictionCode is missing from JURISDICTIONS,
// MissingJurisdictions resolves to those codes instead of never, and the
// assignment below fails to compile with the offending codes named in the
// error. It costs nothing at runtime, it is purely a type level assertion.
type MissingJurisdictions = Exclude<JurisdictionCode, (typeof JURISDICTIONS)[number]>;
const _allJurisdictionsListed: [MissingJurisdictions] extends [never]
  ? true
  : ["JURISDICTIONS is missing these codes", MissingJurisdictions] = true;
void _allJurisdictionsListed;

export const JURISDICTION_COUNT = JURISDICTIONS.length;

// Derived from the labels themselves, so adding a risk category updates every
// piece of copy on the site automatically.
export const RISK_CATEGORY_COUNT = Object.keys(FLAG_CATEGORY_LABELS).length;

export const GOVERNANCE_DIMENSION_COUNT = 6;

// Spelled out forms, because prose reads better with words mid sentence and
// figures read better in headlines. Both come from the same number.
const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];
export function numberWord(n: number): string {
  if (n <= 20) return NUMBER_WORDS[n];
  if (n < 100) {
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty",
      "seventy", "eighty", "ninety"][Math.floor(n / 10)];
    const unit = n % 10;
    return unit ? `${tens} ${NUMBER_WORDS[unit]}` : tens;
  }
  return String(n);
}

export const JURISDICTION_COUNT_WORD = numberWord(JURISDICTION_COUNT);
export const RISK_CATEGORY_COUNT_WORD = numberWord(RISK_CATEGORY_COUNT);
export const GOVERNANCE_DIMENSION_COUNT_WORD = numberWord(GOVERNANCE_DIMENSION_COUNT);
