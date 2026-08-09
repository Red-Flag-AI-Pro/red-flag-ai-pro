"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Plan } from "@/types";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  model_version?: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [decayWebhookUrl, setDecayWebhookUrl] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [plan, setPlan] = useState<Plan>("free");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [modelVersionDrafts, setModelVersionDrafts] = useState<Record<string, string>>({});
  const [savingModelVersion, setSavingModelVersion] = useState<string | null>(null);

  const isSentinel = plan === "sentinel";

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const [{ data: profile }, { data: keys }] = await Promise.all([
        supabase.from("profiles").select("full_name, agency_name, plan, webhook_url, decay_webhook_url, referral_code").eq("user_id", user.id).single(),
        supabase.from("api_keys").select("id, name, key_prefix, model_version, created_at, last_used_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (profile) {
        setFullName(profile.full_name ?? "");
        setAgencyName((profile as { agency_name?: string }).agency_name ?? "");
        setWebhookUrl((profile as { webhook_url?: string }).webhook_url ?? "");
        setDecayWebhookUrl((profile as { decay_webhook_url?: string }).decay_webhook_url ?? "");
        setReferralCode((profile as { referral_code?: string }).referral_code ?? "");
        setPlan((profile.plan as Plan) ?? "free");
      }
      setApiKeys(keys ?? []);
      setModelVersionDrafts(Object.fromEntries((keys ?? []).map((k) => [k.id, k.model_version ?? ""])));
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
      body: JSON.stringify({ full_name: fullName, agency_name: agencyName, webhook_url: webhookUrl, decay_webhook_url: decayWebhookUrl }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error);
    else { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    setSaving(false);
  }

  async function handleCreateKey() {
    setCreatingKey(true);
    setNewKeyValue(null);
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName || "My API Key" }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); }
    else {
      setNewKeyValue(data.raw_key);
      setApiKeys((prev) => [{ id: data.id, name: data.name, key_prefix: data.key_prefix, created_at: data.created_at, last_used_at: null, model_version: null }, ...prev]);
      setModelVersionDrafts((prev) => ({ ...prev, [data.id]: "" }));
      setNewKeyName("");
    }
    setCreatingKey(false);
  }

  async function handleDeleteKey(id: string) {
    await fetch("/api/keys", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  }

  async function handleSaveModelVersion(id: string) {
    setSavingModelVersion(id);
    const modelVersion = (modelVersionDrafts[id] ?? "").trim();
    const res = await fetch("/api/keys", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, model_version: modelVersion || null }),
    });
    if (res.ok) {
      const data = await res.json();
      setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, model_version: data.model_version } : k)));
    }
    setSavingModelVersion(null);
  }

  const referralLink = typeof window !== "undefined" ? `${window.location.origin}/signup?ref=${referralCode}` : "";

  if (loading) return <div className="text-sm text-[rgba(244,241,234,0.4)] p-6">Loading…</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#F4F1EA]">Settings</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)]">Account, branding, API and referrals</p>
      </div>

      {/* Account */}
      <Card>
        <h2 className="text-sm font-semibold text-[#F4F1EA] mb-4">Account</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[rgba(244,241,234,0.8)] mb-1">Your name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith"
              className="w-full rounded-lg border border-white/15 bg-[#0A1628] px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
        </div>
      </Card>

      {/* White-label */}
      <Card>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-[#F4F1EA]">White-label branding</h2>
          {!isSentinel && <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-[rgba(244,241,234,0.5)]">Sentinel only</span>}
        </div>
        <p className="text-xs text-[rgba(244,241,234,0.5)] mb-3">Your agency name appears on PDF reports instead of Red Flag AI Pro.</p>
        <input type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)}
          placeholder="e.g. Loom Digital Compliance" disabled={!isSentinel}
          className="w-full rounded-lg border border-white/15 bg-[#0A1628] px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:bg-[#0A1628] disabled:text-[rgba(244,241,234,0.4)]" />
        {!isSentinel && <p className="mt-1.5 text-xs text-[rgba(244,241,234,0.4)]"><Link href="/sentinel" className="text-[#E5484D] hover:underline font-medium">Upgrade to Sentinel</Link> to white-label reports.</p>}
      </Card>

      {/* Webhook */}
      <Card>
        <h2 className="text-sm font-semibold text-[#F4F1EA] mb-1">Webhook</h2>
        <p className="text-xs text-[rgba(244,241,234,0.5)] mb-3">We POST scan results here every time a scan completes. Use with n8n, Make, Zapier or your own system.</p>
        <input type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://yourname.app.n8n.cloud/webhook/…"
          className="w-full rounded-lg border border-white/15 bg-[#0A1628] px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] font-mono focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
        <p className="mt-1.5 text-xs text-[rgba(244,241,234,0.4)]">Payload includes: scan_id, score, risk, flags with suggestions, scanned_at.</p>
      </Card>

      {/* Decay alerts */}
      <Card>
        <h2 className="text-sm font-semibold text-[#F4F1EA] mb-1">Decay alerts</h2>
        <p className="text-xs text-[rgba(244,241,234,0.5)] mb-3">A Slack or Microsoft Teams incoming webhook. We post a plain text message here the moment a boundary authorization lapses, and again at 30, 14, 7 and 1 day before it expires — the same alerts already emailed to the named owner, pushed to a channel too so they don&apos;t depend on one person&apos;s inbox.</p>
        <input type="text" value={decayWebhookUrl} onChange={(e) => setDecayWebhookUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/… or https://….webhook.office.com/…"
          className="w-full rounded-lg border border-white/15 bg-[#0A1628] px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] font-mono focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
        <p className="mt-1.5 text-xs text-[rgba(244,241,234,0.4)]">Separate from the scan webhook above — set one, both, or neither.</p>
      </Card>

      {error && <p className="text-sm text-[#E5484D]">{error}</p>}
      {success && <p className="text-sm text-green-400">Saved.</p>}
      <Button onClick={handleSave} loading={saving}>Save changes</Button>

      {/* API Keys */}
      <Card>
        <h2 className="text-sm font-semibold text-[#F4F1EA] mb-1">API Keys</h2>
        <p className="text-xs text-[rgba(244,241,234,0.5)] mb-4">
          Use your API key to scan content programmatically.{" "}
          <Link href="/docs" className="text-[#E5484D] hover:underline">View API docs →</Link>
        </p>

        <>
            {newKeyValue && (
              <div className="mb-4 rounded-lg border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] p-3">
                <p className="text-xs font-semibold text-green-300 mb-1">Copy your key now — you won&apos;t see it again</p>
                <div className="flex gap-2">
                  <code className="flex-1 rounded border border-[rgba(34,197,94,0.3)] bg-[#102943] px-3 py-2 text-xs font-mono text-[#F4F1EA] break-all">{newKeyValue}</code>
                  <button onClick={() => { navigator.clipboard.writeText(newKeyValue); setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000); }}
                    className="shrink-0 rounded-lg border border-green-300 px-3 py-2 text-xs font-medium text-green-300 hover:bg-green-100">
                    {copiedKey ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key name (optional)"
                className="flex-1 rounded-lg border border-white/15 bg-[#0A1628] px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
              <Button size="sm" onClick={handleCreateKey} loading={creatingKey} disabled={apiKeys.length >= 5}>
                Create key
              </Button>
            </div>

            {apiKeys.length > 0 ? (
              <ul className="divide-y divide-white/10">
                {apiKeys.map((k) => (
                  <li key={k.id} className="py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#F4F1EA]">{k.name}</p>
                        <p className="text-xs text-[rgba(244,241,234,0.4)] font-mono">{k.key_prefix}</p>
                        <p className="text-xs text-[rgba(244,241,234,0.4)]">
                          {k.last_used_at ? `Last used ${new Date(k.last_used_at).toLocaleDateString("en-GB")}` : "Never used"}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteKey(k.id)} className="text-xs text-red-500 hover:underline shrink-0">Revoke</button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={modelVersionDrafts[k.id] ?? ""}
                        onChange={(e) => setModelVersionDrafts((prev) => ({ ...prev, [k.id]: e.target.value }))}
                        placeholder="Model/vendor version behind this key (optional)"
                        className="flex-1 rounded-lg border border-white/10 bg-[#0A1628] px-3 py-1.5 text-xs text-[#F4F1EA] placeholder-[rgba(244,241,234,0.3)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      {(modelVersionDrafts[k.id] ?? "") !== (k.model_version ?? "") && (
                        <button
                          onClick={() => handleSaveModelVersion(k.id)}
                          disabled={savingModelVersion === k.id}
                          className="text-xs text-[rgba(244,241,234,0.6)] hover:text-[#F4F1EA] shrink-0"
                        >
                          {savingModelVersion === k.id ? "Saving…" : "Save"}
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-[rgba(244,241,234,0.35)] mt-1">
                      Part of the sealed permission fingerprint — changing this counts as scope drift on any linked boundary record, same as the threshold.
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[rgba(244,241,234,0.4)]">No API keys yet.</p>
            )}
          </>
      </Card>

      {/* Referral */}
      {referralCode && (
        <Card>
          <h2 className="text-sm font-semibold text-[#F4F1EA] mb-1">Refer a friend</h2>
          <p className="text-xs text-[rgba(244,241,234,0.5)] mb-3">Share your referral link. We track everyone who signs up through it.</p>
          <div className="flex gap-2">
            <input type="text" readOnly value={referralLink}
              className="flex-1 rounded-lg border border-white/15 bg-[#0A1628] px-3 py-2 text-xs font-mono text-[rgba(244,241,234,0.6)]" />
            <button onClick={() => { navigator.clipboard.writeText(referralLink); setCopiedReferral(true); setTimeout(() => setCopiedReferral(false), 2000); }}
              className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-[rgba(244,241,234,0.8)] hover:bg-white/5">
              {copiedReferral ? "Copied!" : "Copy"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
