import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FlagList } from "@/components/scans/FlagList";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { Badge } from "@/components/ui/Badge";
import { Navbar } from "@/components/layout/Navbar";
import type { Plan, ScanFlag } from "@/types";

export default async function SharePage({
  params,
}: {
  params: Promise<{ scanId: string }>;
}) {
  const { scanId } = await params;
  const supabase = await createClient();

  // Public read — no user_id filter, scan ID is the access token
  const { data: scan } = await supabase
    .from("scans")
    .select("id, title, score, created_at, status, user_id")
    .eq("id", scanId)
    .single();

  if (!scan) notFound();

  const [{ data: flags }, { data: ownerProfile }] = await Promise.all([
    supabase.from("scan_flags").select("*").eq("scan_id", scanId),
    supabase.from("profiles").select("plan").eq("user_id", scan.user_id).single(),
  ]);

  const ownerPlan = (ownerProfile?.plan as Plan) ?? "free";

  // Anyone can view a shared report, but the owner's plan still governs
  // whether fix text is visible — a free scan shared publicly must not
  // leak the paid-tier suggestion text.
  const fl = (flags ?? []).map((f) =>
    ownerPlan === "free" && f.suggestion
      ? { ...f, suggestion: "Unlock Pro to see the exact fix for this flag, rewritten and ready to use." }
      : f
  ) as ScanFlag[];
  const highCount = fl.filter((f) => f.severity === "high").length;
  const medCount = fl.filter((f) => f.severity === "medium").length;
  const lowCount = fl.filter((f) => f.severity === "low").length;

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">

        {/* Shared banner */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Shared compliance report</span> — verified by Red Flag AI Pro
          </p>
          <Link
            href="/"
            className="shrink-0 text-xs font-semibold text-blue-700 hover:underline"
          >
            Run your own scan →
          </Link>
        </div>

        {/* Result card */}
        <div className="rounded-xl border border-white/10 bg-[#102943] p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <ScoreGauge score={scan.score} size={140} />
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-[#F4F1EA]">{scan.title}</h1>
                <p className="text-sm text-[rgba(244,241,234,0.5)]">
                  Scanned {new Date(scan.created_at).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-lg border border-white/10 bg-[#0A1628] px-4 py-2 text-center">
                  <p className="text-lg font-bold text-[#F4F1EA]">{fl.length}</p>
                  <p className="text-xs text-[rgba(244,241,234,0.5)]">Total flags</p>
                </div>
                <div className="rounded-lg border border-[rgba(229,72,77,0.3)] bg-[rgba(229,72,77,0.1)] px-4 py-2 text-center">
                  <p className="text-lg font-bold text-[#ff9b9e]">{highCount}</p>
                  <p className="text-xs text-red-500">High</p>
                </div>
                <div className="rounded-lg border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.1)] px-4 py-2 text-center">
                  <p className="text-lg font-bold text-amber-300">{medCount}</p>
                  <p className="text-xs text-amber-500">Medium</p>
                </div>
                <div className="rounded-lg border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] px-4 py-2 text-center">
                  <p className="text-lg font-bold text-green-300">{lowCount}</p>
                  <p className="text-xs text-green-500">Low</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flags */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-[#F4F1EA]">Compliance Flags</h2>
          <FlagList flags={fl} plan={ownerPlan} />
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-white/10 bg-[#102943] p-6 text-center">
          <p className="text-sm font-semibold text-[#F4F1EA] mb-1">Want to scan your own copy?</p>
          <p className="text-xs text-[rgba(244,241,234,0.5)] mb-4">Free scan — no signup needed. Results in 60 seconds.</p>
          <Link
            href="/compliance-assessment"
            className="inline-block rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Try it free →
          </Link>
        </div>
      </div>
    </div>
  );
}
