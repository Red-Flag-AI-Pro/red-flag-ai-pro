/**
 * AI Enhancement Layer
 *
 * Runs after the keyword engine. Takes the full copy and the flags already
 * found, sends one batched call to GPT-4o-mini, and gets back:
 *   1. Specific rewrites for every flagged sentence (replaces generic suggestions)
 *   2. Any additional violations the keywords missed (implied claims, context, tone)
 *
 * Falls back silently to the original keyword results if the API is unavailable,
 * so the scanner never breaks — it just returns the keyword-only version.
 */

import OpenAI from "openai";
import type { AnalysisResult, Severity } from "@/types";
import type { JurisdictionCode } from "@/lib/analyzer";

type Flag = AnalysisResult["flags"][number];

interface EnhancedFlag {
  index: number;
  specific_suggestion: string;
  enhanced_description: string;
}

interface AdditionalFlag {
  category: string;
  severity: Severity;
  text_excerpt: string;
  flag_description: string;
  suggestion: string;
  out_of_scope?: boolean;
}

interface AIResponse {
  enhanced: EnhancedFlag[];
  additional_flags: AdditionalFlag[];
}

const VALID_CATEGORIES = [
  "income_claim", "urgency", "scarcity", "testimonial", "guarantee",
  "health_claim", "legal_disclaimer", "contract_contradiction", "data_privacy",
  "hidden_fees", "fake_reviews", "comparative_advertising", "email_compliance",
  "dark_patterns", "ai_disclosure", "ai_endorsement", "automated_decisions",
  "financial_promotion", "greenwashing", "subscription_trap", "influencer_disclosure",
  "sms_marketing", "online_safety", "claims_policy_mismatch", "fake_discounts",
  "cookie_consent", "crypto_promotion", "country_of_origin",
] as const;

const VALID_SEVERITIES: Severity[] = ["high", "medium", "low"];

// One block per jurisdiction, keyed the same way analyzeContent's own
// jurisdiction filter is. A scan that narrows to one country's law at the
// keyword layer narrows to the same set here — this is what closes the gap
// Brad Wolfe flagged, 8 Aug 2026: citing law from countries a scan was never
// scoped to isn't a second test, it's an unscoped one wearing the first
// test's flags.
const JURISDICTION_LAW: Record<JurisdictionCode, string> = {
  us: "US: FTC Act Section 5, FTC Endorsement Guides, FTC Income Disclosure Rules, TCPA, CAN-SPAM Act, FDA regulations",
  gb: "UK: ASA CAP Code (Rules 3.1, 3.7, 7.1), CMA Consumer Protection Regulations, FCA Financial Promotions Order, ICO PECR, UK GDPR",
  eu: "EU: GDPR Articles 5/13/14, EU DSA Articles 9/25/26, EU AI Act Articles 50/52, UCPD Directive, EU Green Claims Directive",
  au: "Australia: ACCC Australian Consumer Law Sections 18/29/33, TGA Therapeutic Goods Advertising Code",
  ca: "Canada: CASL Sections 6/7, PIPEDA, CRTC regulations, Quebec Law 25",
  br: "Brazil: LGPD Articles 7/9/46, PROCON consumer protection",
  in: "India: DPDP Act 2023, ASCI Advertising Guidelines",
  sg: "Singapore: PDPA Sections 13/20, ASAS advertising standards",
  ae: "UAE: PDPL 2022 Articles 5/7, UAE Consumer Protection Law",
  ng: "Nigeria: NDPR 2019, NITDA guidelines, FCCPC consumer protection, NAFDAC health advertising",
  cn: "China: PRC Advertising Law (Article 9 absolute-terms ban, Articles 16-19 health/medical ads, Articles 24-25 education and investment ads, Article 38 endorser liability, Article 40 ads to minors), Anti-Unfair Competition Law Article 8, PIPL Articles 13/24, SAMR Internet Advertising Measures 2023 (mandatory ad labeling), CAC AI Content Labeling Measures (in force Sep 2025), PRC Price Law (fictitious original prices), Consumer Protection Law Implementing Regulations 2024 (auto-renewal notices), PBOC 2021 crypto promotion prohibition",
};

const ALL_JURISDICTIONS = Object.keys(JURISDICTION_LAW) as JurisdictionCode[];

