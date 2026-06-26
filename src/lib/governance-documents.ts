/**
 * Governance Fix Documents
 *
 * The compliance side hands users a rewritten sentence — a ready-to-use fix.
 * The governance side only ever handed users a to-do item ("draft a policy").
 * This module closes that gap: for each of the 6 governance dimensions, it
 * generates an actual usable document — a charter, a policy, a questionnaire,
 * a checklist — personalized with the user's own assessment data, not just
 * advice telling them to go write one themselves.
 */

import type { Dimension, RedFlag, RoadmapAction } from "./governance-audit";

export type DocumentType =
  | "charter"
  | "tools_policy"
  | "governance_policy"
  | "monitoring_policy"
  | "vendor_questionnaire"
  | "evidence_checklist";

export interface DocumentMeta {
  type: DocumentType;
  dimension: Dimension;
  title: string;
  description: string;
}

export const GOVERNANCE_DOCUMENTS: DocumentMeta[] = [
  {
    type: "charter",
    dimension: "strategy_ownership",
    title: "AI Governance Charter",
    description: "Decision rights, committee structure and named ownership for AI decisions.",
  },
  {
    type: "tools_policy",
    dimension: "tool_data_governance",
    title: "Approved AI Tools Policy",
    description: "Which tools are approved, how new tools get vetted, what data they may touch.",
  },
  {
    type: "governance_policy",
    dimension: "policy_documentation",
    title: "AI Governance Policy",
    description: "The written policy itself — not a reminder to write one.",
  },
  {
    type: "monitoring_policy",
    dimension: "monitoring_accountability",
    title: "Output Monitoring & Audit Log Policy",
    description: "What gets logged, how often it's reviewed, and who is accountable.",
  },
  {
    type: "vendor_questionnaire",
    dimension: "vendor_risk",
    title: "Vendor AI Risk Questionnaire",
    description: "Send this to any vendor whose product touches your data with AI.",
  },
  {
    type: "evidence_checklist",
    dimension: "regulatory_readiness",
    title: "Regulatory Evidence Checklist",
    description: "What to have on hand if a regulator or auditor asks for proof.",
  },
];

interface GenerateParams {
  companyName: string;
  dimensionScores: Record<Dimension, number>;
  redFlags: RedFlag[];
  roadmap: RoadmapAction[];
  generatedAt: Date;
}

function gapsForDimension(redFlags: RedFlag[], dimension: Dimension): string {
  const relevant = redFlags.filter((f) => f.dimension === dimension);
  if (relevant.length === 0) {
    return "No specific gaps flagged in this dimension — use this document to formalise current practice in writing.";
  }
  return relevant
    .map((f) => `- [${f.severity.toUpperCase()}] ${f.title}: ${f.description || f.recommendation}`)
    .join("\n");
}

function header(title: string, params: GenerateParams): string {
  const dateStr = params.generatedAt.toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  return `${title}
Prepared for: ${params.companyName}
Generated: ${dateStr} by Red Flag AI Pro (Sentinel)

This document is a starting draft based on your AI Governance Maturity Assessment.
Review with legal/compliance before formal adoption.

`;
}

function charter(params: GenerateParams): string {
  return header("AI GOVERNANCE CHARTER", params) + `1. PURPOSE
This charter establishes who is accountable for decisions about artificial
intelligence systems used by or on behalf of ${params.companyName}.

2. GOVERNANCE COMMITTEE
- Chair: [CFO / designated executive]
- Members: [CIO/IT lead, Legal/Compliance, a Product or Operations lead, Risk]
- Meets: Monthly, or immediately for any new high-risk AI use case
- Charter: Approve new AI tools, review incidents, approve policy changes

3. DECISION RIGHTS
| Decision | Owner | Escalation |
|---|---|---|
| Approve a new AI tool for company use | [Committee] | Board, if customer data is involved |
| Approve an AI use case that affects customers | [Committee + Legal] | Board |
| Respond to an AI-related incident or complaint | [Risk/Compliance lead] | Committee within 48 hours |
| Sign off on vendor AI contracts | [Procurement + Legal] | Committee for spend over [£X] |

4. KNOWN GAPS THIS CHARTER SHOULD CLOSE
${gapsForDimension(params.redFlags, "strategy_ownership")}

5. REVIEW
This charter is reviewed every 12 months or after any material incident.

Approved by: _________________________   Date: _______________
`;
}

