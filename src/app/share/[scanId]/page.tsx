import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FlagList } from "@/components/scans/FlagList";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { Badge } from "@/components/ui/Badge";
import { Navbar } from "@/components/layout/Navbar";
import type { ScanFlag } from "@/types";

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
    .select("id, title, score, created_at, status")
    .eq("id", scanId)
    .single();

  if (!scan) notFound();

  const { data: flags } = await supabase
    .from("scan_flags")
    .select("*")
    .eq("scan_id", scanId);

  const fl = (flags ?? []) as ScanFlag[];
  const highCount = fl.filter((f) => f.severity === "high").length;
  const medCount = fl.filter((f) => f.severity === "medium").length;
  const lowCount = fl.filter((f) => f.severity === "low").length;

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <ScoreGauge score={scan.score} size={140} />
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{scan.title}</h1>
                <p className="text-sm text-gray-500">
                  Scanned {new Date(scan.created_at).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-center">
                  <p className="text-lg font-bold text-gray-900">{fl.length}</p>
                  <p className="text-xs text-gray-500">Total flags</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-center">
                  <p className="text-lg font-bold text-red-700">{highCount}</p>
                  <p className="text-xs text-red-500">High</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-center">
                  <p className="text-lg font-bold text-amber-700">{medCount}</p>
                  <p className="text-xs text-amber-500">Medium</p>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-center">
                  <p className="text-lg font-bold text-green-700">{lowCount}</p>
                  <p className="text-xs text-green-500">Low</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flags */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-gray-900">Compliance Flags</h2>
          <FlagList flags={fl} />
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">Want to scan your own copy?</p>
          <p className="text-xs text-gray-500 mb-4">Free scan — no signup needed. Results in 60 seconds.</p>
          <Link
            href="/#demo"
            className="inline-block rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Try it free →
          </Link>
        </div>
      </div>
    </div>
  );
}
