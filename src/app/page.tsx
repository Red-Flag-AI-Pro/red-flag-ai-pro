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

          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-300">
            <span>⚑</span>
            <span>The world&apos;s only 5-country marketing compliance scanner</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Nobody Tells You When
            <br />
            Your Marketing Is Illegal.
            <br />
            <span className="text-red-400">Until It&apos;s Too Late.</span>
          </h1>

          {/* One line solve */}
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
            We do. In plain English. In 60 seconds. Free.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-xl bg-red-600 px-10 py-4 text-base font-bold text-white shadow-lg hover:bg-red-500 transition-colors"
            >
              Scan my copy free →
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              See pricing
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            1 free scan · No credit card required
          </p>

          {/* Flag cards */}
          <div className="mt-12 grid grid-cols-5 gap-3">
            {[
              { code: "us", country: "USA", acronyms: "FTC · FDA · CAN-SPAM" },
              { code: "gb", country: "UK", acronyms: "CMA · ASA · ICO" },
              { code: "eu", country: "EU", acronyms: "GDPR · UCPD · DSA" },
              { code: "au", country: "Australia", acronyms: "ACCC · ACL" },
              { code: "ca", country: "Canada", acronyms: "CASL · PIPEDA" },
            ].map((j) => (
              <div
                key={j.country}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-5 text-center backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="h-8 w-12 overflow-hidden rounded-sm shadow-md">
                  <img
                    src={`https://flagcdn.com/w160/${j.code}.png`}
                    alt={j.country}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mt-1 text-xs font-extrabold uppercase tracking-widest text-white">{j.country}</span>
                <span className="text-xs font-bold text-red-400 leading-relaxed">{j.acronyms}</span>
              </div>
            ))}
          </div>

          {/* 13 categories pill */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2">
              <span className="text-red-400 font-bold text-sm">13 risk categories</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-400 text-sm">5 countries</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-400 text-sm">60 seconds</span>
            </div>
          </div>

          {/* Bold uniqueness statement */}
          <div className="mt-6 mx-auto max-w-2xl">
            <p className="text-2xl font-extrabold text-white leading-snug">
              The <span className="text-red-400">only</span> compliance scanner
              in the world that covers all five.
            </p>
            <p className="mt-2 text-lg font-bold text-gray-300">
              No other tool on the market comes close.
            </p>
          </div>

        </div>
      </section>

      {/* Pain section */}
      <section className="bg-gray-950 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            You Don&apos;t Have To Be Doing Anything Wrong
            <br />
            <span className="text-red-400">To Get In Serious Trouble.</span>
          </h2>
          <p className="mt-4 text-gray-400">
            The businesses that get fined are not scammers. They are regular marketers,
            course creators, and small business owners using the same copy everyone else uses.
            That is exactly the problem.
          </p>
          <ul className="mt-8 space-y-4 text-left">
            {[
              "Saying you 'make six figures' in your sales page can be enough for a government fine — even if it's true",
              "A countdown timer that resets is now specifically illegal in the UK and EU",
              "A money-back guarantee that doesn't match your terms and conditions is a contract violation",
              "Collecting someone's email without the right consent wording breaks Canadian and EU law",
              "Claiming you're 'the best' or 'number one' without proof breaks advertising rules in every country we cover",
              "None of this requires intent — regulators don't care if you didn't know",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-300">
                <span className="mt-0.5 text-red-500 text-lg">🚩</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg font-semibold text-red-400">
            Red Flag AI Pro catches all of it before it costs you.
          </p>
          <p className="mt-2 text-gray-400">
            In plain English. With exactly what to fix. In 60 seconds.
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
