import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const FEATURES = [
  {
    icon: "🚩",
    title: "Compliance Flag Detection",
    description:
      "Automatically surfaces income claims, health claims, fake urgency, and other FTC/GDPR red flags in your copy.",
  },
  {
    icon: "📄",
    title: "Claim vs. Contract Analysis",
    description:
      "Catches contradictions between what your funnel promises and what your Terms of Service actually delivers.",
  },
  {
    icon: "💡",
    title: "Instant Rewrite Suggestions",
    description:
      "Every flag comes with a concrete, compliant rewrite so your team can fix issues without a lawyer on speed dial.",
  },
  {
    icon: "📊",
    title: "Risk Score",
    description:
      "A 0–100 compliance score gives you a quick read on overall funnel risk before you spend on ads.",
  },
  {
    icon: "📥",
    title: "PDF Reports",
    description:
      "Download a branded PDF report to share with clients, legal, or your compliance team.",
  },
  {
    icon: "🕓",
    title: "Scan History",
    description:
      "All scans are saved so you can track compliance improvements across funnel versions.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We flagged a money-back guarantee in our VSL that contradicted our TOS, literally the day before launch. Red Flag AI Pro saved us a potential chargeback nightmare.",
    name: "Marcus T.",
    role: "Performance Marketer",
  },
  {
    quote:
      "I run compliance reviews for 12 clients. This cut my review time from 4 hours to 20 minutes per funnel.",
    name: "Priya N.",
    role: "Marketing Compliance Consultant",
  },
  {
    quote:
      "The income claim detection caught language we had been using for years. The FTC has been cracking down and this gave us peace of mind.",
    name: "Jordan K.",
    role: "Course Creator",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 pb-20 pt-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-red-500 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-red-700 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-300">
            <span>⚑</span>
            <span>Compliance risk scanner for marketing funnels</span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Catch compliance risks
            <br />
            <span className="text-red-400">before they catch you.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Red Flag AI Pro scans your sales pages, emails, and funnels for FTC
            violations, income claims, fake urgency, and contradictions between
            your copy and your contracts — in seconds.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-xl bg-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-red-500 transition-colors"
            >
              Scan your funnel free →
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              See pricing
            </Link>
          </div>

          <p className="mt-4 text-sm font-medium text-gray-300">
            1 free scan · No credit card required
          </p>
        </div>
      </section>

      {/* Social proof strip */}
      <div className="border-b border-gray-100 bg-gray-50 py-4 text-center text-sm text-gray-500">
        Trusted by course creators, marketing agencies, and compliance consultants
      </div>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Everything you need to launch with confidence
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Paste your funnel",
                desc: "Copy-paste your sales page, VSL script, email sequence, or any marketing copy.",
              },
              {
                step: "02",
                title: "AI scans for risk",
                desc: "Our engine checks for 8 compliance risk categories and cross-references your claims against contract language.",
              },
              {
                step: "03",
                title: "Fix, download, launch",
                desc: "Review flagged items with suggested rewrites, download your PDF report, and publish with confidence.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white">
                  {s.step}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          What our users say
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm italic text-gray-700">"{t.quote}"</p>
              <div className="mt-4">
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-600 py-20 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to scan your first funnel?</h2>
        <p className="mt-3 text-red-100">
          Start for free — 1 scan, no credit card.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-xl bg-white px-10 py-3.5 text-base font-semibold text-red-600 shadow hover:bg-red-50 transition-colors"
        >
          Get started free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Red Flag AI Pro. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-6">
          <Link href="/pricing" className="hover:text-gray-600">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-gray-600">
            Log in
          </Link>
          <Link href="/signup" className="hover:text-gray-600">
            Sign up
          </Link>
        </div>
      </footer>
    </div>
  );
}
