/**
 * AI Governance Audit Tool
 * Quiz framework, scoring logic, and governance assessment engine
 *
 * 6 dimensions, 24 total questions
 * Scoring: 0-100 governance maturity score
 * Risk levels: Critical (0-30), Moderate (31-60), Managed (61-80), Mature (81-100)
 */

export type RiskLevel = 'critical' | 'moderate' | 'managed' | 'mature';
export type Dimension =
  | 'strategy_ownership'
  | 'tool_data_governance'
  | 'policy_documentation'
  | 'monitoring_accountability'
  | 'vendor_risk'
  | 'regulatory_readiness';

export interface Answer {
  questionId: string;
  dimension: Dimension;
  value: string;
  riskPoints: number; // 0, 1, 2, or 3
}

export interface RoadmapAction {
  phase: 'quick_wins' | 'medium_term' | 'strategic';
  title: string;
  description: string;
  dimension: Dimension;
  effort: 'low' | 'medium' | 'high';
  impact: 'high' | 'medium' | 'low';
  owner: string;
  timeline: string;
}

export type RoadmapStatus = 'not_started' | 'in_progress' | 'done';

export interface TrackedRoadmapAction extends RoadmapAction {
  id: string;
  status: RoadmapStatus;
}

// Stamps a stable id + initial status onto each roadmap action so it can be
// persisted and its progress tracked over time (account-linked assessments only).
export function trackRoadmap(roadmap: RoadmapAction[]): TrackedRoadmapAction[] {
  return roadmap.map((action, i) => ({
    ...action,
    id: `${action.dimension}-${action.phase}-${i}`,
    status: 'not_started',
  }));
}

export interface GovernanceQuizResponse {
  email: string;
  answers: Answer[];
  dimensionScores: Record<Dimension, number>; // 0-30 per dimension
  overallScore: number; // 0-100
  riskLevel: RiskLevel;
  redFlags: RedFlag[];
  roadmap: RoadmapAction[];
  // True for Growth and Sentinel accounts — every red flag + the full roadmap
  // is unlocked (the diagnosis). False for free/anonymous: only the first red
  // flag carries description/recommendation/regulatoryContext, the rest are
  // stripped to title-only, and roadmap is empty (see roadmapCount).
  fullAccess: boolean;
  // True only for Sentinel — the roadmap is persisted as a tracked, status-
  // toggling checklist in /governance, and all 6 documents are unlocked.
  // Growth gets fullAccess (the diagnosis) but not managed (the fix), plus
  // one free document as a taste of what Sentinel manages in full.
  managed: boolean;
  roadmapCount: number;
}

export interface RedFlag {
  severity: 'high' | 'medium' | 'low';
  dimension: Dimension;
  title: string;
  description: string;
  recommendation: string;
  regulatoryContext: string[]; // e.g., ['EU AI Act', 'SEC 2026', 'Munir v SSHD']
  unlocked?: boolean;
}

// ============================================================
// QUIZ DIMENSIONS & QUESTIONS
// ============================================================

export const GOVERNANCE_DIMENSIONS = {
  strategy_ownership: {
    title: 'Strategy & Decision Rights',
    subtitle: 'Does your organization own who decides about AI?',
    context: 'CFO/Board layer governance',
    category: 'Strategic',
    maxScore: 30,
  },
  tool_data_governance: {
    title: 'Tool & Data Governance',
    subtitle: 'Do you know which AI tools are being used and what data goes into them?',
    context: 'IT/Security layer governance',
    category: 'Operational',
    maxScore: 30,
  },
  policy_documentation: {
    title: 'Policy & Documentation',
    subtitle: 'Do you have written policies, and do they match what\'s actually happening?',
    context: 'Compliance/Legal layer governance',
    category: 'Legal',
    maxScore: 30,
  },
  monitoring_accountability: {
    title: 'Monitoring & Outcome Accountability',
    subtitle: 'Do you monitor what your AI systems actually do, and can you prove it?',
    context: 'Finance/Risk layer governance',
    category: 'Financial',
    maxScore: 30,
  },
  vendor_risk: {
    title: 'Vendor & Third-Party Risk',
    subtitle: 'Do you assess vendors and require governance compliance?',
    context: 'Procurement/Legal layer governance',
    category: 'Risk Management',
    maxScore: 30,
  },
  regulatory_readiness: {
    title: 'Regulatory Readiness & Evidence',
    subtitle: 'If a regulator asked for proof, could you provide it?',
    context: 'External compliance layer governance',
    category: 'Regulatory',
    maxScore: 30,
  },
} as const;

// ============================================================
// DIMENSION 1: STRATEGY & DECISION RIGHTS
// ============================================================

