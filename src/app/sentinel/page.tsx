import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { WaitlistForm } from "@/components/sentinel/WaitlistForm";

export const metadata: Metadata = {
  title: "Sentinel — Compliance Infrastructure for Agencies and Legal Teams",
  description:
    "Human review logs with legal timestamps. Signed compliance certificates. FCA financial promotions. Greenwashing scanner. The audit trail your PI insurer needs. Coming Q3 2026.",
  alternates: { canonical: "https://www.redflagaipro.com/sentinel" },
};

const STEPS = [
  {
    number: "01",
    title: "Copy enters your workflow",
    description: "AI-assisted or human-written. Paste it directly or connect via API. Sentinel accepts copy from any source.",
  },
  {
    number: "02",
    title: "Checked against every applicable rule",
    description: "FTC, GDPR, ASA, ACCC, CASL, EU AI Act, FCA financial promotions, EU Green Claims Directive. Simultaneously, in under 60 seconds.",
  },
  {
    number: "03",
    title: "Signed certificate issued",
    description: "A cryptographically timestamped compliance certificate is generated and stored. Admissible evidence. 3-year retention. Instantly retrievable.",
  },
];

const FEATURES = [
  {
    icon: "📋",
    title: "Human Review Log",
    description: "Every piece of copy reviewed and logged with a timestamped record admissible if a complaint lands.",
  },
  {
    icon: "⏱️",
    title: "Legal Timestamps",
    description: "Cryptographically signed timestamps on every review. Prove what you checked and when.",
  },
  {
    icon: "📄",
    title: "Signed PDF Certificates",
    description: "Compliance certificates for each campaign. The documentation your PI insurer expects.",
  },
  {
    icon: "🏦",
    title: "FCA Financial Promotions",
    description: "FCA-regulated businesses checked at source, before publication. Not after the fine.",
  },
  {
    icon: "🌿",
    title: "Greenwashing Scanner",
    description: "EU Green Claims Directive compliance. Check environmental claims before the regulator does.",
  },
  {
    icon: "🗂️",
    title: "3-Year Retention",
    description: "Full audit trail retained for 3 years. Meet record-keeping obligations automatically.",
  },
  {
    icon: "🔌",
    title: "API Access",
    description: "Integrate compliance checking directly into your CMS, approval pipeline or content workflow.",
  },
  {
    icon: "⚙️",
    title: "Custom Rules",
    description: "Rules specific to your sector, client base or internal policy. Compliance built around your business.",
  },
];

const WHO_ITS_FOR = [
  {
    label: "Digital agencies",
    title: "You write AI copy for clients. From August 2026, that's a regulated activity.",
    description: "The EU AI Act requires disclosure on AI-assisted content. One complaint triggers your agency AND your client simultaneously. Sentinel is the audit trail that proves you checked it before it published.",
  },
  {
    label: "Legal and compliance teams",
    title: "Your review process lives in email threads and spreadsheets. That's not a system.",
    description: "Sentinel replaces informal compliance review with a proper logged, timestamped, signed process. Every review on record. Every certificate retrievable in seconds.",
  },
  {
    label: "FCA-regulated businesses",
    title: "Financial promotions carry the heaviest penalties in UK advertising law.",
    description: "Sentinel checks copy against FCA rules before it goes out - and issues a signed certificate that it was checked. The protection your compliance officer has been asking for.",
  },
  {
    label: "Enterprise marketing",
    title: "Multi-jurisdiction campaigns. One compliance failure can shut a campaign across 5 countries.",
    description: "GDPR, FTC, ASA, EU AI Act, ACCC and CASL checked simultaneously. One certificate covers all jurisdictions. One source of truth for your compliance record.",
  },
];