function buildPrompt(content: string, flags: Flag[], jurisdictions: JurisdictionCode[]): string {
  const flagList = flags
    .map((f, i) =>
      `[FLAG ${i}]\nCategory: ${f.category} | Severity: ${f.severity}\nFlagged sentence: "${f.text_excerpt ?? "N/A"}"\nRewrite only this sentence. Your response for index ${i} must contain a specific_suggestion that is a compliant rewrite of exactly: "${f.text_excerpt ?? "N/A"}"`
    )
    .join("\n\n");

  // Full reach always available — the scope narrows what counts as an IN
  // SCOPE citation, it never removes a jurisdiction from view entirely.
  // Brad Wolfe, 8 Aug 2026: scoping fixed the measurement problem (comparing
  // this layer against a back-test scored on one jurisdiction) but a first
  // pass solved it by suppressing genuine out-of-scope findings, a real
  // product regression, not the same fix as the measurement one. A UK
  // advertiser reaching an EU audience has real EU exposure; scoping should
  // label that, not discard it. "Suppression loses information somebody
  // paid for. Labelling does not."
  const scopedJurisdictions = jurisdictions.length > 0 ? jurisdictions : ALL_JURISDICTIONS;
  const scopedLawBlock = scopedJurisdictions.map((j) => JURISDICTION_LAW[j]).join("\n");
  const outOfScopeJurisdictions = ALL_JURISDICTIONS.filter((j) => !scopedJurisdictions.includes(j));
  const outOfScopeLawBlock = outOfScopeJurisdictions.map((j) => JURISDICTION_LAW[j]).join("\n");

  const scopeNote =
    jurisdictions.length > 0
      ? `This scan is scoped to ${scopedJurisdictions.length} jurisdiction${scopedJurisdictions.length === 1 ? "" : "s"}:\n\n${scopedLawBlock}\n\nFor EACH flagged item, cite only from the scoped list above — that comparison has to stay clean.\n\nFor ADDITIONAL violations you identify: if the applicable law is in the scoped list above, report it normally. If a genuine, checkable violation exists but the law that actually applies falls OUTSIDE the scope (listed below), still report it as an additional_flag — never discard a real finding — but set out_of_scope to true and start the flag_description with "Also observed outside the jurisdictions you selected: " before citing the specific out-of-scope law.\n\nOut-of-scope jurisdictions, only cite these when out_of_scope is true and a genuine violation exists there:\n\n${outOfScopeLawBlock}`
      : `No jurisdiction scope was set, so all of these apply:\n\n${scopedLawBlock}`;

  return `You are a senior marketing compliance lawyer with expertise across these jurisdictions and their specific rules:

${scopedLawBlock}
${outOfScopeJurisdictions.length > 0 ? `\n${outOfScopeLawBlock}` : ""}

${scopeNote}

A compliance scanner has already identified the following violations in this marketing copy. Your job is to:

1. For EACH flagged item: write a specific rewrite of the exact flagged sentence AND cite every applicable law from the scoped jurisdictions. If a phrase breaks more than one of them, cite all that apply.
2. Identify ADDITIONAL violations the keyword scanner missed — implied claims, contextual deception, manufactured urgency, misleading framing — that a regulator would actually act on, in scope or out of it, per the labelling rule above.

CRITICAL: Every enhanced_description for an existing flag MUST cite specific law from the scoped jurisdictions only, never generic ("local law") when a named statute or code applies. Additional flags may cite an out-of-scope law ONLY when out_of_scope is set true and the flag_description is prefixed as instructed above.

PRECISION OVER RECALL — false positives destroy trust with exactly the users who can tell the difference (lawyers, compliance officers, regulators). Before adding ANY additional_flag, confirm the sentence contains a concrete, actionable claim a regulator could actually act on — not generic marketing language. Specifically:

- income_claim requires a claim about the READER's own potential earnings or financial outcome (e.g. "you'll earn £10k/month"). Do NOT flag a company describing its own track record, experience, or the value it has delivered to past clients ("$10M+ in client value created", "clients are the beneficiaries of our experience") — that is a credibility statement, not an income claim.
- data_privacy requires the copy to describe how the AUTHOR'S OWN business actually collects, stores, or processes the reader's personal data. Do NOT flag a company simply describing that it offers privacy/data-protection ADVISORY SERVICES to clients ("we help organisations manage data risk") — that is a service description, not a data processing claim.
- comparative_advertising requires a comparison anchored to a specific, checkable benchmark, statistic, or named competitor. Do NOT flag vague, unquantified positioning language ("senior experience without big firm overheads", "better value than the alternative") — that is ordinary puffery regulators do not act on.
- Apply the same standard to every other category: only flag if a reasonable compliance officer would treat the EXACT sentence as enforceable risk on its own. Mission statements, service descriptions, and qualitative credibility claims are not violations just because they touch a regulated topic (privacy, money, comparisons) in passing.
- When genuinely unsure whether a sentence crosses the line, do not flag it. An empty additional_flags array is a correct and expected result for clean, professionally written copy.

---
MARKETING COPY:
${content.slice(0, 4000)}
---

EXISTING FLAGS:
${flagList}

---
Respond ONLY with valid JSON matching this exact structure. No markdown, no explanation outside the JSON:
{
  "enhanced": [
    {
      "index": 0,
      "specific_suggestion": "The exact rewritten sentence the user should use instead — specific to their actual copy, not generic advice.",
      "enhanced_description": "This specific phrase breaks [exact law names e.g. FTC Act Section 5, ASA CAP Code Rule 3.7, GDPR Article 13] because [specific reason]. A regulator would treat this as [specific enforcement risk]."
    }
  ],
  "additional_flags": [
    {
      "category": "one of: income_claim|urgency|scarcity|testimonial|guarantee|health_claim|legal_disclaimer|contract_contradiction|data_privacy|hidden_fees|fake_reviews|comparative_advertising|email_compliance|dark_patterns|ai_disclosure|ai_endorsement|automated_decisions|financial_promotion|greenwashing|subscription_trap|influencer_disclosure|sms_marketing|online_safety|claims_policy_mismatch|fake_discounts|cookie_consent|crypto_promotion|country_of_origin",
      "severity": "high|medium|low",
      "text_excerpt": "The exact sentence or phrase from the copy that is problematic",
      "flag_description": "In scope: cite [exact law names from the scoped list]. Out of scope (out_of_scope: true): start with 'Also observed outside the jurisdictions you selected: ' then cite the specific out-of-scope law. Either way: [specific reason]. A regulator would treat this as [specific enforcement risk].",
      "suggestion": "The exact rewritten sentence the user should use instead — specific to their actual copy, not generic advice.",
      "out_of_scope": "true only if the law that actually applies here is outside the scoped jurisdiction list, false otherwise"
    }
  ]
}

Only include additional_flags if you find genuine violations not already caught. If none, return an empty array.`;
}

