import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Pricing — Red Flag AI Pro",
  description:
    "Pro from £39/month. Growth £199/month. Sentinel £999/month for agencies — URL scanning, VSL scanning, site audit, team seats, API access and white-label reports.",
  alternates: { canonical: "https://www.redflagaipro.com/pricing" },
};

const PRO_FEATURES = [
  "20 scans per month",
  "16 risk categories",
  "URL page scanning",
  "Paste text and upload .txt",
  "Plain English flags + rewrite suggestions",
  "0–100 compliance score",
  "Full scan history",
  "Public shareable scan links",
  "CSV export",
  "Email support",
];

const GROWTH_FEATURES = [
  "Everything in Pro",
  "Unlimited scans",
  "VSL script scanning",
  "Site audit — up to 10 pages",
  "Client workspaces",
  "URL monitoring — 5 URLs",
  "Weekly email digest",
  "Compliance changelog",
  "Score trend history per client",
  "PDF compliance reports",
  "Priority support",
];

const SENTINEL_FEATURES = [
  "Everything in Growth",
  "All 21 risk categories",
  "FCA financial promotions",
  "Greenwashing scanner",
  "YouTube VSL transcript scanning",
  "Audio transcription via Whisper",
  "Site audit — up to 50 pages",
  "Unlimited URL monitoring",
  "Weekly email digest",
  "Auto-reports to client contacts",
  "Compliance changelog",
  "Multi-user team seats",
  "White-label PDF reports",
  "Public REST API + API keys",
  "Zapier / webhook integration",
  "Chrome extension",
  "Embeddable compliance badge",
  "Dedicated onboarding",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#07070f" }}>
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            Compliance infrastructure.<br className="hidden sm:block" /> Choose your level.
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Try one scan free on the homepage — no account needed.{" "}
            <Link href="/#demo" className="text-red-400 hover:text-red-300 font-medium">
              Run a free scan →
            </Link>
          </p>
        </div>

        {/* Founder message */}
        <div className="mb-10 max-w-3xl mx-auto rounded-2xl p-8" style={{ background: "#1a0a0a", border: "2px solid #dc2626" }}>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-5">🚩 From the founder</p>
          <p className="text-white text-base leading-relaxed mb-4">
            I have never forgotten the struggle. Running campaigns alone with no legal budget, spending everything on ads and just hoping the copy was okay. I know exactly what it costs when it isn&apos;t — the chargebacks, the takedowns, the panic.
          </p>
          <p className="text-gray-200 text-base leading-relaxed mb-4">
            That&apos;s why I made so much of this accessible. And now we&apos;re operating at agency level — I feel that pain too. Agencies are being charged £2,000–£10,000 a month for tools that take weeks to set up and still don&apos;t cover everything.
          </p>
          <p className="text-red-400 text-base font-bold leading-relaxed">
            This wasn&apos;t built for profit. It was built from pain. That&apos;s why we outperform and undercharge — and always will.
          </p>
          <p className="mt-5 text-gray-500 text-sm font-medium">— James, Founder</p>
        </div>

        {/* 3-column plans */}
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-3 items-start">

          {/* Pro */}
          <div
            className="relative flex flex-col rounded-2xl border border-red-500/60 p-7"
            style={{ background: "linear-gradient(160deg, #1a0808 0%, #0f0810 100%)" }}
          >
            <div className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-amber-900">
              Most popular
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Pro</h2>
              <p className="mt-1 text-xs text-red-300/60 leading-relaxed">
                Solopreneurs, funnel builders and buyers checking copy before they spend.
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">£39</span>
                <span className="text-sm text-red-300/60">/month</span>
              </div>
              <Link
                href="/signup?plan=pro"
                className="mt-4 block rounded-xl bg-white py-2.5 text-center text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                Get started →
              </Link>
            </div>

            <div className="border-t border-red-900/40 pt-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">What&apos;s included</p>
              <ul className="space-y-2.5">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="text-red-400 flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-red-50/75">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Growth */}
          <div className="relative flex flex-col rounded-2xl border border-gray-700 bg-gray-900/60 p-7">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Growth</h2>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Agencies managing client copy and high-volume creators who scan daily.
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">£199</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
              <Link
                href="/signup?plan=enterprise"
                className="mt-4 block rounded-xl border border-gray-600 py-2.5 text-center text-sm font-bold text-white hover:border-red-500/50 hover:bg-gray-800 transition-colors"
              >
                Get started →
              </Link>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">What&apos;s included</p>
              <ul className="space-y-2.5">
                {GROWTH_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sentinel */}
          <style>{`
            @keyframes sentinelGlow {
              0%, 100% { opacity: 0.12; }
              50% { opacity: 0.45; }
            }
            .sentinel-sheen {
              background: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, transparent 50%, rgba(255,255,255,0.25) 100%);
              animation: sentinelGlow 10s ease-in-out infinite;
            }
          `}</style>
          <div
            className="relative flex flex-col rounded-2xl p-7 overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #f0f0f8 0%, #d8d8ec 35%, #bfbfd8 65%, #d4d4e8 100%)",
              boxShadow: "0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="sentinel-sheen pointer-events-none absolute inset-0 rounded-2xl" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 35%)" }} />

            <div className="relative mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Agency plan</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Sentinel</h2>
              <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                Agencies and regulated businesses where compliance is not optional.
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">£999</span>
                <span className="text-sm text-gray-600">/month</span>
              </div>
              <Link
                href="/sentinel"
                className="relative mt-4 block rounded-xl py-2.5 text-center text-sm font-bold transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)", color: "#e0e0f0" }}
              >
                Learn more →
              </Link>
            </div>

            <div className="relative border-t border-gray-400/30 pt-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">What&apos;s included</p>
              <ul className="space-y-2.5">
                {SENTINEL_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="text-red-600 flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-gray-800">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Comparison note */}
        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            <div>
              <p className="text-2xl font-extrabold text-white">21</p>
              <p className="text-xs text-gray-500 mt-1">Risk categories on Sentinel</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">5</p>
              <p className="text-xs text-gray-500 mt-1">Jurisdictions — FTC, GDPR, ASA, FCA, ACCC, CASL</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">60s</p>
              <p className="text-xs text-gray-500 mt-1">From paste to compliance score</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          All plans include a 14-day money-back guarantee. Cancel anytime. No contracts.{" "}
          <Link href="/docs" className="text-gray-500 hover:text-gray-400">API docs →</Link>
        </p>


      </div>
    </div>
  );
}
