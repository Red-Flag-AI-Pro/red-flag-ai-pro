import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Pricing — Start Free, Upgrade When Ready",
  description:
    "Start with 1 free scan. Pro from £49/month — price rises to £99 after launch. Enterprise £149/month — rises to £299 after launch. 16 risk categories including EU AI Act across 5 jurisdictions.",
  alternates: { canonical: "https://www.redflagaipro.com/pricing" },
};

const PLANS = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "For individuals who want to try it out.",
    badge: null,
    features: [
      "1 scan per month",
      "Risk score",
      "Compliance flags",
      "Rewrite suggestions",
    ],
    excluded: ["PDF reports", "30 scans per month", "Priority support"],
    cta: "Start free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "£49",
    period: "per month",
    description: "Launch price — rises to £99 after Product Hunt. Lock it in today.",
    badge: "LAUNCH PRICE",
    features: [
      "30 scans per month",
      "16 risk categories",
      "EU AI Act compliance",
      "FTC · GDPR · ASA · ACCC · CASL",
      "Compliance flags",
      "Rewrite suggestions",
      "Scan history",
      "Email support",
    ],
    excluded: [],
    cta: "Lock in £49 →",
    href: "/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "£149",
    period: "per month",
    description: "Launch price — rises to £299 after Product Hunt. For agencies and compliance teams.",
    badge: "LAUNCH PRICE",
    features: [
      "Everything in Pro",
      "Unlimited scans",
      "PDF compliance reports",
      "Dedicated onboarding call",
      "Monthly compliance review call",
      "Priority support (2 business days)",
      "Invoice billing",
      "Early access to new features",
    ],
    excluded: [],
    cta: "Lock in £149 →",
    href: "/signup?plan=enterprise",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Launch banner */}
      <div className="bg-red-600 py-3 text-center">
        <p className="text-sm font-bold text-white">
          🚀 Launching on Product Hunt — lock in founder pricing before it rises.{" "}
          <Link href="/signup?plan=pro" className="underline hover:text-red-100">
            Sign up now →
          </Link>
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Start free. Upgrade for more scans, PDF reports and full compliance coverage.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            16 risk categories · 5 jurisdictions · EU AI Act · FTC · GDPR · ASA · ACCC · CASL
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
                {plan.excluded.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400 line-through">
                    <span>✕</span>
                    <span>{f}</span>
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

        {/* Sentinel coming soon */}
        <div className="mt-16 rounded-2xl bg-gray-950 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Coming Q3 2026</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Sentinel — Compliance Infrastructure for Enterprise
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl leading-relaxed">
            Built for legal teams, financial services firms and regulated businesses. Human review logs with legal timestamps. Signed compliance certificates. Financial promotions compliance for FCA-regulated businesses. Greenwashing scanner for EU Green Claims Directive. The audit trail your PI insurer needs. The documentation your regulator expects.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Human Review Log", "Legal Timestamps", "FCA Financial Promotions", "Greenwashing Scanner", "Signed PDF Certificates", "3-Year Retention", "API Access", "Custom Rules"].map((f) => (
              <span key={f} className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400">
                {f}
              </span>
            ))}
          </div>
          <Link
            href="mailto:support@redflagaipro.com?subject=Sentinel Waitlist"
            className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors"
          >
            Join the Sentinel waitlist →
          </Link>
        </div>
      </div>
    </div>
  );
}