export const STRATEGY_QUESTIONS = [
  {
    id: 'strat_1',
    dimension: 'strategy_ownership' as const,
    question: 'Who is responsible for AI governance in your organization?',
    options: [
      {
        text: 'No one identified / unclear ownership',
        riskPoints: 3,
        context: 'No owner = no accountability',
      },
      {
        text: 'CIO / CTO (technology-focused)',
        riskPoints: 2,
        context: 'Partial coverage; misses finance/board layer',
      },
      {
        text: 'CFO or dedicated governance officer',
        riskPoints: 1,
        context: 'Strong ownership; finance perspective',
      },
      {
        text: 'Cross-functional governance committee (CFO + CIO + Chief Risk + Legal)',
        riskPoints: 0,
        context: 'Ideal: multi-stakeholder ownership',
      },
    ],
  },
  {
    id: 'strat_2',
    dimension: 'strategy_ownership' as const,
    question: 'Has your board approved a formal AI governance policy?',
    options: [
      {
        text: 'No policy exists',
        riskPoints: 3,
        context: 'High risk: no board mandate',
      },
      {
        text: 'Informal policy / guidelines only',
        riskPoints: 2,
        context: 'Partial; not documented for regulators',
      },
      {
        text: 'Yes, formal policy approved by board in past 12 months',
        riskPoints: 0,
        context: 'Strong: current board mandate',
      },
      {
        text: 'Yes, but >12 months old',
        riskPoints: 1,
        context: 'Approved but may need refresh',
      },
    ],
  },
  {
    id: 'strat_3',
    dimension: 'strategy_ownership' as const,
    question: 'Does your CFO understand AI spending and compliance liability?',
    options: [
      {
        text: 'No awareness / not on CFO radar',
        riskPoints: 3,
        context: 'Critical gap: finance blind to AI spend + risk',
      },
      {
        text: 'Partial understanding (aware of some spend, limited liability knowledge)',
        riskPoints: 2,
        context: 'Moderate gap: incomplete visibility',
      },
      {
        text: 'Full understanding (tracks spend, knows compliance penalties, understands risk)',
        riskPoints: 0,
        context: 'Strong: informed financial stewardship',
      },
    ],
  },
  {
    id: 'strat_4',
    dimension: 'strategy_ownership' as const,
    question: 'Do you have decision rights defined for approving new AI tools or deployments?',
    options: [
      {
        text: 'No formal decision process',
        riskPoints: 3,
        context: 'Risky: ad-hoc tool adoption',
      },
      {
        text: 'Informal / inconsistent process',
        riskPoints: 2,
        context: 'Gaps in coverage; depends on person/moment',
      },
      {
        text: 'Formal process, but only for business-critical AI',
        riskPoints: 1,
        context: 'Partial coverage; shadow AI may slip through',
      },
      {
        text: 'Formal, documented process for all AI tool/deployment approvals',
        riskPoints: 0,
        context: 'Strong: consistent governance gate',
      },
    ],
  },
  {
    id: 'strat_5',
    dimension: 'strategy_ownership' as const,
    question: 'How often does your governance leadership review AI risk and spending?',
    options: [
      {
        text: 'Never / not scheduled',
        riskPoints: 3,
        context: 'Zero oversight cadence',
      },
      {
        text: 'Quarterly or less frequently',
        riskPoints: 1,
        context: 'Minimal oversight',
      },
      {
        text: 'Monthly',
        riskPoints: 0,
        context: 'Strong: regular governance cadence',
      },
    ],
  },
];

// ============================================================
// DIMENSION 2: TOOL & DATA GOVERNANCE
// ============================================================

