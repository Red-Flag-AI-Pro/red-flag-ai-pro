import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { RiskCalculator } from "@/components/marketing/RiskCalculator";
import { DemoScanner } from "@/components/marketing/DemoScanner";

export const metadata: Metadata = {
  title: "Red Flag AI Pro — Spot Illegal Ads. Scan Your Copy. Free in 60 Seconds.",
  description:
    "Buyers: paste any ad and find out in 60 seconds if it is breaking the law. Sellers: scan your copy for FTC, GDPR, ASA, ACCC and CASL violations and get a plain English fix. Free. No account needed. The world's only 5-jurisdiction compliance scanner protecting both sides.",
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
    "The world's only compliance scanner that protects buyers and sellers across 5 countries. 21 risk categories including EU AI Act Article 50, FTC AI Guidelines and GDPR Article 22. Scan marketing copy for violations in 60 seconds.",
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
      price: "29",
      priceCurrency: "GBP",
      description: "20 scans per month, 16 risk categories, PDF reports, scan history",
    },
    {
      "@type": "Offer",
      name: "Growth Plan",
      price: "199",
      priceCurrency: "GBP",
      description: "Unlimited scans, URL scanning, VSL script scanning, site audit, client workspaces",
    },
    {
      "@type": "Offer",
      name: "Sentinel Plan",
      price: "999",
      priceCurrency: "GBP",
      description: "All 21 categories, YouTube VSL scanning, audio transcription, team seats, white-label PDF reports, URL monitoring",
    },
  ],
};

