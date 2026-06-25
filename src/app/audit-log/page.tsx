"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import type { Plan } from "@/types";

interface AuditEntry {
  id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  vendor_added: "Vendor added",
  vendor_updated: "Vendor updated",
  vendor_removed: "Vendor removed",
  vendor_reviewed: "Vendor marked reviewed",
  report_downloaded: "Compliance report downloaded",
};

function describeEntry(entry: AuditEntry): string {
  const d = entry.details;
  switch (entry.action) {
    case "vendor_added":
    case "vendor_updated":
    case "vendor_removed":
    case "vendor_reviewed":
      return typeof d.name === "string" ? d.name : "";
    case "report_downloaded":
      return typeof d.score === "number" ? `Score: ${d.score}` : "";
    default:
      return "";
  }
}

export default function AuditLogPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan>("free");
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; checkedEntries: number } | null>(null);

  const isSentinel = plan === "sentinel";

  async function handleVerify() {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch("/api/audit-log/verify");
      const data = await res.json();
      setVerifyResult(data);
    } catch {
      setVerifyResult(null);
    } finally {
      setVerifying(false);
    }
  }

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

      if (profile?.plan === "sentinel") {
        const { data } = await supabase
          .from("audit_log")
          .select("id, action, details, created_at")
          .order("created_at", { ascending: false })
          .limit(200);
        setEntries(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  if (loading) return <div className="text-sm text-[rgba(244,241,234,0.4)] p-6">Loading…</div>;

  if (!isSentinel) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-[#F4F1EA] mb-1">Audit Log</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)] mb-6">A timestamped, tamper-resistant record of every governance action — vendor changes, report downloads, reviews. The evidence regulators ask for.</p>
        <Card>
          <p className="text-sm text-[#F4F1EA] mb-3">This is a Sentinel feature.</p>
          <Link href="/sentinel" className="inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
            Explore Sentinel →
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F1EA]">Audit Log</h1>
          <p className="text-sm text-[rgba(244,241,234,0.5)]">Every governance action, timestamped automatically and sealed in a cryptographic hash chain — nothing here can be edited, deleted, or backdated without breaking the chain.</p>
        </div>
        <button
          onClick={handleVerify}
          disabled={verifying || entries.length === 0}
          className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-[#F4F1EA] hover:bg-white/5 disabled:opacity-50 transition-colors"
        >
          {verifying ? "Verifying…" : "Verify integrity"}
        </button>
      </div>

      {verifyResult && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${verifyResult.valid ? "border-green-800 bg-green-950/40 text-green-300" : "border-red-800 bg-red-950/40 text-red-300"}`}>
          {verifyResult.valid
            ? `Chain verified. All ${verifyResult.checkedEntries} entries are intact and in order.`
            : `Tampering detected — the hash chain breaks before entry ${verifyResult.checkedEntries}. Contact support immediately.`}
        </div>
      )}

      <Card padding="none">
        {entries.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[rgba(244,241,234,0.4)]">No activity logged yet. Add a vendor or download a report to start your audit trail.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#F4F1EA]">{ACTION_LABELS[e.action] ?? e.action}</p>
                  <p className="text-xs text-[rgba(244,241,234,0.4)] truncate">{describeEntry(e)}</p>
                </div>
                <p className="shrink-0 text-xs text-[rgba(244,241,234,0.35)]">
                  {new Date(e.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
