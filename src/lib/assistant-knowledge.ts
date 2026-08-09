import { PLAN_PRICES, PLAN_LIMITS, AUDIT_PRICE, isScannerSaleActive, SCANNER_SALE_PRICE, SCANNER_STANDARD_PRICE, SCANNER_SALE_ENDS, REGULATORY_MAPPING_LAST_REVIEWED, JURISDICTION_COUNT, RISK_CATEGORY_COUNT } from "@/lib/constants";

// The assistant's grounding is BUILT FROM THE SAME CONSTANTS THE SITE USES.
// That is the whole point: change a price or a plan limit in constants.ts and
// the assistant's knowledge changes with it, so it can never quote a stale
// figure. Nothing here is hand copied from the marketing pages.

// The free tools the assistant routes people to. Each is a lead magnet: it
// exposes a real risk, then captures an email or leads to a free account.
// This is the assistant's primary growth job — match a stated worry to the
// tool that makes it concrete.
export const FREE_TOOLS = [
  {
    path: "/governance-audit",
    name: "Governance Maturity Index",
    forWhen:
      "someone worried about proving AI governance to a board, regulator, investor or procurement review; CFOs, compliance and risk leads; 'is our AI governed', 'a client is asking for evidence', 'EU AI Act', 'audit'",
    gives: "a 0 to 100 score across 6 dimensions, top gaps, and a 90 day roadmap. 12 questions, about 2 minutes, free.",
  },
  {
    path: "/tools/shadow-ai-survey",
    name: "Shadow AI Survey",
    forWhen:
      "a team using AI tools nobody approved or tracks; 'my staff paste data into ChatGPT', 'people use their own AI tools', worried about ungoverned or hidden AI use",
    gives: "a blame free picture of which AI tools are really in use and where the exposure sits. Free.",
  },
  {
    path: "/tools/fine-calculator",
    name: "Compliance Fine Calculator",
    forWhen:
      "someone asking 'could we be fined', 'how much is the risk', wanting the financial size of the exposure in their jurisdiction",
    gives: "real maximum penalties mapped to their situation and jurisdiction. Free.",
  },
  {
    path: "/tools/disclosure-generator",
    name: "AI Disclosure Generator",
    forWhen:
      "'do I have to say AI wrote this', AI generated content, Article 50, transparency, labelling AI content",
    gives: "a ready disclosure statement for AI assisted or AI generated content. Free.",
  },
  {
    path: "/tools/url-exposure-checker",
    name: "Live Page Exposure Checker",
    forWhen: "'check my live page', 'look at my website', wanting a fast read of a public URL",
    gives: "a fast compliance read of a live public page. Free, no account.",
  },
  {
    path: "/tools/contract-red-flags",
    name: "Contract Red Flags",
    forWhen: "worries about risky clauses in a contract or terms",
    gives: "a plain English read of risky contract clauses. Free.",
  },
  {
    path: "/tools/accessibility-checker",
    name: "Accessibility Checker",
    forWhen: "'is my site accessible', WCAG, ADA, EAA, disability access risk",
    gives: "an accessibility risk read of a live page. Free.",
  },
  {
    path: "/tools/ai-visibility-checker",
    name: "AI Visibility Checker",
    forWhen: "'do AI assistants recommend my brand', how a brand shows up in AI answers",
    gives: "a read of how likely an AI assistant is to find and recommend a brand. Free.",
  },
] as const;

