import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GoogleConversion } from "@/components/marketing/GoogleConversion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PlanBadge } from "@/components/billing/PlanBadge";
import { ScoreTrend } from "@/components/ui/ScoreTrend";
import { PLAN_LIMITS } from "@/lib/constants";
import type { Plan, Scan } from "@/types";

const PLAN_DISPLAY: Record<Plan, string> = {
  free: "Starter",
  scanner: "Scanner",
  pro: "Pro",
  enterprise: "Growth",
  sentinel: "Sentinel",
};

function scoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-[#E5484D]";
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
  const hasTeam = plan === "sentinel" && !!profile?.organisation_id;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Sentinel team members see all org scans; others see only their own
  const recentScansQuery = supabase
    .from("scans")
    .select("id, title, score, created_at, status")
    .order("created_at", { ascending: false })
    .limit(10);

  const trendScansQuery = supabase
    .from("scans")
    .select("score, created_at")
    .order("created_at", { ascending: true })
    .limit(20);

  const monthCountQuery = supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString());

  if (!hasTeam) {
    recentScansQuery.eq("user_id", user.id);
    trendScansQuery.eq("user_id", user.id);
    monthCountQuery.eq("user_id", user.id);
  }

  const [{ data: recentScans }, { data: trendScans }, { count: monthCount }] = await Promise.all([
    recentScansQuery,
    trendScansQuery,
    monthCountQuery,
  ]);

  const trendScores = (trendScans ?? []).map((s) => s.score as number);

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
      <GoogleConversion email={user.email} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F1EA]">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">Here&apos;s your compliance overview</p>
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
          <p className="text-sm text-[rgba(244,241,234,0.5)]">Scans this month</p>
          <p className="mt-1 text-3xl font-bold text-[#F4F1EA]">
            {scansThisMonth}
          </p>
          {scansRemaining !== null && (
            <p className="mt-1 text-xs text-[rgba(244,241,234,0.4)]">
              {scansRemaining} of {limit} remaining this month
            </p>
          )}
          {hasTeam && (
            <p className="mt-1 text-xs text-[rgba(244,241,234,0.4)]">across your whole team</p>
          )}
        </Card>
        <Card>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm text-[rgba(244,241,234,0.5)]">Avg. compliance score</p>
              <p className={["mt-1 text-3xl font-bold", avgScore !== null ? scoreColor(avgScore) : "text-[rgba(244,241,234,0.35)]"].join(" ")}>
                {avgScore ?? "—"}
              </p>
              <p className="mt-1 text-xs text-[rgba(244,241,234,0.4)]">
                {hasTeam ? "across your team" : "last 10 scans"}
              </p>
            </div>
            {trendScores.length >= 2 && (
              <ScoreTrend scores={trendScores} width={100} height={40} className="mt-1 flex-shrink-0" />
            )}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">Current plan</p>
          <p className="mt-1 text-3xl font-bold text-[#F4F1EA]">
            {PLAN_DISPLAY[plan]}
          </p>
          {plan === "free" && (
            <Link
              href="/billing"
              className="mt-1 block text-xs font-medium text-[#E5484D] hover:underline"
            >
              Upgrade →
            </Link>
          )}
          {plan === "pro" && (
            <Link
              href="/sentinel"
              className="mt-1 block text-xs font-medium text-[#E5484D] hover:underline"
            >
              Explore Sentinel →
            </Link>
          )}
          {plan === "enterprise" && (
            <Link
              href="/sentinel"
              className="mt-1 block text-xs font-medium text-[#E5484D] hover:underline"
            >
              Upgrade to Sentinel →
            </Link>
          )}
        </Card>
      </div>

      {/* First-time welcome */}
      {scansThisMonth === 0 && !recentScans?.length && (
        <div className="rounded-xl border border-[rgba(229,72,77,0.3)] bg-gradient-to-br from-[rgba(229,72,77,0.12)] to-[#102943] p-6">
          <h2 className="text-base font-bold text-[#F4F1EA] mb-1">Welcome — run your first scan</h2>
          <p className="text-sm text-[rgba(244,241,234,0.5)] mb-4">Paste any marketing copy, sales page or ad and get a compliance score in 60 seconds.</p>
          <div className="grid gap-3 sm:grid-cols-3 mb-4">
            {[
              { step: "1", title: "Paste your copy", desc: "Sales page, email, VSL script or ad" },
              { step: "2", title: "Get your score", desc: "0–100 compliance score with plain English flags" },
              { step: "3", title: "Fix and relaunch", desc: "Every flag includes a suggested rewrite" },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold">{s.step}</span>
                <div>
                  <p className="text-sm font-semibold text-[#F4F1EA]">{s.title}</p>
                  <p className="text-xs text-[rgba(244,241,234,0.5)]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/scans/new"
            className="inline-block rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Run your first scan →
          </Link>
        </div>
      )}

      {/* Sentinel upsell for non-Sentinel plans */}
      {plan !== "sentinel" && (
        <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#0A1628] to-[#0C1929] px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#F4F1EA]">
              {plan === "free" ? "Scan smarter with Scanner" : "Need team access? Try Sentinel"}
            </p>
            <p className="text-xs text-[rgba(244,241,234,0.5)] mt-0.5">
              {plan === "free"
                ? "5 scans/month, all 30 risk categories, PDF reports. £350/mo."
                : "Managed implementation, audit logging, drift detection, board reporting, dedicated advisor. £5000+/mo."}
            </p>
          </div>
          <Link
            href={plan === "free" ? "/billing" : "/sentinel"}
            className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            {plan === "free" ? "Upgrade" : "Learn more"}
          </Link>
        </div>
      )}

      {/* Recent scans */}
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <h2 className="text-sm font-semibold text-[#F4F1EA]">Recent scans</h2>
          <Link
            href="/history"
            className="text-xs font-medium text-[#E5484D] hover:underline"
          >
            View all
          </Link>
        </div>

        {!recentScans || recentScans.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[rgba(244,241,234,0.4)]">No scans yet.</p>
            <Link
              href="/scans/new"
              className="mt-3 inline-block text-sm font-medium text-[#E5484D] hover:underline"
            >
              Run your first scan →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {(recentScans as Scan[]).map((scan) => (
              <li key={scan.id}>
                <Link
                  href={`/scans/${scan.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[#F4F1EA]">
                      {scan.title}
                    </p>
                    <p className="text-xs text-[rgba(244,241,234,0.4)]">
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

      {/* Affiliate nudge */}
      <div className="rounded-lg border border-[rgba(229,72,77,0.3)] bg-[rgba(229,72,77,0.1)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#ff9b9e] mb-0.5">Earn 15% recurring commission</p>
          <p className="text-xs text-[#E5484D]">Share your affiliate link — one Sentinel referral earns you £750/month, every month.</p>
        </div>
        <Link href="/affiliates" className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-red-400 px-4 py-2 text-xs font-bold text-[#ff9b9e] hover:bg-red-100 transition-colors whitespace-nowrap">
          Join the programme →
        </Link>
      </div>
    </div>
  );
}
