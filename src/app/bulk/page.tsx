import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { BulkScanner } from "@/components/bulk/BulkScanner";
import type { Plan } from "@/types";

export default async function BulkPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Site Audit</h1>
          <p className="text-sm text-gray-500">Scan every page of a website at once</p>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Growth plan required</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Site Audit scans your client&apos;s entire website in one go. Enter a domain, we find the sitemap and scan up to 50 pages for compliance issues.
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

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Audit</h1>
        <p className="text-sm text-gray-500">
          {plan === "sentinel"
            ? "Scan up to 50 pages per audit — Sentinel plan"
            : "Scan up to 10 pages per audit — upgrade to Sentinel for 50"}
        </p>
      </div>
      <BulkScanner plan={plan} />
    </div>
  );
}
