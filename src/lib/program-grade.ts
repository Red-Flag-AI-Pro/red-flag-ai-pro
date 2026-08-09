// EPC-style A to G letter grade for the £497 Full Governance Program (task #239,
// closes task #184 on the main list).
//
// Same shape as the 0-100 maturity scoring in governance-audit.ts
// (calculateScores / calculateOverallScore): risk factors push the score
// down, recorded safeguards push it back up, more safeguards and lower risk
// means a better grade. Built from the shared intake's own risk and
// safeguard answers rather than a separate questionnaire.

import type { ProgramIntake } from "./program-intake";
import type { RegulatoryMappingRow } from "./program-regulatory-mapping";

export type LetterGrade = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface ProgramGradeResult {
  score: number; // 0-100, higher is better, same direction as governance-audit's maturity score
  grade: LetterGrade;
  breakdown: { label: string; points: number }[];
}

// Each risk factor's weight reflects how much scrutiny it invites on its own
// (matching the same factors DPIAGenerator and the financial snapshot treat
// as high risk): automated decisions and special category data carry the
// article 22 / article 9-10 obligations, so they weigh the most.
const RISK_WEIGHTS = {
  specialCategoryData: 18,
  automatedDecision: 18,
  systematicMonitoring: 12,
  largeScale: 10,
  noSafeguardsAtAll: 12,
} as const;

// Each recorded safeguard offsets some of that risk, capped so safeguards
// alone cannot fully cancel out a high risk profile — a fully safeguarded
// high risk system is still a high risk system, just a better managed one.
const POINTS_PER_SAFEGUARD = 7;
const MAX_SAFEGUARD_OFFSET = 36;

// The six checkboxes above only capture whether a risk category applies —
// they say nothing about whether oversight actually exists. Before this,
// an intake that ticked one safeguard box but left every free-text
// governance answer blank or hollow ("no measures in place", "not tested")
// still scored A/97, directly contradicting the six documents generated
// from those same answers. Each of these fields getting a real answer is
// itself evidence of governance; leaving it blank or trivial is evidence
// of its absence, and the score now reflects that.
const HOLLOW_ANSWER_MIN_LENGTH = 15;
const HOLLOW_PATTERNS = /^(n\/?a|none|no|not (yet|applicable|defined|in place)|tbd|undefined|-)\.?$/i;
const POINTS_PER_UNADDRESSED_FIELD = 6;

function isHollow(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < HOLLOW_ANSWER_MIN_LENGTH) return true;
  return HOLLOW_PATTERNS.test(trimmed);
}

const GOVERNANCE_FIELDS: { key: keyof ProgramIntake; label: string }[] = [
  { key: "oversightMeasures", label: "human oversight measures" },
  { key: "mitigationMeasures", label: "risk mitigation measures" },
  { key: "testing", label: "testing and validation" },
  { key: "correctiveAction", label: "corrective action procedure" },
  { key: "approvalProcess", label: "approval process for new tools" },
  { key: "reportingChannel", label: "reporting and escalation channel" },
];

export function calculateProgramScore(intake: ProgramIntake): ProgramGradeResult {
  const breakdown: { label: string; points: number }[] = [];
  let deductions = 0;

  const unaddressed = GOVERNANCE_FIELDS.filter((f) => isHollow(String(intake[f.key] ?? "")));
  if (unaddressed.length > 0) {
    const points = unaddressed.length * POINTS_PER_UNADDRESSED_FIELD;
    deductions += points;
    breakdown.push({
      label: `${unaddressed.length} governance answer${unaddressed.length === 1 ? "" : "s"} left blank or hollow (${unaddressed.map((f) => f.label).join(", ")})`,
      points: -points,
    });
  }

  const hasSpecialCategoryData = intake.dataTypes.some((d) =>
    ["special_category", "children", "criminal"].includes(d)
  );

  if (hasSpecialCategoryData) {
    deductions += RISK_WEIGHTS.specialCategoryData;
    breakdown.push({ label: "Processes special category, children's, or criminal offence data", points: -RISK_WEIGHTS.specialCategoryData });
  }
  if (intake.automatedDecision) {
    deductions += RISK_WEIGHTS.automatedDecision;
    breakdown.push({ label: "Makes automated decisions with legal or similarly significant effect", points: -RISK_WEIGHTS.automatedDecision });
  }
  if (intake.systematicMonitoring) {
    deductions += RISK_WEIGHTS.systematicMonitoring;
    breakdown.push({ label: "Involves systematic monitoring of individuals", points: -RISK_WEIGHTS.systematicMonitoring });
  }
  if (intake.largeScale) {
    deductions += RISK_WEIGHTS.largeScale;
    breakdown.push({ label: "Processing is large scale", points: -RISK_WEIGHTS.largeScale });
  }

  const safeguardCount = intake.safeguards.length;
  if (safeguardCount === 0) {
    deductions += RISK_WEIGHTS.noSafeguardsAtAll;
    breakdown.push({ label: "No safeguards recorded", points: -RISK_WEIGHTS.noSafeguardsAtAll });
  }

  const safeguardOffset = Math.min(MAX_SAFEGUARD_OFFSET, safeguardCount * POINTS_PER_SAFEGUARD);
  if (safeguardOffset > 0) {
    breakdown.push({ label: `${safeguardCount} safeguard${safeguardCount === 1 ? "" : "s"} recorded`, points: safeguardOffset });
  }

  const score = Math.max(0, Math.min(100, Math.round(100 - deductions + safeguardOffset)));

  let grade: LetterGrade;
  if (score >= 90) grade = "A";
  else if (score >= 78) grade = "B";
  else if (score >= 66) grade = "C";
  else if (score >= 54) grade = "D";
  else if (score >= 42) grade = "E";
  else if (score >= 30) grade = "F";
  else grade = "G";

  return { score, grade, breakdown };
}

