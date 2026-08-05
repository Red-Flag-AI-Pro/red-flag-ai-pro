// Financial impact snapshot for the £497 Full Governance Program (task #237).
//
// Reuses the exact verified statutory figures from the public Fine
// Calculator (src/components/tools/FineCalculator.tsx) and penalty-exposure.ts
// — same ceilings, same "higher of turnover % or fixed floor" model — applied
// to the customer's own turnover and jurisdiction instead of a slider, and
// explained against their own risk answers instead of shown as a bare number.

import type { ProgramIntake, ProgramJurisdiction } from "./program-intake";

// Approximate FX → GBP (June 2026), same rates as FineCalculator.tsx.
const FX = { EUR: 0.85, USD: 0.79 };

interface JurisdictionCeiling {
  law: string;
  pct: number; // fraction of turnover
  floorGBP: number; // statutory fixed floor, in GBP
  note: string;
}

// Same verified figures as FineCalculator.tsx's JURISDICTIONS table and
// governance-enhance.ts's PENALTY_REFERENCE, restricted to the three
// jurisdictions the program intake actually asks about.
const CEILINGS: Record<ProgramJurisdiction, JurisdictionCeiling> = {
  uk: {
    law: "UK GDPR / DPA 2018",
    pct: 0.04,
    floorGBP: 17_500_000,
    note: "the higher of 4% of global annual turnover or £17.5M",
  },
  eu: {
    law: "EU AI Act / GDPR",
    pct: 0.07,
    floorGBP: Math.round(35_000_000 * FX.EUR),
    note: "the higher of 7% of global annual turnover or €35M, the EU AI Act ceiling that applies because this is an AI system",
  },
  us: {
    law: "FTC Act Section 5",
    pct: 0,
    floorGBP: Math.round(53_088 * FX.USD),
    note: "up to $53,088 per violation under the FTC Act, multiplying per affected consumer rather than scaling with turnover",
  },
};

export interface FinancialSnapshot {
  jurisdiction: ProgramJurisdiction;
  jurisdictionLabel: string;
  law: string;
  annualTurnoverGBP: number;
  maxExposureGBP: number;
  ceilingNote: string;
  riskFactors: string[];
  explanation: string;
  generatedAt: string;
}

const JURISDICTION_LABELS: Record<ProgramJurisdiction, string> = {
  uk: "United Kingdom",
  eu: "European Union",
  us: "United States",
};

function fmtGBP(n: number): string {
  if (n >= 1_000_000) {
    // Rounding to a whole number below £100M silently contradicts the
    // ceiling.note string elsewhere in this file (e.g. UK's exact £17.5M
    // floor rounding to a headline "£18M") — keep one decimal at this scale
    // so the headline figure and its own explanation never disagree.
    const m = n / 1_000_000;
    return "£" + (m >= 100 ? Math.round(m) : Math.round(m * 10) / 10) + "M";
  }
  if (n >= 1000) return "£" + Math.round(n / 1000) + "k";
  return "£" + Math.round(n);
}

export function computeFinancialSnapshot(intake: ProgramIntake): FinancialSnapshot {
  const jurisdiction = intake.primaryJurisdiction;
  const ceiling = CEILINGS[jurisdiction];
  const turnover = Math.max(0, intake.annualTurnoverGBP || 0);

  // Same "higher of" model as the public calculator. The US figure is per
  // violation rather than turnover scaled, so turnover plays no part there.
  const maxExposureGBP =
    jurisdiction === "us" ? ceiling.floorGBP : Math.max(turnover * ceiling.pct, ceiling.floorGBP);

  const hasSpecialCategoryData = intake.dataTypes.some((d) =>
    ["special_category", "children", "criminal"].includes(d)
  );

  const riskFactors: string[] = [];
  if (hasSpecialCategoryData) riskFactors.push("Processes special category, children's, or criminal offence data, which regulators treat as higher risk when assessing any penalty");
  if (intake.automatedDecision) riskFactors.push("Makes automated decisions with legal or similarly significant effect, engaging UK/EU GDPR Article 22 and, where the EU AI Act applies, Annex III high risk obligations");
  if (intake.systematicMonitoring) riskFactors.push("Involves systematic monitoring of individuals, a factor regulators weigh when deciding whether to escalate an investigation");
  if (intake.largeScale) riskFactors.push("Processing is large scale, which increases both the number of people a failure could affect and the fine a regulator is likely to consider proportionate");
  const safeguardCount = intake.safeguards.length;
  if (safeguardCount === 0) riskFactors.push("No safeguards were recorded in the intake — regulators and courts treat the presence or absence of safeguards as directly relevant to any penalty decision");

  const turnoverText =
    turnover > 0
      ? `Based on the ${fmtGBP(turnover)} annual turnover given, ${ceiling.note} for ${JURISDICTION_LABELS[jurisdiction]} works out to a maximum statutory exposure of ${fmtGBP(maxExposureGBP)}.`
      : `No annual turnover was given, so the figure below is the statutory floor for ${JURISDICTION_LABELS[jurisdiction]} rather than a turnover scaled figure: ${ceiling.note}.`;

  const explanation = `This is the maximum statutory ceiling under ${ceiling.law}, not a prediction of an actual fine. ${turnoverText} Actual penalties sit at the regulator's discretion and depend on conduct, cooperation, and harm caused, not on this figure alone. ${
    riskFactors.length
      ? "The factors below, drawn from the intake answers, are the ones that would be looked at first if this system were ever investigated."
      : "No specific risk factors were flagged from the intake answers, which keeps this system's profile comparatively low against the same ceiling."
  }`;

  return {
    jurisdiction,
    jurisdictionLabel: JURISDICTION_LABELS[jurisdiction],
    law: ceiling.law,
    annualTurnoverGBP: turnover,
    maxExposureGBP: Math.round(maxExposureGBP),
    ceilingNote: ceiling.note,
    riskFactors,
    explanation,
    generatedAt: new Date().toISOString(),
  };
}