function toolsPolicy(params: GenerateParams): string {
  return header("APPROVED AI TOOLS POLICY", params) + `1. PURPOSE
To maintain a single source of truth for which AI tools are approved for use
at ${params.companyName}, and the process for adding new ones.

2. APPROVED TOOLS REGISTER
| Tool | Purpose | Data it can touch | Approved by | Date |
|---|---|---|---|---|
| [e.g. ChatGPT Enterprise] | [Drafting, internal research] | [No customer PII] | [Name] | [Date] |
| | | | | |

3. REQUESTING A NEW TOOL
Any employee wanting to use a new AI tool for work must submit:
- Tool name and vendor
- What data it would process (and whether that includes customer or
  employee personal data)
- Business justification
Requests are reviewed within 5 business days by [IT/Security lead].

4. PROHIBITED USE
- No customer personal data, financial data, or confidential information may
  be entered into any AI tool not on the approved register.
- No AI tool may be connected to production systems without security review.

5. SHADOW AI
Employees using unapproved AI tools for work, even informally, must disclose
this to [IT/Security lead] without penalty during the first 90 days of this
policy — the goal is visibility, not punishment.

6. KNOWN GAPS THIS POLICY SHOULD CLOSE
${gapsForDimension(params.redFlags, "tool_data_governance")}

Approved by: _________________________   Date: _______________
`;
}

function governancePolicy(params: GenerateParams): string {
  return header("AI GOVERNANCE POLICY", params) + `1. SCOPE
This policy applies to all employees, contractors and systems at
${params.companyName} that use artificial intelligence, including
generative AI, automated decision-making, and AI-powered vendor products.

2. PRINCIPLES
- AI is used to support human judgement, not replace accountability.
- Every AI use case has a named owner.
- Customer and employee data is never used in ways customers/employees
  would not reasonably expect.
- We can produce evidence of how any AI system reached a material decision.

3. ROLES
- AI Governance Committee: see AI Governance Charter.
- Data stewards: responsible for knowing what data flows into AI systems
  within their function.
- All staff: responsible for using only approved tools and disclosing
  AI-assisted work where required.

4. PROHIBITED USE CASES
- Fully automated decisions with legal or significant effect on a customer
  without human review (e.g. credit, pricing, eligibility decisions).
- Use of AI to generate content that is not disclosed as AI-assisted where
  disclosure is legally required.
- Processing special category personal data through AI tools without a
  documented lawful basis and DPIA.

5. INCIDENT RESPONSE
Any AI system error, bias finding, data exposure, or customer complaint
related to AI must be reported to [Risk/Compliance lead] within 24 hours.

6. KNOWN GAPS THIS POLICY SHOULD CLOSE
${gapsForDimension(params.redFlags, "policy_documentation")}

7. REVIEW
Reviewed annually and after any material AI incident or new regulation.

Approved by: _________________________   Date: _______________
`;
}

function monitoringPolicy(params: GenerateParams): string {
  return header("OUTPUT MONITORING & AUDIT LOG POLICY", params) + `1. PURPOSE
To ensure ${params.companyName} can demonstrate what an AI system did, when,
and why — to a regulator, an auditor, or its own board, on request.

2. WHAT GETS LOGGED
- Every material AI-assisted decision (date, system, input summary, output,
  human reviewer if applicable)
- Every change to an AI system's configuration, prompts, or model version
- Every flagged error, override, or customer complaint linked to AI output

3. RETENTION
Logs are retained for [12 months minimum / per regulatory requirement,
whichever is longer] and are not editable after creation.

4. REVIEW CADENCE
| Review | Frequency | Owner |
|---|---|---|
| Spot-check sample of AI decisions | Monthly | [Risk/Compliance lead] |
| Drift / accuracy review | Quarterly | [Data/Product lead] |
| Full audit trail review | Annually | [Governance Committee] |

5. ESCALATION
Any anomaly (unexpected output pattern, repeated errors, customer harm) is
escalated to the Governance Committee within 48 hours of detection.

6. KNOWN GAPS THIS POLICY SHOULD CLOSE
${gapsForDimension(params.redFlags, "monitoring_accountability")}

Approved by: _________________________   Date: _______________
`;
}