export const TOOL_DATA_QUESTIONS = [
  {
    id: 'tool_1',
    dimension: 'tool_data_governance' as const,
    question: 'How many unapproved AI tools is your organization currently using?',
    options: [
      {
        text: '20+ unapproved tools',
        riskPoints: 3,
        context: 'Severe shadow AI problem',
      },
      {
        text: '6-20 unapproved tools',
        riskPoints: 2,
        context: 'Significant shadow AI usage',
      },
      {
        text: '1-5 unapproved tools',
        riskPoints: 1,
        context: 'Some shadow AI; manageable',
      },
      {
        text: 'Zero / we don\'t know (and are investigating)',
        riskPoints: 0,
        context: 'Strong visibility or active remediation',
      },
      {
        text: 'Don\'t know',
        riskPoints: 3,
        context: 'Critical: no visibility into tools',
      },
    ],
  },
  {
    id: 'tool_2',
    dimension: 'tool_data_governance' as const,
    question: 'What percentage of your employees are using personal AI accounts (ChatGPT, Claude, Gemini, etc.) for work?',
    options: [
      {
        text: '51%+ (majority)',
        riskPoints: 3,
        context: 'Majority of workforce on personal tools',
      },
      {
        text: '26-50%',
        riskPoints: 3,
        context: 'Substantial personal tool usage',
      },
      {
        text: '6-25%',
        riskPoints: 1,
        context: 'Moderate personal tool usage',
      },
      {
        text: '0-5%',
        riskPoints: 0,
        context: 'Low personal tool usage',
      },
      {
        text: 'Don\'t know',
        riskPoints: 3,
        context: 'No visibility into employee usage',
      },
    ],
  },
  {
    id: 'tool_3',
    dimension: 'tool_data_governance' as const,
    question: 'Do you monitor what data goes into approved AI tools?',
    options: [
      {
        text: 'No monitoring',
        riskPoints: 3,
        context: 'Complete data visibility gap',
      },
      {
        text: 'Annual audits only',
        riskPoints: 2,
        context: 'Infrequent checks',
      },
      {
        text: 'Monthly spot checks',
        riskPoints: 1,
        context: 'Periodic but not continuous',
      },
      {
        text: 'Real-time monitoring / DLP controls',
        riskPoints: 0,
        context: 'Strong: continuous visibility',
      },
    ],
  },
  {
    id: 'tool_4',
    dimension: 'tool_data_governance' as const,
    question: 'Have you experienced a data breach or security incident involving AI tool usage?',
    options: [
      {
        text: 'Yes, confirmed breach',
        riskPoints: 3,
        context: 'Incident already happened',
      },
      {
        text: 'Suspected, but not confirmed',
        riskPoints: 2,
        context: 'Possible incident',
      },
      {
        text: 'No known incidents',
        riskPoints: 0,
        context: 'No incident to date',
      },
      {
        text: 'Don\'t know',
        riskPoints: 2,
        context: 'Lack of visibility into incidents',
      },
    ],
  },
  {
    id: 'tool_5',
    dimension: 'tool_data_governance' as const,
    question: 'When an AI agent or tool connects to a system (CRM, ERP, knowledge base), are its data access permissions scoped to what it actually needs, or does it get broad default access?',
    options: [
      {
        text: 'Broad default access, nobody has reviewed the scope',
        riskPoints: 3,
        context: 'Unreviewed broad access is the most common source of unintended AI data exposure',
      },
      {
        text: 'Some tools reviewed, most have not been checked',
        riskPoints: 2,
        context: 'Partial visibility into access scope',
      },
      {
        text: 'Most tools scoped per role, a few legacy exceptions',
        riskPoints: 1,
        context: 'Mostly scoped, residual gaps',
      },
      {
        text: 'Every AI tool\'s access is scoped and reviewed on a schedule',
        riskPoints: 0,
        context: 'Strong: access reviewed and minimised by design',
      },
      {
        text: 'Don\'t know',
        riskPoints: 3,
        context: 'No visibility into what data AI agents can actually reach',
      },
    ],
  },
];

// ============================================================
// DIMENSION 3: POLICY & DOCUMENTATION
// ============================================================

export const POLICY_QUESTIONS = [
  {
    id: 'policy_1',
    dimension: 'policy_documentation' as const,
    question: 'Do you have a written AI governance policy?',
    options: [
      {
        text: 'No policy exists',
        riskPoints: 3,
        context: 'No documented governance',
      },
      {
        text: 'Informal guidelines only (not formal policy)',
        riskPoints: 2,
        context: 'Partial documentation',
      },
      {
        text: 'Yes, formal policy but >12 months old',
        riskPoints: 1,
        context: 'Outdated policy',
      },
      {
        text: 'Yes, formal policy updated in past 12 months',
        riskPoints: 0,
        context: 'Current, documented governance',
      },
    ],
  },
  {
    id: 'policy_2',
    dimension: 'policy_documentation' as const,
    question: 'Does your AI governance policy address these critical areas? (Select all that apply)',
    options: [
      {
        text: 'Data privacy & confidentiality',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'Vendor risk assessment & management',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'Model transparency & explainability',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'Prohibited use cases (e.g., client data, medical decisions)',
        riskPoints: 0,
        isSubQuestion: true,
      },
    ],
    scoringLogic: 'countChecked',
    // If 4/4 checked: 0 pts, 3/4: 1 pt, 2/4: 2 pts, 0-1/4: 3 pts
  },
  {
    id: 'policy_3',
    dimension: 'policy_documentation' as const,
    question: 'Have you conducted an AI governance audit or assessment?',
    options: [
      {
        text: 'Yes, annual audit or continuous assessment',
        riskPoints: 0,
        context: 'Regular validation',
      },
      {
        text: 'Yes, but only once (>12 months ago)',
        riskPoints: 1,
        context: 'One-time assessment',
      },
      {
        text: 'No',
        riskPoints: 2,
        context: 'No assessment conducted',
      },
      {
        text: 'Don\'t know',
        riskPoints: 2,
        context: 'Unclear if assessment happened',
      },
    ],
  },
];