function isValidResponse(data: unknown): data is AIResponse {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.enhanced) || !Array.isArray(d.additional_flags)) return false;
  return true;
}

// Enforced in code, not just requested in the prompt — the model's own
// prefix is a request, this is the guarantee. Never rely on wording alone
// for something a customer's trust in the scope depends on.
const OUT_OF_SCOPE_PREFIX = "Also observed outside the jurisdictions you selected: ";

function sanitiseAdditional(raw: AdditionalFlag[]): Flag[] {
  return raw
    .filter(
      (f) =>
        f.text_excerpt &&
        f.flag_description &&
        f.suggestion &&
        VALID_SEVERITIES.includes(f.severity) &&
        VALID_CATEGORIES.includes(f.category as typeof VALID_CATEGORIES[number])
    )
    .map((f) => {
      const alreadyLabelled = f.flag_description.startsWith(OUT_OF_SCOPE_PREFIX);
      const flag_description = f.out_of_scope && !alreadyLabelled
        ? `${OUT_OF_SCOPE_PREFIX}${f.flag_description}`
        : f.flag_description;
      return {
        category: f.category,
        severity: f.severity,
        text_excerpt: f.text_excerpt,
        flag_description,
        suggestion: f.suggestion,
        // Moe Hachem, LinkedIn 9 Aug 2026: separate confirmed material from
        // inference. This flag has no keyword rule behind it at all, it's
        // the AI's own addition — the one case in this file that genuinely
        // is inference, not a rewritten keyword match.
        source: "ai" as const,
      };
    });
}

export async function enhanceWithAI(
  content: string,
  flags: Flag[],
  jurisdictions: JurisdictionCode[] = []
): Promise<Flag[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  // No key configured — return original flags unchanged
  if (!apiKey) return flags;

  try {
    const client = new OpenAI({ apiKey });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: buildPrompt(content, flags, jurisdictions),
        },
      ],
    });

    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) return flags;

    // Strip markdown code fences if model wraps in ```json ... ```
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return flags;
    }

    if (!isValidResponse(parsed)) return flags;

    // Apply specific suggestions back onto the keyword flags
    // Only apply if the suggestion is meaningfully different from the flagged text
    const enhanced = flags.map((flag, i) => {
      const improvement = parsed.enhanced.find((e) => e.index === i);
      if (!improvement) return flag;

      const suggestion = improvement.specific_suggestion?.trim();
      const original = flag.text_excerpt?.trim() ?? "";

      // Reject the AI suggestion if it suspiciously matches a different flag's text
      const matchesAnotherFlag = flags.some(
        (other, j) => j !== i && other.text_excerpt && suggestion?.includes(other.text_excerpt.slice(0, 30))
      );
      if (matchesAnotherFlag) return flag;

      return {
        ...flag,
        suggestion: suggestion || flag.suggestion,
        flag_description: improvement.enhanced_description || flag.flag_description,
      };
    });

    // Append any additional AI-detected flags
    const additional = sanitiseAdditional(parsed.additional_flags);

    return [...enhanced, ...additional];
  } catch {
    // Any failure — network, rate limit, parse error — falls back silently
    return flags;
  }
}
