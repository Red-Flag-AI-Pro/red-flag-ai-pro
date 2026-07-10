/**
 * Governance Report AI Enhancement Layer
 *
 * The governance red flags produced by generateRedFlags() are keyed to score
 * bands, so every low scorer gets the same boilerplate paragraph regardless of
 * what they actually answered. This layer runs after that generation, sends the
 * respondent's real answers + dimension scores to the model, and gets back a
 * tailored description and recommendation for every flag that speaks to THIS
 * organisation's specific situation, grounded in verified statutory ceilings.
 *
 * Mirrors ai-enhance.ts: one batched call, silent fallback to the original
 * template text if the key is missing or anything fails, so the assessment
 * never breaks. Gating is applied by the caller AFTER this runs, so tailoring
 * the text changes nothing about who sees what.
 */

import OpenAI from "openai";
import type { RedFlag, Answer, Dimension } from "@/lib/governance-audit";
import { GOVERNANCE_DIMENSIONS, ALL_QUESTIONS } from "@/lib/governance-audit";

interface EnhancedFlag {
  index: number;
  enhanced_description: string;
  enhanced_recommendation: string;
}

interface AIResponse {
  enhanced: EnhancedFlag[];
}

// Verified maximum statutory ceilings, from the Red Flag penalty caps reference
// (verified 2026-06-20). These are given to the model as ground truth so any
// figure it cites is real, not invented. Framed as MAXIMUM statutory exposure —
// a potential ceiling, never a prediction of an actual fine.
const PENALTY_REFERENCE = `VERIFIED MAXIMUM STATUTORY CEILINGS (use ONLY these figures, never invent one; always frame as a maximum potential ceiling, never a predicted fine):
- EU AI Act (Art 99): up to EUR 35M or 7% of global annual turnover, whichever is higher
- EU GDPR: up to EUR 20M or 4% of global turnover, whichever is higher
- UK GDPR / DPA 2018: up to GBP 17.5M or 4% of global turnover, whichever is higher
- US FTC Act Section 5: up to USD 53,088 PER violation (aggregates across affected consumers)
- Australia Privacy Act: greatest of AUD 50M, three times the benefit, or 30% of adjusted turnover
- Canada PIPEDA: currently only up to CAD 100,000 (do not overstate this one)
- Brazil LGPD: 2% of Brazil revenue, capped at BRL 50M per infraction
- India DPDP Act 2023: up to INR 250 crore per breach
- Singapore PDPA: up to 10% of Singapore turnover or SGD 1M, whichever is higher
- UAE PDPL: AED 50,000 to AED 5M`;

function answersSummary(answers: Answer[]): string {
  return answers
    .map((a) => {
      const q = ALL_QUESTIONS.find((question) => question.id === a.questionId);
      const questionText = q ? q.question : a.questionId;
      const dim = GOVERNANCE_DIMENSIONS[a.dimension]?.title ?? a.dimension;
      return `- [${dim}] ${questionText}\n  Their answer: "${a.value}" (risk weight ${a.riskPoints}/3)`;
    })
    .join("\n");
}

function scoresSummary(
  dimensionScores: Record<Dimension, number>,
  overallScore: number,
  riskLevel: string
): string {
  const lines = (Object.entries(dimensionScores) as [Dimension, number][])
    .map(([dim, score]) => `- ${GOVERNANCE_DIMENSIONS[dim]?.title ?? dim}: ${score}/100`)
    .join("\n");
  return `Overall maturity index: ${overallScore}/100 (${riskLevel})\n${lines}`;
}