// ============================================================
// DIMENSION 4: MONITORING & OUTCOME ACCOUNTABILITY
// ============================================================

export const MONITORING_QUESTIONS = [
  {
    id: 'monitor_1',
    dimension: 'monitoring_accountability' as const,
    question: 'Do you monitor AI system outputs for drift, bias, or unintended consequences?',
    options: [
      {
        text: 'No monitoring',
        riskPoints: 3,
        context: 'Misalignment happens silently',
      },
      {
        text: 'Quarterly audits or manual spot checks',
        riskPoints: 1,
        context: 'Infrequent checks; lag in detection',
      },
      {
        text: 'Monthly monitoring & reporting',
        riskPoints: 1,
        context: 'Regular but not real-time',
      },
      {
        text: 'Real-time / continuous monitoring',
        riskPoints: 0,
        context: 'Strong: immediate drift detection',
      },
    ],
  },
  {
    id: 'monitor_2',
    dimension: 'monitoring_accountability' as const,
    question: 'Can you produce an audit trail showing who approved a specific AI decision (within 24 hours)?',
    options: [
      {
        text: 'No / cannot produce',
        riskPoints: 3,
        context: 'Forensic accountability gap',
      },
      {
        text: 'Can produce within a week',
        riskPoints: 2,
        context: 'Delayed evidence',
      },
      {
        text: 'Can produce within 24 hours',
        riskPoints: 1,
        context: 'Reasonable timeliness',
      },
      {
        text: 'Yes, automated/real-time audit trail',
        riskPoints: 0,
        context: 'Strong: immutable records',
      },
    ],
  },
  {
    id: 'monitor_3',
    dimension: 'monitoring_accountability' as const,
    question: 'Have you experienced a situation where an AI system optimized for the wrong metric?',
    options: [
      {
        text: 'Yes, multiple incidents',
        riskPoints: 3,
        context: 'Repeated metric misalignment',
      },
      {
        text: 'Yes, one incident',
        riskPoints: 3,
        context: 'Misalignment incident occurred',
      },
      {
        text: 'No, but we have monitoring to catch it',
        riskPoints: 0,
        context: 'Proactive prevention',
      },
      {
        text: 'No, don\'t know if it\'s happened',
        riskPoints: 2,
        context: 'Visibility gap',
      },
    ],
  },
  {
    id: 'monitor_4',
    dimension: 'monitoring_accountability' as const,
    question: 'Do you have automated controls to prevent prohibited AI use cases?',
    options: [
      {
        text: 'No automated controls',
        riskPoints: 3,
        context: 'Relying on manual enforcement',
      },
      {
        text: 'Automated controls for high-risk use cases only',
        riskPoints: 1,
        context: 'Partial automation',
      },
      {
        text: 'Automated controls for all identified prohibited cases',
        riskPoints: 0,
        context: 'Strong: enforcement at scale',
      },
    ],
  },
];

// ============================================================
// DIMENSION 5: VENDOR & THIRD-PARTY RISK
// ============================================================

export const VENDOR_QUESTIONS = [
  {
    id: 'vendor_1',
    dimension: 'vendor_risk' as const,
    question: 'Do you assess third-party AI vendors before adoption?',
    options: [
      {
        text: 'No formal assessment process',
        riskPoints: 3,
        context: 'Ad-hoc vendor selection',
      },
      {
        text: 'Informal assessment (checklist, conversation)',
        riskPoints: 2,
        context: 'Partial due diligence',
      },
      {
        text: 'Formal assessment process for all vendors',
        riskPoints: 0,
        context: 'Rigorous vendor vetting',
      },
    ],
  },
  {
    id: 'vendor_2',
    dimension: 'vendor_risk' as const,
    question: 'Do your vendor contracts require these protections? (Select all that apply)',
    options: [
      {
        text: 'Data privacy & confidentiality clauses',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'Audit rights / compliance access',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'Liability caps & indemnification',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'Exit / transition clauses',
        riskPoints: 0,
        isSubQuestion: true,
      },
    ],
    scoringLogic: 'countChecked',
    // If 4/4: 0 pts, 3/4: 1 pt, 2/4: 2 pts, 0-1/4: 3 pts
  },
  {
    id: 'vendor_3',
    dimension: 'vendor_risk' as const,
    question: 'Have you mapped which vendors handle what data in your AI stack?',
    options: [
      {
        text: 'No data map exists',
        riskPoints: 2,
        context: 'Visibility gap',
      },
      {
        text: 'Partial map (some vendors documented)',
        riskPoints: 1,
        context: 'Incomplete visibility',
      },
      {
        text: 'Complete map of all vendors & data flows',
        riskPoints: 0,
        context: 'Full visibility',
      },
      {
        text: 'Don\'t know',
        riskPoints: 2,
        context: 'No visibility into vendor data',
      },
    ],
  },
];

