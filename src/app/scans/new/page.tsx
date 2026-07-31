import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScanForm } from "@/components/scans/ScanForm";
import {
  PLAN_LIMITS,
  PLAN_PRICES,
  SCANNER_SALE_ACTIVE,
  SCANNER_STANDARD_PRICE,
} from "@/lib/constants";
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
        <h1 className="text-2xl font-bold text-[#F4F1EA]">New Compliance Scan</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)]">
          Paste or upload your funnel content to analyze for compliance risk.
        </p>
      </div>

      {overLimit ? (
        <div className="rounded-xl border border-[rgba(229,72,77,0.3)] bg-[rgba(229,72,77,0.1)] p-8 text-center">
          <p className="text-4xl"></p>
          <h2 className="mt-3 text-lg font-bold text-[#F4F1EA]">
            Monthly check limit reached
          </h2>
          <p className="mt-2 text-sm text-[#E5484D]">
            {plan === "free"
              ? `You have used your free check this month. Upgrade to Pro for ${PLAN_LIMITS.scanner} checks a month and the exact fix for every flag.`
              : plan === "enterprise"
              ? `You have used all ${limit} checks this month. Upgrade to Sentinel for unlimited checks.`
              : `You have used all ${limit} checks this month. Upgrade to Growth for ${PLAN_LIMITS.enterprise} checks a month.`}
          </p>
          {plan === "free" && (
            <p className="mt-2 text-sm text-[rgba(244,241,234,0.7)]">
              {SCANNER_SALE_ACTIVE
                ? `Pro is £${PLAN_PRICES.scanner.monthly}/mo in the enforcement week rate, normally £${SCANNER_STANDARD_PRICE}. Lock this rate in for as long as you stay subscribed.`
                : `Pro is £${PLAN_PRICES.scanner.monthly}/mo.`}
            </p>
          )}
          <Link
            href={plan === "free" ? "/billing?plan=scanner" : "/billing"}
            className="mt-5 inline-block rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            {plan === "enterprise" ? "Upgrade to Sentinel" : plan === "free" ? "Unlock every fix with Pro" : "Upgrade to Growth"}
          </Link>
        </div>
      ) : (
        <>
          {limit !== Infinity && (
            <div className="rounded-lg border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.1)] px-4 py-3 text-sm text-amber-300">
              You&apos;ve used <strong>{scansUsed}</strong> of <strong>{limit}</strong>{" "}
              scans this month.{" "}
              <Link href="/billing" className="font-semibold underline">
                {plan === "free" ? "Upgrade to Pro" : plan === "enterprise" ? "Upgrade to Sentinel" : "Upgrade to Growth"}
              </Link>{" "}
              for {plan === "free" ? `${PLAN_LIMITS.scanner} scans per month` : plan === "enterprise" ? "unlimited scans" : `${PLAN_LIMITS.enterprise} scans per month`}.
            </div>
          )}
          <div className="rounded-xl border border-white/10 bg-[#102943] p-6">
            <ScanForm plan={plan} />
          </div>
        </>
      )}
    </div>
  );
}
