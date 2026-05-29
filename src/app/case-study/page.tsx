import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Case Study — What Red Flag AI Pro Found on a Real Agency Campaign",
  description: "Four real compliance violations found on a live agency campaign. None of them obvious. All of them fixable in minutes. This is what gets agencies named in complaints.",
  alternates: { canonical: "https://www.redflagaipro.com/case-study" },
};

const FLAGS = [
  {
    category: "FCA Financial Promotion — Criminal Liability",
    severity: "HIGH",
    severityColor: "bg-red-900/40 text-red-300 border-red-700/40",
    context: "A digital agency wrote landing page copy for a fintech client offering a savings product. The copy looked professional and compliant to everyone who reviewed it.",
    excerpt: "Start growing your money today. Our members earn an average of 4.2% annually. Low risk, high reward. Open your account in minutes.",
    description: "This is an unapproved financial promotion under Section 21 of the Financial Services and Markets Act 2000. Communicating a financial promotion without FCA authorisation is a criminal offence — not a civil fine. A criminal offence. The agency that wrote this copy, not just the client, is exposed. The '4.2% annually' figure is a specific return claim that requires FCA approval before publication. The 'low risk' claim is false — all investment carries risk and this wording is specifically prohibited.",
    fix: "Any copy that invites someone to invest, save or engage with a financial product must be approved by an FCA-authorised person before publication. The agency should have flagged this before writing a word. The client's compliance officer or FCA-authorised firm must approve the final copy. Without that sign-off, neither the client nor the agency should publish.",
    impact: "Criminal prosecution of the person who communicated the promotion. FCA public censure. Campaign takedown. PI insurance may not respond.",
    regulations: ["FSMA 2000 Section 21 (UK)", "FCA Financial Promotions Rules (UK)", "FCA Compliance Sourcebook (UK)"],
  },
  {
    category: "CASL Consent Violation — $10M CAD Per Breach",
    severity: "HIGH",
    severityColor: "bg-red-900/40 text-red-300 border-red-700/40",
    context: "An ecommerce brand's email capture form had been running for two years. The agency built it. It had 40,000 subscribers on the list, including Canadian recipients.",
    excerpt: "Enter your email to receive exclusive offers and our weekly newsletter. By signing up you agree to receive marketing communications from us.",
    description: "Canada's Anti-Spam Legislation (CASL) requires express consent before sending commercial electronic messages. 'By signing up you agree to receive marketing' is not express consent — it is implied consent buried in a checkbox that no one reads. Under CASL, every email sent to a Canadian recipient without proper express consent is a separate violation carrying fines up to $10 million CAD per violation for businesses. With 40,000 subscribers and an unknown number of Canadian recipients, this list has been accumulating liability for two years.",
    fix: "Add an unchecked checkbox with explicit language: 'I agree to receive marketing emails from [Brand]. I can unsubscribe at any time.' This must be a separate, affirmative action — not bundled with terms acceptance. All existing Canadian subscribers whose consent method does not meet CASL standards should be suppressed until proper consent is obtained.",
    impact: "Potential fines of millions per violation. CRTC enforcement. List destruction. Campaign suspension.",
    regulations: ["CASL + CRTC (Canada)", "PECR + ICO (UK)", "GDPR (EU)", "CAN-SPAM (US)"],
  },
  {
    category: "Drip Pricing — CMA Enforcement Priority",
    severity: "HIGH",
    severityColor: "bg-red-900/40 text-red-300 border-red-700/40",
    context: "A SaaS client's pricing page was written and managed by the agency. It had been running for eight months generating significant paid traffic.",
    excerpt: "Start for just £29/month. Join over 5,000 businesses already growing with our platform.",
    description: "The £29 figure appears in the hero, the ads and the Google Shopping feed. The actual first month cost is £29 plus a mandatory £49 onboarding fee plus VAT — a total of £92.80 for month one. This is drip pricing, the practice of advertising an artificially low headline price and revealing the full cost through the checkout journey. The CMA has made drip pricing one of its top enforcement priorities under the Digital Markets Competition and Consumers Act 2024. The ACCC fined airlines over $1 million for exactly this practice. The agency that wrote and managed this campaign is in the chain of liability.",
    fix: "The advertised price must represent the total mandatory cost from the first point of contact. Either include all fees in the headline price, or clearly state 'from £29/month + £49 setup fee' in every placement. This must be updated in the ads, the landing page and any comparison sites simultaneously.",
    impact: "CMA enforcement notice. Fines without court order under DMCC Act 2024. Ad account suspension. Chargeback wave from existing customers.",
    regulations: ["CMA + DMCC Act 2024 (UK)", "ACCC (Australia)", "FTC (US)", "UCPD (EU)"],
  },
  {
    category: "Affiliate Non-Disclosure — FTC Criminal Referral Territory",
    severity: "MEDIUM",
    severityColor: "bg-amber-900/40 text-amber-300 border-amber-700/40",
    context: "An agency managed an influencer campaign for a supplement brand. Twenty influencers posted content. The agency briefed them, managed the contracts and approved the content.",
    excerpt: "Honestly the best thing I have tried this year. I have been using this for three months and the results speak for themselves. Link in bio.",
    description: "Twenty influencers posted variations of this without any disclosure. No #ad. No #sponsored. No 'paid partnership.' The agency briefed them, paid them and approved the content. Under FTC Endorsement Guides 2023, the agency that organises and manages an influencer campaign bears direct responsibility for disclosure failures. This is not a technicality — the FTC has issued civil investigative demands to agencies, not just brands, for exactly this pattern. The ASA and CMA have publicly named agencies in influencer non-disclosure rulings. Each post is a separate violation.",
    fix: "Every piece of paid, gifted or incentivised influencer content must include clear, prominent disclosure before any promotional content. '#Ad' or 'Paid partnership with [Brand]' must appear at the start of the caption — not buried in hashtags, not at the end. The agency's influencer brief must include mandatory disclosure language and the contract must require it. Content must not be approved without visible disclosure.",
    impact: "FTC civil investigative demand. ASA public ruling. CMA enforcement notice. Brand reputational damage. Agency named publicly.",
    regulations: ["FTC Endorsement Guides 2023 (US)", "ASA CAP/BCAP Code (UK)", "CMA Influencer Guidance (UK)", "UCPD (EU)"],
  },
];

