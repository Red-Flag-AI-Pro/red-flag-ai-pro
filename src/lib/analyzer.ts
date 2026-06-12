import type { AnalysisResult, Severity } from "@/types";
import { SEVERITY_DEDUCTIONS } from "./constants";

export type JurisdictionCode = "us" | "gb" | "eu" | "au" | "ca" | "br" | "in" | "sg" | "ae";

interface Rule {
  category: string;
  severity: Severity;
  keywords: string[];
  flag_description: string;
  suggestion: string;
  regulations: string[];
  jurisdictions: JurisdictionCode[];
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
    jurisdictions: ["us", "gb", "eu", "au", "ca"],
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
    jurisdictions: ["us", "gb", "eu", "au", "ca"],
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
    jurisdictions: ["us", "gb", "eu", "au", "ca"],
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
    jurisdictions: ["us", "gb", "eu", "au", "ca"],
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
    jurisdictions: ["us", "gb", "eu", "au", "ca"],
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
    jurisdictions: ["us", "gb", "eu", "au", "ca"],
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
    jurisdictions: ["us", "gb", "eu", "au", "ca"],
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
      "Audit all guarantee language against your TOS. Statutory rights override contract terms across all 9 jurisdictions — UK (14 days), EU (14 days), Australia (ACL guarantees), Canada (provincial rights), Brazil (LGPD/CDC), India (DPDP Act), Singapore (PDPA), UAE (Consumer Protection Law). A 'no refunds' clause does not override these rights.",
    regulations: [
      "FTC (US)",
      "Consumer Rights Act 2015 (UK)",
      "Australian Consumer Law (AU)",
      "Consumer Protection Act (CA)",
      "Consumer Rights Directive (EU)",
    ],
    jurisdictions: ["us", "gb", "eu", "au", "ca"],
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
      "personal data",
      "personal information",
      "we process your",
      "data controller",
      "data processor",
    ],
    flag_description:
      "Contains data collection or sharing language. Data privacy law applies across all major jurisdictions and carries some of the highest fines in marketing compliance.",
    suggestion:
      "Ensure your Privacy Policy is clearly linked. Key rules: UK GDPR/ICO requires explicit opt-in for email marketing. EU GDPR fines up to 4% of global turnover. CASL (Canada) requires express consent — fines up to $10M CAD. Australian Privacy Act requires transparency on all data use. CCPA/CPRA (California) requires a 'Do Not Sell My Personal Information' link. Brazil LGPD, India DPDP Act 2023, Singapore PDPA, and Quebec Law 25 all require equivalent transparency and consent. UAE PDPL 2022 requires a lawful basis for processing, data subject rights, and a Privacy Policy — Dubai-based businesses must comply even if selling globally. Pre-ticked boxes are illegal in all jurisdictions we cover.",
    regulations: [
      "UK GDPR + ICO (UK)",
      "GDPR (EU)",
      "CASL + PIPEDA (CA)",
      "Quebec Law 25 (CA)",
      "Privacy Act + ACCC (AU)",
      "CAN-SPAM + FTC (US)",
      "CCPA + CPRA (US — California)",
      "LGPD (Brazil)",
      "DPDP Act 2023 (India)",
      "PDPA (Singapore)",
      "UAE PDPL 2022 (UAE)",
    ],
    jurisdictions: ["us", "gb", "eu", "au", "ca", "br", "in", "sg", "ae"],
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
      "convenience fee",
      "service charge",
      "platform fee",
      "processing charge",
      "resort fee",
    ],
    flag_description:
      "Possible drip pricing or hidden fees detected. Drip pricing is actively targeted by regulators across all jurisdictions we cover — the ACCC has fined airlines over $1M for this practice. The UK's DMCC Act 2024 specifically prohibits drip pricing and junk fees, with fines up to £300,000.",
    suggestion:
      "Display the full total price including all fees from the very first point of purchase. CMA and DMCC Act 2024 (UK), ACCC (AU), FTC Junk Fees Rule (US), Competition Bureau (CA), and EU UCPD all require complete upfront pricing transparency. Any fee not disclosed at the start of the transaction is potentially illegal.",
    regulations: [
      "FTC Junk Fees Rule (US)",
      "CMA + DMCC Act 2024 (UK)",
      "ACCC (AU)",
      "Competition Bureau (CA)",
      "UCPD (EU)",
      "LGPD (Brazil)",
      "PDPA (Singapore)",
    ],
    jurisdictions: ["us", "gb", "eu", "au", "ca", "br", "sg"],
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
      "leave us a review",
      "write a review",
      "review in exchange",
      "review for discount",
      "incentivised review",
      "incentivized review",
    ],
    flag_description:
      "Review authenticity claim detected. Fake or misleading reviews are a specific enforcement priority across all jurisdictions we cover. The UK's DMCC Act 2024 makes commissioning or publishing fake reviews a criminal offence for the first time.",
    suggestion:
      "Do not label reviews as verified or independent without a robust verification system. Under the DMCC Act 2024 (UK), commissioning or hosting fake reviews is now a criminal offence. Under CMA (UK) and ACCC (AU) rules, incentivising reviews without disclosure is illegal. Under EU UCPD and Omnibus Directive rules, fake reviews carry significant fines. Never offer discounts or gifts in exchange for reviews without full disclosure.",
    regulations: [
      "FTC (US)",
      "CMA + DMCC Act 2024 (UK)",
      "ASA CAP Code (UK)",
      "ACCC (AU)",
      "UCPD + Omnibus Directive (EU)",
      "Competition Bureau (CA)",
      "PDPA (Singapore)",
    ],
    jurisdictions: ["us", "gb", "eu", "au", "ca", "sg"],
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
    jurisdictions: ["us", "gb", "eu", "au", "ca"],
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
      "text message",
      "sms updates",
      "reply stop",
      "text us",
      "whatsapp us",
    ],
    flag_description:
      "Email or SMS marketing consent language detected. Canada's CASL carries fines up to $10 million CAD per violation. Quebec Law 25 adds stricter requirements for Quebec residents. The US TCPA governs SMS marketing with fines up to $1,500 per unsolicited text.",
    suggestion:
      "Ensure explicit opt-in consent is obtained before sending any commercial electronic messages. For SMS/text marketing: TCPA (US) requires prior express written consent — fines up to $1,500 per text. Under CASL (Canada) implied consent has a strict time limit. Quebec Law 25 requires explicit consent in French for Quebec residents. Under UK PECR and EU GDPR, pre-ticked opt-in boxes are illegal. India DPDP Act 2023 requires explicit consent for all digital communications. Always include a working unsubscribe mechanism in every message.",
    regulations: [
      "CASL + CRTC (CA)",
      "Quebec Law 25 (CA)",
      "PECR + ICO (UK)",
      "GDPR (EU)",
      "CAN-SPAM + FTC (US)",
      "TCPA (US)",
      "Spam Act + ACCC (AU)",
      "DPDP Act 2023 (India)",
      "PDPA (Singapore)",
      "UAE PDPL 2022 (UAE)",
    ],
    jurisdictions: ["us", "gb", "eu", "au", "ca", "in", "sg", "ae"],
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
    jurisdictions: ["eu", "gb", "us", "au"],
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
    jurisdictions: ["us", "gb", "eu", "au"],
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
    jurisdictions: ["eu", "gb", "us", "au", "ca"],
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
    jurisdictions: ["eu", "au", "gb", "us"],
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
    jurisdictions: ["gb", "us", "au", "ca", "eu"],
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
    jurisdictions: ["eu", "gb", "us", "au", "ca"],
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
      "membership renews",
      "easy cancellation",
      "manage subscription",
      "pause subscription",
      "unsubscribe anytime",
    ],
    flag_description:
      "Subscription or free trial language detected. Negative option billing is one of the fastest-growing enforcement areas globally. The FTC's Click-to-Cancel Rule (2024) now requires cancellation to be as easy as signup — online, in a single step, the same way you signed up. Violations carry fines up to $51,744 per incident. The DMCC Act 2024 introduces similar protections for UK consumers.",
    suggestion:
      "You must clearly and conspicuously disclose: (1) that the trial converts to a paid subscription, (2) the exact amount and date of the first charge, (3) how to cancel — before the consumer commits. FTC Click-to-Cancel Rule 2024: cancellation must be as easy as signup, online, immediate, and without requiring a phone call or chat agent. 'Cancel anytime' must be a literal single-step process. DMCC Act 2024 (UK) carries similar requirements. Brazil LGPD and India DPDP Act 2023 require explicit consent for recurring billing of their residents.",
    regulations: [
      "FTC Negative Option Rule 2024 (US)",
      "FTC Click-to-Cancel Rule 2024 (US)",
      "CMA Subscription Guidance (UK)",
      "DMCC Act 2024 (UK)",
      "Consumer Contracts Regulations 2013 (UK)",
      "Consumer Rights Directive (EU)",
      "UCPD (EU)",
      "ACCC (AU)",
      "Competition Bureau (CA)",
      "LGPD (Brazil)",
      "DPDP Act 2023 (India)",
    ],
    jurisdictions: ["us", "gb", "eu", "au", "ca", "br", "in"],
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
    jurisdictions: ["us", "gb", "eu", "au", "ca"],
  },

  // ─── SMS / TEXT MARKETING ─────────────────────────────────────────────────────
  {
    category: "sms_marketing",
    severity: "high",
    keywords: [
      "text us",
      "text your number",
      "send us a text",
      "sms updates",
      "sms alerts",
      "text alerts",
      "text message",
      "reply stop to opt out",
      "reply stop",
      "msg & data rates",
      "msg and data rates",
      "text to join",
      "text to subscribe",
      "whatsapp updates",
      "opt in to texts",
      "opt into texts",
      "receive texts",
      "receive sms",
    ],
    flag_description:
      "SMS or text marketing language detected. The US TCPA (Telephone Consumer Protection Act) is one of the most litigated marketing laws in the US — fines reach $1,500 per unsolicited text per recipient. Class actions are common. UK PECR requires prior explicit consent for all electronic marketing messages including SMS.",
    suggestion:
      "TCPA (US): You must obtain prior express written consent before sending any marketing texts — a checkbox at the point of data collection is not sufficient on its own. The consent must be clear, specific, and not bundled with T&Cs. Fines: $500-$1,500 per text. UK PECR: same as email — explicit opt-in required, opt-out must be simple and free. CASL (Canada) applies to SMS. Include: (1) clear consent language at the opt-in point, (2) STOP opt-out instruction in every message, (3) message frequency disclosure, (4) 'Msg & data rates may apply' for US audiences.",
    regulations: [
      "TCPA + FCC (US)",
      "FTC (US)",
      "PECR + ICO (UK)",
      "CASL + CRTC (CA)",
      "Quebec Law 25 (CA)",
      "GDPR (EU)",
      "PDPA (Singapore)",
      "DPDP Act 2023 (India)",
      "UAE PDPL 2022 (UAE)",
    ],
    jurisdictions: ["us", "gb", "ca", "eu", "sg", "in", "ae"],
  },

  // ─── ONLINE SAFETY / HARMFUL CONTENT ─────────────────────────────────────────
  {
    category: "online_safety",
    severity: "medium",
    keywords: [
      "user generated content",
      "user-generated content",
      "ugc",
      "community forum",
      "comment section",
      "public comments",
      "open forum",
      "members can post",
      "users can post",
      "submit content",
      "share content",
      "post content",
      "report content",
      "flag content",
      "community guidelines",
      "house rules",
      "moderation policy",
      "content moderation",
      "report abuse",
      "report this",
    ],
    flag_description:
      "User-generated content or community features detected. The UK Online Safety Act 2023 (OSA) places legal duties on platforms to protect users from illegal content and harmful material. Ofcom began enforcement in 2024 — non-compliant platforms face fines up to £18 million or 10% of global annual turnover (whichever is higher). The EU Digital Services Act (DSA) carries similar obligations for platforms with EU users.",
    suggestion:
      "If your site hosts user-generated content, reviews, forums, or community features: (1) publish a clear and accessible content moderation policy, (2) provide a visible and easy-to-use mechanism for reporting illegal or harmful content, (3) act on reports promptly, (4) for UK-based platforms or those with significant UK users — complete an Ofcom risk assessment under the Online Safety Act 2023. EU DSA obligations apply if you have EU users. Failure to moderate illegal content (CSAM, terrorism, fraud) is a criminal offence under the OSA.",
    regulations: [
      "Online Safety Act 2023 (UK)",
      "Ofcom (UK)",
      "Digital Services Act (EU)",
      "GDPR (EU)",
      "Section 230 (US — limited protections for UGC platforms)",
    ],
    jurisdictions: ["gb", "eu", "us"],
  },
];

