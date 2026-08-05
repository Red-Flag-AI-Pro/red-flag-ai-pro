// Regulatory framework mapping for the £497 Full Governance Program (task #238).
//
// Maps each of the six generated documents to the specific article or duty it
// addresses, so the delivery page can show the customer exactly what each
// document is for instead of leaving them to infer it. Citations match the
// ones already used inside program-documents.ts and the free tools it was
// ported from — nothing here is a new or different claim.

import type { ProgramIntake } from "./program-intake";

export interface RegulatoryMappingRow {
  document: string;
  framework: string;
  article: string;
  whatItSatisfies: string;
}

export function computeRegulatoryMapping(intake: ProgramIntake): RegulatoryMappingRow[] {
  const incidentFramework =
    intake.primaryJurisdiction === "eu"
      ? "EU AI Act / GDPR"
      : intake.primaryJurisdiction === "us"
      ? "FTC Act / state breach laws"
      : "UK GDPR / DPA 2018";

  const incidentArticle =
    intake.primaryJurisdiction === "eu"
      ? "Article 73 (serious incident reporting) / Article 33"
      : intake.primaryJurisdiction === "us"
      ? "FTC Act Section 5 / state notification statutes"
      : "Article 33 (regulator) / Article 34 (individuals)";

  return [
    {
      document: "Data Protection Impact Assessment screening",
      framework: "UK GDPR / GDPR",
      article: "Article 35(3), and Article 9/10 where special category, children's, or criminal offence data is involved",
      whatItSatisfies: "The duty to screen processing for high risk factors before it begins, and to document why a full DPIA is or is not required.",
    },
    {
      document: "Fundamental Rights Impact Assessment draft",
      framework: "EU AI Act",
      article: "Article 27",
      whatItSatisfies: "The pre deployment assessment required of public bodies, public service providers, and deployers of specific Annex III high risk systems, covering deployer processes, affected persons, and human oversight.",
    },
    {
      document: "AI Acceptable Use Policy draft",
      framework: "EU AI Act",
      article: "Article 4",
      whatItSatisfies: "The duty to take measures ensuring sufficient AI literacy among staff using AI systems on the company's behalf, and to give staff a written answer on what is and is not an approved use.",
    },
    {
      document: "Incident reporting checklist",
      framework: incidentFramework,
      article: incidentArticle,
      whatItSatisfies: "Knowing the deadline, the authority, and who must be told the moment an incident is discovered, so the clock is not being worked out for the first time during an actual incident.",
    },
    {
      document: "Post market monitoring plan draft",
      framework: "EU AI Act",
      article: "Article 72",
      whatItSatisfies: "The plan for watching a deployed system's performance over time: metrics, review cadence, escalation thresholds, and corrective action, which becomes part of the Annex IV technical file.",
    },
    {
      document: "Annex IV technical documentation draft",
      framework: "EU AI Act",
      article: "Annex IV",
      whatItSatisfies: "The structured technical file a provider or deployer needs to hold on the system: purpose, architecture, risk measures, human oversight, testing, and known limitations, the same record a Munir v SSHD style challenge tests when it asks whether genuine human oversight can actually be evidenced.",
    },
  ];
}
