import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ScoreTrend } from "@/components/ui/ScoreTrend";
import { Badge } from "@/components/ui/Badge";
import { Navbar } from "@/components/layout/Navbar";
import type { Scan } from "@/types";

function scoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

function scoreBg(score: number) {
  if (score >= 70) return "bg-green-50 border-green-200";
  if (score >= 40) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  // Public read — client ID is the access token
  const { data: client } = await supabase
    .from("clients")
    .select("id, name, website")
    .eq("id", clientId)
    .single();

  if (!client) notFound();

  const { data: scans } = await supabase
    .from("scans")
    .select("id, title, score, created_at, status")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(20);

  const fl = scans ?? [];
  const trendScores = [...fl].reverse().map((s) => s.score as number);
  const avgScore = fl.length > 0
    ? Math.round(fl.reduce((sum, s) => sum + (s.score as number), 0) / fl.length)
    : null;

  const latestScore = fl[0]?.score as number | undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">

        {/* Portal header */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Compliance Portal</p>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              {client.website && (
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:underline mt-0.5 block">
                  {client.website}
                </a>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Verified by</p>
              <p className="text-sm font-bold text-gray-900">Red Flag AI Pro</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs text-gray-500">Total scans</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{fl.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500">Avg score</p>
                <p className={["mt-1 text-3xl font-bold", avgScore !== null ? scoreColor(avgScore) : "text-gray-300"].join(" ")}>
                  {avgScore ?? "—"}
                </p>
              </div>
              {trendScores.length >= 2 && (
                <ScoreTrend scores={trendScores} width={80} height={32} className="mt-1" />
              )}
            </div>
          </div>
          <div className={["rounded-xl border p-5", latestScore !== undefined ? scoreBg(latestScore) : "border-gray-200 bg-white"].join(" ")}>
            <p className="text-xs text-gray-500">Latest score</p>
            <p className={["mt-1 text-3xl font-bold", latestScore !== undefined ? scoreColor(latestScore) : "text-gray-300"].join(" ")}>
              {latestScore ?? "—"}
            </p>
            {latestScore !== undefined && (
              <p className={["text-xs font-semibold mt-1", scoreColor(latestScore)].join(" ")}>
                {latestScore >= 70 ? "Low risk" : latestScore >= 40 ? "Medium risk" : "High risk"}
              </p>
            )}
          </div>
        </div>

        {/* Scan history */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Compliance scan history</h2>
          </div>
          {fl.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400">No scans yet.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {(fl as Scan[]).map((scan) => (
                <li key={scan.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{scan.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(scan.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={["text-lg font-bold", scoreColor(scan.score)].join(" ")}>{scan.score}</span>
                    <Badge variant={scan.score >= 70 ? "low" : scan.score >= 40 ? "medium" : "high"}>
                      {scan.score >= 70 ? "Low risk" : scan.score >= 40 ? "Med risk" : "High risk"}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">
            Compliance monitoring provided by{" "}
            <Link href="/" className="text-red-600 hover:underline font-medium">Red Flag AI Pro</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
