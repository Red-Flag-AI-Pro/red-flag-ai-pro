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

const FEATURES = [
  {
    icon: "📋",
    title: "Human Review Log",
    description: "Every piece of copy reviewed and logged with a timestamped record. Admissible evidence if a complaint lands.",
  },
  {
    icon: "⏱️",
    title: "Legal Timestamps",
    description: "Cryptographically signed timestamps on every review. Prove what you checked, when you checked it.",
  },
  {
    icon: "📄",
    title: "Signed PDF Certificates",
    description: "Issue compliance certificates for each campaign. The documentation your PI insurer and regulator expects.",
  },
  {
    icon: "🏦",
    title: "FCA Financial Promotions",
    description: "Built for FCA-regulated businesses. Financial promotion rules checked at source, before publication.",
  },
  {
    icon: "🌿",
    title: "Greenwashing Scanner",
    description: "EU Green Claims Directive compliance. Check environmental claims before the regulator does.",
  },
  {
    icon: "🗂️",
    title: "3-Year Retention",
    description: "Full audit trail retained for 3 years. Meet your record-keeping obligations without lifting a finger.",
  },
  {
    icon: "🔌",
    title: "API Access",
    description: "Integrate compliance checking directly into your content workflow, CMS or approval pipeline.",
  },
  {
    icon: "⚙️",
    title: "Custom Rules",
    description: "Build rules specific to your sector, client base or internal policy. Compliance your way.",
  },
];

const WHO_ITS_FOR = [
  {
    title: "Digital marketing agencies",
    description: "You write AI-assisted copy for clients. From August 2026, the EU AI Act requires disclosure. One complaint lands on your agency AND your client simultaneously. Sentinel gives you the audit trail that proves you checked.",
  },
  {
    title: "Compliance and legal teams",
    description: "Your team reviews copy before it publishes. Right now that process lives in email threads and spreadsheets. Sentinel gives you a proper system - logged, timestamped, signed.",
  },
  {
    title: "FCA-regulated businesses",
    description: "Financial promotions carry the heaviest penalties in UK advertising law. Sentinel checks copy against FCA rules before it goes out, with a signed record that you did.",
  },
  {
    title: "Enterprise marketing teams",
    description: "You're running campaigns across multiple jurisdictions. GDPR, FTC, ASA, EU AI Act all at once. Sentinel checks all five simultaneously and issues a certificate for your records.",
  },
];

export default function SentinelPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-gray-950 to-gray-950" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 mb-8">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Coming Q3 2026</span>
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Sentinel
          </h1>
          <p className="mt-4 text-2xl font-semibold text-red-400">
            Compliance infrastructure for agencies and regulated businesses
          </p>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Built for the teams where a compliance failure isn&apos;t just embarrassing, it&apos;s a regulatory event. Human review logs. Legal timestamps. Signed certificates. The audit trail your PI insurer needs and your regulator expects.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["Human Review Log", "Legal Timestamps", "FCA Financial Promotions", "Greenwashing Scanner", "Signed PDF Certificates", "3-Year Retention", "API Access", "Custom Rules"].map((f) => (
              <span key={f} className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs text-gray-400">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* EU AI Act urgency */}
      <div className="border-y border-red-500/20 bg-red-950/20">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-4xl">⚠️</div>
            <div>
              <h2 className="text-lg font-bold text-white">EU AI Act enforcement begins August 2026</h2>
              <p className="mt-1 text-gray-400 text-sm leading-relaxed max-w-3xl">
                If you&apos;re using AI to write copy for clients, disclosure requirements apply from August. The penalty for non-compliance is not a warning letter. Sentinel gives agencies a timestamped, signed record that every piece of AI-assisted copy was reviewed before it published.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Who it's for */}
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">
          Built for teams where compliance isn&apos;t optional
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {WHO_ITS_FOR.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-3xl font-extrabold text-white text-center mb-4">
            What Sentinel includes
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
            Everything in Red Flag AI Pro Enterprise, plus the compliance infrastructure layer built for regulated businesses.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Waitlist */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-xl px-6 py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white">
              Join the waitlist
            </h2>
            <p className="mt-4 text-gray-400">
              Sentinel launches Q3 2026. Waitlist members get early access and founding pricing locked in before it goes public.
            </p>
          </div>
          <WaitlistForm />
        </div>
      </div>

      {/* Footer link */}
      <div className="border-t border-gray-800 py-10 text-center">
        <p className="text-gray-600 text-sm mb-4">
          Looking for the scanner that&apos;s available now?
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-400 hover:border-red-500 hover:text-white transition-colors"
        >
          ← Red Flag AI Pro - start free today
        </Link>
      </div>
    </div>
  );
}
