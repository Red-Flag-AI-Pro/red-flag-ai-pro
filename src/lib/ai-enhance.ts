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

function buildPrompt(content: string, flags: Flag[]): string {
  const flagList = flags
    .map((f, i) =>
      `[FLAG ${i}]\nCategory: ${f.category} | Severity: ${f.severity}\nFlagged sentence: "${f.text_excerpt ?? "N/A"}"\nRewrite only this sentence. Your response for index ${i} must contain a specific_suggestion that is a compliant rewrite of exactly: "${f.text_excerpt ?? "N/A"}"`
    )
    .join("\n\n");

  return `You are a senior marketing compliance lawyer with expertise across ALL of these jurisdictions and their specific rules:

US: FTC Act Section 5, FTC Endorsement Guides, FTC Income Disclosure Rules, TCPA, CAN-SPAM Act, FDA regulations
UK: ASA CAP Code (Rules 3.1, 3.7, 7.1), CMA Consumer Protection Regulations, FCA Financial Promotions Order, ICO PECR, UK GDPR
EU: GDPR Articles 5/13/14, EU DSA Articles 9/25/26, EU AI Act Articles 50/52, UCPD Directive, EU Green Claims Directive
Australia: ACCC Australian Consumer Law Sections 18/29/33, TGA Therapeutic Goods Advertising Code
Canada: CASL Sections 6/7, PIPEDA, CRTC regulations, Quebec Law 25
Brazil: LGPD Articles 7/9/46, PROCON consumer protection
India: DPDP Act 2023, ASCI Advertising Guidelines
Singapore: PDPA Sections 13/20, ASAS advertising standards
UAE: PDPL 2022 Articles 5/7, UAE Consumer Protection Law

A compliance scanner has already identified the following violations in this marketing copy. Your job is to:

1. For EACH flagged item: write a specific rewrite of the exact flagged sentence AND cite every applicable law across ALL relevant jurisdictions — not just FTC. If a phrase breaks UK, EU and Australian law too, cite all of them.
2. Identify ADDITIONAL violations the keyword scanner missed — implied claims, contextual deception, manufactured urgency, misleading framing — that a regulator would actually act on.

CRITICAL: Every enhanced_description MUST cite laws from multiple jurisdictions where applicable. Do not default to FTC only. A UK user needs ASA citations. An EU user needs GDPR/DSA citations. Cite all that apply.

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
      "flag_description": "This phrase breaks [exact law names] because [specific reason]. A regulator would treat this as [specific enforcement risk].",
      "suggestion": "The exact rewritten sentence the user should use instead — specific to their actual copy, not generic advice."
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
    .map((f) => ({
      category: f.category,
      severity: f.severity,
      text_excerpt: f.text_excerpt,
      flag_description: f.flag_description,
      suggestion: f.suggestion,
    }));
}

export async function enhanceWithAI(
  content: string,
  flags: Flag[]
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
          content: buildPrompt(content, flags),
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
