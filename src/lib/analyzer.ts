import type { AnalysisResult, Severity } from "@/types";
import { SEVERITY_DEDUCTIONS } from "./constants";

interface Rule {
  category: string;
  severity: Severity;
  keywords: string[];
  flag_description: string;
  suggestion: string;
}

const RULES: Rule[] = [
  {
    category: "income_claim",
    severity: "high",
    keywords: [
      "six figures",
      "seven figures",
      "earn $",
      "make $",
      "make money fast",
      "passive income",
      "quit your job",
      "financial freedom",
      "get rich",
      "unlimited income",
    ],
    flag_description:
      "Contains an income or earnings claim that may require FTC substantiation.",
    suggestion:
      'Add a clear earnings disclaimer: "Results are not typical. Individual results will vary." Provide data on average results if available.',
  },
  {
    category: "urgency",
    severity: "medium",
    keywords: [
      "limited time",
      "expires tonight",
      "act now",
      "hurry",
      "don't wait",
      "today only",
      "offer ends",
      "last chance",
      "ending soon",
    ],
    flag_description:
      "Uses urgency language that may be considered manipulative if the deadline is artificial.",
    suggestion:
      "Only use deadline language if the offer genuinely expires. Document the real end date and honor it.",
  },
  {
    category: "scarcity",
    severity: "medium",
    keywords: [
      "only 3 left",
      "only 5 left",
      "limited spots",
      "limited seats",
      "almost sold out",
      "selling fast",
      "running out",
      "exclusive access",
    ],
    flag_description:
      "Claims scarcity of product or spots. Must be factually accurate or risks deceptive marketing.",
    suggestion:
      "Ensure scarcity claims reflect real inventory counts. Use a live counter or remove if not verifiable.",
  },
  {
    category: "testimonial",
    severity: "medium",
    keywords: [
      "i made",
      "i earned",
      "i lost",
      "i gained",
      "customer says",
      "client testimonial",
      "success story",
      "they said",
    ],
    flag_description:
      "Contains a testimonial. FTC guidelines require disclosure of material connections and typicality disclaimers.",
    suggestion:
      'Add: "Results not typical. This individual\'s experience may not reflect yours." Disclose any paid endorsements.',
  },
  {
    category: "guarantee",
    severity: "low",
    keywords: [
      "money back guarantee",
      "risk free",
      "risk-free",
      "100% guaranteed",
      "satisfaction guaranteed",
      "no questions asked",
      "full refund",
    ],
    flag_description:
      "Offers a guarantee. Ensure the guarantee terms in the sales copy match those in your Terms of Service.",
    suggestion:
      "Cross-check refund window, conditions, and process against your TOS. Any mismatch is a contract contradiction.",
  },
  {
    category: "health_claim",
    severity: "high",
    keywords: [
      "cure",
      "treat",
      "heal",
      "fda approved",
      "clinically proven",
      "medically proven",
      "doctor recommended",
      "lose weight fast",
      "burn fat",
      "detox",
      "boost immunity",
    ],
    flag_description:
      "Contains a health or medical claim that may require FDA approval or clinical substantiation.",
    suggestion:
      'Replace definitive health claims with qualified language: "may support," "some users report." Consult an FDA compliance attorney before launching.',
  },
  {
    category: "legal_disclaimer",
    severity: "low",
    keywords: [
      "not responsible",
      "no liability",
      "results may vary",
      "individual results",
      "as seen on",
      "endorsed by",
    ],
    flag_description:
      "Disclaimer language detected. Verify it is complete, visible, and not buried in fine print.",
    suggestion:
      "Disclaimers must be clear and conspicuous — not hidden in footers or fine print. Bold or increase font size.",
  },
  {
    category: "contract_contradiction",
    severity: "high",
    keywords: [
      "no refund",
      "non-refundable",
      "all sales final",
      "no cancellation",
      "cannot cancel",
    ],
    flag_description:
      'Sales copy may promise refunds while this clause says "no refunds" — a direct claim vs. contract contradiction.',
    suggestion:
      "Audit your TOS against all guarantee language in your funnel. One of them must change to eliminate the contradiction.",
  },
];

function extractExcerpt(content: string, index: number): string {
  const start = Math.max(0, index - 60);
  const end = Math.min(content.length, index + 60);
  const excerpt = content.slice(start, end).replace(/\s+/g, " ").trim();
  return (start > 0 ? "…" : "") + excerpt + (end < content.length ? "…" : "");
}

export function analyzeContent(
  title: string,
  content: string
): AnalysisResult {
  const lower = content.toLowerCase();
  const seenCategories = new Set<string>();
  const flags: AnalysisResult["flags"] = [];

  for (const rule of RULES) {
    if (seenCategories.has(rule.category)) continue;

    for (const keyword of rule.keywords) {
      const idx = lower.indexOf(keyword);
      if (idx !== -1) {
        seenCategories.add(rule.category);
        flags.push({
          category: rule.category,
          severity: rule.severity,
          text_excerpt: extractExcerpt(content, idx),
          flag_description: rule.flag_description,
          suggestion: rule.suggestion,
        });
        break;
      }
    }
  }

  const deduction = flags.reduce(
    (sum, f) => sum + (SEVERITY_DEDUCTIONS[f.severity] ?? 0),
    0
  );
  const score = Math.max(0, 100 - deduction);

  return { score, flags };
}