// ============================================================
// DIMENSION 6: REGULATORY READINESS & EVIDENCE
// ============================================================

export const REGULATORY_QUESTIONS = [
  {
    id: 'reg_1',
    dimension: 'regulatory_readiness' as const,
    question: 'Which regulatory frameworks do you need to comply with? (Select all that apply)',
    options: [
      {
        text: 'EU AI Act',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'GDPR',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'FTC AI Act enforcement / marketing rules',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'SEC rules (if you\'re an RIA or investment firm)',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'Industry-specific (healthcare, finance, insurance)',
        riskPoints: 0,
        isSubQuestion: true,
      },
      {
        text: 'None identified',
        riskPoints: 3,
        context: 'If checked alone: risky oversight',
      },
    ],
    scoringLogic: 'custom',
    // If "None identified" is only answer: 3 pts
    // If frameworks identified: 0 pts
  },
  {
    id: 'reg_2',
    dimension: 'regulatory_readiness' as const,
    question: 'Have you conducted a regulatory gap assessment for AI?',
    options: [
      {
        text: 'Yes, annually',
        riskPoints: 0,
        context: 'Strong: regular validation',
      },
      {
        text: 'Yes, but only once (>12 months ago)',
        riskPoints: 2,
        context: 'Outdated assessment',
      },
      {
        text: 'No',
        riskPoints: 2,
        context: 'No gap assessment',
      },
    ],
  },
  {
    id: 'reg_3',
    dimension: 'regulatory_readiness' as const,
    question: 'Can you produce evidence of AI governance for an audit or examination?',
    options: [
      {
        text: 'No / cannot produce',
        riskPoints: 3,
        context: 'Munir ruling: governance you cannot demonstrate = liability',
      },
      {
        text: 'Partial evidence (some documentation, gaps in coverage)',
        riskPoints: 2,
        context: 'Incomplete evidence package',
      },
      {
        text: 'Complete evidence package (policies, decisions, audits, outcomes)',
        riskPoints: 0,
        context: 'Audit-ready documentation',
      },
      {
        text: 'Don\'t know',
        riskPoints: 3,
        context: 'Unclear if evidence exists',
      },
    ],
  },
  {
    id: 'reg_4',
    dimension: 'regulatory_readiness' as const,
    question: 'Have you disclosed AI governance to your board or investors?',
    options: [
      {
        text: 'Yes, formal reporting (board deck, annual update)',
        riskPoints: 0,
        context: 'Strong: board transparency',
      },
      {
        text: 'Yes, informal disclosure',
        riskPoints: 1,
        context: 'Partial transparency',
      },
      {
        text: 'No',
        riskPoints: 1,
        context: 'Board awareness gap',
      },
    ],
  },
];

// ============================================================
// SCORING & RED FLAG GENERATION
// ============================================================

export function calculateScores(answers: Answer[]): GovernanceQuizResponse['dimensionScores'] {
  const risk: Record<Dimension, number> = {
    strategy_ownership: 0,
    tool_data_governance: 0,
    policy_documentation: 0,
    monitoring_accountability: 0,
    vendor_risk: 0,
    regulatory_readiness: 0,
  };
  const counts: Record<Dimension, number> = {
    strategy_ownership: 0,
    tool_data_governance: 0,
    policy_documentation: 0,
    monitoring_accountability: 0,
    vendor_risk: 0,
    regulatory_readiness: 0,
  };

  // Accumulate risk points and number of questions answered per dimension.
  answers.forEach(answer => {
    risk[answer.dimension] += answer.riskPoints;
    counts[answer.dimension] += 1;
  });

  // Convert to a 0-100 MATURITY score per dimension (higher = better).
  // Max risk per question is 3, so max risk for a dimension = questions × 3.
  const scores: Record<Dimension, number> = {
    strategy_ownership: 0,
    tool_data_governance: 0,
    policy_documentation: 0,
    monitoring_accountability: 0,
    vendor_risk: 0,
    regulatory_readiness: 0,
  };
  (Object.keys(scores) as Dimension[]).forEach(dim => {
    const maxRisk = (counts[dim] || 0) * 3 || 1;
    const riskFraction = Math.min(1, Math.max(0, risk[dim] / maxRisk));
    scores[dim] = Math.round((1 - riskFraction) * 100);
  });

  return scores;
}

