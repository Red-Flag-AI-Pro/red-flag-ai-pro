import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScanResultCard } from "@/components/scans/ScanResultCard";
import { FlagList } from "@/components/scans/FlagList";
import type { Plan, Scan, ScanFlag } from "@/types";

export default async function ScanResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: scan }, { data: flags }, { data: profile }] =
    await Promise.all([
      supabase
        .from("scans")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single(),
      supabase.from("scan_flags").select("*").eq("scan_id", id),
      supabase
        .from("profiles")
        .select("plan")
        .eq("user_id", user.id)
        .single(),
    ]);

  if (!scan) notFound();

  const plan: Plan = (profile?.plan as Plan) ?? "free";

  // Free users see that a fix exists (blurred, teased in the UI) but the
  // actual fix text must never reach the client, or it's readable from the
  // page payload regardless of the blur. Swap in a placeholder so the tease
  // still renders without leaking the real suggestion.
  const visibleFlags = (flags ?? []).map((f) =>
    plan === "free" && f.suggestion
      ? { ...f, suggestion: "Unlock Pro to see the exact fix for this flag, rewritten and ready to use." }
      : f
  ) as ScanFlag[];

  return (
    <div className="space-y-6">
      <ScanResultCard
        scan={scan as Scan}
        flags={visibleFlags}
        plan={plan}
      />

      <div>
        <h2 className="mb-3 text-lg font-bold text-[#F4F1EA]">
          Compliance Flags
        </h2>
        <FlagList flags={visibleFlags} score={scan.score} plan={plan} scanId={id} />
      </div>
    </div>
  );
}
