import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScanForm } from "@/components/scans/ScanForm";
import { PLAN_LIMITS } from "@/lib/constants";
import type { Plan } from "@/types";
import Link from "next/link";

export default async function NewScanPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  const limit = PLAN_LIMITS[plan];

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString());

  const scansUsed = count ?? 0;
  const overLimit = limit !== Infinity && scansUsed >= limit;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Compliance Scan</h1>
        <p className="text-sm text-gray-500">
          Paste or upload your funnel content to analyze for compliance risk.
        </p>
      </div>

      {overLimit ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-4xl">🚫</p>
          <h2 className="mt-3 text-lg font-bold text-red-800">
            Monthly scan limit reached
          </h2>
          <p className="mt-2 text-sm text-red-600">
            You&apos;ve used all {limit} free scans this month. Upgrade to Pro for
            unlimited scans.
          </p>
          <Link
            href="/billing"
            className="mt-5 inline-block rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
      ) : (
        <>
          {plan === "free" && limit !== Infinity && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              You&apos;ve used <strong>{scansUsed}</strong> of <strong>{limit}</strong>{" "}
              free scans this month.{" "}
              <Link href="/billing" className="font-semibold underline">
                Upgrade to Pro
              </Link>{" "}
              for unlimited scans.
            </div>
          )}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <ScanForm />
          </div>
        </>
      )}
    </div>
  );
}
