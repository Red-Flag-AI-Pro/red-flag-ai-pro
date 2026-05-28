"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import type { Plan } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [plan, setPlan] = useState<Plan>("free");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, agency_name, plan")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setAgencyName((profile as { agency_name?: string }).agency_name ?? "");
        setPlan((profile.plan as Plan) ?? "free");
      }
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, agency_name: agencyName }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  const isSentinel = plan === "sentinel";

  if (loading) {
    return <div className="text-sm text-gray-400 p-6">Loading…</div>;
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and branding</p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Account</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Your name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-gray-900">White-label branding</h2>
          {!isSentinel && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">Sentinel only</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Your agency name appears on PDF compliance reports instead of &quot;Red Flag AI Pro&quot;. Send reports to clients under your own brand.
        </p>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Agency name</label>
          <input
            type="text"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            placeholder="e.g. Loom Digital Compliance"
            disabled={!isSentinel}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
          {isSentinel && (
            <p className="mt-1.5 text-xs text-gray-400">
              Leave blank to use &quot;Red Flag AI Pro&quot; on reports.
            </p>
          )}
          {!isSentinel && (
            <p className="mt-1.5 text-xs text-gray-400">
              <a href="/sentinel" className="text-red-600 hover:underline font-medium">Upgrade to Sentinel</a> to white-label your compliance reports.
            </p>
          )}
        </div>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Saved.</p>}

      <Button onClick={handleSave} loading={saving}>
        Save changes
      </Button>
    </div>
  );
}