// ─── CLAIMS vs. POLICY MISMATCH ──────────────────────────────────────────────
// Cross-reference check: looks for a marketing "guarantee" claim AND a
// contradicting refund/cancellation restriction within the same content.
// Unlike the keyword rules above, this only fires when BOTH sides of the
// contradiction are present — it's the "you promised X but your own policy
// says Y" gotcha that's far more compelling (and more defensible) than
// flagging either phrase in isolation.
const CLAIM_PHRASES = [
  "money-back guarantee",
  "money back guarantee",
  "30-day guarantee",
  "14-day guarantee",
  "60-day guarantee",
  "90-day guarantee",
  "satisfaction guaranteed",
  "100% guarantee",
  "100% money back",
  "full refund",
  "risk-free",
  "risk free",
  "cancel anytime",
  "cancel at any time",
  "no questions asked",
  "guaranteed results",
];

const POLICY_RESTRICTION_PHRASES = [
  "no refund",
  "non-refundable",
  "all sales final",
  "no cancellation",
  "cannot cancel",
  "no returns",
  "strictly no refunds",
  "not eligible for a refund",
  "no exceptions",
];

const CLAIMS_POLICY_REGULATIONS = [
  "FTC (US) — Guides Concerning the Use of Endorsements and Testimonials",
  "Consumer Rights Act 2015 (UK)",
  "ASA CAP Code (UK)",
  "Australian Consumer Law (AU)",
  "Consumer Protection Act (CA)",
  "Consumer Rights Directive (EU)",
];

