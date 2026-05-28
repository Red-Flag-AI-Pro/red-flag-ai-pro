import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Sentinel — Compliance Infrastructure for Agencies and Regulated Businesses",
  description:
    "Stop managing compliance in email threads. Sentinel gives agencies a signed, timestamped audit trail for every piece of copy reviewed. Built for the teams where a compliance failure is a regulatory event.",
  alternates: { canonical: "https://www.redflagaipro.com/sentinel" },
};

const BENEFITS = [
  {
    icon: "🛡️",
    headline: "A complaint lands. You have proof.",
    body: "Without a record, your agency has no defence. Sentinel logs every review with a legal timestamp and issues a signed certificate. When the regulator or client asks what you checked and when, the answer is instant.",
  },
  {
    icon: "📋",
    headline: "Your PI insurer will ask. Now you can answer.",
    body: "Professional indemnity insurers increasingly require documented compliance processes. A signed audit trail showing you reviewed copy before it published is exactly the kind of evidence they expect. Sentinel creates it automatically.",
  },
  {
    icon: "⚡",
    headline: "Compliance that keeps pace with delivery.",
    body: "Your team ships fast. Compliance cannot be a bottleneck. Sentinel checks copy against FTC, GDPR, ASA, FCA and the EU AI Act in under 60 seconds, so the compliance review happens before the brief leaves your desk, not after the complaint.",
  },
  {
    icon: "🏦",
    headline: "FCA and financial promotions handled.",
    body: "Financial promotion rules are the highest-stakes area of UK advertising law. One unapproved copy can trigger an FCA investigation for both you and your client. Sentinel checks financial copy against FCA rules at source, before it publishes.",
  },
  {
    icon: "🌿",
    headline: "Greenwashing is now an enforcement priority.",
    body: "The EU Green Claims Directive and the CMA Green Claims Code are actively enforced. Agencies writing sustainability copy for clients are exposed if those claims are unsubstantiated. Sentinel catches greenwashing before it becomes a headline.",
  },
  {
    icon: "🤖",
    headline: "AI copy. August 2026. Your responsibility.",
    body: "The EU AI Act requires disclosure on AI-assisted content from August 2026. If you use AI to write copy for clients, the obligation to disclose sits with you as the creator. Sentinel records what was checked, when, and by whom. That is your audit trail.",
  },
];

const WHO_ITS_FOR = [
  {
    label: "Digital agencies",
    title: "You write copy for clients. Their compliance failure is your liability.",
    description: "When a client campaign triggers an ASA or FCA complaint, the agency that wrote the copy is named too. Sentinel gives you a signed record proving you reviewed it before it went out. That is the difference between a claim dismissed and a claim upheld.",
  },
  {
    label: "Legal and compliance teams",
    title: "Your review process lives in inboxes. That is not a system.",
    description: "Sentinel replaces informal email-based review with a logged, timestamped, signed process. Every piece of copy has a record. Every certificate is retrievable in seconds. When the audit arrives, you are ready.",
  },
  {
    label: "FCA-regulated businesses",
    title: "Financial promotions carry the heaviest penalties in UK advertising law.",
    description: "Sentinel checks copy against FCA financial promotion rules before publication and issues a signed certificate confirming it was checked. The protection your compliance officer has been asking for, built into your content workflow.",
  },
  {
    label: "Enterprise marketing teams",
    title: "Multi-jurisdiction campaigns. One failure can shut a campaign in five countries.",
    description: "GDPR, FTC, ASA, EU AI Act, ACCC and CASL checked simultaneously. One certificate covers all jurisdictions. One source of truth for your compliance record, however many markets you operate in.",
  },
];

