import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const FEATURES = [
  {
    icon: "🚩",
    title: "Know Your Risk Before You Spend On Ads",
    description:
      "Stop paying to amplify illegal copy. Red Flag AI Pro surfaces income claims, health claims, fake urgency, and FTC red flags before your campaign goes live.",
  },
  {
    icon: "📄",
    title: "Catch Contract Contradictions",
    description:
      "Spots the gap between what your funnel promises and what your Terms of Service actually delivers — before a customer screenshots it and charges back.",
  },
  {
    icon: "💡",
    title: "Compliant Rewrites Included",
    description:
      "Every flag comes with a concrete, compliant rewrite ready to use. No lawyer, no guesswork, no waiting.",
  },
  {
    icon: "📊",
    title: "0–100 Risk Score",
    description:
      "One number that tells you exactly how safe your funnel is to launch. Green means go. Red means fix first.",
  },
  {
    icon: "📥",
    title: "Branded PDF Reports",
    description:
      "Download a professional compliance report to share with clients, legal teams, or your ad agency in one click.",
  },
  {
    icon: "🕓",
    title: "Full Scan History",
    description:
      "Every scan is saved so you can track compliance improvements across every version of your funnel.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We caught a guarantee in our VSL that directly contradicted our refund policy. The day before launch. This tool saved us a chargeback nightmare.",
    name: "Marcus T.",
    role: "Performance Marketer",
  },
  {
    quote:
      "I review compliance for 12 clients. This went from 4 hours per funnel to 20 minutes. It's not optional for my workflow anymore.",
    name: "Priya N.",
    role: "Marketing Compliance Consultant",
  },
  {
    quote:
      "We had been using the same income claim language for 3 years. The FTC has been cracking down hard. Finding it when we did was a relief I cannot put a price on.",
    name: "Jordan K.",
    role: "Course Creator",
  },
];

const FAQS = [
  {
    q: "Is this just another AI gimmick?",
    a: "No. Red Flag AI Pro is trained specifically on FTC enforcement actions, GDPR guidelines, and real compliance cases — not generic marketing advice.",
  },
  {
    q: "What if my copy is already compliant?",
    a: "Then you get a green score and launch with total confidence. Either way you win.",
  },
  {
    q: "Do I need to know anything about compliance law?",
    a: "Zero. Every flag is explained in plain English with a suggested fix. No legal degree required.",
  },
  {
    q: "Why is there a free scan?",
    a: "Because once you see what it finds in your copy, you will never launch without it again.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 pb-24 pt-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-red-500 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-red-700 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-300">
            <span>⚑</span>
            <span>The world's only 5-jurisdiction funnel compliance scanner</span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            The FTC Has Fined Online Marketers
            <br />
            <span className="text-red-400">Over $50 Million.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xl font-semibold text-gray-200">
            Income claims. Fake urgency. Guarantee contradictions. Is your funnel next?
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Red Flag AI Pro scans your sales pages, emails, and funnels for illegal income claims,
            fake urgency, dark patterns, and contract contradictions — covering US, UK, EU, Australian,
            and Canadian marketing law. In 60 seconds flat.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-xl bg-red-600 px-10 py-4 text-base font-bold text-white shadow-lg hover:bg-red-500 transition-colors"
            >
              Scan your funnel free — takes 60 seconds →
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              See pricing
            </Link>
          </div>

          <p className="mt-5 text-sm font-medium text-gray-400">
            1 free scan · No credit card · Covers 🇺🇸 🇬🇧 🇪🇺 🇦🇺 🇨🇦 · Used by 500+ marketers, agencies, and course creators
          </p>
        </div>
      </section>

      {/* Pain section */}
      <section className="bg-gray-950 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Here&apos;s What&apos;s Sitting In Your Funnel Right Now
          </h2>
          <ul className="mt-8 space-y-4 text-left">
            {[
              "An income claim the FTC considers deceptive — even if you didn't mean it that way",
              "A money-back guarantee that directly contradicts your Terms of Service",
              "Fake urgency language that triggers platform bans and payment processor flags",
              "A health or results claim with zero legal backing",
              "One sentence that could cost you everything you have built",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-300">
                <span className="mt-0.5 text-red-500 text-lg">🚩</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg font-semibold text-red-400">
            You don&apos;t know it&apos;s there. That&apos;s the problem.
          </p>
          <p className="mt-2 text-gray-400">
            Most marketers who get hit by the FTC weren&apos;t trying to break the law. They just never checked.
          </p>
        </div>
      </section>

      {/* Value stack / Hormozi math */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-8 text-center">
            <h2 className="text-2xl font-extrabold text-gray-900">Let&apos;s Do The Maths.</h2>
            <div className="mt-6 space-y-3 text-gray-700 text-lg">
              <p>A compliance lawyer charges <strong>£400/hour.</strong></p>
              <p>A proper funnel audit takes <strong>4–6 hours.</strong></p>
              <p>That&apos;s <strong>£2,400 minimum.</strong></p>
            </div>
            <div className="mt-6 text-3xl font-extrabold text-red-600">
              Red Flag AI Pro does it in 60 seconds.
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">For free.</div>
            <p className="mt-4 text-gray-600">
              If it catches one thing that saves you from a single chargeback, refund dispute, or FTC complaint —
              it has paid for itself a thousand times over.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Three Steps. 60 Seconds. Total Clarity.
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Paste your funnel",
                desc: "Sales page, VSL script, email sequence, ad copy — anything. Just paste it in.",
              },
              {
                step: "02",
                title: "AI scans 8 risk categories",
                desc: "Income claims, fake urgency, health claims, guarantee contradictions, and more — all checked in seconds.",
              },
              {
                step: "03",
                title: "Fix, download, launch",
                desc: "Every flag comes with a compliant rewrite. Download your PDF report. Launch with confidence.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white shadow-lg">
                  {s.step}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Everything You Need to Launch Without Fear
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            What Marketers Are Saying
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 text-2xl text-red-500">★★★★★</div>
                <p className="text-sm italic text-gray-700">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Still On The Fence?
        </h2>
        <div className="mt-10 space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-gray-900">&ldquo;{faq.q}&rdquo;</h3>
              <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-950 py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Stop Guessing.
            <br />
            <span className="text-red-400">Start Knowing.</span>
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Scan your funnel free right now — before your ads go live, before your launch,
            before the FTC does it for you.
          </p>
          <Link
            href="/signup"
            className="mt-10 inline-block rounded-xl bg-red-600 px-12 py-4 text-lg font-bold text-white shadow-lg hover:bg-red-500 transition-colors"
          >
            Scan my funnel free →
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            1 free scan · No credit card · No risk
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950 py-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Red Flag AI Pro. All rights reserved.</p>
        <p className="mt-1 text-xs text-gray-600">FTC · CMA · ASA · ICO · ACCC · CASL · GDPR · UCPD compliance scanner for marketing funnels, sales pages, and email sequences. Covering US, UK, EU, Australian, and Canadian marketing law.</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="/pricing" className="hover:text-gray-300 transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-gray-300 transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="hover:text-gray-300 transition-colors">
            Sign up
          </Link>
        </div>
      </footer>
    </div>
  );
}