function buildPrompt(
  redFlags: RedFlag[],
  answers: Answer[],
  dimensionScores: Record<Dimension, number>,
  overallScore: number,
  riskLevel: string
): string {
  const flagList = redFlags
    .map(
      (f, i) =>
        `[FLAG ${i}]\nDimension: ${GOVERNANCE_DIMENSIONS[f.dimension]?.title ?? f.dimension} | Severity: ${f.severity}\nTitle: ${f.title}\nGeneric template description: "${f.description}"\nGeneric template recommendation: "${f.recommendation}"`
    )
    .join("\n\n");

  return `You are a senior AI governance and regulatory risk advisor writing a governance maturity assessment for a specific organisation. You have their actual answers to a governance questionnaire below. A template engine has already produced generic findings keyed only to score bands. Your job is to rewrite each finding so it is SPECIFIC to THIS organisation, using what they actually told you.

THIS ORGANISATION'S SCORES:
${scoresSummary(dimensionScores, overallScore, riskLevel)}

THEIR ACTUAL ANSWERS:
${answersSummary(answers)}

${PENALTY_REFERENCE}

For EACH flag below, rewrite two things:

1. enhanced_description (the warning): explain why THIS organisation specifically has this gap, referencing the actual answers they gave (e.g. if they said no one owns governance, or they have 20+ shadow AI tools, or they cannot produce an audit trail, name that). Make it concrete and evidence based, not generic. Where a real statutory ceiling applies to a framework or market their answers indicate is relevant, you may cite ONE figure from the verified list above, framed strictly as a maximum potential exposure, never a predicted fine. Do not invent facts about the organisation beyond what their answers state.

2. enhanced_recommendation (the fix): give a specific, sequenced first action tailored to their situation and the weakest dimensions, not a generic checklist. Keep it practical for a mid sized organisation.

STYLE RULES (strict):
- Do NOT use hyphens or dashes of any kind in your prose. Rephrase instead.
- Do NOT use the words "scanning" or "scans". Use "checking" or "reviewing".
- Plain, direct, board ready British English. No filler, no marketing language.
- Precision over invention: if their answers do not support a specific claim, keep that finding higher level rather than fabricating detail.

Respond ONLY with valid JSON in exactly this structure, no markdown, no prose outside the JSON:
{
  "enhanced": [
    {
      "index": 0,
      "enhanced_description": "The tailored warning for flag 0, specific to this organisation's answers.",
      "enhanced_recommendation": "The tailored first action for flag 0."
    }
  ]
}

Include one object per flag, matching each flag's index. If you genuinely cannot improve on a template for a given flag, return its original text rather than degrading it.

FLAGS TO REWRITE:
${flagList}`;
}

function isValidResponse(data: unknown): data is AIResponse {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return Array.isArray(d.enhanced);
}

export async function enhanceGovernanceReport(
  redFlags: RedFlag[],
  answers: Answer[],
  dimensionScores: Record<Dimension, number>,
  overallScore: number,
  riskLevel: string
): Promise<RedFlag[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  // No key configured, or nothing to enhance — return originals unchanged.
  if (!apiKey || redFlags.length === 0) return redFlags;

  try {
    const client = new OpenAI({ apiKey });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 2500,
      messages: [
        {
          role: "user",
          content: buildPrompt(redFlags, answers, dimensionScores, overallScore, riskLevel),
        },
      ],
    });

    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) return redFlags;

    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return redFlags;
    }

    if (!isValidResponse(parsed)) return redFlags;

    // Apply tailored text back onto each flag. Severity, dimension, title and
    // regulatoryContext are left untouched — only the prose the respondent
    // reads is upgraded. Any flag the model skipped keeps its template text.
    return redFlags.map((flag, i) => {
      const improvement = parsed.enhanced.find((e) => e.index === i);
      if (!improvement) return flag;

      const description = improvement.enhanced_description?.trim();
      const recommendation = improvement.enhanced_recommendation?.trim();

      return {
        ...flag,
        description: description && description.length > 0 ? description : flag.description,
        recommendation:
          recommendation && recommendation.length > 0 ? recommendation : flag.recommendation,
      };
    });
  } catch {
    // Any failure — network, rate limit, parse error — falls back silently to
    // the original template findings so the assessment always completes.
    return redFlags;
  }
}