export function calculateOverallScore(dimensionScores: Record<Dimension, number>): number {
  const dimensions = Object.values(dimensionScores);
  const average = dimensions.reduce((a, b) => a + b, 0) / dimensions.length;
  return Math.round(average); // average of the six 0-100 dimension maturity scores
}

// Maturity bands (higher = better)
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'mature';
  if (score >= 60) return 'managed';
  if (score >= 40) return 'moderate';
  return 'critical';
}

export function generateRedFlags(
  dimensionScores: Record<Dimension, number>,
  answers: Answer[]
): RedFlag[] {
  const flags: RedFlag[] = [];

  // Strategy & Ownership red flags
  if (dimensionScores.strategy_ownership < 33) {
    flags.push({
      severity: 'high',
      dimension: 'strategy_ownership',
      title: 'Unclear AI Governance Ownership',
      description: 'Your organization lacks a clear owner for AI governance. This gaps accountability and executive oversight.',
      recommendation: 'Appoint a named executive (CFO or CIO) as AI Governance Owner in writing, with board sign-off recorded in the next board minutes. Within 30 days, convene a cross-functional AI Governance Committee including Legal, Risk, and at least one business unit lead. Document the committee charter, meeting cadence, and escalation path. This single step closes the accountability gap that regulators and courts (Mobley v. Workday, 2026) test first: who owned the decision, and can you prove it?',
      regulatoryContext: ['Brad Wolfe: "ownership gap is the real gap"', 'SEC 2026 exams test decision rights', 'ISO 42001 Clause 5: Leadership and roles', 'NIST AI RMF Govern 1.1: Accountability structures', 'OECD AI Principles: Accountability'],
    });
  }

  // Tool & Data Governance red flags
  if (dimensionScores.tool_data_governance < 33) {
    flags.push({
      severity: 'high',
      dimension: 'tool_data_governance',
      title: 'High Shadow AI Usage / Data Visibility Gap',
      description: 'You have significant unapproved AI tool usage or lack visibility into what data is going into tools.',
      recommendation: 'Run a full AI tool inventory across every team: ask each department head to list every AI tool in use, approved or not, within two weeks. Cross-reference against your approved software register and flag any tool touching customer data, financial records, or personally identifiable information. Implement a Data Loss Prevention policy that blocks unapproved tools from accessing sensitive data stores, and set a monthly data governance review as a standing agenda item. Shadow AI is not an IT problem — it is a liability that sits with whoever deployed the tool, whether they knew about it or not.',
      regulatoryContext: ['Artem Gabrielyan: "gap between policy and practice is the exam"', 'Munir v SSHD: governance you cannot demonstrate = liability', 'ISO 42001 Clause 8.1: Operational planning and control', 'NIST AI RMF Map 1.1: Context and AI system inventory', 'OECD AI Principles: Transparency and explainability'],
    });
  }

  // Policy & Documentation red flags
  if (dimensionScores.policy_documentation < 50) {
    flags.push({
      severity: 'high',
      dimension: 'policy_documentation',
      title: 'No Written AI Governance Policy',
      description: 'Your organization lacks a formal, documented AI governance policy. This exposes you to regulatory liability.',
      recommendation: 'Draft a single-page AI Governance Policy as the immediate priority — it does not need to be long, it needs to exist and be board-approved. Cover four things: what AI tools are permitted, what data they may not touch, who approves exceptions, and what the prohibited use cases are. Once approved, version it, date it, and store it somewhere auditable. A regulator does not need a 40-page document; they need proof that someone in authority made a decision and wrote it down.',
      regulatoryContext: ['SEC 2026 exams require written policies', 'EU AI Act requires governance documentation', 'ISO 42001 Clause 7.5: Documented information', 'NIST AI RMF Govern 1.2: Documented policies and procedures', 'OECD AI Principles: Robustness, security and safety'],
    });
  }

  // Monitoring & Accountability red flags
  if (dimensionScores.monitoring_accountability < 33) {
    flags.push({
      severity: 'high',
      dimension: 'monitoring_accountability',
      title: 'Cannot Prove AI Governance Happened',
      description: 'You lack audit trails and monitoring to prove what your AI systems are doing and who approved them.',
      recommendation: 'Configure immutable audit logging on every AI system that touches a decision: who ran it, when, on what input, and what it returned. Logs must be tamper-evident — a mutable spreadsheet is not an audit trail. Alongside logging, establish a quarterly output review to catch drift between what the model was approved to do and what it is actually doing. Compile these into a governance evidence package now, before you are asked for it — because the regulator asking is not the time to start building it.',
      regulatoryContext: ['Michael Shuler: "Can you prove exactly what happened?"', 'Munir v SSHD: governance you cannot demonstrate = liability', 'ISO 42001 Clause 9: Performance evaluation', 'NIST AI RMF Measure 2.7: Monitoring for drift and performance', 'OECD AI Principles: Accountability'],
    });
  }

  // Vendor Risk red flags
  if (dimensionScores.vendor_risk < 50) {
    flags.push({
      severity: 'medium',
      dimension: 'vendor_risk',
      title: 'Vendor AI Risk Not Assessed or Managed',
      description: 'You don\'t formally assess AI vendors or require governance compliance in contracts.',
      recommendation: 'Build a vendor AI assessment checklist covering five questions: what data does this vendor process, where is it stored, can you audit their AI outputs, who is liable if the AI causes harm, and can you exit the contract cleanly if they breach governance terms. Apply this checklist to every current AI vendor at next renewal, and make it a gate for any new vendor onboarding. Under delegated authority frameworks (insurance, financial services, legal) the regulator looks through to the vendor — "they did it, not us" is not a defence.',
      regulatoryContext: ['SEC Reg S-P requires vendor oversight', 'Artem Gabrielyan: "proof the review happened" angle for vendors', 'ISO 42001 Annex A.10: Supplier relationships', 'NIST AI RMF Govern 6.1: Third-party risk management', 'OECD AI Principles: Human-centred values and fairness'],
    });
  }

  // Regulatory Readiness red flags
  if (dimensionScores.regulatory_readiness < 33) {
    flags.push({
      severity: 'high',
      dimension: 'regulatory_readiness',
      title: 'Not Prepared for Regulatory Examination',
      description: 'You cannot produce evidence of AI governance to regulators, or are unaware of applicable frameworks.',
      recommendation: 'Map your applicable regulatory obligations first: EU AI Act if you operate in or sell to Europe (enforcement begins August 2026), GDPR if you process EU personal data, sector-specific rules if you are in financial services, legal, or healthcare. For each framework, identify the three to five controls you currently cannot evidence, and prioritise closing those gaps before the others. Then build a single audit-ready evidence package — a folder, physical or digital, that contains your policy, your logs, your vendor assessments, and your ownership structure. When the exam comes, you hand over the folder.',
      regulatoryContext: ['EU AI Act enforcement starts August 2026', 'SEC 2026 exams focus on AI governance', 'Munir v SSHD: prove governance or face liability', 'ISO 42001 Clause 9.2: Internal audit', 'NIST AI RMF Govern 1.5: Regulatory and legal compliance review', 'OECD AI Principles: International cooperation and standards'],
    });
  }

  // Sort by severity, then weakest dimension first (lower maturity = worse)
  return flags
    .sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return dimensionScores[a.dimension] - dimensionScores[b.dimension];
    })
    .slice(0, 5); // Top 5 red flags
}

