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
  "sms_marketing", "online_safety",
] as const;

const VALID_SEVERITIES: Severity[] = ["high", "medium", "low"];

function buildPrompt(content: string, flags: Flag[]): string {
  const flagList = flags
    .map((f, i) =>
      `[${i}] Category: ${f.category} | Severity: ${f.severity}\nFlagged text: "${f.text_excerpt ?? "N/A"}"\nCurrent generic suggestion: ${f.suggestion ?? "N/A"}`
    )
    .join("\n\n");

  return `You are a senior marketing compliance lawyer with expertise in FTC (US), ASA/CMA (UK), GDPR/DSA/EU AI Act (EU), ACCC (Australia), CASL/PIPEDA (Canada), LGPD (Brazil), DPDP Act (India), PDPA (Singapore), and UAE PDPL.

A compliance scanner has already identified the following violations in this marketing copy using keyword detection. Your job is to:

1. For EACH flagged item: replace the generic suggestion with a specific rewrite of the actual flagged sentence — give the exact words they should use instead.
2. Identify any ADDITIONAL violations the keyword scanner missed — implied claims, contextual deception, manufactured urgency, overall misleading framing — that a regulator would actually act on.

Be direct and specific. Do not repeat the generic rule — give the actual fix for this specific sentence.

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
      "specific_suggestion": "Replace with the exact compliant wording they should use for this specific sentence.",
      "enhanced_description": "One sentence explaining exactly why this specific phrasing is a problem under which specific law."
    }
  ],
  "additional_flags": [
    {
      "category": "one of: income_claim|urgency|scarcity|testimonial|guarantee|health_claim|legal_disclaimer|contract_contradiction|data_privacy|hidden_fees|fake_reviews|comparative_advertising|email_compliance|dark_patterns|ai_disclosure|ai_endorsement|automated_decisions|financial_promotion|greenwashing|subscription_trap|influencer_disclosure|sms_marketing|online_safety",
      "severity": "high|medium|low",
      "text_excerpt": "The exact sentence or phrase from the copy that is problematic",
      "flag_description": "Plain English explanation of the specific violation and which law it breaks",
      "suggestion": "The exact compliant rewrite for this specific sentence"
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
      model: "gpt-4o-mini",
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
    const enhanced = flags.map((flag, i) => {
      const improvement = parsed.enhanced.find((e) => e.index === i);
      if (!improvement) return flag;
      return {
        ...flag,
        suggestion: improvement.specific_suggestion || flag.suggestion,
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
