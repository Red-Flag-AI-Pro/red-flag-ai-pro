"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Plan } from "@/types";

interface Vendor {
  id: string;
  name: string;
  purpose: string | null;
  data_shared: string | null;
  risk_level: "unassessed" | "low" | "medium" | "high";
  contract_reviewed: boolean;
  last_reviewed_at: string | null;
  next_review_due: string | null;
  notes: string | null;
  created_at: string;
}

const RISK_STYLES: Record<Vendor["risk_level"], string> = {
  unassessed: "bg-white/5 text-[rgba(244,241,234,0.5)]",
  low: "bg-[rgba(34,197,94,0.15)] text-green-400",
  medium: "bg-[rgba(245,158,11,0.15)] text-amber-400",
  high: "bg-[rgba(229,72,77,0.15)] text-[#ff9b9e]",
};

export default function VendorsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan>("free");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [dataShared, setDataShared] = useState("");
  const [riskLevel, setRiskLevel] = useState<Vendor["risk_level"]>("unassessed");
  const [nextReviewDue, setNextReviewDue] = useState("");

  const isPaid = plan === "scanner" || plan === "enterprise" || plan === "sentinel";

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("user_id", user.id)
        .single();
      setPlan((profile?.plan as Plan) ?? "free");

      if (profile?.plan && profile.plan !== "free") {
        const res = await fetch("/api/vendors");
        const data = await res.json();
        if (res.ok) setVendors(data.vendors ?? []);
      }
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  function resetForm() {
    setName(""); setPurpose(""); setDataShared(""); setRiskLevel("unassessed"); setNextReviewDue("");
  }

  async function handleAdd() {
    setError(null);
    if (!name.trim()) { setError("Vendor name is required."); return; }
    setSaving(true);
    const res = await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, purpose, data_shared: dataShared, risk_level: riskLevel,
        next_review_due: nextReviewDue || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); }
    else {
      setVendors((prev) => [data.vendor, ...prev]);
      resetForm();
      setShowForm(false);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch("/api/vendors", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setVendors((prev) => prev.filter((v) => v.id !== id));
  }

  async function handleToggleReviewed(vendor: Vendor) {
    const res = await fetch("/api/vendors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: vendor.id,
        contract_reviewed: !vendor.contract_reviewed,
        last_reviewed_at: !vendor.contract_reviewed ? new Date().toISOString().slice(0, 10) : null,
      }),
    });
    const data = await res.json();
    if (res.ok) setVendors((prev) => prev.map((v) => (v.id === vendor.id ? data.vendor : v)));
  }

  if (loading) return <div className="text-sm text-[rgba(244,241,234,0.4)] p-6">Loading…</div>;

  if (!isPaid) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-[#F4F1EA] mb-1">Vendor AI Risk Tracker</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)] mb-6">Track every third-party AI tool your business uses, what data it touches, and when it was last reviewed — the evidence regulators ask for.</p>
        <Card>
          <p className="text-sm text-[#F4F1EA] mb-3">This is a Pro and Sentinel feature.</p>
          <Link href="/billing" className="inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
            Upgrade to Pro →
          </Link>
        </Card>
      </div>
    );
  }

  const highRiskCount = vendors.filter((v) => v.risk_level === "high").length;
  const unreviewedCount = vendors.filter((v) => !v.contract_reviewed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F1EA]">Vendor AI Risk Tracker</h1>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">Every AI tool, what it touches, and proof it's been reviewed.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Add vendor"}</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">Vendors tracked</p>
          <p className="mt-1 text-3xl font-bold text-[#F4F1EA]">{vendors.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">High risk</p>
          <p className="mt-1 text-3xl font-bold text-[#ff9b9e]">{highRiskCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">Awaiting review</p>
          <p className="mt-1 text-3xl font-bold text-amber-400">{unreviewedCount}</p>
        </Card>
      </div>

      {showForm && (
        <Card>
          <h2 className="text-sm font-semibold text-[#F4F1EA] mb-4">Add a vendor</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[rgba(244,241,234,0.8)] mb-1">Vendor / tool name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. OpenAI, Jasper, Zapier AI"
                className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[rgba(244,241,234,0.8)] mb-1">What is it used for?</label>
              <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Drafting ad copy"
                className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[rgba(244,241,234,0.8)] mb-1">What data does it touch?</label>
              <input value={dataShared} onChange={(e) => setDataShared(e.target.value)} placeholder="e.g. Customer emails, no PII"
                className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[rgba(244,241,234,0.8)] mb-1">Risk level</label>
                <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as Vendor["risk_level"])}
                  className="w-full rounded-lg border border-white/15 bg-[#0A1628] px-3 py-2 text-sm text-[#F4F1EA] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500">
                  <option value="unassessed">Unassessed</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[rgba(244,241,234,0.8)] mb-1">Next review due</label>
                <input type="date" value={nextReviewDue} onChange={(e) => setNextReviewDue(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-[#0A1628] px-3 py-2 text-sm text-[#F4F1EA] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-[#E5484D]">{error}</p>}
          <Button onClick={handleAdd} loading={saving} className="mt-4">Add vendor</Button>
        </Card>
      )}

      <Card padding="none">
        {vendors.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[rgba(244,241,234,0.4)]">No vendors tracked yet.</p>
            <button onClick={() => setShowForm(true)} className="mt-3 text-sm font-medium text-[#E5484D] hover:underline">
              Add your first vendor →
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {vendors.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#F4F1EA] truncate">{v.name}</p>
                    <span className={["shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", RISK_STYLES[v.risk_level]].join(" ")}>
                      {v.risk_level}
                    </span>
                  </div>
                  {v.purpose && <p className="text-xs text-[rgba(244,241,234,0.4)] truncate">{v.purpose}</p>}
                  {v.next_review_due && (
                    <p className="text-xs text-[rgba(244,241,234,0.35)]">Next review: {new Date(v.next_review_due).toLocaleDateString("en-GB")}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-[rgba(244,241,234,0.6)] cursor-pointer">
                    <input type="checkbox" checked={v.contract_reviewed} onChange={() => handleToggleReviewed(v)} className="accent-red-600" />
                    Reviewed
                  </label>
                  <button onClick={() => handleDelete(v.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
