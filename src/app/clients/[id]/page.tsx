import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreTrend } from "@/components/ui/ScoreTrend";
import type { Scan } from "@/types";

function scoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-[#E5484D]";
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!client) notFound();

  const { data: scans } = await supabase
    .from("scans")
    .select("id, title, score, status, created_at")
    .eq("client_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const trendScores = [...(scans ?? [])].reverse().map((s) => s.score as number);
  const avgScore = scans && scans.length > 0
    ? Math.round((scans as Scan[]).reduce((sum, s) => sum + (s.score as number), 0) / scans.length)
    : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/clients" className="text-xs text-[rgba(244,241,234,0.4)] hover:text-[rgba(244,241,234,0.6)] mb-1 block">
            ← Clients
          </Link>
          <h1 className="text-2xl font-bold text-[#F4F1EA]">{client.name}</h1>
          {client.website && (
            <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#E5484D] hover:underline mt-0.5 block">
              {client.website}
            </a>
          )}
          {client.notes && (
            <p className="text-sm text-[rgba(244,241,234,0.5)] mt-1">{client.notes}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/portal/${id}`}
            target="_blank"
            className="rounded-lg border border-white/15 bg-[#102943] px-4 py-2 text-sm font-medium text-[rgba(244,241,234,0.8)] hover:bg-white/5 transition-colors whitespace-nowrap"
          >
            Client portal →
          </Link>
          <Link
            href={`/scans/new?client=${id}`}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            + New scan
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">Total scans</p>
          <p className="mt-1 text-3xl font-bold text-[#F4F1EA]">{scans?.length ?? 0}</p>
        </Card>
        <Card>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm text-[rgba(244,241,234,0.5)]">Avg. compliance score</p>
              <p className={["mt-1 text-3xl font-bold", avgScore !== null ? scoreColor(avgScore) : "text-[rgba(244,241,234,0.35)]"].join(" ")}>
                {avgScore ?? "—"}
              </p>
            </div>
            {trendScores.length >= 2 && (
              <ScoreTrend scores={trendScores} width={90} height={36} className="mt-1 flex-shrink-0" />
            )}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">Latest scan</p>
          <p className="mt-1 text-sm font-medium text-[#F4F1EA]">
            {scans && scans.length > 0
              ? new Date(scans[0].created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
              : "No scans yet"}
          </p>
        </Card>
      </div>

      {/* Scan history */}
      <Card padding="none">
        <div className="border-b border-white/5 px-5 py-4">
          <h2 className="text-sm font-semibold text-[#F4F1EA]">Scan history</h2>
        </div>
        {!scans || scans.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[rgba(244,241,234,0.4)] text-sm">No scans for this client yet.</p>
            <Link href={`/scans/new?client=${id}`} className="mt-2 inline-block text-sm text-[#E5484D] hover:underline">
              Run the first scan →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {(scans as Scan[]).map((scan) => (
              <li key={scan.id}>
                <Link
                  href={`/scans/${scan.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[#F4F1EA]">{scan.title}</p>
                    <p className="text-xs text-[rgba(244,241,234,0.4)]">
                      {new Date(scan.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={["text-lg font-bold", scoreColor(scan.score)].join(" ")}>{scan.score}</span>
                    <Badge variant={scan.score >= 70 ? "low" : scan.score >= 40 ? "medium" : "high"}>
                      {scan.score >= 70 ? "Low risk" : scan.score >= 40 ? "Med risk" : "High risk"}
                    </Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