const FEATURES = [
  {
    icon: "📊",
    title: "0–100 Compliance Score",
    description:
      "One number tells you exactly how safe your copy is to publish — or buy from. Green means go. Red means stop. Every flag explained in plain English with a suggested fix.",
  },
  {
    icon: "🌐",
    title: "Scan Any Live URL",
    description:
      "Paste a URL and we fetch the live page, strip navigation and boilerplate, and scan what is actually published — not what you think is there.",
  },
  {
    icon: "🎬",
    title: "YouTube VSL and Audio Scanning",
    description:
      "Paste a YouTube URL and we fetch the transcript automatically. Or drop in an audio file and Whisper transcribes it first. Every word scanned against all 21 categories.",
  },
  {
    icon: "🔍",
    title: "Full Site Audit",
    description:
      "Enter a domain and we find the sitemap, scan every page, and rank them by risk. Audit a new client's entire website in under two minutes.",
  },
  {
    icon: "📡",
    title: "Weekly Auto-Monitoring",
    description:
      "Add pages to monitoring. We rescan them every Monday and email you if anything changes. Know about new compliance issues before your client does.",
  },
  {
    icon: "🏢",
    title: "Client Workspaces",
    description:
      "Organise scans by client. Each client has their own workspace showing all scans, score trends over time and compliance history. Auto-reports sent to client contacts.",
  },
  {
    icon: "📥",
    title: "White-Label PDF Reports",
    description:
      "Download compliance reports under your agency name. Set it in Settings once — every report shows your branding. Clients never know the tool behind it.",
  },
  {
    icon: "🔗",
    title: "Embeddable Compliance Badge",
    description:
      "A live SVG badge showing the compliance score. Agencies embed it on client sites or include it in deliverables as verifiable proof of review.",
  },
  {
    icon: "⚡",
    title: "Zapier and Webhook Integration",
    description:
      "Every scan fires a webhook to any URL. Connect to Zapier, Make, Slack or your own system. Compliance results flow into your existing workflow automatically.",
  },
  {
    icon: "🧩",
    title: "Chrome Extension",
    description:
      "Scan any page without leaving your browser. Click the extension icon, see the compliance score and top flags in seconds. Available to Sentinel users.",
  },
  {
    icon: "🔑",
    title: "Public REST API",
    description:
      "Integrate compliance scanning into your own tools, CMS or client portal. API keys, full documentation at /docs, JSON responses with scores and flags.",
  },
  {
    icon: "🕓",
    title: "Compliance Changelog",
    description:
      "Compare any two scans side by side. See exactly what improved, what got worse, and what new flags appeared — with the fix for each one.",
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
  { icon: "📋", label: "Contract Contradictions" },
  { icon: "🛡️", label: "Missing Disclaimers" },
  { icon: "🤝", label: "Unverified Testimonials" },
  { icon: "🤖", label: "AI Content Disclosure" },
  { icon: "📢", label: "AI Endorsement Violations" },
  { icon: "⚙️", label: "Automated Decisions" },
  { icon: "🏦", label: "FCA Financial Promotions" },
  { icon: "🌿", label: "Greenwashing" },
  { icon: "🔄", label: "Subscription Traps" },
  { icon: "📣", label: "Influencer Disclosure" },
  { icon: "💳", label: "Misleading Guarantees" },
  { icon: "🌍", label: "GDPR & Data Law" },
];

const AI_CATEGORIES = [
  { icon: "🤖", label: "AI Content Disclosure", tag: "EU AI Act Art. 50" },
  { icon: "📢", label: "AI Endorsement Violations", tag: "FTC AI Guidelines" },
  { icon: "⚙️", label: "Automated Decision Making", tag: "GDPR Article 22" },
];

const PERSONAS = [
  { icon: "🏢", label: "Marketing Agencies", desc: "Scan client copy before it publishes. White-label reports. Team seats. Auto-monitoring." },
  { icon: "🏦", label: "FCA-Regulated Businesses", desc: "Financial promotions checked before publication. Signed certificates as audit evidence." },
  { icon: "🎓", label: "Course Creators", desc: "Selling internationally. Income claims, guarantees and testimonials checked across all 5 jurisdictions." },
  { icon: "🎯", label: "Coaches and Consultants", desc: "High-ticket VSLs and sales pages scanned before traffic. YouTube transcript fetching included." },
  { icon: "💻", label: "SaaS Founders", desc: "Free trial terms, subscription language, data collection claims — all checked before ads run." },
  { icon: "🛒", label: "Ecommerce Brands", desc: "Product claims, sustainability assertions and pricing language across UK, EU, US, AUS and Canada." },
  { icon: "📊", label: "Compliance Teams", desc: "API access, webhooks and bulk scanning. Integrate compliance into your existing review workflow." },
  { icon: "🛡️", label: "Buyers and Consumers", desc: "Paste any sales page before you buy. Know if the claims are legal. Free — no signup needed." },
  { icon: "🌿", label: "Sustainable Brands", desc: "Greenwashing scanner checks every environmental claim against the EU Green Claims Directive and CMA Code." },
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

const FAQS = [
  {
    q: "Can I use this to check something before I buy it?",
    a: "Yes. Paste any sales page, ad or VSL you are considering. If it flags illegal claims, walk away. If it comes back clean, buy with confidence.",
  },
  {
    q: "I have been ripped off by misleading marketing before. Would this have caught it?",
    a: "In most cases yes. Fake scarcity, guaranteed results, income claims without proof — these are exactly what we scan for.",
  },
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
    a: "Because once you see what it finds — whether in your own copy or in an ad you were about to buy from — you will never skip it again.",
  },
];

const TICKER_ITEMS = [
  "FTC", "GDPR", "ASA", "CMA", "ACCC", "CASL", "ICO", "UCPD", "DSA", "PIPEDA", "ACL", "FDA", "CAN-SPAM",
  "EU AI Act", "FCA", "FSMA 2000", "EU Green Claims", "PECR", "MHRA", "TGA", "ESMA", "ASIC",
  "FTC Negative Option Rule", "CMA Green Claims Code", "FTC Green Guides", "BCAP Code", "OSC",
  "FTC", "GDPR", "ASA", "CMA", "ACCC", "CASL", "ICO", "UCPD", "DSA", "PIPEDA", "ACL", "FDA", "CAN-SPAM",
  "EU AI Act", "FCA", "FSMA 2000", "EU Green Claims", "PECR", "MHRA", "TGA", "ESMA", "ASIC",
  "FTC Negative Option Rule", "CMA Green Claims Code", "FTC Green Guides", "BCAP Code", "OSC",
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 pb-12 pt-8 sm:pb-24 sm:pt-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-red-500 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-red-700 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">

          {/* Product Hunt Badge */}
          <div className="mb-6 flex justify-center">
            <a href="https://www.producthunt.com/posts/red-flag-ai-pro" target="_blank" rel="noopener noreferrer">
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=red-flag-ai-pro&theme=dark"
                alt="Red Flag AI Pro - on Product Hunt"
                width="220"
                height="48"
              />
            </a>
          </div>

          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-300">
            <span>⚑</span>
            <span>The world&apos;s only 5-country marketing compliance scanner</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Your Copy Is Either
            <br />
            Legal or It Isn&apos;t.
            <br />
            <span className="text-red-400">Find Out in 60 Seconds.</span>
          </h1>

          {/* One line solve */}
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
            Compliance scanner for agencies, funnel builders and anyone who writes marketing copy. Paste text, scan a URL, audit a whole site. Plain English results. No lawyer needed.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#demo"
              className="rounded-xl bg-red-600 px-10 py-4 text-base font-bold text-white shadow-lg hover:bg-red-500 transition-colors"
            >
              Try Free — No Signup Needed ↓
            </a>
            <Link
              href="/signup"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Create Free Account →
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            ✅ Free scan — no signup · Pro from £29/mo · Agencies from £999/mo · Cancel anytime
          </p>

          <div className="mt-6 flex justify-center">
            <a href="https://www.producthunt.com/products/red-flag-ai-pro?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-red-flag-ai-pro" target="_blank" rel="noopener noreferrer">
              <img alt="Red Flag AI Pro - Spot illegal ads before buying. Scan copy before you publish | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1151061&theme=dark&t=1779869402522" />
            </a>
          </div>

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

          {/* Mobile flag row - compact */}
          <div className="mt-8 lg:hidden">
            <div className="flex justify-center gap-4">
              {[
                { code: "us", country: "USA" },
                { code: "gb", country: "UK" },
                { code: "eu", country: "EU" },
                { code: "au", country: "AUS" },
                { code: "ca", country: "CAN" },
              ].map((j) => (
                <div key={j.country} className="flex flex-col items-center gap-1">
                  <div className="h-6 w-9 overflow-hidden rounded-sm shadow-md">
                    <img src={`https://flagcdn.com/w160/${j.code}.png`} alt={j.country} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-gray-400">{j.country}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats pill */}
          <div className="mt-6 flex justify-center">
            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 rounded-full border border-white/10 bg-white/5 px-5 py-2">
              <span className="text-red-400 font-bold text-sm">21 risk categories</span>
              <span className="text-gray-600">·</span>
              <span className="text-red-400 font-bold text-sm">5 countries</span>
              <span className="text-gray-600">·</span>
              <span className="text-red-400 font-bold text-sm">URL + VSL + site audit</span>
              <span className="text-gray-600">·</span>
              <span className="text-red-400 font-bold text-sm">60 seconds</span>
            </div>
          </div>

          <div className="mt-6 mx-auto max-w-2xl">
            <p className="text-2xl font-extrabold text-white leading-snug">
              The <span className="text-red-400">only</span> compliance scanner
              in the world that protects both sides across all five jurisdictions.
            </p>
            <p className="mt-2 text-lg font-bold text-red-400">
              No other tool on the market comes close.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Scanner */}
      <DemoScanner />

      {/* Feedback CTA */}
      <div className="bg-gray-950 pb-10 text-center">
        <p className="text-gray-500 text-sm mb-3">Tried the scanner? Let us know what you found.</p>
        <a
          href="mailto:support@redflagaipro.com?subject=Red Flag AI Pro Feedback&body=Hi James, I just tried the scanner and wanted to share my thoughts..."
          className="inline-block rounded-lg border border-gray-700 bg-gray-800 px-6 py-2.5 text-sm font-semibold text-gray-300 hover:border-red-500 hover:text-white transition-colors"
        >
          Leave Feedback →
        </a>
      </div>

      {/* Pain section */}
      <section className="bg-gray-950 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            The Ad That Just Convinced You To Buy Could Be Breaking The Law.
            <br />
            <span className="text-red-400">So Could The One You Just Wrote.</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Most people who get ripped off online are not stupid. They are trusting people responding to convincing ads that are illegal.
            And most sellers doing it are not scammers. They are regular marketers, course creators and small business owners using the same copy everyone else uses — without knowing it crosses the line.
          </p>
          <p className="mt-2 text-gray-400 font-semibold">Red Flag AI Pro protects both sides.</p>
          <ul className="mt-8 space-y-4 text-left">
            {[
              "That limited time offer you almost bought — countdown timers that reset are now specifically illegal in the UK and EU",
              "That six figure income claim you wrote — it can trigger a government fine even if it is true",
              "That money back guarantee you trusted — if it contradicts the terms and conditions it is a contract violation",
              "That email list you signed up to — collecting emails without the right consent wording breaks Canadian and EU law",
              "That number one claim that convinced you — without proof it breaks advertising rules in every country we cover",
              "Nobody needs intent. Buyers still lose money. Sellers still get fined. Regulators do not care if you did not know.",
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

      {/* Before vs After — moved high for trust */}
      <section className="bg-gray-950 py-10 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-white">
            Before You Buy It. Before You Build It. See What We Find.
          </h2>
          <p className="mt-3 text-center text-gray-400">
            Real examples. Real flags. Both sides.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">

            {/* SELLER EXAMPLE */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400 uppercase tracking-widest">For Sellers</div>
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

            {/* BUYER EXAMPLE */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 uppercase tracking-widest">For Buyers</div>
              <div className="rounded-2xl border-2 border-gray-600/50 bg-gray-800/50 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-gray-400 text-xl">👀</span>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Looks Legitimate</span>
                </div>
                <p className="text-white text-lg italic leading-relaxed">
                  &ldquo;Over 2,400 students have completed this programme. Our top performers report life-changing results. Enrol today and get our 30-day satisfaction guarantee — we are so confident in our method that we offer a full refund if you do not see results within the first month.&rdquo;
                </p>
                <div className="mt-4 rounded-lg bg-gray-700/40 p-3">
                  <p className="text-xs text-gray-400 font-semibold">Passed your gut check. Failed ours.</p>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-red-500/50 bg-red-950/30 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-red-400 text-xl">🚩</span>
                  <span className="text-sm font-bold text-red-400 uppercase tracking-wider">What We Found</span>
                </div>
                <ul className="space-y-2">
                  <li className="text-xs text-red-200"><span className="font-semibold text-red-300">Unverified social proof</span> — 2,400 students with no independent verification · FTC violation</li>
                  <li className="text-xs text-red-200"><span className="font-semibold text-red-300">Vague results claim</span> — life-changing results with no data or disclaimer · ASA violation</li>
                  <li className="text-xs text-red-200"><span className="font-semibold text-red-300">Conditional guarantee</span> — refund tied to results, contradicts UK statutory consumer rights · CMA violation</li>
                  <li className="text-xs text-red-200"><span className="font-semibold text-red-300">Missing income disclaimer</span> — implied financial outcomes without mandatory disclosure · ACCC violation</li>
                </ul>
                <div className="mt-4 rounded-lg bg-red-900/40 p-3">
                  <p className="text-xs text-red-300 font-semibold">Scan before you buy. Free. 60 seconds.</p>
                </div>
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

      {/* Fines & Penalties */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            The Cost Of Getting It Wrong. For Everyone.
          </h2>
          <p className="mt-3 text-center text-gray-500">
            Real fines handed to sellers. Real money lost by buyers. All from the same illegal marketing copy.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm font-bold text-red-500 uppercase tracking-widest">What Buyers Lose</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6">
              <p className="text-lg font-bold text-gray-900">🛍️ Ecommerce</p>
              <p className="text-sm text-gray-500">Misleading product claims</p>
              <p className="mt-3 text-3xl font-extrabold text-purple-700">£200–£800</p>
              <p className="mt-1 text-sm text-gray-600">average loss per purchase</p>
            </div>
            <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6">
              <p className="text-lg font-bold text-gray-900">📚 Course Buyers</p>
              <p className="text-sm text-gray-500">Fake income claims and guarantees</p>
              <p className="mt-3 text-3xl font-extrabold text-purple-700">£500–£5k</p>
              <p className="mt-1 text-sm text-gray-600">average loss per course</p>
            </div>
            <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6">
              <p className="text-lg font-bold text-gray-900">💊 Health Products</p>
              <p className="text-sm text-gray-500">Unsubstantiated health claims</p>
              <p className="mt-3 text-3xl font-extrabold text-purple-700">£100–£2k</p>
              <p className="mt-1 text-sm text-gray-600">average loss per product</p>
            </div>
            <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6">
              <p className="text-lg font-bold text-gray-900">🔁 Subscriptions</p>
              <p className="text-sm text-gray-500">Hidden recurring charges</p>
              <p className="mt-3 text-3xl font-extrabold text-purple-700">£300–£1.2k</p>
              <p className="mt-1 text-sm text-gray-600">average annual loss</p>
            </div>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm font-bold text-red-500 uppercase tracking-widest">What Sellers Face</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* AI Liability Section */}
      <section className="relative overflow-hidden bg-gray-950 py-24">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[100px] rounded-full" />

        <div className="relative mx-auto max-w-5xl px-6">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold text-red-400 uppercase tracking-widest">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              New Threat — 2026
            </span>
          </div>

          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            AI Generated It. That Doesn&apos;t Make It Legal To Write.
            <span className="block text-red-500 mt-1">Or Safe To Buy.</span>
          </h2>
          <p className="mt-5 text-center text-gray-400 max-w-2xl mx-auto text-lg">
            From January 2026, major insurers began adding AI exclusions to Professional Indemnity policies. AI-generated copy that breaches advertising law is now an <span className="text-white font-semibold">uninsured liability</span> for the seller — and an invisible risk for the buyer.
          </p>

          {/* Three columns */}
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900/60 p-6 backdrop-blur">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="text-red-400 text-lg">⚠️</span>
              </div>
              <h3 className="text-white font-bold text-lg">Berkley Insurance</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">Introduced an <span className="text-red-400 font-semibold">absolute AI exclusion</span> on D&amp;O, E&amp;O and Fiduciary Liability policies — covering all AI use, not just generative.</p>
            </div>
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900/60 p-6 backdrop-blur">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="text-red-400 text-lg">🏛️</span>
              </div>
              <h3 className="text-white font-bold text-lg">EU AI Act — Aug 2026</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">Article 50(4) requires AI-assisted marketing content to carry <span className="text-red-400 font-semibold">disclosure or documented human review</span>. Non-compliance triggers regulatory action.</p>
            </div>
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900/60 p-6 backdrop-blur">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="text-red-400 text-lg">🔍</span>
              </div>
              <h3 className="text-white font-bold text-lg">RSA (UK)</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">RSA's UK Head of PI confirmed they are <span className="text-red-400 font-semibold">"assuming but not yet pricing"</span> AI exposures — meaning exclusions are coming at next renewal.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-white text-xl font-bold">Whether You&apos;re Selling It Or Buying It — Know The Truth First.</p>
            <p className="mt-2 text-gray-400"><span className="text-red-400 font-semibold">For sellers:</span> Red Flag AI Pro catches the compliance violations in your AI copy that could trigger an uninsured claim — before it goes live.</p>
            <p className="mt-2 text-gray-400"><span className="text-red-400 font-semibold">For buyers:</span> It spots the illegal claims in the ads targeting you — before you hand over your money.</p>
            <a
              href="/signup"
              className="mt-6 inline-block rounded-lg bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors"
            >
              Scan Your Copy Free →
            </a>
          </div>
        </div>
      </section>

      {/* Value stack */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-8 text-center">
            <h2 className="text-2xl font-extrabold text-gray-900">Let&apos;s Do The Maths. For Both Sides.</h2>
            <div className="mt-6 space-y-3 text-gray-700 text-lg">
              <p><span className="text-red-500 font-semibold">For sellers:</span> A compliance lawyer charges <strong>£400 per hour.</strong></p>
              <p><span className="text-red-500 font-semibold">For sellers:</span> A proper funnel audit takes <strong>4 to 6 hours.</strong> That is <strong>£2,400 minimum.</strong></p>
              <p><span className="text-red-500 font-semibold">For buyers:</span> The average person loses <strong>£500 to £2,000</strong> on a misleading course or offer before they realise something was wrong.</p>
              <p><span className="text-red-500 font-semibold">For buyers:</span> A solicitor to pursue a refund costs more than the money you lost.</p>
            </div>
            <div className="mt-6 text-3xl font-extrabold text-red-600">
              Red Flag AI Pro does it in 60 seconds.
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">For free.</div>
            <p className="mt-4 text-gray-600">
              Whether you are protecting your business or protecting your wallet — if it catches one thing, it has paid for itself a thousand times over.
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
                desc: "Sales page, VSL script, email sequence, ad copy — anything you are about to buy from or publish. Just paste it in.",
              },
              {
                step: "02",
                title: "AI scans 21 risk categories",
                desc: "Income claims, fake urgency, dark patterns, GDPR, hidden fees, and more — across all 5 jurisdictions simultaneously.",
              },
              {
                step: "03",
                title: "Buyers get the truth. Sellers get the fix.",
                desc: "Every flag comes with a plain English explanation and a compliant rewrite. Know before you spend. Launch with confidence.",
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
            If you sell anything online — or buy anything online — this is for you.
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
            21 risk categories. One Scan.
          </h2>
          <p className="mt-3 text-center text-gray-400">
            Every category checked against all 5 jurisdictions simultaneously. Protecting sellers from liability. Protecting buyers from being misled.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SCAN_CATEGORIES.map((c) => (
              <div key={c.label} className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 hover:border-red-500/50 transition-colors">
                <span className="text-xl">{c.icon}</span>
                <span className="text-sm font-medium text-gray-200">{c.label}</span>
              </div>
            ))}
          </div>

          {/* AI Law Categories */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-800" />
              <span className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                New — AI Law Compliance
              </span>
              <div className="h-px flex-1 bg-gray-800" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {AI_CATEGORIES.map((c) => (
                <div key={c.label} className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 hover:border-red-500/60 transition-colors">
                  <span className="text-xl">{c.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{c.label}</p>
                    <p className="text-xs text-red-400 mt-0.5">{c.tag}</p>
                  </div>
                </div>
              ))}
            </div>
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
          Everything You Need To Buy Or Launch Without Fear
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


      {/* Risk Calculator */}
      <section className="bg-gray-950 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white">What Is Your Compliance Risk Actually Worth?</h2>
            <p className="mt-3 text-gray-400">Move the slider to see your personal exposure based on your ad spend.</p>
          </div>
          <RiskCalculator />
        </div>
      </section>

      {/* Founder story teaser */}
      <section className="bg-gray-950 py-10">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-gray-400 text-sm">
            Built alone, from a laptop, after a life that gave every reason not to.
          </p>
          <Link
            href="/about"
            className="mt-3 inline-block text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            Read the story →
          </Link>
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
            <div className="mt-4 space-y-4 text-left">
              <p className="text-gray-300 leading-relaxed">
                <span className="text-red-400 font-semibold">Buyer:</span> If the scan comes back <strong className="text-white">clean</strong> — buy with total confidence knowing the ad is legitimate.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <span className="text-red-400 font-semibold">Seller:</span> If your scan finds <strong className="text-white">nothing</strong> — you launch with total confidence knowing your copy is clean.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <span className="text-red-400 font-semibold">Buyer:</span> If the scan <strong className="text-red-400">flags something</strong> — you just saved yourself from losing your money to an illegal ad.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <span className="text-red-400 font-semibold">Seller:</span> If your scan finds <strong className="text-red-400">something</strong> — it just saved you from a fine, a chargeback, or a takedown that could cost you thousands.
              </p>
            </div>
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
            Scan before you buy. Scan before you launch. Know the truth in 60 seconds — before it costs you.
          </p>
          <Link
            href="/signup"
            className="mt-10 inline-block rounded-xl bg-red-600 px-12 py-4 text-lg font-bold text-white shadow-lg hover:bg-red-500 transition-colors"
          >
            Scan free now →
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            1 free scan · No credit card · No risk
          </p>
        </div>
      </section>

      {/* Product Hunt Badge */}
      <div className="bg-gray-950 py-10 text-center">
        <p className="text-gray-400 text-sm mb-6">Free to start. Pro from £49/month. No credit card needed.</p>
        <a href="https://www.producthunt.com/products/red-flag-ai-pro" target="_blank" rel="noopener noreferrer">
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1151061&theme=dark&t=1779869402522"
            alt="Red Flag AI Pro - Spot illegal ads before buying. Scan copy before you publish | Product Hunt"
            width="250"
            height="54"
            className="mx-auto"
          />
        </a>
      </div>

      {/* Sentinel Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: "#07070f" }}>
        {/* Red glow top */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[800px] opacity-20"
            style={{ background: "radial-gradient(ellipse at center top, #dc2626 0%, transparent 65%)" }}
          />
        </div>
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 py-24">
          {/* Label */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-500 uppercase tracking-[0.18em]">
              Sentinel — enterprise compliance
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: copy */}
            <div>
              <h2
                className="text-5xl font-black tracking-tight leading-none"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #dc2626 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Sentinel
              </h2>
              <p className="mt-4 text-lg font-semibold text-gray-300 leading-snug">
                Compliance infrastructure for agencies, legal teams and regulated businesses.
              </p>
              <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                Red Flag AI Pro scans copy. Sentinel does everything beyond that — human review logs, legal timestamps, signed PDF certificates, FCA financial promotions, greenwashing checks and a full 3-year audit trail. Built for the teams where a compliance failure is a regulatory event, not just an embarrassment.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {["Human Review Log", "Legal Timestamps", "FCA Promotions", "Greenwashing Scanner", "Signed Certificates", "3-Year Retention", "API Access"].map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-gray-700/60 bg-gray-900/60 px-3 py-1 text-xs font-medium text-gray-400"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sentinel"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
                >
                  Learn about Sentinel →
                </Link>
                <a
                  href="mailto:support@redflagaipro.com?subject=Sentinel Enquiry"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-7 py-3.5 text-sm font-medium text-gray-400 hover:border-red-500/40 hover:text-white transition-all"
                >
                  Get in touch
                </a>
              </div>
            </div>

            {/* Right: feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "📋", title: "Human Review Log", desc: "Every review logged and timestamped" },
                { icon: "⏱️", title: "Legal Timestamps", desc: "Cryptographic proof of when you checked" },
                { icon: "📄", title: "Signed Certificates", desc: "PDF certificates for every campaign" },
                { icon: "🏦", title: "FCA Promotions", desc: "Financial promotions checked at source" },
                { icon: "🌿", title: "Greenwashing", desc: "EU Green Claims Directive compliance" },
                { icon: "🔌", title: "API Access", desc: "Plug into your existing workflow" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-gray-800/60 bg-gray-900/40 p-4 hover:border-red-500/20 transition-all"
                >
                  <div className="text-lg mb-2">{item.icon}</div>
                  <p className="text-xs font-bold text-white mb-1">{item.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
        <div className="mt-4 flex justify-center">
          <a href="https://www.producthunt.com/products/red-flag-ai-pro?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-red-flag-ai-pro" target="_blank" rel="noopener noreferrer">
            <img alt="Red Flag AI Pro - Spot illegal ads before buying. Scan copy before you publish | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1151061&theme=dark&t=1779869402522" />
          </a>
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
