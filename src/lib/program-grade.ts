// EPC-style A to G letter grade for the £497 Full Governance Program (task #239,
// closes task #184 on the main list).
//
// Same shape as the 0-100 maturity scoring in governance-audit.ts
// (calculateScores / calculateOverallScore): risk factors push the score
// down, recorded safeguards push it back up, more safeguards and lower risk
// means a better grade. Built from the shared intake's own risk and
// safeguard answers rather than a separate questionnaire.

import type { ProgramIntake } from "./program-intake";

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

export function calculateProgramScore(intake: ProgramIntake): ProgramGradeResult {
  const breakdown: { label: string; points: number }[] = [];
  let deductions = 0;

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
