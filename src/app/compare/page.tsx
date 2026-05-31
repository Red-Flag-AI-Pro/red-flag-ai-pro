import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Red Flag AI Pro vs Competitors — Marketing Compliance Tool Comparison",
  description: "How Red Flag AI Pro compares to Red Marker, Blee, and manual compliance consultants. Feature comparison, pricing and honest assessment of what each tool actually does.",
  alternates: { canonical: "https://www.redflagaipro.com/compare" },
};

const COMPARISON = [
  { feature: "Price per month", rfp: "£39 – £999", redmarker: "£2,000 – £10,000", consultant: "£500 – £3,000" },
  { feature: "Setup time", rfp: "Same day", redmarker: "Weeks", consultant: "Days" },
  { feature: "Scan speed", rfp: "60 seconds", redmarker: "Hours to days", consultant: "48 – 72 hours" },
  { feature: "URL page scanning", rfp: "✓", redmarker: "Limited", consultant: "Manual" },
  { feature: "YouTube VSL scanning", rfp: "✓", redmarker: "✗", consultant: "Manual" },
  { feature: "Audio transcription", rfp: "✓ Whisper AI", redmarker: "✗", consultant: "Manual" },
  { feature: "Full site audit", rfp: "✓ Up to 50 pages", redmarker: "✗", consultant: "Extra charge" },
  { feature: "Weekly auto-monitoring", rfp: "✓", redmarker: "✗", consultant: "✗" },
  { feature: "FCA financial promotions", rfp: "✓ Growth & Sentinel", redmarker: "Enterprise only", consultant: "Specialist only" },
  { feature: "Greenwashing scanner", rfp: "✓ Growth & Sentinel", redmarker: "Limited", consultant: "Specialist only" },
  { feature: "EU AI Act compliance", rfp: "✓ Full", redmarker: "Partial", consultant: "Variable" },
  { feature: "Multi-jurisdiction", rfp: "✓ 5 countries", redmarker: "Sometimes", consultant: "Variable" },
  { feature: "Team seats", rfp: "✓", redmarker: "✓", consultant: "N/A" },
  { feature: "White-label reports", rfp: "✓", redmarker: "✗", consultant: "✗" },
  { feature: "REST API + webhooks", rfp: "✓", redmarker: "✗", consultant: "✗" },
  { feature: "Chrome extension", rfp: "✓", redmarker: "✗", consultant: "✗" },
  { feature: "Signed PDF certificates", rfp: "✓", redmarker: "✓", consultant: "✓" },
  { feature: "Risk categories covered", rfp: "21 categories", redmarker: "8 – 12", consultant: "Variable" },
  { feature: "Free scan available", rfp: "✓ No signup", redmarker: "✗", consultant: "✗" },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-gray-950 py-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Comparison</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Red Flag AI Pro vs the alternatives
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            Enterprise compliance tools charge £2,000–£10,000 a month and take weeks to onboard. Manual consultants charge by the hour and take days to turn around. Here is the honest comparison.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-4 font-semibold text-gray-500 w-1/3">Feature</th>
                <th className="text-center px-4 py-4 font-bold text-gray-900 bg-red-50 border-l border-r border-red-100">
                  <div className="flex flex-col items-center">
                    <span className="text-red-600">Red Flag AI Pro</span>
                    <span className="text-xs font-normal text-gray-500 mt-0.5">£39 – £999/mo</span>
                  </div>
                </th>
                <th className="text-center px-4 py-4 font-semibold text-gray-500">
                  <div className="flex flex-col items-center">
                    <span>Red Marker / Blee</span>
                    <span className="text-xs font-normal mt-0.5">£2,000 – £10,000/mo</span>
                  </div>
                </th>
                <th className="text-center px-4 py-4 font-semibold text-gray-500">
                  <div className="flex flex-col items-center">
                    <span>Compliance consultant</span>
                    <span className="text-xs font-normal mt-0.5">£500 – £3,000/mo</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-5 py-3.5 text-gray-700 font-medium">{row.feature}</td>
                  <td className="px-4 py-3.5 text-center font-medium bg-red-50/30 border-l border-r border-red-100">
                    <span className={row.rfp === "✓" || row.rfp.startsWith("✓") ? "text-green-600" : "text-gray-900"}>
                      {row.rfp}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-gray-500">{row.redmarker}</td>
                  <td className="px-4 py-3.5 text-center text-gray-500">{row.consultant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">Competitor pricing based on publicly available information and industry estimates. May 2026.</p>

        {/* Why cheaper */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Software, not consultants",
              body: "Enterprise tools charge for account managers, onboarding specialists and support teams. We built software that does the work. No overhead means lower prices.",
            },
            {
              title: "Built for speed",
              body: "60 seconds to scan, same day to set up. No onboarding calls, no implementation projects, no change management. You log in and it works.",
            },
            {
              title: "Built from experience",
              body: "This was built by someone who needed it and couldn't afford the alternative. The pricing reflects that. It always will.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-gray-950 p-8 text-center">
          <p className="text-white font-bold text-xl mb-2">Try it free. No account needed.</p>
          <p className="text-gray-400 text-sm mb-6">Paste any marketing copy and see what we find. 60 seconds.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/#demo" className="rounded-xl bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors">
              Run a free scan →
            </a>
            <Link href="/pricing" className="rounded-xl border border-gray-700 px-8 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
              See pricing
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
