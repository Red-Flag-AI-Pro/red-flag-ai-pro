import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PlanBadge } from "@/components/billing/PlanBadge";
import { PLAN_LIMITS } from "@/lib/constants";
import type { Plan, Scan } from "@/types";

function scoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  const limit = PLAN_LIMITS[plan];

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: recentScans }, { count: monthCount }] = await Promise.all([
    supabase
      .from("scans")
      .select("id, title, score, created_at, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("scans")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString()),
  ]);

  const scansThisMonth = monthCount ?? 0;
  const scansRemaining =
    limit === Infinity ? null : Math.max(0, limit - scansThisMonth);

  const avgScore =
    recentScans && recentScans.length > 0
      ? Math.round(
          (recentScans as Scan[]).reduce((sum: number, s: Scan) => sum + (s.score as number), 0) /
            recentScans.length
        )
      : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-gray-500">Here&apos;s your compliance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <PlanBadge plan={plan} />
          <Link
            href="/scans/new"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            + New Scan
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500">Scans this month</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {scansThisMonth}
          </p>
          {scansRemaining !== null && (
            <p className="mt-1 text-xs text-gray-400">
              {scansRemaining} remaining on Free plan
            </p>
          )}
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Avg. compliance score</p>
          <p
            className={[
              "mt-1 text-3xl font-bold",
              avgScore !== null ? scoreColor(avgScore) : "text-gray-300",
            ].join(" ")}
          >
            {avgScore ?? "—"}
          </p>
          <p className="mt-1 text-xs text-gray-400">from last 5 scans</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Current plan</p>
          <p className="mt-1 text-3xl font-bold capitalize text-gray-900">
            {plan}
          </p>
          {plan === "free" && (
            <Link
              href="/billing"
              className="mt-1 block text-xs font-medium text-red-600 hover:underline"
            >
              Upgrade to Pro →
            </Link>
          )}
        </Card>
      </div>

      {/* Recent scans */}
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Recent scans</h2>
          <Link
            href="/history"
            className="text-xs font-medium text-red-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {!recentScans || recentScans.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-gray-400">No scans yet.</p>
            <Link
              href="/scans/new"
              className="mt-3 inline-block text-sm font-medium text-red-600 hover:underline"
            >
              Run your first scan →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {(recentScans as Scan[]).map((scan) => (
              <li key={scan.id}>
                <Link
                  href={`/scans/${scan.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {scan.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(scan.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "text-lg font-bold",
                        scoreColor(scan.score),
                      ].join(" ")}
                    >
                      {scan.score}
                    </span>
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