export default function SentinelPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080810" }}>
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse at center, #dc2626 0%, transparent 70%)" }} />
        </div>
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative mx-auto max-w-5xl px-6 pt-28 pb-24 text-center">

          <div className="inline-flex items-center gap-2.5 rounded-full border border-red-500/25 bg-red-500/8 px-5 py-2 mb-10">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-[0.15em]">Coming Q3 2026 — Join the waitlist</span>
          </div>

          <h1 className="text-7xl font-black tracking-tight"
            style={{ background: "linear-gradient(135deg, #ffffff 0%, #ffffff 40%, #dc2626 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Sentinel
          </h1>

          <p className="mt-5 text-xl font-semibold text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Compliance infrastructure for agencies, legal teams and regulated businesses.
          </p>

          <p className="mt-4 text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Human review logs. Legal timestamps. Signed certificates. The audit trail your PI insurer needs and your regulator expects.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {["Human Review Log", "Legal Timestamps", "FCA Financial Promotions", "Greenwashing Scanner", "Signed PDF Certificates", "3-Year Retention", "API Access", "Custom Rules"].map((f) => (
              <span key={f} className="rounded-full border border-gray-700/60 bg-gray-900/60 px-3.5 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>

          <div className="mt-12">
            <a href="#waitlist"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/25">
              Join the waitlist - founding pricing locked in →
            </a>
          </div>
        </div>
      </div>

      {/* EU AI Act urgency bar */}
      <div className="border-y border-red-500/15 bg-gradient-to-r from-red-950/30 via-red-900/10 to-red-950/30">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex-shrink-0 rounded-xl border border-red-500/25 bg-red-500/10 p-3">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <p className="text-sm font-bold text-red-400 uppercase tracking-wide mb-1">EU AI Act — August 2026</p>
              <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
                If you use AI to write copy for clients, disclosure requirements become enforceable in August 2026. Penalties are not warnings. Sentinel gives your agency a signed, timestamped record proving every piece of AI-assisted copy was reviewed before it published.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-3">How it works</p>
          <h2 className="text-4xl font-extrabold text-white">
            From copy to certificate in three steps
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

          <div className="grid gap-8 lg:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="relative rounded-2xl border border-gray-800 bg-gray-900/50 p-7 backdrop-blur-sm">
                <div className="text-4xl font-black text-red-600/30 mb-4 leading-none">{step.number}</div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who it's for */}
      <div className="border-t border-gray-800/60">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-3">Who it's for</p>
            <h2 className="text-4xl font-extrabold text-white">
              Built for teams where a compliance failure is a regulatory event
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {WHO_ITS_FOR.map((item) => (
              <div key={item.label}
                className="group rounded-2xl border border-gray-800 bg-gray-900/40 p-7 hover:border-red-500/30 hover:bg-gray-900/70 transition-all duration-300">
                <span className="inline-block rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400 mb-4">
                  {item.label}
                </span>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-800/60">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-3">What's included</p>
            <h2 className="text-4xl font-extrabold text-white">
              Every tool the compliance layer needs
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm">
              Built on top of Red Flag AI Pro. Everything in Enterprise, plus the infrastructure layer that regulated businesses actually need.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="group rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-gray-900/40 p-5 hover:border-red-500/25 transition-all duration-300">
                <div className="text-xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed group-hover:text-gray-500 transition-colors">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="border-t border-gray-800/60">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-3">Before and after</p>
            <h2 className="text-3xl font-extrabold text-white">Replace your compliance spreadsheet</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">Without Sentinel</p>
              {[
                "Copy reviewed over email",
                "No record of what was checked",
                "No timestamp, no signature",
                "Compliance lives in someone's inbox",
                "One complaint, no evidence",
                "PI insurer asks: can you prove it?",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 mb-2.5">
                  <span className="text-gray-700 mt-0.5 text-sm">✕</span>
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-950/20 to-gray-900/40 p-6">
              <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-4">With Sentinel</p>
              {[
                "Copy reviewed in a proper system",
                "Every check logged and timestamped",
                "Cryptographic signature on every review",
                "Compliance is a retrievable record",
                "One complaint, instant evidence",
                "PI insurer asks: yes, here it is.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 mb-2.5">
                  <span className="text-red-500 mt-0.5 text-sm">✓</span>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist */}
      <div id="waitlist" className="border-t border-gray-800/60">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 h-[400px] w-[600px] rounded-full opacity-15"
              style={{ background: "radial-gradient(ellipse at center, #dc2626 0%, transparent 70%)" }} />
          </div>
          <div className="relative mx-auto max-w-lg px-6 py-24">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-3">Sentinel waitlist</p>
              <h2 className="text-4xl font-extrabold text-white mb-4">
                Get in early
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sentinel launches Q3 2026. Waitlist members get early access and founding pricing locked in. No spam. Cancel any time.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="border-t border-gray-800/60 py-12">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            Looking for the scanner available right now?
          </p>
          <Link
            href="/"
            className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-medium text-gray-400 hover:border-red-500/50 hover:text-white transition-all">
            Red Flag AI Pro - start free today →
          </Link>
        </div>
      </div>
    </div>
  );
}
