import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Plan, Scan } from "@/types";

function scoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-[#E5484D]";
}

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, organisation_id")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  const hasTeam = plan === "sentinel" && !!profile?.organisation_id;

  const scansQuery = supabase
    .from("scans")
    .select("id, title, score, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (!hasTeam) scansQuery.eq("user_id", user.id);

  const { data: scans } = await scansQuery;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F1EA]">Scan History</h1>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">
            {hasTeam ? "All scans across your team" : "All your compliance scans"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/export/csv"
            className="rounded-lg border border-white/15 bg-[#102943] px-4 py-2 text-sm font-medium text-[rgba(244,241,234,0.8)] hover:bg-white/5 transition-colors"
          >
            Export CSV
          </a>
          <Link
            href="/scans/new"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            + New Scan
          </Link>
        </div>
      </div>

      <Card padding="none">
        {!scans || scans.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-3xl"></p>
            <p className="mt-3 font-medium text-[rgba(244,241,234,0.8)]">No scans yet</p>
            <p className="text-sm text-[rgba(244,241,234,0.4)]">
              Run your first scan to see it here.
            </p>
            <Link
              href="/scans/new"
              className="mt-4 inline-block text-sm font-medium text-[#E5484D] hover:underline"
            >
              Start a scan →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-[#0A1628]">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[rgba(244,241,234,0.5)]">
                    Scan
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[rgba(244,241,234,0.5)]">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[rgba(244,241,234,0.5)]">
                    Score
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[rgba(244,241,234,0.5)]">
                    Risk
                  </th>
                  <th className="relative px-5 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#102943]">
                {(scans as Scan[]).map((scan, i) => {
                  const next = (scans as Scan[])[i + 1];
                  const canCompare = next && scan.title === next.title;
                  return (
                  <tr key={scan.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-[#F4F1EA]">
                        {scan.title}
                      </p>
                      {canCompare && (
                        <Link href={`/compare/${next.id}/${scan.id}`} className="text-xs text-[#E5484D] hover:underline">
                          Compare with previous →
                        </Link>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[rgba(244,241,234,0.5)] whitespace-nowrap">
                      {new Date(scan.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={[
                          "text-lg font-bold",
                          scoreColor(scan.score),
                        ].join(" ")}
                      >
                        {scan.score}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={
                          scan.score >= 70
                            ? "low"
                            : scan.score >= 40
                            ? "medium"
                            : "high"
                        }
                      >
                        {scan.score >= 70
                          ? "Low risk"
                          : scan.score >= 40
                          ? "Med risk"
                          : "High risk"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/scans/${scan.id}`}
                        className="text-sm font-medium text-[#E5484D] hover:underline whitespace-nowrap"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
