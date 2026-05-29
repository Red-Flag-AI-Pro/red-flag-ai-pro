import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

export default async function ReferralsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("user_id", user.id)
    .single();

  const referralCode = (profile as { referral_code?: string })?.referral_code ?? "";

  // Count referrals
  const { data: referrals } = await supabase
    .from("profiles")
    .select("full_name, plan, created_at")
    .eq("referred_by", referralCode)
    .order("created_at", { ascending: false });

  const total = referrals?.length ?? 0;
  const paying = referrals?.filter((r) => r.plan !== "free").length ?? 0;

  const referralLink = `https://redflagaipro.com/signup?ref=${referralCode}`;

  const PLAN_DISPLAY: Record<string, string> = {
    free: "Free",
    pro: "Pro",
    enterprise: "Growth",
    sentinel: "Sentinel",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        <p className="text-sm text-gray-500">Track everyone who signed up through your link</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500">Total referrals</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{total}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Paying customers</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{paying}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Your code</p>
          <p className="mt-1 text-2xl font-bold font-mono text-gray-900">{referralCode}</p>
        </Card>
      </div>

      {/* Share link */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Your referral link</h2>
        <div className="flex gap-2">
          <input
            readOnly
            value={referralLink}
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono text-gray-600"
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Share this link. Anyone who signs up through it is tracked as your referral.
        </p>
      </Card>

      {/* Referral list */}
      <Card padding="none">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Referred users ({total})</h2>
        </div>
        {total === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            <p className="text-3xl mb-3">🔗</p>
            No referrals yet. Share your link to start tracking signups.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {referrals!.map((r, i) => (
              <li key={i} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.full_name || "Anonymous"}</p>
                  <p className="text-xs text-gray-400">
                    Joined {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={[
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  r.plan === "free" ? "bg-gray-100 text-gray-600" :
                  r.plan === "sentinel" ? "bg-gray-900 text-red-400 border border-red-500/30" :
                  "bg-red-100 text-red-700",
                ].join(" ")}>
                  {PLAN_DISPLAY[r.plan] ?? r.plan}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
