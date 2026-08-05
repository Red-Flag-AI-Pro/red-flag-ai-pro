/**
 * Full Governance Program — AI Enhancement Layer
 *
 * The six documents in program-documents.ts are template driven: every
 * narrative section is either the customer's own words dropped in verbatim,
 * or a bracketed placeholder if they left a field blank. This layer runs
 * after generation, sends the whole intake plus all six drafts to the model
 * in one batched call, and asks it to expand the narrative sections into
 * fuller, specific prose grounded in what the customer actually answered —
 * headings, structure, legal citations, and disclaimers are left untouched.
 *
 * Mirrors governance-enhance.ts: one batched call, silent per-document
 * fallback to the original template text if the key is missing or anything
 * fails, so a customer who paid £497 never receives nothing. Only ever
 * called once per order, from the generation pipeline.
 */

import OpenAI from "openai";
import { DOCUMENT_LABELS, type ProgramDocumentBundle } from "./program-documents";
import type { ProgramIntake } from "./program-intake";

type DocKey = keyof ProgramDocumentBundle;

const DOC_LABELS: Record<DocKey, string> = Object.fromEntries(
  DOCUMENT_LABELS.map(({ key, label }) => [key, label])
) as Record<DocKey, string>;

interface AIResponse {
  enhanced?: Partial<Record<DocKey, string>>;
}

function intakeSummary(intake: ProgramIntake): string {
  const lines: string[] = [
    `Company: ${intake.companyName || "(not given)"}`,
    `System: ${intake.systemName || "(not given)"}`,
    `Purpose: ${intake.purpose || "(not given)"}`,
    `Architecture: ${intake.architecture}`,
    `Primary jurisdiction: ${intake.primaryJurisdiction}`,
    `Data types: ${intake.dataTypes.length ? intake.dataTypes.join(", ") : "(none selected)"}`,
    `Data sources: ${intake.dataSources || "(not given)"}`,
    `Automated decision making: ${intake.automatedDecision ? "yes" : "no"}`,
    `Systematic monitoring: ${intake.systematicMonitoring ? "yes" : "no"}`,
    `Large scale processing: ${intake.largeScale ? "yes" : "no"}`,
    `Safeguards in place: ${intake.safeguards.length ? intake.safeguards.join(", ") : "(none selected)"}`,
    `Oversight measures: ${intake.oversightMeasures || "(not given)"}`,
    `Mitigation measures: ${intake.mitigationMeasures || "(not given)"}`,
    `Testing: ${intake.testing || "(not given)"}`,
    `Known limitations: ${intake.limitations || "(not given)"}`,
    `Affected parties: ${intake.affectedParties || "(not given)"}`,
    `Usage period: ${intake.usagePeriod || "(not given)"}`,
    `Specific risks: ${intake.specificRisks || "(not given)"}`,
    `Monitoring metrics: ${intake.metrics || "(not given)"}`,
    `Review cadence: ${intake.reviewCadence || "(not given)"}`,
    `Escalation thresholds: ${intake.thresholds || "(not given)"}`,
    `Corrective action: ${intake.correctiveAction || "(not given)"}`,
    `Record keeping: ${intake.recordKeeping || "(not given)"}`,
    `Prohibited AI uses: ${intake.prohibitedUses || "(not given)"}`,
    `Data handling rules: ${intake.dataRules || "(not given)"}`,
    `Approval process: ${intake.approvalProcess || "(not given)"}`,
    `Reporting channel: ${intake.reportingChannel || "(not given)"}`,
  ];
  return lines.join("\n");
}

function buildPrompt(intake: ProgramIntake, docs: ProgramDocumentBundle): string {
  const docBlocks = (Object.keys(docs) as DocKey[])
    .map((key) => `[DOCUMENT: ${key}] — ${DOC_LABELS[key]}\n"""\n${docs[key]}\n"""`)
    .join("\n\n");

  return `You are a senior AI governance consultant finishing a paid, done for you governance bundle for a specific client. Six draft documents were produced by a template engine from the client's own intake answers below. Your job is to expand each document's narrative sections into fuller, genuinely tailored prose that reads as if a consultant wrote it for this exact business, while leaving structure, section numbering, headings, legal citations, and the closing disclaimer paragraph of each document EXACTLY as they are.

THE CLIENT'S INTAKE ANSWERS:
${intakeSummary(intake)}

THE SIX DRAFT DOCUMENTS:
${docBlocks}

RULES (strict):
- Do not invent facts about the client beyond what their intake answers state. If an answer was left blank, keep the bracketed placeholder rather than fabricating detail.
- Do not alter any legal citation, article number, deadline, or statutory reference already present — these are verified and must not change.
- Do not remove or reword the disclaimer paragraph at the end of each document.
- Do not change section headings or numbering.
- Expand only the descriptive prose: turn short or placeholder answers into fuller paragraphs that connect back to the client's actual system, data, and risk profile as described in the intake.
- Do NOT use hyphens or dashes of any kind in your prose. Rephrase instead.
- Do NOT use the words "scanning" or "scans". Use "checking" or "reviewing".
- Do NOT use stock AI phrasing such as "leverage", "seamless", "cutting edge", "delve", "robust framework", or compliment wrapper openings.
- Plain, direct, board ready British English.

Respond ONLY with valid JSON in exactly this structure, no markdown, no prose outside the JSON:
{
  "enhanced": {
    "dpia": "the full tailored document text",
    "fria": "the full tailored document text",
    "ai_use_policy": "the full tailored document text",
    "incident_checklist": "the full tailored document text",
    "monitoring_plan": "the full tailored document text",
    "documentation": "the full tailored document text"
  }
}

Include all six keys. If you genuinely cannot improve on a document (for example the incident checklist, which is mostly fixed regulatory guidance rather than client narrative), return its original text unchanged rather than degrading it.`;
}

function isValidResponse(data: unknown): data is AIResponse {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return typeof d.enhanced === "object" && d.enhanced !== null;
}

// Never throws. Returns the original bundle unchanged if there is no API key,
// the call fails, the response cannot be parsed, or a given document is
// missing from the response — a customer who paid £497 always gets a
// complete set of documents, tailored or not.
export async function enhanceProgramDocuments(
  docs: ProgramDocumentBundle,
  intake: ProgramIntake
): Promise<ProgramDocumentBundle> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return docs;

  try {
    const client = new OpenAI({ apiKey });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 6000,
      messages: [{ role: "user", content: buildPrompt(intake, docs) }],
    });

    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) return docs;

    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return docs;
    }

    if (!isValidResponse(parsed)) return docs;

    const enhanced = parsed.enhanced ?? {};
    const result = { ...docs };
    (Object.keys(docs) as DocKey[]).forEach((key) => {
      const candidate = enhanced[key];
      if (typeof candidate === "string" && candidate.trim().length > 0) {
        result[key] = candidate.trim();
      }
    });
    return result;
  } catch {
    // Any failure — network, rate limit, parse error — falls back silently
    // to the unenhanced templates so delivery always completes.
    return docs;
  }
}
