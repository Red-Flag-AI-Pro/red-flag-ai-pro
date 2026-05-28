import type { AnalysisResult, Severity } from "@/types";
import { SEVERITY_DEDUCTIONS } from "./constants";

interface Rule {
  category: string;
  severity: Severity;
  keywords: string[];
  flag_description: string;
  suggestion: string;
  regulations: string[];
}

const RULES: Rule[] = [
  // ─── INCOME CLAIMS ───────────────────────────────────────────────────────────
  {
    category: "income_claim",
    severity: "high",
    keywords: [
      "six figures",
      "seven figures",
      "earn $",
      "earn £",
      "earn €",
      "make $",
      "make £",
      "make €",
      "make money fast",
      "passive income",
      "quit your job",
      "financial freedom",
      "get rich",
      "unlimited income",
      "replace your salary",
      "income from home",
      "work from home income",
      "financial independence",
      "extra income",
      "side income",
      "earn from home",
    ],
    flag_description:
      "Contains an income or earnings claim that may require substantiation. This is a high-priority violation across all major jurisdictions.",
    suggestion:
      'Add a clear earnings disclaimer: "Results are not typical. Individual results will vary based on effort, experience, and market conditions." Provide verified data on average customer results if available.',
    regulations: [
      "FTC (US)",
      "CMA (UK)",
      "ASA CAP Code (UK)",
      "ACCC (AU)",
      "Competition Bureau (CA)",
      "UCPD (EU)",
    ],
  },

  // ─── FAKE URGENCY ─────────────────────────────────────────────────────────────
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
      "price goes up",
      "doors closing",
      "closing soon",
      "this week only",
      "midnight tonight",
      "offer expires",
      "final hours",
    ],
    flag_description:
      "Uses urgency language that may be considered a dark pattern or manipulative commercial practice if the deadline is artificial.",
    suggestion:
      "Only use deadline language if the offer genuinely expires. Document the real end date and honour it. Do not reset countdown timers — this is specifically illegal under EU DSA and UCPD rules and targeted by the ACCC and CMA.",
    regulations: [
      "FTC (US)",
      "ASA CAP Code (UK)",
      "CMA (UK)",
      "ACCC (AU)",
      "UCPD (EU)",
      "DSA (EU)",
      "Competition Bureau (CA)",
    ],
  },

  // ─── FAKE SCARCITY ────────────────────────────────────────────────────────────
  {
    category: "scarcity",
    severity: "medium",
    keywords: [
      "only 3 left",
      "only 5 left",
      "only 10 left",
      "limited spots",
      "limited seats",
      "almost sold out",
      "selling fast",
      "running out",
      "exclusive access",
      "limited availability",
      "nearly full",
      "spaces filling up",
      "high demand",
      "going fast",
    ],
    flag_description:
      "Claims scarcity of product or spots. Must be factually accurate — fake scarcity is specifically named as an illegal dark pattern under EU DSA rules and is targeted by the ACCC and CMA.",
    suggestion:
      "Ensure all scarcity claims reflect real, verifiable inventory or availability. Use a live counter synced to actual stock or remove the claim entirely.",
    regulations: [
      "FTC (US)",
      "CMA (UK)",
      "ASA CAP Code (UK)",
      "ACCC (AU)",
      "UCPD (EU)",
      "DSA (EU)",
      "Competition Bureau (CA)",
    ],
  },

  // ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
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
      "real results",
      "case study",
      "here's what happened",
      "before and after",
      "transformed my",
    ],
    flag_description:
      "Contains a testimonial or results claim. All major regulators require disclosure of material connections and typicality disclaimers.",
    suggestion:
      'Add: "Results not typical. Individual results will vary." Disclose any paid, gifted, or incentivised endorsements. Under ACCC rules testimonials must reflect genuine, typical experiences. Under EU UCPD rules fake reviews carry significant fines.',
    regulations: [
      "FTC (US)",
      "ASA CAP Code (UK)",
      "CMA (UK)",
      "ACCC (AU)",
      "UCPD (EU)",
      "Competition Bureau (CA)",
    ],
  },

  // ─── GUARANTEES ───────────────────────────────────────────────────────────────
  {
    category: "guarantee",
    severity: "low",
    keywords: [
      "money back guarantee",
      "money-back guarantee",
      "risk free",
      "risk-free",
      "100% guaranteed",
      "satisfaction guaranteed",
      "no questions asked",
      "full refund",
      "guaranteed results",
      "we guarantee",
      "double your money back",
    ],
    flag_description:
      "Offers a guarantee. Guarantee terms in your sales copy must exactly match those in your Terms of Service across all jurisdictions.",
    suggestion:
      "Cross-check all refund terms against your TOS. Note: UK consumers have a statutory 14-day cooling off period. EU consumers have 14 days. Australian Consumer Law provides non-waivable guarantees. Canadian consumers have provincial rights. None of these can be contracted out of.",
    regulations: [
      "FTC (US)",
      "CMA + Consumer Rights Act 2015 (UK)",
      "ACCC + Australian Consumer Law (AU)",
      "Competition Bureau (CA)",
      "Consumer Rights Directive (EU)",
    ],
  },

  // ─── HEALTH CLAIMS ────────────────────────────────────────────────────────────
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
      "mhra approved",
      "nhs recommended",
      "scientifically proven",
      "guaranteed weight loss",
      "tga approved",
      "health canada approved",
      "ce marked",
      "evidence based",
    ],
    flag_description:
      "Contains a health or medical claim. This is the highest-risk category across all jurisdictions — regulators in every major market actively pursue unsubstantiated health claims.",
    suggestion:
      'Replace definitive health claims with qualified language: "may support," "some users report." Each country has its own health claims regulator: FDA/FTC (US), MHRA (UK), TGA (AU), Health Canada (CA), EMA (EU). Consult a specialist compliance attorney before launching any health-related product.',
    regulations: [
      "FTC + FDA (US)",
      "MHRA + ASA (UK)",
      "TGA + ACCC (AU)",
      "Health Canada + Competition Bureau (CA)",
      "EMA + UCPD (EU)",
    ],
  },

  // ─── LEGAL DISCLAIMER ─────────────────────────────────────────────────────────
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
      "not affiliated",
      "for entertainment only",
      "no guarantee",
    ],
    flag_description:
      "Disclaimer language detected. Across all major jurisdictions, disclaimers must be clear, conspicuous, and cannot contradict the main claim they accompany.",
    suggestion:
      "Disclaimers must be prominently displayed — not hidden in footers or small print. A disclaimer cannot legally undo a false or misleading headline claim under FTC, ASA, ACCC, or UCPD rules.",
    regulations: [
      "FTC (US)",
      "ASA CAP Code (UK)",
      "CMA (UK)",
      "ACCC (AU)",
      "UCPD (EU)",
      "Competition Bureau (CA)",
    ],
  },

  // ─── CONTRACT CONTRADICTION ───────────────────────────────────────────────────
  {
    category: "contract_contradiction",
    severity: "high",
    keywords: [
      "no refund",
      "non-refundable",
      "all sales final",
      "no cancellation",
      "cannot cancel",
      "no returns",
      "strictly no refunds",
      "change of mind",
    ],
    flag_description:
      "Possible contradiction between sales copy guarantees and this no-refund clause. Statutory consumer rights in the UK, EU, Australia, and Canada cannot be contracted out of.",
    suggestion:
      "Audit all guarantee language against your TOS. Statutory rights override contract terms in every Big 5 jurisdiction — UK (14 days), EU (14 days), Australia (ACL guarantees), Canada (provincial rights). A 'no refunds' clause does not override these rights.",
    regulations: [
      "FTC (US)",
      "Consumer Rights Act 2015 (UK)",
      "Australian Consumer Law (AU)",
      "Consumer Protection Act (CA)",
      "Consumer Rights Directive (EU)",
    ],
  },

  // ─── GDPR / ICO / DATA PRIVACY ────────────────────────────────────────────────
  {
    category: "data_privacy",
    severity: "high",
    keywords: [
      "we collect your data",
      "we share your information",
      "third party",
      "marketing partners",
      "your details will be",
      "we may contact you",
      "opt out",
      "unsubscribe",
      "your email will",
      "we store your",
      "your information will",
      "we use cookies",
      "tracking",
    ],
    flag_description:
      "Contains data collection or sharing language. Data privacy law applies across all major jurisdictions and carries some of the highest fines in marketing compliance.",
    suggestion:
      "Ensure your Privacy Policy is clearly linked. Key rules: UK GDPR/ICO requires explicit opt-in for email marketing. EU GDPR fines up to 4% of global turnover. CASL (Canada) requires express consent — fines up to $10M CAD. Australian Privacy Act requires transparency on all data use. Pre-ticked boxes are illegal in all Big 5 jurisdictions.",
    regulations: [
      "UK GDPR + ICO (UK)",
      "GDPR (EU)",
      "CASL + PIPEDA (CA)",
      "Privacy Act + ACCC (AU)",
      "CAN-SPAM + FTC (US)",
    ],
  },

  // ─── DRIP PRICING / HIDDEN FEES ───────────────────────────────────────────────
  {
    category: "hidden_fees",
    severity: "medium",
    keywords: [
      "plus shipping",
      "plus processing",
      "handling fee",
      "administration fee",
      "booking fee",
      "setup fee",
      "activation fee",
      "additional charges may apply",
      "fees may apply",
      "taxes not included",
      "delivery not included",
    ],
    flag_description:
      "Possible drip pricing or hidden fees detected. Drip pricing is actively targeted by regulators across all Big 5 jurisdictions — the ACCC has fined airlines over $1M for this practice.",
    suggestion:
      "Display the full total price including all fees from the very first point of purchase. CMA (UK), ACCC (AU), FTC (US), Competition Bureau (CA), and EU UCPD all require complete upfront pricing transparency.",
    regulations: [
      "FTC (US)",
      "CMA (UK)",
      "ACCC (AU)",
      "Competition Bureau (CA)",
      "UCPD (EU)",
    ],
  },

  // ─── FAKE REVIEWS ─────────────────────────────────────────────────────────────
  {
    category: "fake_reviews",
    severity: "high",
    keywords: [
      "verified purchase",
      "independent review",
      "unbiased review",
      "genuine customer",
      "real customer review",
      "trusted review",
      "authentic review",
      "verified buyer",
    ],
    flag_description:
      "Review authenticity claim detected. Fake or misleading reviews are now a specific enforcement priority for regulators across all Big 5 jurisdictions.",
    suggestion:
      "Do not label reviews as verified or independent without a robust verification system. Under CMA (UK) and ACCC (AU) rules, paying for reviews without disclosure is illegal. Under EU UCPD rules, fake reviews are an unfair commercial practice. Use a recognised third-party review platform.",
    regulations: [
      "FTC (US)",
      "CMA (UK)",
      "ASA CAP Code (UK)",
      "ACCC (AU)",
      "UCPD (EU)",
      "Competition Bureau (CA)",
    ],
  },

  // ─── COMPARATIVE ADVERTISING ──────────────────────────────────────────────────
  {
    category: "comparative_advertising",
    severity: "medium",
    keywords: [
      "better than",
      "unlike our competitors",
      "the only tool that",
      "no other product",
      "outperforms",
      "beats",
      "#1 rated",
      "best in class",
      "market leading",
      "industry leading",
      "number one",
      "world's best",
      "globally recognised",
    ],
    flag_description:
      "Contains comparative or superlative claims. These must be objectively verifiable under advertising rules in all major jurisdictions.",
    suggestion:
      "All comparative claims must be based on objective, up-to-date, verifiable evidence. Claims like '#1 rated' or 'world's best' require documented proof. Remove or qualify with specific, sourced supporting data.",
    regulations: [
      "FTC (US)",
      "ASA CAP Code (UK)",
      "CMA (UK)",
      "ACCC (AU)",
      "UCPD (EU)",
      "Competition Bureau (CA)",
    ],
  },

  // ─── CASL / EMAIL MARKETING ───────────────────────────────────────────────────
  {
    category: "email_compliance",
    severity: "high",
    keywords: [
      "you will receive emails",
      "we will email you",
      "join our mailing list",
      "subscribe to our list",
      "sign up for updates",
      "receive our newsletter",
      "marketing emails",
      "promotional emails",
      "you agree to receive",
      "commercial messages",
    ],
    flag_description:
      "Email marketing consent language detected. Canada's CASL carries fines up to $10 million CAD per violation — one of the strictest anti-spam laws in the world.",
    suggestion:
      "Ensure explicit opt-in consent is obtained before sending any commercial electronic messages to Canadian recipients. Under CASL, implied consent has a strict time limit. Under UK PECR and EU GDPR, pre-ticked opt-in boxes are illegal. Always include a working unsubscribe mechanism.",
    regulations: [
      "CASL + CRTC (CA)",
      "PECR + ICO (UK)",
      "GDPR (EU)",
      "CAN-SPAM + FTC (US)",
      "Spam Act + ACCC (AU)",
    ],
  },

  // ─── EU AI ACT / AI CONTENT DISCLOSURE ───────────────────────────────────────
  {
    category: "ai_disclosure",
    severity: "high",
    keywords: [
      "written by ai",
      "created by ai",
      "ai generated",
      "ai-generated",
      "generated by ai",
      "ai wrote",
      "chatgpt wrote",
      "made with ai",
      "produced by ai",
      "ai content",
      "ai-created",
      "artificially generated",
      "machine generated",
      "machine-generated",
    ],
    flag_description:
      "AI-generated content detected without clear disclosure. EU AI Act Article 50(4) — effective 2 August 2026 — requires that AI-generated marketing content is clearly disclosed to consumers. Failure to disclose is a regulatory violation across the EU and is increasingly referenced in UK ICO guidance.",
    suggestion:
      "Add a clear, prominent disclosure wherever AI-generated content appears: 'This content was created with the assistance of AI.' Under EU AI Act Article 50(4), non-disclosed AI content on matters of public interest carries significant fines. Document your human editorial review process as evidence of oversight.",
    regulations: [
      "EU AI Act Article 50(4) (EU — effective Aug 2026)",
      "UK ICO AI Transparency Guidance (UK)",
      "FTC AI Endorsement Guidelines (US)",
      "ACCC AI Guidelines (AU)",
    ],
  },

  // ─── FTC AI ENDORSEMENTS ──────────────────────────────────────────────────────
  {
    category: "ai_endorsement",
    severity: "high",
    keywords: [
      "ai recommends",
      "ai says",
      "our ai found",
      "ai-powered recommendation",
      "ai suggests",
      "recommended by ai",
      "ai review",
      "ai rated",
      "ai endorsed",
      "algorithm recommends",
      "ai selected",
      "ai approved",
    ],
    flag_description:
      "AI-powered recommendation or endorsement detected. The FTC's updated Endorsement Guides (2023) require clear disclosure when AI systems are used to generate or select endorsements, testimonials or recommendations shown to consumers.",
    suggestion:
      "Disclose prominently that recommendations are AI-generated: 'These recommendations are generated by an automated system.' Under FTC rules, AI-generated endorsements carry the same disclosure requirements as paid human endorsements. Failure to disclose can result in civil penalties.",
    regulations: [
      "FTC Endorsement Guides 2023 (US)",
      "FTC AI Guidelines (US)",
      "ASA CAP Code (UK)",
      "UCPD (EU)",
      "ACCC (AU)",
    ],
  },

  // ─── AUTOMATED DECISION MAKING ────────────────────────────────────────────────
  {
    category: "automated_decisions",
    severity: "medium",
    keywords: [
      "automatically selected",
      "algorithm selected",
      "ai decided",
      "automatically determined",
      "our algorithm",
      "ai-powered pricing",
      "dynamic pricing",
      "personalised by ai",
      "personalized by ai",
      "ai calculated",
      "system automatically",
      "automated assessment",
      "ai scored",
    ],
    flag_description:
      "Automated decision-making language detected. GDPR Article 22 and UK GDPR give consumers the right to not be subject to solely automated decisions that significantly affect them — and to request human review.",
    suggestion:
      "Where AI or algorithms make decisions affecting consumers (pricing, eligibility, personalisation), disclose this clearly and provide a mechanism to request human review. Under UK GDPR and EU GDPR Article 22, consumers have enforceable rights around automated decisions. Include this in your Privacy Policy.",
    regulations: [
      "GDPR Article 22 (EU)",
      "UK GDPR + ICO (UK)",
      "FTC (US)",
      "Privacy Act (AU)",
      "PIPEDA (CA)",
    ],
  },

  // ─── DARK PATTERNS / MANIPULATIVE DESIGN ─────────────────────────────────────
  {
    category: "dark_patterns",
    severity: "medium",
    keywords: [
      "you're missing out",
      "everyone is buying",
      "don't be left behind",
      "your competitors are",
      "people like you are",
      "join thousands",
      "be one of the few",
      "exclusive members only",
      "special invitation",
      "you've been selected",
      "you qualify for",
    ],
    flag_description:
      "Contains psychological pressure language that may constitute a dark pattern or manipulative commercial practice under EU DSA rules and ACCC guidelines.",
    suggestion:
      "Avoid language designed to exploit psychological biases through false social proof or artificial exclusivity. The EU Digital Services Act specifically targets dark patterns — fines up to 6% of global annual turnover for platforms.",
    regulations: [
      "DSA (EU)",
      "UCPD (EU)",
      "ACCC (AU)",
      "CMA (UK)",
      "FTC (US)",
    ],
  },

  // ─── FCA FINANCIAL PROMOTIONS ─────────────────────────────────────────────────
  {
    category: "financial_promotion",
    severity: "high",
    keywords: [
      "invest now",
      "investment opportunity",
      "guaranteed returns",
      "guaranteed profit",
      "fixed return",
      "annual return",
      "high yield",
      "capital growth",
      "risk-free investment",
      "financial advice",
      "we advise",
      "portfolio growth",
      "beat inflation",
      "outperform the market",
      "forex trading",
      "crypto investment",
      "trading signals",
      "past performance",
      "returns of",
      "yield of",
      "interest rate of",
    ],
    flag_description:
      "Contains financial promotion language. In the UK, any communication that invites or induces someone to engage in investment activity must be approved by an FCA-authorised person or fall within an exemption. Unapproved financial promotions are a criminal offence under Section 21 of the Financial Services and Markets Act 2000.",
    suggestion:
      "If this is a financial promotion: (1) ensure it is approved by an FCA-authorised person before publication, (2) include required risk warnings prominently, (3) do not imply guaranteed returns — past performance is not a reliable indicator of future results. For crypto promotions, FCA rules effective October 2023 require specific consumer warnings. Consult an FCA-authorised compliance specialist before publishing.",
    regulations: [
      "FSMA 2000 Section 21 (UK)",
      "FCA Financial Promotions Rules (UK)",
      "FCA Crypto Promotions Rules 2023 (UK)",
      "SEC + FINRA (US)",
      "ASIC (AU)",
      "OSC + CSA (CA)",
      "ESMA (EU)",
    ],
  },

  // ─── GREENWASHING / EU GREEN CLAIMS DIRECTIVE ─────────────────────────────────
  {
    category: "greenwashing",
    severity: "high",
    keywords: [
      "carbon neutral",
      "net zero",
      "carbon negative",
      "climate positive",
      "eco-friendly",
      "environmentally friendly",
      "sustainable",
      "green product",
      "planet friendly",
      "zero emissions",
      "carbon offset",
      "fully recyclable",
      "biodegradable",
      "plastic free",
      "zero waste",
      "renewable",
      "clean energy",
      "carbon footprint",
      "good for the planet",
      "earth friendly",
    ],
    flag_description:
      "Contains an environmental or sustainability claim. The EU Green Claims Directive (proposed 2023, enforcement from 2026) prohibits unsubstantiated green claims. The CMA Green Claims Code (UK) and FTC Green Guides (US) require all environmental claims to be specific, accurate, and substantiated with verifiable evidence.",
    suggestion:
      "All environmental claims must be: (1) substantiated with independently verified evidence, (2) specific — 'carbon neutral' requires a recognised offsetting standard, (3) not misleading by omission. Remove vague claims like 'eco-friendly' or 'sustainable' unless supported by a recognised certification scheme. Under the EU Green Claims Directive, non-compliant claims can result in significant fines and removal of products from the EU market.",
    regulations: [
      "EU Green Claims Directive (EU)",
      "UCPD (EU)",
      "CMA Green Claims Code (UK)",
      "ASA CAP Code (UK)",
      "FTC Green Guides (US)",
      "ACCC (AU)",
      "Competition Bureau (CA)",
    ],
  },

  // ─── SUBSCRIPTION TRAPS / NEGATIVE OPTION BILLING ────────────────────────────
  {
    category: "subscription_trap",
    severity: "high",
    keywords: [
      "free trial",
      "cancel anytime",
      "cancel any time",
      "try free",
      "no commitment",
      "auto-renews",
      "automatically renews",
      "recurring charge",
      "subscription renews",
      "billed monthly",
      "billed annually",
      "charged after trial",
      "trial converts",
      "ongoing subscription",
    ],
    flag_description:
      "Subscription or free trial language detected. Negative option billing — where silence is treated as consent to be charged — is one of the fastest-growing enforcement areas across all major jurisdictions. The FTC's updated Negative Option Rule (2024) requires clear upfront disclosure of all charges, a simple cancellation mechanism, and explicit consent before billing.",
    suggestion:
      "You must clearly and conspicuously disclose: (1) that the trial converts to a paid subscription, (2) the exact amount and date of the first charge, (3) how to cancel — before the consumer commits. 'Cancel anytime' must mean exactly that — a simple, single-step process. Under the FTC Negative Option Rule 2024, violations carry fines up to $51,744 per incident. UK CMA and EU UCPD carry similar requirements.",
    regulations: [
      "FTC Negative Option Rule 2024 (US)",
      "CMA Subscription Guidance (UK)",
      "Consumer Contracts Regulations 2013 (UK)",
      "Consumer Rights Directive (EU)",
      "UCPD (EU)",
      "ACCC (AU)",
      "Competition Bureau (CA)",
    ],
  },

  // ─── INFLUENCER / PAID PROMOTION NON-DISCLOSURE ───────────────────────────────
  {
    category: "influencer_disclosure",
    severity: "high",
    keywords: [
      "ambassador",
      "brand ambassador",
      "partner",
      "in partnership with",
      "sponsored by",
      "gifted",
      "gifted by",
      "gifted product",
      "ad",
      "#ad",
      "#sponsored",
      "in collaboration with",
      "collab",
      "paid partnership",
      "affiliate",
      "affiliate link",
      "commission",
      "referral link",
    ],
    flag_description:
      "Paid promotion, sponsorship or affiliate relationship detected. All major regulators require that paid relationships are disclosed clearly and upfront — not buried in hashtags, disclaimers or small print. The ASA and CMA launched a major influencer enforcement crackdown in 2023 and continue active monitoring.",
    suggestion:
      "Disclose the commercial relationship clearly and immediately — before any promotional content. 'AD', 'PAID PARTNERSHIP' or 'GIFTED' must appear at the start of the content, not at the end. Affiliate links must be disclosed as such. Under FTC and ASA rules, 'in partnership with' without explicit 'AD' is insufficient. The CMA has issued enforcement notices to major influencers for this exact wording.",
    regulations: [
      "FTC Endorsement Guides 2023 (US)",
      "ASA CAP/BCAP Code (UK)",
      "CMA Influencer Guidance (UK)",
      "UCPD (EU)",
      "ACCC (AU)",
      "Competition Bureau (CA)",
    ],
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
          flag_description: `${rule.flag_description} [Regulations: ${rule.regulations.join(" · ")}]`,
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