function detectClaimsPolicyMismatch(
  content: string,
  lower: string,
  selectedJurisdictions?: JurisdictionCode[]
): AnalysisResult["flags"][number] | null {
  const jurisdictions: JurisdictionCode[] = ["us", "gb", "eu", "au", "ca"];
  if (selectedJurisdictions && selectedJurisdictions.length > 0) {
    if (!jurisdictions.some((j) => selectedJurisdictions.includes(j))) return null;
  }

  let claimIdx = -1;
  let claimPhrase = "";
  for (const phrase of CLAIM_PHRASES) {
    const idx = lower.indexOf(phrase);
    if (idx !== -1) {
      claimIdx = idx;
      claimPhrase = phrase;
      break;
    }
  }
  if (claimIdx === -1) return null;

  let restrictionIdx = -1;
  let restrictionPhrase = "";
  for (const phrase of POLICY_RESTRICTION_PHRASES) {
    const idx = lower.indexOf(phrase);
    if (idx !== -1) {
      restrictionIdx = idx;
      restrictionPhrase = phrase;
      break;
    }
  }
  if (restrictionIdx === -1) return null;

  const claimExcerpt = extractExcerpt(content, claimIdx);
  const restrictionExcerpt = extractExcerpt(content, restrictionIdx);

  return {
    category: "claims_policy_mismatch",
    severity: "high",
    text_excerpt: `"${claimPhrase}" … "${restrictionPhrase}"`,
    flag_description:
      `Direct contradiction found: this copy promises "${claimPhrase}" (${claimExcerpt}) ` +
      `but elsewhere states "${restrictionPhrase}" (${restrictionExcerpt}). ` +
      `Advertising a guarantee or cancellation right that your own policy then denies is a ` +
      `textbook unfair commercial practice — and statutory consumer rights (UK, EU, Australia, ` +
      `Canada) can't be overridden by a "no refunds" clause regardless. ` +
      `[Regulations: ${CLAIMS_POLICY_REGULATIONS.join(" · ")}]`,
    suggestion:
      `Make your refund/cancellation policy match the guarantee you advertise. Either honour the ` +
      `"${claimPhrase}" promise in your T&Cs, or remove/soften the marketing claim so it doesn't ` +
      `overstate what customers will actually get.`,
  };
}

