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

  return (
    <div className="space-y-6">
      <ScanResultCard
        scan={scan as Scan}
        flags={(flags ?? []) as ScanFlag[]}
        plan={plan}
      />

      <div>
        <h2 className="mb-3 text-lg font-bold text-[#F4F1EA]">
          Compliance Flags
        </h2>
        <FlagList flags={(flags ?? []) as ScanFlag[]} score={scan.score} />
      </div>
    </div>
  );
}