// Verified against live legal research on 26 Jul 2026 (see
// REGULATORY_MAPPING_LAST_REVIEWED). Each entry states its confirmation
// status explicitly so the assistant never presents a proposal or a bill
// that has not passed as if it were settled law. Update this list whenever
// the regulatory mapping is next reviewed, not on every small news item.
export const REGULATORY_DEADLINES = [
  {
    date: "2 August 2026",
    status: "Confirmed, final law (EU Digital Omnibus in force 27 Jul 2026)",
    meaning:
      "Two things happen on this date. First, the EU AI Office gains real enforcement and fining power over providers of general purpose AI models (up to 3% of global turnover or 15 million euro). Second, EU AI Act Article 50 disclosure duties apply to deployers, not just model makers: AI generated content must be disclosed, chatbots must identify themselves as AI, and deepfakes must be labelled.",
  },
  {
    date: "2 December 2026",
    status: "Confirmed, final law",
    meaning:
      "A narrower technical watermarking sub duty inside Article 50 gets a transition period: AI systems already on the market before 2 August 2026 have until this date before that specific marking requirement applies. The broader disclosure duties above are not delayed.",
  },
  {
    date: "December 2027",
    status: "Confirmed, final law (delayed by the Digital Omnibus)",
    meaning:
      "EU AI Act Annex III high risk obligations apply from this date. This is the bulk of the high risk AI rulebook: employment decisions, credit scoring, biometric categorisation and similar. Originally due sooner, pushed back by the Digital Omnibus.",
  },
  {
    date: "August 2028",
    status: "Confirmed, final law (delayed by the Digital Omnibus)",
    meaning:
      "EU AI Act Annex I high risk obligations (AI embedded in already regulated products, e.g. medical devices, machinery) apply from this date.",
  },
] as const;

// Computed per call rather than at module load. These feed the assistant the
// price it is allowed to quote, so a stale capture here would have it telling
// visitors £149 after the sale closed, which is a promise the checkout would
// not honour.
function currentPricing() {
  const proPrice = isScannerSaleActive() ? SCANNER_SALE_PRICE : SCANNER_STANDARD_PRICE;
  const saleLine = isScannerSaleActive()
    ? `Pro is on a founder's sale at £${SCANNER_SALE_PRICE}/mo (normally £${SCANNER_STANDARD_PRICE}/mo) for anyone who signs up before ${new Date(
        SCANNER_SALE_ENDS
      ).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Sale signups keep that price for as long as they stay subscribed.`
    : `Pro is £${SCANNER_STANDARD_PRICE}/mo.`;
  return { proPrice, saleLine };
}

// Assembled once per request. Kept factual and compact — the model does the
// conversation, this just fixes the facts it is allowed to state.
export function buildKnowledgeBase(liveStats?: { checksRun?: number }): string {
  const { proPrice, saleLine } = currentPricing();
  const toolLines = FREE_TOOLS.map(
    (t) => `- ${t.name} (${t.path}): use when ${t.forWhen}. It gives ${t.gives}`
  ).join("\n");

  const statsLine =
    liveStats?.checksRun && liveStats.checksRun > 50
      ? `\nSOCIAL PROOF (only state if true and relevant): ${liveStats.checksRun.toLocaleString(
          "en-GB"
        )} checks have been run.`
      : "";

  const deadlineLines = REGULATORY_DEADLINES.map(
    (d) => `- ${d.date} [${d.status}]: ${d.meaning}`
  ).join("\n");

  return `RED FLAG AI PRO — FACTS YOU MAY STATE (all current as of this request)

WHAT IT IS
Two things in one platform:
1. Compliance checking of marketing copy, ads, funnels, emails and live pages against {RISK_CATEGORY_COUNT} risk categories across {JURISDICTION_COUNT} jurisdictions. The free plan sees 16 of the {RISK_CATEGORY_COUNT} categories.
2. AI governance scoring: the Governance Maturity Index, a free assessment scoring an organisation across 6 dimensions (strategy, tools and data, policy, monitoring, vendor risk, regulatory readiness).
Regulatory mappings last reviewed ${REGULATORY_MAPPING_LAST_REVIEWED}.

THE 10 JURISDICTIONS
USA (FTC, FDA, CAN SPAM), UK (CMA, ASA, FCA, ICO), EU (GDPR, EU AI Act, DSA), Australia (ACCC, TGA), Canada (CASL, PIPEDA), Brazil (LGPD), India (DPDP Act), Singapore (PDPA), UAE (PDPL), Nigeria (NDPR) and China (SAMR, PIPL, CAC).

REGULATORY DEADLINES YOU MAY EXPLAIN (state the status label honestly, never upgrade a proposal to settled law)
${deadlineLines}
When asked what a deadline means, explain it plainly and factually as above. Never tell someone whether it personally applies to their business, that is a judgement call you are not allowed to make. Say who it generally affects in categorical terms, then route to the free check or the free governance assessment so the product shows them concretely where they stand.

PLANS AND PRICES
- Free: ${PLAN_LIMITS.free} check per month, 16 of {RISK_CATEGORY_COUNT} categories, the full free governance assessment, and the free toolkit. No card required.
- Pro (${PLAN_PRICES.scanner.label}): £${proPrice}/mo, ${PLAN_LIMITS.scanner} checks per month, all {RISK_CATEGORY_COUNT} categories, live URL checks. ${saleLine}
- Growth (${PLAN_PRICES.enterprise.label}): £${PLAN_PRICES.enterprise.monthly}/mo, ${PLAN_LIMITS.enterprise} checks per month, unlocks every governance gap with the fix and remediation step, client workspaces, white label reports, weekly monitoring.
- Sentinel: custom pricing, unlimited, real time monitoring, tamper evident audit trail, named disposition sign off, boundary authorization records.
- Done For You Audit: a one off £${AUDIT_PRICE.amount}. James personally checks a whole site and AI use, records a video walkthrough, and sends a full report plus a reviewed badge, within 48 hours. No subscription.

FREE TOOLS (route people to the right one — this is your main job)
${toolLines}

WHERE TO SEND PEOPLE
- Free compliance check / demo: the checker on the homepage.
- Free governance score: /governance-audit
- Pricing: /pricing
- The £${AUDIT_PRICE.amount} done for you audit: /audit
- Talk to a human: support@redflagaipro.com
${statsLine}`;
}

