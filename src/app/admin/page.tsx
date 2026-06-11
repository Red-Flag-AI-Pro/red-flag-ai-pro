import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

const ADMIN_EMAIL = "redflagaipro@gmail.com";

function scoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function scoreLabel(score: number) {
  if (score >= 70) return "Low risk";
  if (score >= 40) return "Med risk";
  return "High risk";
}

export default async function AdminPage() {
  // Auth check — must be logged in as admin email
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/dashboard");

  // Use service role to query all users & scans
  const service = await createServiceClient();

  const [
    { count: totalUsers },
    { count: totalScans },
    { data: recentUsers },
    { data: recentScans },
    { count: proUsers },
    { count: scansToday },
  ] = await Promise.all([
    service.from("profiles").select("id", { count: "exact", head: true }),
    service.from("scans").select("id", { count: "exact", head: true }),
    service
      .from("profiles")
      .select("full_name, email, plan, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    service
      .from("scans")
      .select("id, title, score, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10),
    service
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .in("plan", ["pro", "enterprise"]),
    service
      .from("scans")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
  ]);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">🚩 Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-400">Red Flag AI Pro — internal overview</p>
          </div>
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Total users</p>
            <p className="mt-2 text-4xl font-extrabold text-white">{totalUsers ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Paying users</p>
            <p className="mt-2 text-4xl font-extrabold text-green-400">{proUsers ?? 0}</p>
            <p className="mt-1 text-xs text-gray-500">Pro + Enterprise</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Total scans</p>
            <p className="mt-2 text-4xl font-extrabold text-white">{totalScans ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Scans today</p>
            <p className="mt-2 text-4xl font-extrabold text-red-400">{scansToday ?? 0}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Recent signups */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="border-b border-gray-800 px-6 py-4">
              <h2 className="text-sm font-semibold text-white">Recent signups</h2>
            </div>
            {!recentUsers || recentUsers.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">No signups yet</div>
            ) : (
              <ul className="divide-y divide-gray-800">
                {recentUsers.map((u: any, i: number) => (
                  <li key={i} className="flex items-center justify-between px-6 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {u.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={[
                        "inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
                        u.plan === "pro" || u.plan === "enterprise"
                          ? "bg-green-900 text-green-300"
                          : "bg-gray-800 text-gray-400"
                      ].join(" ")}>
                        {u.plan ?? "free"}
                      </span>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(u.created_at).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent scans */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="border-b border-gray-800 px-6 py-4">
              <h2 className="text-sm font-semibold text-white">Recent scans</h2>
            </div>
            {!recentScans || recentScans.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">No scans yet</div>
            ) : (
              <ul className="divide-y divide-gray-800">
                {recentScans.map((s: any, i: number) => (
                  <li key={i} className="flex items-center justify-between px-6 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[180px]">
                        {s.title || "Untitled scan"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(s.created_at).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={["text-lg font-bold", scoreColor(s.score)].join(" ")}>
                        {s.score}
                      </p>
                      <p className="text-xs text-gray-500">{scoreLabel(s.score)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600">
          This page is only visible to support@redflagaipro.com
        </p>
      </div>
    </div>
  );
}
