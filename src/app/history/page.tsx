import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Scan } from "@/types";

function scoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: scans } = await supabase
    .from("scans")
    .select("id, title, score, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
          <p className="text-sm text-gray-500">All your compliance scans</p>
        </div>
        <Link
          href="/scans/new"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          + New Scan
        </Link>
      </div>

      <Card padding="none">
        {!scans || scans.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-3xl">📋</p>
            <p className="mt-3 font-medium text-gray-700">No scans yet</p>
            <p className="text-sm text-gray-400">
              Run your first scan to see it here.
            </p>
            <Link
              href="/scans/new"
              className="mt-4 inline-block text-sm font-medium text-red-600 hover:underline"
            >
              Start a scan →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Scan
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Score
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Risk
                  </th>
                  <th className="relative px-5 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {(scans as Scan[]).map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900">
                        {scan.title}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
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
                        className="text-sm font-medium text-red-600 hover:underline whitespace-nowrap"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
