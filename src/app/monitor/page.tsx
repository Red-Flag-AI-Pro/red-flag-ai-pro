import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { MonitorManager } from "@/components/monitor/MonitorManager";
import Link from "next/link";
import type { Plan } from "@/types";

export default async function MonitorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  const isEligible = plan === "enterprise" || plan === "sentinel";

  if (!isEligible) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">URL Monitoring</h1>
          <p className="text-sm text-gray-500">Automatic weekly compliance checks on live pages</p>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-4xl mb-4">📡</p>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Growth plan required</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              URL monitoring automatically rescans your live pages every week and flags anything that changes. Growth gets 5 monitored URLs. Sentinel gets unlimited.
            </p>
            <Link
              href="/billing"
              className="inline-block rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Upgrade to Growth →
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const { data: monitoredUrls } = await supabase
    .from("monitored_urls")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">URL Monitoring</h1>
        <p className="text-sm text-gray-500">
          {plan === "sentinel"
            ? "Unlimited monitored URLs - rescanned automatically every Monday"
            : `${monitoredUrls?.length ?? 0} of 5 URLs monitored - rescanned every Monday`}
        </p>
      </div>
      <MonitorManager
        initialUrls={monitoredUrls ?? []}
        plan={plan}
      />
    </div>
  );
}