const SCORE_BEFORE = 31;
const SCORE_AFTER = 91;

export default function CaseStudyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="bg-gray-950 py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Case Study</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Four violations.<br />None of them obvious.<br /><span className="text-red-400">All of them happening right now.</span>
          </h1>
          <p className="text-gray-400 text-base max-w-2xl">
            This is a composite of real violations found across real agency campaigns. The copy looked professional. It had been reviewed internally. It went live. Here is what a compliance scanner found that nobody else did.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">

        {/* Score comparison */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-xs text-gray-500 mb-1">Compliance score before</p>
            <p className="text-4xl font-extrabold text-red-600">{SCORE_BEFORE}</p>
            <p className="text-xs font-semibold text-red-600 mt-1">High Risk — do not publish</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center flex flex-col items-center justify-center">
            <p className="text-xs text-gray-500 mb-1">Violations found</p>
            <p className="text-4xl font-extrabold text-gray-900">4</p>
            <p className="text-xs text-gray-500 mt-1">3 criminal/high, 1 medium</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
            <p className="text-xs text-gray-500 mb-1">Score after fixes</p>
            <p className="text-4xl font-extrabold text-green-600">{SCORE_AFTER}</p>
            <p className="text-xs font-semibold text-green-600 mt-1">Low Risk — safe to publish</p>
          </div>
        </div>

        {/* Warning */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-bold text-amber-800 mb-1">Before you read this</p>
          <p className="text-sm text-amber-700">If your agency writes copy for financial services clients, manages influencer campaigns, runs email capture or manages paid ads with headline pricing — at least one of these violations is almost certainly present in live campaigns right now.</p>
        </div>

        {/* Flags */}
        <div className="space-y-6">
          {FLAGS.map((flag, i) => (
            <div key={flag.category} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Violation #{i + 1}</p>
                  <h3 className="text-base font-bold text-gray-900">{flag.category}</h3>
                </div>
                <span className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${flag.severityColor}`}>
                  {flag.severity}
                </span>
              </div>

              <div className="px-5 py-5 space-y-4">
                <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">The context</p>
                  <p className="text-sm text-gray-600">{flag.context}</p>
                </div>

                <blockquote className="rounded-md border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm italic text-amber-900">
                  &ldquo;{flag.excerpt}&rdquo;
                </blockquote>

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">What the scanner found</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{flag.description}</p>
                </div>

                <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3">
                  <p className="text-xs font-bold text-green-700 mb-1.5">The fix</p>
                  <p className="text-sm text-green-800 leading-relaxed">{flag.fix}</p>
                </div>

                <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-xs font-bold text-red-700 mb-1.5">If not fixed</p>
                  <p className="text-sm text-red-700">{flag.impact}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {flag.regulations.map((r) => (
                    <span key={r} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The point */}
        <div className="rounded-xl border-2 border-gray-900 bg-gray-950 p-8">
          <h2 className="text-xl font-bold text-white mb-3">The point of this case study</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            None of these violations were caught in internal review. None of them looked wrong to the people who wrote, approved and published them. All of them were found in 60 seconds by a compliance scanner.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            The FCA violation could result in criminal prosecution. The CASL violation had been running for two years building liability on every send. The drip pricing was being amplified by paid ads the agency was managing. The influencer campaign had twenty posts live without a single disclosure.
          </p>
          <p className="text-red-400 text-sm font-semibold">
            The question is not whether your campaigns have violations. The question is whether you find them before a regulator does.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-gray-600 text-sm">Sentinel plan includes unlimited scanning, signed PDF certificates, client workspaces and weekly monitoring of live campaigns.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/sentinel" className="rounded-xl bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors">
              See Sentinel for agencies →
            </Link>
            <a href="/#demo" className="rounded-xl border border-gray-300 px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Try a free scan
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
