"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import type { Plan } from "@/types";

interface ExportSummary {
  generated_at: string;
  boundary_records_count: number;
  boundary_records_active: number;
  boundary_records_expired: number;
  program_orders_count: number;
  program_orders: { letter_grade: string | null; delivered_at: string | null; sealed: boolean }[];
  governance_assessment: { score: number; risk_level: string; completed_at: string } | null;
  real_time_gate_decisions_count: number;
  real_time_gate_decisions_blocked: number;
  audit_chain_intact: boolean;
  audit_chain_checked_entries: number;
}

interface HistoryEntry {
  id: string;
  created_at: string;
  details: Record<string, unknown>;
}

type ExportState =
  | { state: "idle" }
  | { state: "exporting" }
  | { state: "ok"; summary: ExportSummary; entryId: string }
  | { state: "error"; message: string };

const INCLUDES = [
  "Every boundary authorization record you hold, active and expired",
  "Any completed £497 Full Governance Program bundle (documents, risk register, letter grade)",
  "Your latest governance assessment score and risk level, if you have one",
  "Real Time Gate decision totals and block rate",
  "Whether your own audit chain is still intact",
];

export default function DataRoomPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan>("free");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [exportState, setExportState] = useState<ExportState>({ state: "idle" });

  const isSentinel = plan === "sentinel";

  async function loadHistory() {
    const { data } = await supabase
      .from("audit_log")
      .select("id, created_at, details")
      .eq("action", "data_room.exported")
      .order("created_at", { ascending: false })
      .limit(20);
    setHistory(data ?? []);
  }

  async function handleExport() {
    setExportState({ state: "exporting" });
    try {
      const res = await fetch("/api/data-room/export", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setExportState({ state: "ok", summary: data.summary, entryId: data.entryId });
        loadHistory();
      } else {
        setExportState({ state: "error", message: data.error ?? "Export failed. Try again." });
      }
    } catch {
      setExportState({ state: "error", message: "Could not reach the server. Try again." });
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

      if (profile?.plan === "sentinel") await loadHistory();
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="text-sm text-[rgba(244,241,234,0.4)] p-6">Loading…</div>;

  if (!isSentinel) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-[#F4F1EA] mb-1">Data Room</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)] mb-6">One sealed snapshot of everything Red Flag holds about your governance posture — for a board, an investor, an insurer, or an auditor who wants it all in one place, proven not to have been altered since the day it was compiled.</p>
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
      <div>
        <h1 className="text-2xl font-bold text-[#F4F1EA]">Data Room</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)]">A sealed, dated snapshot of your governance posture, compiled fresh each time and timestamped independently, so anyone you hand it to can verify it hasn&apos;t been altered since the day it was compiled.</p>
      </div>

      <Card>
        <p className="text-sm font-medium text-[#F4F1EA] mb-3">Every export includes</p>
        <ul className="space-y-1.5">
          {INCLUDES.map((item) => (
            <li key={item} className="text-sm text-[rgba(244,241,234,0.6)] flex gap-2">
              <span className="text-red-400 shrink-0">·</span>{item}
            </li>
          ))}
        </ul>
        <button
          onClick={handleExport}
          disabled={exportState.state === "exporting"}
          className="mt-5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {exportState.state === "exporting" ? "Compiling and sealing…" : "Generate Data Room export"}
        </button>
      </Card>

      {exportState.state === "error" && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {exportState.message}
        </div>
      )}

      {exportState.state === "ok" && (
        <Card>
          <p className="text-sm font-medium text-emerald-300 mb-4">✓ Sealed and independently timestamped</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-[rgba(244,241,234,0.4)] uppercase tracking-wide mb-1">Boundary records</p>
              <p className="text-lg font-bold text-[#F4F1EA]">{exportState.summary.boundary_records_active} active <span className="text-sm font-normal text-[rgba(244,241,234,0.4)]">/ {exportState.summary.boundary_records_expired} expired</span></p>
            </div>
            <div>
              <p className="text-xs text-[rgba(244,241,234,0.4)] uppercase tracking-wide mb-1">Governance programs</p>
              <p className="text-lg font-bold text-[#F4F1EA]">{exportState.summary.program_orders_count}</p>
            </div>
            <div>
              <p className="text-xs text-[rgba(244,241,234,0.4)] uppercase tracking-wide mb-1">Real Time Gate decisions</p>
              <p className="text-lg font-bold text-[#F4F1EA]">{exportState.summary.real_time_gate_decisions_count} <span className="text-sm font-normal text-[rgba(244,241,234,0.4)]">({exportState.summary.real_time_gate_decisions_blocked} blocked)</span></p>
            </div>
            <div>
              <p className="text-xs text-[rgba(244,241,234,0.4)] uppercase tracking-wide mb-1">Audit chain</p>
              <p className={`text-lg font-bold ${exportState.summary.audit_chain_intact ? "text-emerald-300" : "text-red-400"}`}>
                {exportState.summary.audit_chain_intact ? "Intact" : "Broken"}
              </p>
            </div>
          </div>
          <Link href={`/verify?id=${exportState.entryId}`} target="_blank" className="text-sm text-red-400 hover:underline">
            Share proof of this export →
          </Link>
        </Card>
      )}

      <div>
        <p className="text-sm font-medium text-[#F4F1EA] mb-2">Past exports</p>
        <Card padding="none">
          {history.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[rgba(244,241,234,0.4)]">No exports yet. Generate one above to start the history.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {history.map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <p className="text-xs text-[rgba(244,241,234,0.5)]">
                    {new Date(h.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <Link href={`/verify?id=${h.id}`} target="_blank" className="text-xs text-red-400 hover:underline shrink-0">
                    Verify →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
