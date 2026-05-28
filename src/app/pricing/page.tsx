import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Pricing — Red Flag AI Pro",
  description:
    "Starter £29/month for bootstrapped funnel builders. Pro £49/month for solopreneurs. Growth £199/month for high-volume creators. Sentinel £999/month for agencies and regulated businesses.",
  alternates: { canonical: "https://www.redflagaipro.com/pricing" },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#07070f" }}>
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-gray-400 text-base">
            Try one scan free on the homepage. No account needed.
          </p>
        </div>

        {/* Demo CTA */}
        <div className="mt-6 mb-10 rounded-xl border border-gray-800 bg-gray-900/50 px-6 py-4 text-center max-w-xl mx-auto">
          <p className="text-sm text-gray-400">
            Want to try before you buy?{" "}
            <Link href="/#demo" className="font-semibold text-red-400 hover:text-red-300 transition-colors">
              Run a free scan on the homepage →
            </Link>
          </p>
        </div>

        {/* 3-column plans */}
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Starter */}
          <div className="relative flex flex-col rounded-2xl border border-gray-800 bg-gray-900/40 p-8">
            <div>
              <h2 className="text-xl font-bold text-white">Starter</h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                For bootstrapped funnel builders and affiliate marketers just getting started.
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">£29</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
            </div>

            <ul className="mt-6 flex-1 space-y-2.5">
              {[
                "10 scans per month",
                "16 risk categories scanned",
                "5 jurisdictions - FTC, GDPR, ASA, ACCC, CASL",
                "EU AI Act compliance",
                "Compliance flags in plain English",
                "Compliant rewrite suggestions",
                "Scan history",
                "Email support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 flex-shrink-0">✓</span>
                  <span className="text-gray-400">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup?plan=starter"
              className="mt-8 block rounded-xl border border-gray-700 py-3 text-center text-sm font-semibold text-white hover:border-red-500/50 hover:bg-gray-800 transition-colors"
            >
              Get started →
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border border-red-500 p-8 shadow-xl shadow-red-500/10" style={{ background: "linear-gradient(160deg, #1a0a0a 0%, #0f0810 100%)" }}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-amber-900 whitespace-nowrap">
              Most popular
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Pro</h2>
              <p className="mt-1 text-sm text-red-300/70 leading-relaxed">
                For solopreneurs and buyers running proper campaigns.
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">£49</span>
                <span className="text-sm text-red-300/60">/month</span>
              </div>
            </div>

            <ul className="mt-6 flex-1 space-y-2.5">
              {[
                "20 scans per month",
                "16 risk categories scanned",
                "5 jurisdictions - FTC, GDPR, ASA, ACCC, CASL",
                "EU AI Act compliance",
                "Compliance flags in plain English",
                "Compliant rewrite suggestions",
                "Scan history",
                "Email support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-red-400 flex-shrink-0">✓</span>
                  <span className="text-red-50/80">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup?plan=pro"
              className="mt-8 block rounded-xl bg-white py-3 text-center text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              Get started →
            </Link>
          </div>

          {/* Growth */}
          <div className="relative flex flex-col rounded-2xl border border-gray-800 bg-gray-900/40 p-8">
            <div>
              <h2 className="text-xl font-bold text-white">Growth</h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                For funnel builders, affiliate marketers and high-volume creators.
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">£199</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
            </div>

            <ul className="mt-6 flex-1 space-y-2.5">
              {[
                "Unlimited scans",
                "16 risk categories scanned",
                "5 jurisdictions - FTC, GDPR, ASA, ACCC, CASL",
                "EU AI Act compliance",
                "Compliance flags in plain English",
                "Compliant rewrite suggestions",
                "PDF compliance reports",
                "Full scan history",
                "Priority email support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 flex-shrink-0">✓</span>
                  <span className="text-gray-400">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup?plan=enterprise"
              className="mt-8 block rounded-xl border border-gray-700 py-3 text-center text-sm font-semibold text-white hover:border-red-500/50 hover:bg-gray-800 transition-colors"
            >
              Get started →
            </Link>
          </div>

          {/* Sentinel */}
          <style>{`
            @keyframes sentinelGlow {
              0%, 100% { opacity: 0.15; }
              50% { opacity: 0.5; }
            }
            .sentinel-sheen {
              background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%, rgba(255,255,255,0.3) 100%);
              animation: sentinelGlow 10s ease-in-out infinite;
            }
          `}</style>
          <div
            className="relative flex flex-col rounded-2xl p-8 overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #d0d0da 0%, #b4b4c8 35%, #9a9ab2 65%, #acacc0 100%)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(0,0,0,0.2)",
            }}
          >
            {/* Slow elegant sheen */}
            <div className="sentinel-sheen pointer-events-none absolute inset-0 rounded-2xl" />
            {/* Top highlight */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%)",
              }}
            />

            <div className="relative flex items-center gap-2 mb-5">
              <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-700">For agencies</span>
            </div>

            <div className="relative">
              <h2 className="text-xl font-bold text-gray-900">Sentinel</h2>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                For agencies and regulated businesses where compliance is not optional.
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">£999</span>
                <span className="text-sm text-gray-600">/month</span>
              </div>
            </div>

            <ul className="relative mt-6 flex-1 space-y-2.5">
              {[
                "Unlimited scans",
                "All 21 risk categories",
                "FCA financial promotions",
                "Greenwashing scanner",
                "Human review log",
                "Legal timestamps",
                "Signed PDF certificates",
                "3-year audit retention",
                "API access",
                "Custom rules",
                "Dedicated onboarding",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-red-600 flex-shrink-0">✓</span>
                  <span className="text-gray-800">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/sentinel"
              className="relative mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)",
                color: "#e0e0f0",
              }}
            >
              Learn more about Sentinel →
            </Link>
          </div>

        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          All plans include a 14-day money-back guarantee. Cancel anytime. No contracts.
        </p>

      </div>
    </div>
  );
}