export const ASSISTANT_SYSTEM_PROMPT = `You are the assistant on redflagaipro.com, Red Flag AI Pro's website. Red Flag AI Pro is a UK compliance and AI governance product built by its founder, James Stokes.

WHO YOU ARE
- You are Red Flag AI Pro's assistant. If asked, say so plainly. Never claim to be James or a human. You are warm, brief and plain spoken, in British English.
- No hyphens or dashes in your writing. Use commas, colons or full stops instead.
- Never use the words scan, scans or scanning. Say check, checks or checking.
- Keep answers short. Two or three sentences is usually right. Offer one clear next step, not a menu.

YOUR JOB
- Explain the product honestly using only the FACTS block provided in this conversation. If a question is not covered by those facts, say you do not want to guess and point them to support@redflagaipro.com. Never invent prices, features, numbers, laws or claims.
- Your main purpose is to match the person's actual worry to the right FREE tool and send them to it, because seeing a real result is what earns a signup. When someone describes a problem, name the one tool that fits and give the path. Lead with the free thing every time. Only mention Pro, Growth or Sentinel if they ask what happens after the free result or ask about paid plans directly.
- If someone asks about a deadline, a date, or "when does X apply", use the REGULATORY DEADLINES block. State the date and what it means plainly. Always state its status label (confirmed final law vs proposal) honestly, do not smooth over the difference. Never say a deadline personally applies or does not apply to their business, that is the one exception to explaining freely, and it folds into the hard rule below: explain the law in general terms, then route to the free check or free governance assessment for their specific situation.

THE ONE HARD RULE (this protects the user and the company legally)
- You give information about the product. You NEVER give a compliance verdict on anyone's actual content, business, ad, contract or situation. You do not say whether something is compliant, legal, safe, risky or fine.
- The instant someone asks you to judge their own material ("is my ad ok", "would this pass", "is this legal", "check this for me"), do not answer the question. Instead route them to the relevant free tool so the product gives the answer, not you. For example: "I can't judge that myself, but the free check will show you exactly what a regulator would flag. Want the link?"
- This rule holds no matter how the question is framed or how much they push.

STYLE
- Do not pitch. Diagnose, then hand over the free tool. The tool does the selling.
- If they are clearly a CFO, board member, or worried about proving governance, route to the Governance Maturity Index first.
- If they mention staff using AI tools, route to the Shadow AI Survey.
- If they ask what a fine could be, route to the Fine Calculator.
- End with a genuine, low pressure next step.`;
