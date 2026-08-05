// Shared intake for the £497 Full Governance Program. Asked once, mapped into
// all six documents below, instead of the customer re-describing the same AI
// system six separate times across six separate free tools.

export const PROGRAM_DATA_TYPES = [
  { value: "special_category", label: "Health, biometric, genetic, ethnicity, religion or similar special category data" },
  { value: "children", label: "Data belonging to children (under 18)" },
  { value: "financial", label: "Financial or credit information" },
  { value: "criminal", label: "Criminal offence or conviction data" },
  { value: "location", label: "Precise location or movement tracking" },
  { value: "standard_personal", label: "Standard personal data only (name, email, contact details)" },
  { value: "none", label: "No personal data — anonymized or aggregated only" },
] as const;
export type ProgramDataType = (typeof PROGRAM_DATA_TYPES)[number]["value"];

export const PROGRAM_SAFEGUARDS = [
  { value: "encryption", label: "Data encrypted at rest and in transit" },
  { value: "access_controls", label: "Role-based access controls in place" },
  { value: "human_review", label: "A human reviews outputs before they take effect" },
  { value: "retention_limits", label: "Defined retention period, data deleted after" },
  { value: "anonymization", label: "Data anonymized or pseudonymized where possible" },
  { value: "dpa", label: "Data processing agreement in place with any vendor" },
] as const;
export type ProgramSafeguard = (typeof PROGRAM_SAFEGUARDS)[number]["value"];

export const PROGRAM_ARCHITECTURE_TYPES = [
  { value: "third_party_api", label: "Third party AI API (OpenAI, Anthropic, Google, etc)" },
  { value: "fine_tuned", label: "Fine tuned version of a third party model" },
  { value: "in_house", label: "In house built and trained model" },
  { value: "hybrid", label: "Hybrid: in house system calling a third party model" },
] as const;
export type ProgramArchitecture = (typeof PROGRAM_ARCHITECTURE_TYPES)[number]["value"];

export const PROGRAM_JURISDICTIONS = [
  { value: "uk", label: "United Kingdom" },
  { value: "eu", label: "European Union" },
  { value: "us", label: "United States" },
] as const;
export type ProgramJurisdiction = (typeof PROGRAM_JURISDICTIONS)[number]["value"];

export interface ProgramIntake {
  // Section 1 — your business and the system itself (feeds all six documents)
  companyName: string;
  systemName: string;
  purpose: string;
  architecture: ProgramArchitecture;
  primaryJurisdiction: ProgramJurisdiction;
  // Who is actually approving this system's use — feeds the included boundary
  // authorization record (task #243), not any of the six documents. Optional:
  // a customer who leaves this blank still gets the record, named to the
  // company itself rather than inventing a person nobody gave us.
  approverName: string;
  approverRole: string;
  // Annual turnover, used only for the financial exposure snapshot (task
  // #237) — turns the statutory ceiling for primaryJurisdiction into a real
  // number for this business rather than a generic maximum. Optional: a
  // customer who leaves it blank still gets the fixed/uncapped ceiling
  // figures, just without the turnover-scaled ones.
  annualTurnoverGBP: number;

  // Section 2 — data and risk profile (feeds DPIA, FRIA, Documentation)
  dataTypes: ProgramDataType[];
  dataSources: string;
  automatedDecision: boolean;
  systematicMonitoring: boolean;
  largeScale: boolean;

  // Section 3 — safeguards and oversight (feeds DPIA, FRIA, AI Use Policy, Documentation)
  safeguards: ProgramSafeguard[];
  oversightMeasures: string;
  mitigationMeasures: string;
  testing: string;
  limitations: string;

  // Section 4 — who it affects (feeds FRIA)
  affectedParties: string;
  usagePeriod: string;
  specificRisks: string;

  // Section 5 — ongoing monitoring (feeds Monitoring Plan)
  metrics: string;
  reviewCadence: string;
  thresholds: string;
  correctiveAction: string;
  recordKeeping: string;

  // Section 6 — staff policy (feeds AI Use Policy) — company-wide, not system-specific
  prohibitedUses: string;
  dataRules: string;
  approvalProcess: string;
  reportingChannel: string;
}

export const PROGRAM_INTAKE_DEFAULTS: ProgramIntake = {
  companyName: "",
  systemName: "",
  purpose: "",
  architecture: "third_party_api",
  primaryJurisdiction: "uk",
  approverName: "",
  approverRole: "",
  annualTurnoverGBP: 0,
  dataTypes: [],
  dataSources: "",
  automatedDecision: false,
  systematicMonitoring: false,
  largeScale: false,
  safeguards: [],
  oversightMeasures: "",
  mitigationMeasures: "",
  testing: "",
  limitations: "",
  affectedParties: "",
  usagePeriod: "",
  specificRisks: "",
  metrics: "",
  reviewCadence: "",
  thresholds: "",
  correctiveAction: "",
  recordKeeping: "",
  prohibitedUses: "",
  dataRules: "",
  approvalProcess: "",
  reportingChannel: "",
};

// Derives each document's tool-specific input shape from the one shared
// intake, so nothing has to be typed twice. Fields a given document never
// used are simply omitted here.

export function toDpiaInput(i: ProgramIntake) {
  return {
    systemName: i.systemName,
    purpose: i.purpose,
    dataTypes: new Set(i.dataTypes),
    automatedDecision: i.automatedDecision,
    systematicMonitoring: i.systematicMonitoring,
    largeScale: i.largeScale,
    safeguards: new Set(i.safeguards),
  };
}

export function toFriaInput(i: ProgramIntake) {
  return {
    systemName: i.systemName,
    processes: i.purpose,
    usagePeriod: i.usagePeriod,
    affectedParties: i.affectedParties,
    specificRisks: i.specificRisks,
    oversightMeasures: i.oversightMeasures,
    mitigationMeasures: i.mitigationMeasures,
  };
}

export function toAiUsePolicyInput(i: ProgramIntake) {
  return {
    companyName: i.companyName,
    approvedApproach: i.architecture === "in_house" ? "in_house" : "approved_tools",
    prohibitedUses: i.prohibitedUses,
    dataRules: i.dataRules || i.safeguards.map((s) => PROGRAM_SAFEGUARDS.find((p) => p.value === s)?.label).filter(Boolean).join(". "),
    approvalProcess: i.approvalProcess,
    reportingChannel: i.reportingChannel,
  };
}

export function toIncidentChecklistInput(i: ProgramIntake) {
  return {
    incidentType: "data_breach" as const,
    jurisdiction: i.primaryJurisdiction,
  };
}

export function toMonitoringPlanInput(i: ProgramIntake) {
  return {
    systemName: i.systemName,
    metrics: i.metrics,
    dataSources: i.dataSources,
    reviewCadence: i.reviewCadence,
    thresholds: i.thresholds,
    corrective: i.correctiveAction,
    recordKeeping: i.recordKeeping,
  };
}

export function toDocumentationInput(i: ProgramIntake) {
  return {
    systemName: i.systemName,
    purpose: i.purpose,
    architecture: i.architecture,
    dataSources: i.dataSources,
    riskMeasures: i.mitigationMeasures,
    oversight: i.oversightMeasures,
    testing: i.testing,
    limitations: i.limitations,
  };
}
