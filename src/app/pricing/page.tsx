import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Pricing — Start Free, Upgrade When Ready",
  description:
    "Start with 1 free scan. Upgrade to Pro for £49/month and get unlimited scans, PDF reports and full compliance history. Founder pricing — only 42 spots left.",
  alternates: { canonical: "https://www.redflagaipro.com/pricing" },
};

const PLANS = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "For individuals who want to try it out.",
    features: [
      "1 scan per month",
      "Risk score",
      "Compliance flags",
      "Rewrite suggestions",
    ],
    excluded: ["PDF reports", "Unlimited scans", "Priority support"],
    cta: "Start free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "£49",
    period: "per month — founder price",
    description: "For marketers and agencies running live funnels. Price rises to £79 after 50 members.",
    features: [
      "Unlimited scans",
      "Risk score",
      "Compliance flags",
      "Rewrite suggestions",
      "PDF reports",
      "Scan history",
      "Email support",
    ],
    excluded: [],
    cta: "Start Pro",
    href: "/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "£149",
    period: "per month",
    description: "For agencies managing multiple clients.",
    features: [
      "Everything in Pro",
      "Team seats",
      "API access",
      "Priority support",
      "Custom compliance rules",
      "Dedicated onboarding",
    ],
    excluded: [],
    cta: "Start Enterprise",
    href: "/signup?plan=enterprise",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Founder pricing banner */}
      <div className="bg-amber-400 py-3 text-center">
        <p className="text-sm font-bold text-amber-900">
          🚩 Founder Pricing — Pro locked at £49/month for the first 50 members only. Price rises to £79 after that.{" "}
          <span className="underline">42 founder spots remaining.</span>
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Start for free. Upgrade when you need unlimited scans and PDF reports.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700">
            ⚡ Founder pricing ends at 50 members — 42 spots left
          </div>
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
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-amber-900">
                  MOST POPULAR
                </div>
              )}

              <div>
                <h2
                  className={[
                    "text-xl font-bold",
                    plan.highlight ? "text-white" : "text-gray-900",
                  ].join(" ")}
                >
                  {plan.name}
                </h2>
                <p
                  className={[
                    "mt-1 text-sm",
                    plan.highlight ? "text-red-100" : "text-gray-500",
                  ].join(" ")}
                >
                  {plan.description}
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={[
                      "text-4xl font-extrabold",
                      plan.highlight ? "text-white" : "text-gray-900",
                    ].join(" ")}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={[
                      "text-sm",
                      plan.highlight ? "text-red-200" : "text-gray-400",
                    ].join(" ")}
                  >
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span
                      className={plan.highlight ? "text-red-200" : "text-green-500"}
                    >
                      ✓
                    </span>
                    <span
                      className={plan.highlight ? "text-red-50" : "text-gray-700"}
                    >
                      {f}
                    </span>
                  </li>
                ))}
                {plan.excluded.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-400 line-through"
                  >
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
          All plans include a 14-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