function extractExcerpt(content: string, index: number): string {
  const start = Math.max(0, index - 60);
  const end = Math.min(content.length, index + 60);
  const excerpt = content.slice(start, end).replace(/\s+/g, " ").trim();
  return (start > 0 ? "…" : "") + excerpt + (end < content.length ? "…" : "");
}

export function analyzeContent(
  title: string,
  content: string,
  selectedJurisdictions?: JurisdictionCode[]
): AnalysisResult {
  const lower = content.toLowerCase();
  const seenCategories = new Set<string>();
  const flags: AnalysisResult["flags"] = [];

  // Filter rules to selected jurisdictions (if provided)
  const activeRules = selectedJurisdictions && selectedJurisdictions.length > 0
    ? RULES.filter(rule => rule.jurisdictions.some(j => selectedJurisdictions.includes(j)))
    : RULES;

  for (const rule of activeRules) {
    if (seenCategories.has(rule.category)) continue;

    for (const keyword of rule.keywords) {
      const idx = lower.indexOf(keyword);
      if (idx !== -1) {
        seenCategories.add(rule.category);
        // Filter regulations to only those matching selected jurisdictions
        const relevantRegs = selectedJurisdictions && selectedJurisdictions.length > 0
          ? rule.regulations.filter(reg => {
              const lower = reg.toLowerCase();
              return selectedJurisdictions.some(j => {
                if (j === "us") return lower.includes("(us") || lower.includes("ftc") || lower.includes("fda") || lower.includes("sec") || lower.includes("tcpa");
                if (j === "gb") return lower.includes("(uk") || lower.includes("asa") || lower.includes("cma") || lower.includes("ico") || lower.includes("fca") || lower.includes("ofcom");
                if (j === "eu") return lower.includes("(eu") || lower.includes("gdpr") || lower.includes("ucpd") || lower.includes("dsa") || lower.includes("ema") || lower.includes("esma");
                if (j === "au") return lower.includes("(au") || lower.includes("accc") || lower.includes("tga") || lower.includes("asic");
                if (j === "ca") return lower.includes("(ca") || lower.includes("casl") || lower.includes("pipeda") || lower.includes("competition bureau") || lower.includes("quebec");
                if (j === "br") return lower.includes("lgpd") || lower.includes("brazil");
                if (j === "in") return lower.includes("dpdp") || lower.includes("india");
                if (j === "sg") return lower.includes("pdpa") || lower.includes("singapore");
                if (j === "ae") return lower.includes("pdpl") || lower.includes("uae");
                return false;
              });
            })
          : rule.regulations;
        flags.push({
          category: rule.category,
          severity: rule.severity,
          text_excerpt: extractExcerpt(content, idx),
          flag_description: `${rule.flag_description} [Regulations: ${(relevantRegs.length > 0 ? relevantRegs : rule.regulations).join(" · ")}]`,
          suggestion: rule.suggestion,
        });
        break;
      }
    }
  }

  const mismatch = detectClaimsPolicyMismatch(content, lower, selectedJurisdictions);
  if (mismatch) {
    flags.push(mismatch);
  }

  const deduction = flags.reduce(
    (sum, f) => sum + (SEVERITY_DEDUCTIONS[f.severity] ?? 0),
    0
  );
  const score = Math.max(0, 100 - deduction);

  return { score, flags };
}
