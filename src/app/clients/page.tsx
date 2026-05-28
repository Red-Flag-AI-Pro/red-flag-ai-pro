import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ClientManager } from "@/components/clients/ClientManager";
import type { Plan } from "@/types";

export default async function ClientsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500">Manage your client accounts</p>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-4xl mb-4">🏢</p>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Growth plan required</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Client workspaces let you organise scans by client, track compliance per account, and build a paper trail for each relationship.
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

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, website, notes, created_at")
    .eq("user_id", user.id)
    .order("name");

  // Get scan counts per client
  const { data: scanCounts } = await supabase
    .from("scans")
    .select("client_id")
    .eq("user_id", user.id)
    .not("client_id", "is", null);

  const countMap: Record<string, number> = {};
  (scanCounts ?? []).forEach((s) => {
    if (s.client_id) countMap[s.client_id] = (countMap[s.client_id] ?? 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-sm text-gray-500">
          {clients?.length ?? 0} client{(clients?.length ?? 0) !== 1 ? "s" : ""} - organise scans and monitor compliance per account
        </p>
      </div>
      <ClientManager
        initialClients={(clients ?? []).map((c) => ({ ...c, scanCount: countMap[c.id] ?? 0 }))}
        plan={plan}
      />
    </div>
  );
}
