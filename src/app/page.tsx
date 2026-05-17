import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { RiskCalculator } from "@/components/marketing/RiskCalculator";

export const metadata: Metadata = {
  title: "Red Flag AI Pro — Marketing Compliance Scanner",
  description:
    "The world's only 5-country marketing compliance scanner. Scan your funnels, ads and copy for FTC, CMA, ASA, GDPR, ACCC and CASL violations in 60 seconds. Free to start.",
  alternates: { canonical: "https://www.redflagaipro.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Red Flag AI Pro",
  url: "https://www.redflagaipro.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "The world's only 5-country marketing compliance scanner covering US, UK, EU, Australia and Canada. Scan marketing copy for FTC, CMA, ASA, GDPR, ACCC and CASL violations in 60 seconds.",
  offers: [
    {
      "@type": "Offer",
      name: "Free Plan",
      price: "0",
      priceCurrency: "GBP",
      description: "1 free scan per month",
    },
    {
      "@type": "Offer",
      name: "Pro Plan",
      price: "49",
      priceCurrency: "GBP",
      description: "Unlimited scans, PDF reports, scan history",
    },
    {
      "@type": "Offer",
      name: "Enterprise Plan",
      price: "149",
      priceCurrency: "GBP",
      description: "Team seats, API access, priority support",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "12",
  },
};

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

const SCAN_CATEGORIES = [
  { icon: "💰", label: "Income Claims" },
  { icon: "❤️", label: "Health Claims" },
  { icon: "⏱️", label: "Fake Urgency" },
  { icon: "🎭", label: "Dark Patterns" },
  { icon: "🕵️", label: "Hidden Fees" },
  { icon: "⭐", label: "Fake Reviews" },
  { icon: "🔒", label: "Data Privacy" },
  { icon: "📧", label: "Email Compliance" },
  { icon: "⚖️", label: "Comparative Advertising" },
  { icon: "🛡️", label: "Consumer Protection" },
  { icon: "📢", label: "Advertising Standards" },
  { icon: "🌍", label: "GDPR & Data Law" },
  { icon: "📋", label: "Contract Contradictions" },
];

const PERSONAS = [
  { icon: "🎓", label: "Course Creators", desc: "Selling online courses internationally" },
  { icon: "🏢", label: "Marketing Agencies", desc: "Managing compliance for multiple clients" },
  { icon: "🎯", label: "Coaches", desc: "Running high-ticket offers and VSLs" },
  { icon: "💻", label: "SaaS Founders", desc: "Running paid ads across multiple markets" },
  { icon: "🛒", label: "Ecommerce Brands", desc: "Selling across borders with ad funnels" },
  { icon: "📊", label: "Compliance Consultants", desc: "Need faster, deeper audits for clients" },
];

const FINES = [
  {
    country: "🇺🇸 USA",
    body: "FTC",
    fine: "Up to $50,000",
    detail: "per violation — per day",
    colour: "border-blue-200 bg-blue-50",
    textColour: "text-blue-700",
  },
  {
    country: "🇬🇧 UK",
    body: "CMA / ASA",
    fine: "Up to £300,000",
    detail: "plus full campaign takedown",
    colour: "border-red-200 bg-red-50",
    textColour: "text-red-700",
  },
  {
    country: "🇪🇺 EU",
    body: "GDPR",
    fine: "Up to €20 million",
    detail: "or 4% of global turnover",
    colour: "border-yellow-200 bg-yellow-50",
    textColour: "text-yellow-700",
  },
  {
    country: "🇦🇺 Australia",
    body: "ACCC",
    fine: "Up to $50M AUD",
    detail: "per breach under ACL",
    colour: "border-green-200 bg-green-50",
    textColour: "text-green-700",
  },
  {
    country: "🇨🇦 Canada",
    body: "CASL",
    fine: "Up to $10M CAD",
    detail: "per violation for businesses",
    colour: "border-orange-200 bg-orange-50",
    textColour: "text-orange-700",
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
    a: "Red Flag AI Pro is trained specifically on FTC enforcement actions, GDPR guidelines, and real compliance cases. Not generic marketing advice.",
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

const TICKER_ITEMS = [
  "FTC", "GDPR", "ASA", "CMA", "ACCC", "CASL", "ICO", "UCPD", "DSA", "PIPEDA", "ACL", "FDA", "CAN-SPAM",
  "FTC", "GDPR", "ASA", "CMA", "ACCC", "CASL", "ICO", "UCPD", "DSA", "PIPEDA", "ACL", "FDA", "CAN-SPAM",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExitIntent />
      <Navbar />

      {/* Scrolling compliance ticker */}
      <div className="overflow-hidden bg-gray-950 border-b border-gray-800 py-2">
        <style>{`
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-track {
            display: flex;
            width: max-content;
            animation: ticker 30s linear infinite;
          }
        `}</style>
        <div className="ticker-track">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="mx-4 text-xs font-bold text-red-500 tracking-widest uppercase">
              {item} <span className="text-gray-700 mx-2">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Founder pricing banner */}
      <div className="bg-amber-400 py-2.5 text-center">
        <p className="text-sm font-bold text-amber-900">
          ⚡ Founder Pricing — Only <span className="underline">42 spots</span> left at £49/month. Price rises to £79 after 50 members.{" "}
          <Link href="/pricing" className="underline hover:no-underline">Grab your spot →</Link>
        </p>
      </div>

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

          {/* Flag cards — 5 across on desktop */}
          <div className="mt-12 hidden lg:grid lg:grid-cols-5 gap-3">
            {[
              { code: "us", country: "USA", acronyms: "FTC · FDA · CAN-SPAM" },
              { code: "gb", country: "UK", acronyms: "CMA · ASA · ICO" },
              { code: "eu", country: "EU", acronyms: "GDPR · UCPD · DSA" },
              { code: "au", country: "Australia", acronyms: "ACCC · ACL" },
              { code: "ca", country: "Canada", acronyms: "CASL · PIPEDA" },
            ].map((j) => (
              <div
                key={j.country}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-5 text-center backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="h-8 w-12 overflow-hidden rounded-sm shadow-md">
                  <img src={`https://flagcdn.com/w160/${j.code}.png`} alt={j.country} className="h-full w-full object-cover" />
                </div>
                <span className="mt-1 text-xs font-extrabold uppercase tracking-widest text-white">{j.country}</span>
                <span className="text-xs font-bold text-white leading-relaxed">{j.acronyms}</span>
              </div>
            ))}
          </div>

          {/* Mobile flag cards */}
          <div className="mt-12 lg:hidden">
            <div className="grid grid-cols-2 gap-3">
              {[
                { code: "us", country: "USA", acronyms: "FTC · FDA · CAN-SPAM" },
                { code: "gb", country: "UK", acronyms: "CMA · ASA · ICO" },
                { code: "eu", country: "EU", acronyms: "GDPR · UCPD · DSA" },
                { code: "au", country: "Australia", acronyms: "ACCC · ACL" },
              ].map((j) => (
                <div
                  key={j.country}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-5 text-center backdrop-blur-sm"
                >
                  <div className="h-8 w-12 overflow-hidden rounded-sm shadow-md">
                    <img src={`https://flagcdn.com/w160/${j.code}.png`} alt={j.country} className="h-full w-full object-cover" />
                  </div>
                  <span className="mt-1 text-xs font-extrabold uppercase tracking-widest text-white">{j.country}</span>
                  <span className="text-xs font-bold text-white leading-relaxed">{j.acronyms}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-center">
              <div className="flex w-1/2 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-5 text-center backdrop-blur-sm">
                <div className="h-8 w-12 overflow-hidden rounded-sm shadow-md">
                  <img src="https://flagcdn.com/w160/ca.png" alt="Canada" className="h-full w-full object-cover" />
                </div>
                <span className="mt-1 text-xs font-extrabold uppercase tracking-widest text-white">Canada</span>
                <span className="text-xs font-bold text-white leading-relaxed">CASL · PIPEDA</span>
              </div>
            </div>
          </div>

          {/* Stats pill */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2">
              <span className="text-red-400 font-bold text-sm">13 risk categories</span>
              <span className="text-gray-600">·</span>
              <span className="text-red-400 font-bold text-sm">5 countries</span>
              <span className="text-gray-600">·</span>
              <span className="text-red-400 font-bold text-sm">60 seconds</span>
            </div>
          </div>

          <div className="mt-6 mx-auto max-w-2xl">
            <p className="text-2xl font-extrabold text-white leading-snug">
              The <span className="text-red-400">only</span> compliance scanner
              in the world that covers all five.
            </p>
            <p className="mt-2 text-lg font-bold text-red-400">
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

      {/* Fines & Penalties */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            What Ignoring Compliance Actually Costs
          </h2>
          <p className="mt-3 text-center text-gray-500">
            These are real fines, from real regulators, handed to real businesses just like yours.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FINES.map((f) => (
              <div key={f.country} className={`rounded-2xl border-2 p-6 ${f.colour}`}>
                <p className="text-lg font-bold text-gray-900">{f.country}</p>
                <p className="text-sm text-gray-500">{f.body}</p>
                <p className={`mt-3 text-3xl font-extrabold ${f.textColour}`}>{f.fine}</p>
                <p className="mt-1 text-sm text-gray-600">{f.detail}</p>
              </div>
            ))}
            <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-6 flex flex-col justify-center">
              <p className="text-2xl font-extrabold text-gray-900">$6 Billion+</p>
              <p className="mt-1 text-sm text-gray-600">paid in marketing compliance fines globally in the last 3 years alone</p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-400">
            Red Flag AI Pro scans against all of the above — simultaneously — in 60 seconds.
          </p>
        </div>
      </section>

      {/* Before vs After */}
      <section className="bg-gray-950 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-white">
            See It In Action
          </h2>
          <p className="mt-3 text-center text-gray-400">
            Real example. Real flag. Real fix.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Before */}
            <div className="rounded-2xl border-2 border-red-500/50 bg-red-950/30 p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-red-400 text-xl">🚩</span>
                <span className="text-sm font-bold text-red-400 uppercase tracking-wider">Flagged Copy</span>
              </div>
              <p className="text-white text-lg italic leading-relaxed">
                &ldquo;Join thousands of members who are making £5,000–£10,000 per month using our proven system. Results guaranteed or your money back — no questions asked.&rdquo;
              </p>
              <div className="mt-4 rounded-lg bg-red-900/40 p-3">
                <p className="text-xs text-red-300 font-semibold">⚠️ Flags triggered:</p>
                <p className="text-xs text-red-200 mt-1">Income claim without disclaimer · Unsubstantiated earnings · Guarantee contradiction · FTC · ASA · ACCC</p>
              </div>
            </div>
            {/* After */}
            <div className="rounded-2xl border-2 border-green-500/50 bg-green-950/30 p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <span className="text-sm font-bold text-green-400 uppercase tracking-wider">Compliant Rewrite</span>
              </div>
              <p className="text-white text-lg italic leading-relaxed">
                &ldquo;Our members report a wide range of results. Some earn £5,000+ per month — individual results vary based on effort, experience, and market conditions. See our income disclaimer for full details.&rdquo;
              </p>
              <div className="mt-4 rounded-lg bg-green-900/40 p-3">
                <p className="text-xs text-green-300 font-semibold">✅ Now compliant with:</p>
                <p className="text-xs text-green-200 mt-1">FTC · CMA · ASA · ACCC · CASL guidelines on earnings claims and guarantees</p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/signup"
              className="inline-block rounded-xl bg-red-600 px-8 py-3.5 text-base font-bold text-white hover:bg-red-500 transition-colors"
            >
              Scan your copy free →
            </Link>
          </div>
        </div>
      </section>

      {/* Value stack */}
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
                title: "Paste your copy",
                desc: "Sales page, VSL script, email sequence, ad copy — anything. Just paste it in.",
              },
              {
                step: "02",
                title: "AI scans 13 risk categories",
                desc: "Income claims, fake urgency, dark patterns, GDPR, hidden fees, and more — across all 5 jurisdictions simultaneously.",
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

      {/* Who is this for */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Who Uses Red Flag AI Pro?
          </h2>
          <p className="mt-3 text-center text-gray-500">
            If you sell anything online — this is for you.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PERSONAS.map((p) => (
              <div key={p.label} className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:shadow-md transition-shadow">
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <p className="font-bold text-gray-900">{p.label}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we scan for */}
      <section className="bg-gray-950 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-white">
            13 Risk Categories. One Scan.
          </h2>
          <p className="mt-3 text-center text-gray-400">
            Every category checked against all 5 jurisdictions simultaneously.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SCAN_CATEGORIES.map((c) => (
              <div key={c.label} className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 hover:border-red-500/50 transition-colors">
                <span className="text-xl">{c.icon}</span>
                <span className="text-sm font-medium text-gray-200">{c.label}</span>
              </div>
            ))}
          </div>

          {/* Credibility block */}
          <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-900 p-8">
            <h3 className="text-center text-lg font-bold text-white mb-6">Trained On Real Compliance Sources</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "FTC Enforcement Actions", icon: "📋" },
                { label: "GDPR Guidelines & Rulings", icon: "🇪🇺" },
                { label: "ASA & CMA Case Library", icon: "🇬🇧" },
                { label: "ACCC & CASL Decisions", icon: "⚖️" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-gray-300">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
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

      {/* Risk Calculator */}
      <section className="bg-gray-950 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <RiskCalculator />
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

      {/* Guarantee CTA block */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border-2 border-gray-900 bg-gray-950 p-10 text-center">
            <p className="text-4xl">🛡️</p>
            <h2 className="mt-4 text-2xl font-extrabold text-white">Either Way, You Win.</h2>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              If your scan finds <strong className="text-white">nothing</strong> — you launch with total confidence knowing your copy is clean.
              <br /><br />
              If your scan finds <strong className="text-red-400">something</strong> — it just saved you from a fine, a chargeback, or a takedown that could cost you thousands.
            </p>
            <p className="mt-6 text-xl font-bold text-red-400">
              There is no losing scenario.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-xl bg-red-600 px-10 py-4 text-base font-bold text-white hover:bg-red-500 transition-colors"
            >
              Scan my copy free →
            </Link>
            <p className="mt-3 text-sm text-gray-500">1 free scan · No credit card · No risk</p>
          </div>
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
      <footer className="border-t border-gray-800 bg-gray-950 py-10 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Red Flag AI Pro. All rights reserved.</p>
        <p className="mt-1 text-xs text-gray-600">FTC · CMA · ASA · ICO · ACCC · CASL · GDPR · UCPD compliance scanner for marketing funnels, sales pages, and email sequences. Covering US, UK, EU, Australian, and Canadian marketing law.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-6">
          <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-gray-300 transition-colors">Log in</Link>
          <Link href="/signup" className="hover:text-gray-300 transition-colors">Sign up</Link>
          <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
        </div>
        <div className="mt-4 border-t border-gray-800 pt-4">
          <p className="text-xs text-gray-600">
            Questions? Email us at{" "}
            <a href="mailto:support@redflagaipro.com" className="font-semibold text-red-400 hover:text-red-300 transition-colors">
              support@redflagaipro.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