export function generateRoadmap(
  dimensionScores: Record<Dimension, number>,
  redFlags: RedFlag[]
): RoadmapAction[] {
  const actions: RoadmapAction[] = [];

  // 90-DAY QUICK WINS (Low effort, high impact)
  if (dimensionScores.policy_documentation < 50) {
    actions.push({
      phase: 'quick_wins',
      title: 'Draft AI Governance Policy',
      description: 'Create a 1-page AI governance charter outlining decision rights, approved tools, data handling, and prohibited use cases.',
      dimension: 'policy_documentation',
      effort: 'low',
      impact: 'high',
      owner: 'Legal + CFO',
      timeline: '2-3 weeks',
    });
  }

  if (dimensionScores.strategy_ownership < 33) {
    actions.push({
      phase: 'quick_wins',
      title: 'Establish AI Governance Committee',
      description: 'Kick off monthly cross-functional governance committee (CFO, CIO, Chief Risk, Legal, Product).',
      dimension: 'strategy_ownership',
      effort: 'low',
      impact: 'high',
      owner: 'CFO',
      timeline: '1 week to schedule, then recurring',
    });
  }

  if (dimensionScores.tool_data_governance < 33) {
    actions.push({
      phase: 'quick_wins',
      title: 'Conduct AI Tool Audit',
      description: 'Identify all AI tools in use (approved + shadow). Map data inputs. Create approved tools list.',
      dimension: 'tool_data_governance',
      effort: 'low',
      impact: 'high',
      owner: 'IT + Security',
      timeline: '3-4 weeks',
    });
  }

  // 6-MONTH MEDIUM-TERM (Medium effort, high impact)
  if (dimensionScores.vendor_risk < 50) {
    actions.push({
      phase: 'medium_term',
      title: 'Implement Vendor AI Assessment Process',
      description: 'Build vendor AI risk scorecard. Update vendor contracts with data privacy, audit rights, and liability protections.',
      dimension: 'vendor_risk',
      effort: 'medium',
      impact: 'high',
      owner: 'Procurement + Legal',
      timeline: '8-12 weeks',
    });
  }

  if (dimensionScores.monitoring_accountability < 33) {
    actions.push({
      phase: 'medium_term',
      title: 'Set Up AI Monitoring & Audit Trails',
      description: 'Implement logging for all AI system outputs. Set up dashboards for output drift, performance anomalies, and usage patterns.',
      dimension: 'monitoring_accountability',
      effort: 'medium',
      impact: 'high',
      owner: 'CIO + Data team',
      timeline: '12-16 weeks',
    });
  }

  // 12-MONTH STRATEGIC (High effort, transformational)
  if (dimensionScores.regulatory_readiness < 33) {
    actions.push({
      phase: 'strategic',
      title: 'Build Regulatory Evidence Package',
      description: 'Create audit-ready governance evidence (policies, logs, assessment records, remediation proof) mapped to EU AI Act, SEC, GDPR, FTC requirements.',
      dimension: 'regulatory_readiness',
      effort: 'high',
      impact: 'high',
      owner: 'Compliance + CFO',
      timeline: '16-24 weeks (ongoing)',
    });
  }

  if (dimensionScores.strategy_ownership < 50) {
    actions.push({
      phase: 'strategic',
      title: 'Build AI Financial Impact Model',
      description: 'Model potential compliance costs, regulatory penalties, and operational risk. Use to justify ongoing governance investment.',
      dimension: 'strategy_ownership',
      effort: 'medium',
      impact: 'medium',
      owner: 'CFO',
      timeline: '12-16 weeks',
    });
  }

  return actions.sort((a, b) => {
    const phaseOrder = { quick_wins: 0, medium_term: 1, strategic: 2 };
    return phaseOrder[a.phase] - phaseOrder[b.phase];
  });
}