function vendorQuestionnaire(params: GenerateParams): string {
  return header("VENDOR AI RISK QUESTIONNAIRE", params) + `Send this to any vendor whose product uses AI and touches ${params.companyName}
data, before signing or renewing a contract.

SECTION 1 — WHAT THE AI DOES
1. Describe what AI/ML capability your product uses and what decisions or
   outputs it produces.
2. Is the AI provided by you directly, or sourced from a third party
   (e.g. OpenAI, Anthropic, Google)? Name the underlying provider(s).

SECTION 2 — DATA
3. What data of ours does the AI process? Does this include personal data,
   financial data, or confidential business information?
4. Is our data used to train or fine-tune any model, including a model
   shared with other customers? If yes, can we opt out?
5. Where is our data processed and stored (jurisdiction)?

SECTION 3 — RISK & CONTROLS
6. Do you have a documented AI governance or responsible AI policy?
   Will you share it?
7. Do you conduct bias, accuracy, or safety testing on the AI? How often?
8. What human oversight exists before an AI output reaches us or our
   customers?

SECTION 4 — CONTRACT TERMS WE REQUIRE
9. Right to audit your AI systems and data handling on reasonable notice.
10. Liability allocation if the AI causes harm, error, or a compliance
    breach affecting us or our customers.
11. Notification within 72 hours of any AI-related incident, breach, or
    material model change.
12. Right to terminate without penalty if the AI is materially changed in a
    way that increases our risk.

SECTION 5 — KNOWN GAPS THIS QUESTIONNAIRE SHOULD CLOSE
${gapsForDimension(params.redFlags, "vendor_risk")}

Vendor response due by: _______________   Reviewed by: _________________________
`;
}

function evidenceChecklist(params: GenerateParams): string {
  return header("REGULATORY EVIDENCE CHECKLIST", params) + `If a regulator, auditor, or customer's legal team asked ${params.companyName}
to prove its AI governance tomorrow, here is what you would need to produce.
Tick off what you already have; the rest are your priority gaps.

[ ] Named AI governance owner and committee (see AI Governance Charter)
[ ] Written AI Governance Policy, reviewed within the last 12 months
[ ] Register of all AI tools in use, including any "shadow AI"
[ ] Records of what personal/customer data flows into each AI tool
[ ] Audit logs for material AI-assisted decisions (see Monitoring Policy)
[ ] Vendor AI risk assessments for any third-party AI product in use
[ ] Documented lawful basis for any AI processing of personal data
[ ] DPIA (Data Protection Impact Assessment) for high-risk AI use cases
[ ] Incident log: any AI errors, bias findings, or customer complaints
[ ] Evidence of human review for any automated decision with legal or
    significant effect on a customer
[ ] Mapping of which AI regulations apply to you (EU AI Act, UK/US sector
    rules, GDPR, sector-specific rules) and your status against each

KNOWN GAPS BASED ON YOUR ASSESSMENT
${gapsForDimension(params.redFlags, "regulatory_readiness")}

This checklist should be reviewed every time you adopt a new AI tool, enter
a new jurisdiction, or after any material AI incident.
`;
}

const GENERATORS: Record<DocumentType, (params: GenerateParams) => string> = {
  charter,
  tools_policy: toolsPolicy,
  governance_policy: governancePolicy,
  monitoring_policy: monitoringPolicy,
  vendor_questionnaire: vendorQuestionnaire,
  evidence_checklist: evidenceChecklist,
};

export function generateGovernanceDocument(type: DocumentType, params: GenerateParams): { title: string; content: string } {
  const meta = GOVERNANCE_DOCUMENTS.find((d) => d.type === type);
  if (!meta) throw new Error(`Unknown document type: ${type}`);
  return { title: meta.title, content: GENERATORS[type](params) };
}
