import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { TeamManager } from "@/components/team/TeamManager";
import type { Plan } from "@/types";
import Link from "next/link";

export default async function TeamPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, organisation_id")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";

  // Fetch organisation if they have one
  let org = null;
  let members: { user_id: string; full_name: string | null; created_at: string }[] = [];

  if (profile?.organisation_id) {
    const { data: orgData } = await supabase
      .from("organisations")
      .select("*")
      .eq("id", profile.organisation_id)
      .single();
    org = orgData;

    // Fetch team members
    const { data: memberData } = await supabase
      .from("profiles")
      .select("user_id, full_name, created_at")
      .eq("organisation_id", profile.organisation_id);
    members = memberData ?? [];
  }

  const isOwner = org?.owner_id === user.id;

  if (plan !== "sentinel") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F1EA]">Team Seats</h1>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">Manage your team members</p>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-4xl mb-4"></p>
            <h2 className="text-lg font-bold text-[#F4F1EA] mb-2">Sentinel plan required</h2>
            <p className="text-sm text-[rgba(244,241,234,0.5)] mb-6 max-w-sm mx-auto">
              Team seats allow multiple users to scan under one Sentinel account.
              Share scan history, collaborate on compliance and manage your whole agency from one place.
            </p>
            <Link
              href="/sentinel"
              className="inline-block rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Learn about Sentinel →
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F4F1EA]">Team Seats</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)]">
          {org ? `${members.length} member${members.length !== 1 ? "s" : ""} in your organisation` : "Set up your team"}
        </p>
      </div>

      <TeamManager
        org={org}
        members={members}
        isOwner={isOwner}
        userId={user.id}
      />
    </div>
  );
}