export default function SentinelPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#07070f" }}>
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 -top-20 -translate-x-1/2 h-[700px] w-[1000px] opacity-25"
            style={{ background: "radial-gradient(ellipse at center top, #dc2626 0%, transparent 65%)" }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-32 text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-red-500/20 bg-red-500/5 px-5 py-2 mb-12">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-[0.18em]">
              Stay compliant. Stay protected. Stay ahead.
            </span>
          </div>

          <h1
            className="text-[clamp(4rem,12vw,8rem)] font-black tracking-tighter leading-none"
            style={{
              background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 35%, #dc2626 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Sentinel
          </h1>

          <p className="mt-6 text-xl sm:text-2xl font-semibold text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Compliance infrastructure for agencies, legal teams and regulated businesses.
          </p>

          <p className="mt-5 text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            All 21 risk categories, legally mapped across 5 jurisdictions. Human review logs. Legal timestamps. Signed certificates. Built for the teams where a compliance failure is not an embarrassment. It is a regulatory event.
          </p>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:support@redflagaipro.com?subject=Sentinel Enquiry"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-sm font-bold text-white hover:bg-red-500 transition-all shadow-xl shadow-red-600/20"
            >
              Get compliant today →
            </a>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/60 px-8 py-4 text-sm font-medium text-gray-300 hover:border-red-500/40 hover:text-white transition-all backdrop-blur-sm"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>

      {/* EU AI Act urgency */}
      <div className="border-y border-red-500/10 bg-gradient-to-r from-red-950/25 via-red-900/10 to-red-950/25">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0 rounded-xl border border-red-500/20 bg-red-500/8 p-3.5">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <p className="text-xs font-bold text-red-400 uppercase tracking-[0.15em] mb-1.5">
                EU AI Act enforcement begins August 2026
              </p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                If your agency uses AI to write copy for clients, disclosure requirements become enforceable in August 2026. Agencies that cannot prove they reviewed AI-assisted content before publication face the same penalties as the brand. Sentinel is the audit trail that proves you were compliant.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mx-auto max-w-5xl px-6 py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-4">Why Sentinel</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            What it actually means<br className="hidden sm:block" /> for your agency
          </h2>
          <p className="mt-5 text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
            Compliance is not a feature. It is commercial protection. Here is what Sentinel gives you in practice.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.headline}
              className="group rounded-2xl border border-gray-800/60 bg-gradient-to-b from-gray-900/70 to-transparent p-7 hover:border-red-500/20 hover:from-gray-900 transition-all duration-300"
            >
              <div className="text-2xl mb-4">{b.icon}</div>
              <h3 className="text-sm font-bold text-white mb-3 leading-snug">{b.headline}</h3>
              <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-500 transition-colors">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Who it's for */}
      <div className="border-t border-gray-800/40">
        <div className="mx-auto max-w-5xl px-6 py-28">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-4">Who it&apos;s for</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
              Built for teams where<br className="hidden sm:block" /> compliance is not optional
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {WHO_ITS_FOR.map((item) => (
              <div
                key={item.label}
                className="group rounded-2xl border border-gray-800/60 bg-gray-900/30 p-8 hover:border-red-500/25 hover:bg-gray-900/60 transition-all duration-300 cursor-default"
              >
                <span className="inline-block rounded-full border border-red-500/20 bg-red-500/8 px-3 py-1 text-xs font-bold text-red-400 mb-5">
                  {item.label}
                </span>
                <h3 className="text-base font-bold text-white mb-3 leading-snug">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Before / After */}
      <div className="border-t border-gray-800/40">
        <div className="mx-auto max-w-3xl px-6 py-28">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-4">The difference</p>
            <h2 className="text-4xl font-extrabold text-white">Replace your compliance spreadsheet</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-7">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.15em] mb-6">Without Sentinel</p>
              {[
                "Copy reviewed over email threads",
                "No record of what was checked",
                "No timestamp, no signature",
                "Compliance lives in someone's inbox",
                "One complaint, no evidence",
                "PI insurer asks: can you prove it?",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 mb-3">
                  <span className="text-gray-700 mt-0.5 text-sm flex-shrink-0">✕</span>
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div
              className="rounded-2xl border border-red-500/15 p-7"
              style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.15) 0%, rgba(9,7,15,0.8) 100%)" }}
            >
              <p className="text-xs font-bold text-red-500 uppercase tracking-[0.15em] mb-6">With Sentinel</p>
              {[
                "Copy reviewed in a proper system",
                "Every check logged and timestamped",
                "Cryptographic signature on every review",
                "Compliance is a retrievable record",
                "One complaint, instant evidence",
                "PI insurer asks: yes, here it is.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 mb-3">
                  <span className="text-red-500 mt-0.5 text-sm flex-shrink-0">✓</span>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-gray-800/40">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 bottom-0 -translate-x-1/2 h-[500px] w-[700px] opacity-20"
              style={{ background: "radial-gradient(ellipse at center bottom, #dc2626 0%, transparent 65%)" }}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          <div className="relative mx-auto max-w-3xl px-6 py-32 text-center">
            <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-6">Get started</p>
            <h2
              className="text-5xl sm:text-6xl font-black tracking-tight mb-6"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #dc2626 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Ready when you are.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto mb-12">
              Compliance is not a one-off task. It is a constant. Sentinel keeps your agency protected every time copy is created, reviewed and published. Get in touch and we will get you set up.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@redflagaipro.com?subject=Sentinel Enquiry"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-10 py-4 text-base font-bold text-white hover:bg-red-500 transition-all shadow-2xl shadow-red-600/25"
              >
                Get in touch →
              </a>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/60 px-10 py-4 text-base font-medium text-gray-300 hover:border-red-500/40 hover:text-white transition-all"
              >
                Try Red Flag AI Pro free
              </Link>
            </div>

            <p className="mt-8 text-xs text-gray-600">
              Or email us directly at{" "}
              <a href="mailto:support@redflagaipro.com" className="text-gray-500 hover:text-red-400 transition-colors">
                support@redflagaipro.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-gray-800/40 py-10">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-700 text-sm">
            Red Flag AI Pro — compliance scanning available now
          </p>
          <Link
            href="/"
            className="rounded-lg border border-gray-800 px-5 py-2 text-sm font-medium text-gray-500 hover:border-red-500/40 hover:text-white transition-all"
          >
            Start free today →
          </Link>
        </div>
      </div>
    </div>
  );
}
