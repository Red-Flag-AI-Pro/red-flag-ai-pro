import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Pricing — Red Flag AI Pro",
  description:
    "Try free on the homepage. Pro £49/month for buyers and solopreneurs. Growth £199/month for funnel builders and affiliate marketers. Sentinel £999/month for agencies and regulated businesses.",
  alternates: { canonical: "https://www.redflagaipro.com/pricing" },
};

const PLANS = [
  {
    name: "Pro",
    price: "£49",
    period: "per month",
    description: "For buyers checking before they spend and solopreneurs scanning their own copy.",
    badge: null,
    features: [
      "20 scans per month",
      "16 risk categories scanned",
      "5 jurisdictions - FTC, GDPR, ASA, ACCC, CASL",
      "EU AI Act compliance",
      "Compliance flags in plain English",
      "Compliant rewrite suggestions",
      "Scan history",
      "Email support",
    ],
    excluded: ["PDF compliance reports"],
    cta: "Get started →",
    href: "/signup?plan=pro",
    highlight: false,
  },
  {
    name: "Growth",
    price: "£199",
    period: "per month",
    description: "For funnel builders, affiliate marketers and high-volume creators.",
    badge: "Most popular",
    features: [
      "Unlimited scans",
      "16 risk categories scanned",
      "5 jurisdictions - FTC, GDPR, ASA, ACCC, CASL",
      "EU AI Act compliance",
      "Compliance flags in plain English",
      "Compliant rewrite suggestions",
      "PDF compliance reports",
      "Full scan history",
      "Priority email support",
    ],
    excluded: [],
    cta: "Get started →",
    href: "/signup?plan=enterprise",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Try one scan free on the homepage. No account needed.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            21 risk categories · 5 jurisdictions · EU AI Act · FTC · GDPR · ASA · ACCC · CASL
          </p>
        </div>

        {/* Demo CTA */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Want to try before you buy?{" "}
            <Link href="/#demo" className="font-semibold text-red-600 hover:text-red-500 transition-colors">
              Run a free scan on the homepage - no account needed →
            </Link>
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 max-w-3xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={[
                "relative flex flex-col rounded-2xl border p-8",
                plan.highlight
                  ? "border-red-500 bg-red-600 text-white shadow-xl shadow-red-200"
                  : "border-gray-200 bg-white text-gray-900",
              ].join(" ")}
            >
              {plan.badge && (
                <div className={[
                  "absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold whitespace-nowrap",
                  plan.highlight ? "bg-amber-400 text-amber-900" : "bg-gray-800 text-gray-200",
                ].join(" ")}>
                  {plan.badge}
                </div>
              )}

              <div>
                <h2 className={[
                  "text-xl font-bold",
                  plan.highlight ? "text-white" : "text-gray-900",
                ].join(" ")}>
                  {plan.name}
                </h2>
                <p className={[
                  "mt-1 text-sm leading-relaxed",
                  plan.highlight ? "text-red-100" : "text-gray-500",
                ].join(" ")}>
                  {plan.description}
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className={[
                    "text-4xl font-extrabold",
                    plan.highlight ? "text-white" : "text-gray-900",
                  ].join(" ")}>
                    {plan.price}
                  </span>
                  <span className={[
                    "text-sm",
                    plan.highlight ? "text-red-200" : "text-gray-400",
                  ].join(" ")}>
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={plan.highlight ? "text-red-200" : "text-green-500"}>✓</span>
                    <span className={plan.highlight ? "text-red-50" : "text-gray-700"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={[
                  "mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-colors",
                  plan.highlight
                    ? "bg-white text-red-600 hover:bg-red-50"
                    : "bg-red-600 text-white hover:bg-red-700",
                ].join(" ")}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          All plans include a 14-day money-back guarantee. Cancel anytime. No contracts.
        </p>

        {/* Sentinel */}
        <div className="mt-16 rounded-2xl bg-gray-950 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Sentinel — for agencies and regulated businesses</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-white">
              Sentinel
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">£999</span>
              <span className="text-gray-400 text-sm">/month</span>
            </div>
          </div>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Built for agencies and regulated businesses where a compliance failure is a regulatory event. Human review logs with legal timestamps. Signed compliance certificates. FCA financial promotions. Greenwashing scanner for EU Green Claims Directive. The audit trail your PI insurer needs and your regulator expects.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Unlimited scans", "All 21 risk categories", "Human Review Log", "Legal Timestamps", "FCA Financial Promotions", "Greenwashing Scanner", "Signed PDF Certificates", "3-Year Retention", "API Access", "Custom Rules", "Dedicated onboarding", "Monthly compliance review"].map((f) => (
              <span key={f} className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400">
                {f}
              </span>
            ))}
          </div>
          <Link
            href="/sentinel"
            className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors"
          >
            Learn more about Sentinel →
          </Link>
        </div>
      </div>
    </div>
  );
}
