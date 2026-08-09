// Risk register for the £497 Full Governance Program (task #276).
//
// Jabber Khan sample deliverable, 9 Aug 2026: his Part 2 has a numbered risk
// register, each row an ID, a description, likelihood, impact, and a
// mitigation. Ours had nothing like it. There is no live scan in this
// pipeline (see program-generate.ts) — the six documents are generated
// purely from the customer's own intake answers, so risks here are derived
// the same honest way the gap status column is: specific, named combinations
// of what was answered or left blank, never invented, never scored against
// data the customer never gave us.

import type { ProgramIntake } from "./program-intake";

export type RiskLikelihood = "low" | "medium" | "high";
export type RiskImpact = "low" | "medium" | "high";

export const RISK_LEVEL_LABELS: Record<RiskLikelihood, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export interface RiskRegisterRow {
  id: string;
  description: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  mitigation: string;
}

const SENSITIVE_DATA_TYPES = new Set(["special_category", "children", "criminal"]);

export function computeRiskRegister(intake: ProgramIntake): RiskRegisterRow[] {
  const rows: RiskRegisterRow[] = [];
  let n = 1;
  const add = (description: string, likelihood: RiskLikelihood, impact: RiskImpact, mitigation: string) => {
    rows.push({ id: `R-${String(n).padStart(2, "0")}`, description, likelihood, impact, mitigation });
    n += 1;
  };

  const hasSensitiveData = intake.dataTypes.some((t) => SENSITIVE_DATA_TYPES.has(t));
  if (hasSensitiveData && intake.safeguards.length === 0) {
    add(
      "Special category, children's, or criminal offence data is in scope, and no safeguard was selected at intake.",
      "high",
      "high",
      "Confirm at least encryption, access controls, and a defined retention period before this system continues processing this data."
    );
  }

  if (intake.automatedDecision && !intake.oversightMeasures.trim()) {
    add(
      "The system makes automated decisions, and no human oversight measure was described.",
      "high",
      "high",
      "Document who reviews an output before it takes effect, and under what conditions they can override it."
    );
  }

  if (intake.systematicMonitoring && !intake.oversightMeasures.trim()) {
    add(
      "The system performs systematic monitoring, and no human oversight measure was described.",
      "medium",
      "medium",
      "Name who is responsible for reviewing what the monitoring surfaces, not just that monitoring exists."
    );
  }

  if (intake.largeScale && !intake.thresholds.trim()) {
    add(
      "Processing is described as large scale, and no monitoring threshold was defined for when performance is considered to have degraded.",
      "medium",
      "high",
      "Set a specific, numeric threshold, not a general intention to \"keep an eye on it\", the same threshold the monitoring plan needs to be enforceable."
    );
  }

  if ((intake.architecture === "third_party_api" || intake.architecture === "fine_tuned") && !intake.safeguards.includes("dpa")) {
    add(
      "The system relies on a third party model, and a data processing agreement with that provider was not confirmed at intake.",
      "medium",
      "medium",
      "Confirm a DPA is in place with the model provider before any personal data reaches their infrastructure, not after."
    );
  }

  if (!intake.limitations.trim()) {
    add(
      "Known limitations of the system were not documented at intake.",
      "medium",
      "low",
      "Record what the system is not designed to do and where it is known to be unreliable, this is required Annex IV content, not optional context."
    );
  }

  if (!intake.correctiveAction.trim()) {
    add(
      "No corrective action was defined for when monitoring finds a problem.",
      "medium",
      "medium",
      "Decide in advance what happens when a threshold is crossed, pause, escalate, or roll back, rather than deciding for the first time during an actual incident."
    );
  }

  if (!intake.reportingChannel.trim()) {
    add(
      "No internal reporting channel was named for staff who notice something wrong with this system.",
      "high",
      "medium",
      "Name a specific channel, an inbox, a person, a form, staff cannot report what they have no route to report to."
    );
  }

  return rows;
}