// ============================================================
// PEER BENCHMARKING (fallback estimate)
// ============================================================
// /api/governance-audit/benchmark computes the real anonymized average and
// quartiles from governance_audit_emails once enough assessments exist
// (see MIN_SAMPLE_SIZE there). This stays as the fallback shown until then.

export const PEER_BENCHMARK = {
  overall: {
    average: 35,
    quartile: {
      q1: 25,
      q2: 35,
      q3: 55,
      q4: 78,
    },
  },
  byIndustry: {
    technology: { average: 42, percentileHigher: 35 },
    finance: { average: 48, percentileHigher: 28 },
    healthcare: { average: 45, percentileHigher: 32 },
    manufacturing: { average: 38, percentileHigher: 45 },
    retail: { average: 32, percentileHigher: 58 },
    other: { average: 33, percentileHigher: 60 },
  },
};

// ============================================================
// ALL QUIZ QUESTIONS (COMBINED)
// ============================================================

export const ALL_QUESTIONS = [
  ...STRATEGY_QUESTIONS,
  ...TOOL_DATA_QUESTIONS,
  ...POLICY_QUESTIONS,
  ...MONITORING_QUESTIONS,
  ...VENDOR_QUESTIONS,
  ...REGULATORY_QUESTIONS,
];

export type QuizQuestion = (typeof ALL_QUESTIONS)[number];

// ============================================================
// SHORT QUIZ (public, free signal check)
// ============================================================
// 2 highest-signal questions per dimension, 12 total. This is the
// public entry point — fast enough to finish on mobile. The full
// 24-question ALL_QUESTIONS set becomes the deep assessment unlocked
// for Growth/Sentinel, asking more detailed, specific follow-up
// questions rather than just showing more of the same answers.
const SHORT_QUESTION_IDS = [
  'strat_1', 'strat_2',
  'tool_1', 'tool_5',
  'policy_1', 'policy_3',
  'monitor_1', 'monitor_2',
  'vendor_1', 'vendor_3',
  'reg_1', 'reg_3',
];

export const SHORT_QUESTIONS = SHORT_QUESTION_IDS.map(
  id => ALL_QUESTIONS.find(q => q.id === id)!
);
