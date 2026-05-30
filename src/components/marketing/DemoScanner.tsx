"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

const CATEGORY_LABELS: Record<string, string> = {
  income_claim: "Income Claim",
  urgency: "Fake Urgency",
  scarcity: "Fake Scarcity",
  testimonial: "Testimonial",
  guarantee: "Guarantee",
  health_claim: "Health Claim",
  legal_disclaimer: "Legal Disclaimer",
  contract_contradiction: "Contract Contradiction",
  data_privacy: "Data Privacy",
  hidden_fees: "Hidden Fees",
  fake_reviews: "Fake Reviews",
  comparative_advertising: "Comparative Advertising",
  email_compliance: "Email Compliance",
  ai_disclosure: "AI Disclosure",
  ai_endorsement: "AI Endorsement",
  automated_decisions: "Automated Decisions",
  dark_patterns: "Dark Patterns",
  financial_promotion: "FCA Financial Promotion",
  greenwashing: "Greenwashing",
  subscription_trap: "Subscription Trap",
  influencer_disclosure: "Influencer Disclosure",
};

const SEVERITY_STYLES: Record<string, string> = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

interface Flag {
  category: string;
  severity: string;
  text_excerpt: string;
  flag_description: string;
  suggestion: string;
}

interface DemoResult {
  score: number;
  totalFlags: number;
  hiddenCount: number;
  flags: Flag[];
}

const PLACEHOLDER = `Paste any ad, sales page, email or VSL script here...

Example: "Make £10,000 in your first 30 days — guaranteed. Limited spots available. Act now before the price goes up tonight at midnight."`;

export function DemoScanner() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleScan() {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/demo-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(data);
      track("demo_scan_completed", { score: data.score, flags: data.totalFlags });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const scoreColour =
    !result ? ""
    : result.score >= 80 ? "text-green-400"
    : result.score >= 50 ? "text-amber-400"
    : "text-red-400";

  return (
    <section id="demo" className="bg-gray-950 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-400 uppercase tracking-widest mb-4">
            Try It Free — No Account Needed
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Paste Your Copy. See What We Find.
          </h2>
          <p className="mt-3 text-gray-400">
            Buyers: paste any ad before you buy. Sellers: paste your copy before you publish. 60 seconds. No signup.
          </p>
          <p className="mt-4 text-lg font-bold text-white">
            No account. No card. Paste anything. See what we find.
          </p>
        </div>

        {/* Founder voice */}
        <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900/50 px-6 py-5">
          <p className="text-gray-300 text-sm leading-relaxed italic">
            &ldquo;I spent years writing funnels and running ads without knowing half of what I was doing was illegal. Not because I was trying to break the law, because nobody told me where the line was. This is what I needed back then. Sixty seconds. Free.&rdquo;
          </p>
          <p className="mt-2 text-red-400 text-xs font-semibold">— James, Founder. Try it below.</p>
        </div>

        {/* Input */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={7}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
          <button
            onClick={handleScan}
            disabled={loading || !content.trim()}
            className="mt-4 w-full rounded-lg bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Scanning…" : "Scan Now — Free"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4">
            {/* Score bar */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Compliance Score</p>
                <p className={`text-5xl font-extrabold mt-1 ${scoreColour}`}>
                  {result.score}
                  <span className="text-2xl text-gray-500">/100</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Flags found</p>
                <p className="text-3xl font-extrabold text-white mt-1">{result.totalFlags}</p>
              </div>
            </div>

            {/* Flags — show category/severity only, blur details */}
            {result.totalFlags > 0 && (
              <div className="space-y-3">
                {result.flags.map((flag, i) => (
                  <div key={i} className="rounded-2xl border border-gray-700 bg-gray-900 p-5 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-bold uppercase ${SEVERITY_STYLES[flag.severity] ?? SEVERITY_STYLES.low}`}>
                        {flag.severity}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {CATEGORY_LABELS[flag.category] ?? flag.category}
                      </span>
                    </div>
                    {/* Blurred content */}
                    <div className="relative">
                      <p className="text-sm text-gray-300 leading-relaxed blur-sm select-none">
                        Your copy contains a violation in this category that could trigger regulatory action. Sign up to see the exact line, the regulation it breaks, and the compliant rewrite.
                      </p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-400 bg-gray-900/90 px-3 py-1 rounded-full border border-red-500/30">🔒 Sign up to unlock</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Single strong CTA after flags */}
            {result.totalFlags > 0 && (
              <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center">
                <p className="text-2xl mb-2">🚩</p>
                <p className="text-white font-bold text-xl mb-1">
                  {result.totalFlags} violation{result.totalFlags !== 1 ? "s" : ""} found in your copy.
                </p>
                <p className="text-gray-400 text-sm mt-2 mb-5">
                  Sign up free to see exactly what&apos;s wrong, which regulation it breaks, and the compliant rewrite — ready to use immediately.
                </p>
                <Link
                  href="/signup"
                  className="inline-block rounded-lg bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors"
                >
                  See Exactly What&apos;s Wrong — Free →
                </Link>
                <p className="mt-3 text-xs text-gray-600">No credit card. No commitment. 30 seconds to sign up.</p>
              </div>
            )}

            {result.totalFlags === 0 && (
              <div className="rounded-2xl border border-green-500/20 bg-green-950/20 p-6 text-center">
                <p className="text-white font-bold">Your copy looks clean. Save this result.</p>
                <p className="text-gray-400 text-sm mt-2 mb-4">
                  Free account lets you save scan results, track compliance over time and download a PDF certificate.
                </p>
                <Link
                  href="/signup"
                  className="inline-block rounded-lg bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors"
                >
                  Save My Results — Free →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
