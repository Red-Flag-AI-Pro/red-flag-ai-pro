import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Case Study — What Red Flag AI Pro Found on a Real Sales Page",
  description: "A real walk-through of what Red Flag AI Pro found when scanning a typical online course sales page. Four violations. Plain English explanations. Exact rewrites provided.",
  alternates: { canonical: "https://www.redflagaipro.com/case-study" },
};

const FLAGS = [
  {
    category: "Income Claim",
    severity: "HIGH",
    severityColor: "bg-red-900/40 text-red-300 border-red-700/40",
    excerpt: "Join thousands of members who are making £5,000–£10,000 per month using our proven system.",
    description: "This is an unsubstantiated earnings claim. It implies typical members earn this amount without providing evidence of actual results. This violates FTC guidelines, ASA CAP Code Rule 3.1 and ACCC rules on earnings representations.",
    fix: "Replace with: 'Our members report a wide range of results. Some earn £5,000+ per month, individual results vary based on effort, experience and market conditions. See our income disclaimer for full details.'",
    regulations: ["FTC (US)", "ASA CAP Code (UK)", "CMA (UK)", "ACCC (AU)"],
  },
  {
    category: "Guarantee Contradiction",
    severity: "HIGH",
    severityColor: "bg-red-900/40 text-red-300 border-red-700/40",
    excerpt: "Results guaranteed or your money back, no questions asked.",
    description: "The sales page guarantees results, but the Terms of Service states 'all sales final, no refunds on digital products.' This direct contradiction between the sales copy and the contract terms is a violation of ASA CAP Code Rule 3.1 and the Consumer Rights Act 2015.",
    fix: "Either update the Terms to match the guarantee, or remove the guarantee from the sales page. Note: UK consumers have a statutory 14-day right to cancel digital purchases that cannot be contracted away.",
    regulations: ["ASA CAP Code (UK)", "Consumer Rights Act 2015 (UK)", "FTC (US)"],
  },
  {
    category: "False Urgency",
    severity: "MEDIUM",
    severityColor: "bg-amber-900/40 text-amber-300 border-amber-700/40",
    excerpt: "Offer expires tonight at midnight. Only 3 spots remaining at this price.",
    description: "The countdown timer on this page resets when visited in a new browser session, and the same '3 spots remaining' message has been live for over two weeks. Fake urgency and fake scarcity are specifically named as illegal dark patterns under CMA guidance and EU DSA Article 25.",
    fix: "Remove the countdown timer entirely, or replace it with a genuine deadline that is honoured. If spots are not actually limited, remove the scarcity claim.",
    regulations: ["CMA (UK)", "EU DSA (EU)", "ACCC (AU)", "FTC (US)"],
  },
  {
    category: "Unverified Testimonial",
    severity: "MEDIUM",
    severityColor: "bg-amber-900/40 text-amber-300 border-amber-700/40",
    excerpt: "I made £20,000 in my first month using this exact system. This changed my life.",
    description: "This testimonial shows exceptional results without disclosing that they are atypical. The person providing the testimonial received a free product in exchange for their review, which was not disclosed. Both the missing typicality disclaimer and the undisclosed incentive violate FTC and ASA rules.",
    fix: "Add: 'Results not typical. Individual results will vary.' If the testimonial was incentivised, add clear disclosure: 'This customer received free access in exchange for their feedback.'",
    regulations: ["FTC Endorsement Guides 2023 (US)", "ASA CAP Code (UK)", "CMA (UK)"],
  },
];

const SCORE_BEFORE = 42;
const SCORE_AFTER = 89;

export default function CaseStudyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="bg-gray-950 py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Case Study</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            What We Found on a Real Sales Page
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            A typical online course sales page. Looked professional. Scanned in 60 seconds. Four violations found. Here is exactly what they were and how to fix them.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">

        {/* Score comparison */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-xs text-gray-500 mb-1">Score before</p>
            <p className="text-4xl font-extrabold text-red-600">{SCORE_BEFORE}</p>
            <p className="text-xs font-semibold text-red-600 mt-1">Medium Risk</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center flex flex-col items-center justify-center">
            <p className="text-xs text-gray-500 mb-1">Flags found</p>
            <p className="text-4xl font-extrabold text-gray-900">4</p>
            <p className="text-xs text-gray-500 mt-1">2 high, 2 medium</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
            <p className="text-xs text-gray-500 mb-1">Score after fixes</p>
            <p className="text-4xl font-extrabold text-green-600">{SCORE_AFTER}</p>
            <p className="text-xs font-semibold text-green-600 mt-1">Low Risk</p>
          </div>
        </div>

        {/* The copy */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">The copy that was scanned</h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-gray-700 text-sm leading-relaxed italic">
              &ldquo;Join thousands of members who are making £5,000–£10,000 per month using our proven system. Results guaranteed or your money back, no questions asked. Offer expires tonight at midnight. Only 3 spots remaining at this price. I made £20,000 in my first month using this exact system. This changed my life.&rdquo;
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">Typical course sales page copy. Nothing unusual to the human eye. Four violations to a compliance scanner.</p>
        </div>

        {/* Flags */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">What was found</h2>
          <div className="space-y-4">
            {FLAGS.map((flag, i) => (
              <div key={flag.category} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">#{i + 1}</span>
                    <span className="text-sm font-bold text-gray-900">{flag.category}</span>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${flag.severityColor}`}>
                    {flag.severity}
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <blockquote className="rounded-md border-l-4 border-amber-400 bg-amber-50 px-4 py-2 text-sm italic text-amber-800">
                    &ldquo;{flag.excerpt}&rdquo;
                  </blockquote>
                  <p className="text-sm text-gray-700">{flag.description}</p>
                  <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3">
                    <p className="text-xs font-bold text-green-700 mb-1">The fix</p>
                    <p className="text-sm text-green-800">{flag.fix}</p>
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
        </div>

        {/* What happened next */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What happened after the fixes</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            The four issues were fixed before the campaign went live. The earnings claim was replaced with qualified language and an income disclaimer. The guarantee was aligned with the Terms of Service. The countdown timer was removed. The testimonial was updated with a typicality disclaimer and incentive disclosure.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Compliance score went from 42 to 89. The campaign launched without a complaint. The whole process, scanning and fixing, took under 30 minutes.
          </p>
        </div>

        {/* CTA */}
        <div className="rounded-xl border-2 border-gray-900 bg-gray-950 p-8 text-center">
          <p className="text-white font-bold text-lg mb-2">Scan your copy before it costs you</p>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Free scan, no account needed. Paste any sales page, email or ad and see what a compliance scanner finds in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/#demo" className="rounded-xl bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors">
              Try it free →
            </a>
            <Link href="/pricing" className="rounded-xl border border-gray-700 px-8 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
              See pricing
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
