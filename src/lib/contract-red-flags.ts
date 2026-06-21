export type ContractSeverity = "high" | "medium" | "low";

export interface ContractFlag {
  category: string;
  severity: ContractSeverity;
  title: string;
  description: string;
  whatToDo: string;
  matchedText: string;
}

interface ContractRule {
  category: string;
  severity: ContractSeverity;
  title: string;
  patterns: RegExp[];
  description: string;
  whatToDo: string;
}

const RULES: ContractRule[] = [
  {
    category: "auto_renewal",
    severity: "high",
    title: "Auto-renewal without easy exit",
    patterns: [
      /automatically renew/i,
      /auto-renew/i,
      /shall renew for (a |an )?(successive|additional)/i,
    ],
    description: "This contract renews itself unless you actively cancel — easy to miss the cancellation window and get locked in for another term.",
    whatToDo: "Check the exact cancellation notice period and put a reminder in your calendar well before it.",
  },
  {
    category: "unilateral_termination",
    severity: "high",
    title: "One-sided termination rights",
    patterns: [
      /may terminate.{0,40}(at any time|for any reason|in its sole discretion|without cause)/i,
      /sole discretion.{0,40}terminate/i,
    ],
    description: "The other party can end this agreement whenever they like, often without giving you the same right.",
    whatToDo: "Ask for mutual termination rights, or at minimum a defined notice period and reason requirement.",
  },
  {
    category: "unlimited_liability",
    severity: "high",
    title: "Uncapped or one-sided liability",
    patterns: [
      /unlimited liability/i,
      /no limitation of liability/i,
      /shall indemnify.{0,60}without limit/i,
    ],
    description: "You could be on the hook for damages with no ceiling — a single dispute could exceed the entire value of the contract.",
    whatToDo: "Push for a liability cap, typically tied to fees paid under the agreement (e.g. 12 months' fees).",
  },
  {
    category: "broad_indemnification",
    severity: "high",
    title: "Broad indemnification clause",
    patterns: [
      /indemnify and hold harmless/i,
      /defend.{0,30}indemnify/i,
    ],
    description: "You may be agreeing to cover the other party's legal costs and losses, even for issues you didn't directly cause.",
    whatToDo: "Narrow the indemnity to claims arising from your own breach or negligence, not all third-party claims.",
  },
  {
    category: "ip_assignment",
    severity: "high",
    title: "Broad IP assignment",
    patterns: [
      /assigns? all (right|title and interest)/i,
      /work product.{0,40}(sole and exclusive property|owned exclusively)/i,
    ],
    description: "Everything you create under this contract — including ideas adjacent to the work — may become the other party's property.",
    whatToDo: "Limit IP assignment to deliverables actually paid for, and carve out your own pre-existing tools/methods.",
  },
  {
    category: "non_compete",
    severity: "medium",
    title: "Non-compete or non-solicitation clause",
    patterns: [
      /non-compete/i,
      /shall not.{0,30}compete/i,
      /non-solicitation/i,
      /shall not solicit/i,
    ],
    description: "This restricts what work you can take on, or who you can contact, after the relationship ends — sometimes for years.",
    whatToDo: "Check the geographic scope and time period — these are often negotiable down to something reasonable.",
  },
  {
    category: "unilateral_amendment",
    severity: "medium",
    title: "Unilateral right to change terms",
    patterns: [
      /may (modify|amend|update) (this agreement|these terms).{0,40}at any time/i,
      /reserves the right to change.{0,40}without notice/i,
    ],
    description: "The other party can change the deal after you've already signed — sometimes without telling you.",
    whatToDo: "Require advance written notice of any changes, with a right to terminate if you don't accept them.",
  },
  {
    category: "arbitration_waiver",
    severity: "medium",
    title: "Mandatory arbitration / jury trial waiver",
    patterns: [
      /binding arbitration/i,
      /waive.{0,30}right to a jury trial/i,
      /class action waiver/i,
    ],
    description: "You may be giving up the right to sue in court or join a class action — disputes get resolved privately instead.",
    whatToDo: "Understand this trade-off before signing; arbitration can be faster but limits your legal options.",
  },
  {
    category: "unfavorable_governing_law",
    severity: "low",
    title: "Distant or unfamiliar governing law",
    patterns: [
      /governed by.{0,40}laws of/i,
      /exclusive jurisdiction.{0,40}courts of/i,
    ],
    description: "Disputes may need to be resolved in a jurisdiction far from you, increasing cost and complexity if something goes wrong.",
    whatToDo: "Confirm where the named jurisdiction is and what that means practically if a dispute arises.",
  },
  {
    category: "price_increase",
    severity: "medium",
    title: "Unilateral price increase rights",
    patterns: [
      /may increase (the )?(price|fees|rates).{0,40}(at any time|without (prior )?notice|in its (sole )?discretion)/i,
    ],
    description: "Pricing can go up during the term without you having agreed to the new number in advance.",
    whatToDo: "Ask for a cap on annual increases (e.g. tied to inflation) and advance notice before any change takes effect.",
  },
  {
    category: "data_ownership",
    severity: "high",
    title: "Unclear or unfavorable data ownership",
    patterns: [
      /(we|company) (own|retain ownership of).{0,40}(your data|all data|customer data)/i,
      /perpetual.{0,30}license.{0,30}your (data|content)/i,
    ],
    description: "The other party may retain rights to use or own data/content you provide, even after the contract ends.",
    whatToDo: "Confirm you retain ownership of your own data, with only a limited license granted for the service's operation.",
  },
  {
    category: "confidentiality_imbalance",
    severity: "low",
    title: "One-sided confidentiality obligations",
    patterns: [
      /you shall keep confidential.{0,80}company shall not/i,
    ],
    description: "Confidentiality duties may run only one way — protecting the other party's information, not yours.",
    whatToDo: "Ask for mutual confidentiality obligations covering both parties' sensitive information.",
  },
];

export function scanContract(text: string): ContractFlag[] {
  const flags: ContractFlag[] = [];

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        flags.push({
          category: rule.category,
          severity: rule.severity,
          title: rule.title,
          description: rule.description,
          whatToDo: rule.whatToDo,
          matchedText: match[0],
        });
        break;
      }
    }
  }

  return flags;
}