const GRADE_ORDER: LetterGrade[] = ["A", "B", "C", "D", "E", "F", "G"];

export interface GapCeilingResult extends ProgramGradeResult {
  // True only when the ceiling actually changed the grade — a customer
  // whose score alone would land at C or worse never sees this as true,
  // since nothing was capped, the score just was what it was.
  capped: boolean;
  notStartedCount: number;
}

// Evelyne-Claudia Y., LinkedIn 9 Aug 2026, replying to the gap status
// thread: can an unresolved underlying claim "extinguish the relevant
// permission independently of the headline grade, before the bundled
// status carries that permission forward" — or does a headline grade stay
// technically accurate while concealing what's still unaddressed beneath
// it? Checked honestly: before this, no, the grade never looked at gap
// status at all. This closes that gap for the one case material enough to
// matter: a regulatory document with genuinely nothing behind it, not a
// partial answer, which the scoring above already treats proportionately.
// A single completely unaddressed document is a categorically different
// fact from a partially answered one, and a grade of A or B cannot
// honestly coexist with it, regardless of how strong the rest of the
// intake scores. The ceiling is C, not the bottom, because most of the
// program's substance can still be genuinely strong even with one gap.
export function applyGapCeiling(
  result: ProgramGradeResult,
  regulatoryMapping: RegulatoryMappingRow[]
): GapCeilingResult {
  const notStartedCount = regulatoryMapping.filter((r) => r.status === "not_started").length;
  if (notStartedCount === 0) {
    return { ...result, capped: false, notStartedCount: 0 };
  }
  const currentIndex = GRADE_ORDER.indexOf(result.grade);
  const ceilingIndex = GRADE_ORDER.indexOf("C");
  if (currentIndex >= ceilingIndex) {
    // Already C or worse on the score alone — the ceiling isn't binding.
    return { ...result, capped: false, notStartedCount };
  }
  return { ...result, grade: "C", capped: true, notStartedCount };
}

export interface LiveGradeResult extends GapCeilingResult {
  staleCount: number;
}

// Evelyne-Claudia Y., LinkedIn 9 Aug 2026, replying to the gap ceiling
// above: the ceiling closes composition at the moment the grade is struck,
// but a document that was fine at generation can go stale afterwards
// (task #281's one year review clock), and nothing reopened the grade to
// reflect it -- staleness only ever removed the document from a Data Room
// export, the grade itself sat there unchanged and now potentially
// overstated. This recomputes the ceiling live, at read time, from
// whichever documents are currently stale, not just the gap status
// captured once at generation. Confirming a document still accurate resets
// its review clock, which is what lifts this ceiling again -- the same
// mechanism, applied to a fact that changes after delivery instead of one
// fixed at it.
export function applyStalenessCeiling(
  result: GapCeilingResult,
  staleCount: number
): LiveGradeResult {
  if (staleCount === 0) return { ...result, staleCount: 0 };
  const currentIndex = GRADE_ORDER.indexOf(result.grade);
  const ceilingIndex = GRADE_ORDER.indexOf("C");
  if (currentIndex >= ceilingIndex) {
    return { ...result, staleCount };
  }
  return { ...result, grade: "C", capped: true, staleCount };
}
