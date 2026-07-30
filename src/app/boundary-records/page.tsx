"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import type { Plan, BoundaryAuthorizationRecord, BoundaryOption, BoundaryRisk, BoundaryEvidence, BoundaryFalsifier } from "@/types";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyOption(): BoundaryOption {
  return { label: "" };
}

function emptyRisk(): BoundaryRisk {
  return { risk: "", mitigation: "" };
}

function emptyEvidence(): BoundaryEvidence {
  return { label: "" };
}

function emptyFalsifier(): BoundaryFalsifier {
  return { condition: "" };
}

type AuthorityStatus = "active" | "expiring" | "expired" | "unbounded";

// The "whether" leg, derived at read time: is this grant still inside its own
// shelf life? "unbounded" only appears on records created before expiry was
// required — surfaced deliberately, because an authorization with no stated
// end is the exact exposure the record exists to prevent.
function authorityStatus(record: BoundaryAuthorizationRecord): AuthorityStatus {
  if (!record.expires_at) return "unbounded";
  const today = todayISO();
  if (record.expires_at < today) return "expired";
  const soon = new Date();
  soon.setDate(soon.getDate() + 30);
  if (record.expires_at <= soon.toISOString().slice(0, 10)) return "expiring";
  return "active";
}

const STATUS_CHIP: Record<AuthorityStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
  expiring: { label: "Expires soon", className: "bg-amber-500/15 text-amber-300 border-amber-400/30" },
  expired: { label: "Expired", className: "bg-red-500/15 text-red-300 border-red-400/30" },
  unbounded: { label: "No expiry set", className: "bg-white/10 text-[rgba(244,241,234,0.5)] border-white/15" },
};

function NewRecordForm({ onCreated }: { onCreated: (record: BoundaryAuthorizationRecord) => void }) {
  const [decision, setDecision] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerRole, setOwnerRole] = useState("");
  const [decisionDate, setDecisionDate] = useState(todayISO());
  const [expiresAt, setExpiresAt] = useState("");
  const [falsifiers, setFalsifiers] = useState<BoundaryFalsifier[]>([emptyFalsifier()]);
  const [options, setOptions] = useState<BoundaryOption[]>([emptyOption()]);
  const [risks, setRisks] = useState<BoundaryRisk[]>([emptyRisk()]);
  const [evidence, setEvidence] = useState<BoundaryEvidence[]>([emptyEvidence()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setDecision("");
    setOwnerName("");
    setOwnerRole("");
    setDecisionDate(todayISO());
    setExpiresAt("");
    setFalsifiers([emptyFalsifier()]);
    setOptions([emptyOption()]);
    setRisks([emptyRisk()]);
    setEvidence([emptyEvidence()]);
  }

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/boundary-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          owner_name: ownerName,
          owner_role: ownerRole,
          decision_date: decisionDate,
          expires_at: expiresAt,
          expiry_conditions: falsifiers,
          options_considered: options,
          risks_accepted: risks,
          evidence,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to save");
      }
      const { record } = await res.json();
      onCreated(record);
      reset();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const canSubmit = decision.trim() && ownerName.trim() && ownerRole.trim() && decisionDate.trim() && expiresAt.trim();

  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.5)] mb-4">New boundary authorization record</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Decision</label>
          <textarea
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            placeholder="What was approved e.g. Approved use of Vendor X's AI copywriting tool for marketing drafts"
            rows={2}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 resize-none focus:outline-none focus:border-white/25"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Owner name</label>
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Named owner"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Owner role</label>
            <input
              value={ownerRole}
              onChange={(e) => setOwnerRole(e.target.value)}
              placeholder="e.g. DPO, CRO, Legal Counsel"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Decision date</label>
            <input
              type="date"
              value={decisionDate}
              onChange={(e) => setDecisionDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-white/25 [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Authority expires</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={decisionDate}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-white/25 [color-scheme:dark]"
            />
          </div>
        </div>
        <p className="text-xs text-[rgba(244,241,234,0.35)] -mt-2">
          A grant needs a shelf life the same way a signature needs a name. An authorization with no expiry never stops being your risk.
        </p>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-[rgba(244,241,234,0.5)]">This authority stops being valid if…</label>
            <button
              onClick={() => setFalsifiers([...falsifiers, emptyFalsifier()])}
              className="text-xs text-[rgba(244,241,234,0.5)] hover:text-[#F4F1EA]"
            >
              + Add condition
            </button>
          </div>
          <div className="space-y-2">
            {falsifiers.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={f.condition}
                  onChange={(e) => setFalsifiers(falsifiers.map((row, j) => (j === i ? { condition: e.target.value } : row)))}
                  placeholder="Observable condition e.g. Vendor X appears on a regulator's enforcement list, or approval rates diverge by more than 10% between customer groups"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
                />
                {falsifiers.length > 1 && (
                  <button
                    onClick={() => setFalsifiers(falsifiers.filter((_, j) => j !== i))}
                    className="shrink-0 text-xs text-[rgba(244,241,234,0.4)] hover:text-red-400 px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-[rgba(244,241,234,0.35)] mt-1.5">
            Name what you would have to observe for this approval to stop being safe. The signer is approving a set of tests they could run themselves, not a description — and the condition doubles as the revocation trigger.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-[rgba(244,241,234,0.5)]">Options considered</label>
            <button
              onClick={() => setOptions([...options, emptyOption()])}
              className="text-xs text-[rgba(244,241,234,0.5)] hover:text-[#F4F1EA]"
            >
              + Add option
            </button>
          </div>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={opt.label}
                  onChange={(e) => setOptions(options.map((o, j) => (j === i ? { label: e.target.value } : o)))}
                  placeholder="Option considered e.g. Continue with manual copywriting only"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
                />
                {options.length > 1 && (
                  <button
                    onClick={() => setOptions(options.filter((_, j) => j !== i))}
                    className="shrink-0 text-xs text-[rgba(244,241,234,0.4)] hover:text-red-400 px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-[rgba(244,241,234,0.5)]">Risks accepted</label>
            <button
              onClick={() => setRisks([...risks, emptyRisk()])}
              className="text-xs text-[rgba(244,241,234,0.5)] hover:text-[#F4F1EA]"
            >
              + Add risk
            </button>
          </div>
          <div className="space-y-2">
            {risks.map((r, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={r.risk}
                  onChange={(e) => setRisks(risks.map((row, j) => (j === i ? { ...row, risk: e.target.value } : row)))}
                  placeholder="Risk accepted"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
                />
                <input
                  value={r.mitigation}
                  onChange={(e) => setRisks(risks.map((row, j) => (j === i ? { ...row, mitigation: e.target.value } : row)))}
                  placeholder="Mitigation"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
                />
                {risks.length > 1 && (
                  <button
                    onClick={() => setRisks(risks.filter((_, j) => j !== i))}
                    className="shrink-0 text-xs text-[rgba(244,241,234,0.4)] hover:text-red-400 px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-[rgba(244,241,234,0.5)]">Evidence relied on</label>
            <button
              onClick={() => setEvidence([...evidence, emptyEvidence()])}
              className="text-xs text-[rgba(244,241,234,0.5)] hover:text-[#F4F1EA]"
            >
              + Add evidence
            </button>
          </div>
          <div className="space-y-2">
            {evidence.map((ev, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={ev.label}
                  onChange={(e) => setEvidence(evidence.map((o, j) => (j === i ? { label: e.target.value } : o)))}
                  placeholder="Evidence e.g. DPIA reference DPIA-2026-014, vendor security assessment"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
                />
                {evidence.length > 1 && (
                  <button
                    onClick={() => setEvidence(evidence.filter((_, j) => j !== i))}
                    className="shrink-0 text-xs text-[rgba(244,241,234,0.4)] hover:text-red-400 px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          onClick={submit}
          disabled={saving || !canSubmit}
          className="text-sm font-semibold rounded-lg px-4 py-2 bg-[#E5484D] text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Log decision"}
        </button>
      </div>
    </Card>
  );
}

function RecordCard({ record }: { record: BoundaryAuthorizationRecord }) {
  const [expanded, setExpanded] = useState(false);
  const status = authorityStatus(record);
  const chip = STATUS_CHIP[status];

  return (
    <div className="rounded-xl border border-white/10 bg-[#102943] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-4 px-5 py-3.5 text-left"
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#F4F1EA] truncate">{record.decision}</p>
          <p className="text-xs text-[rgba(244,241,234,0.4)]">
            {record.owner_name} · {record.owner_role}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full border px-2 py-0.5 ${chip.className}`}>
            {chip.label}
          </span>
          <p className="text-xs text-[rgba(244,241,234,0.35)]">
            {new Date(record.decision_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
          <span className="text-xs text-[rgba(244,241,234,0.4)]">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/5 px-5 py-4 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Authority shelf life</p>
            {record.expires_at ? (
              <p className="text-sm text-[rgba(244,241,234,0.8)]">
                {status === "expired" ? "Expired " : "Expires "}
                {new Date(record.expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                {status === "expired" && (
                  <span className="text-red-300"> — this authorization has lapsed. Anything still acting on it is acting without valid authority.</span>
                )}
              </p>
            ) : (
              <p className="text-sm text-[rgba(244,241,234,0.5)]">
                No expiry recorded — this grant predates expiry capture. An authorization without a stated end never stops being your risk: re-log it with a shelf life.
              </p>
            )}
          </div>

          {(record.expiry_conditions ?? []).length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Stops being valid if</p>
              <ul className="space-y-1">
                {(record.expiry_conditions ?? []).map((f, i) => (
                  <li key={i} className="text-sm text-[rgba(244,241,234,0.8)]">• {f.condition}</li>
                ))}
              </ul>
            </div>
          )}
          {record.options_considered.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Options considered</p>
              <ul className="space-y-1">
                {record.options_considered.map((o, i) => (
                  <li key={i} className="text-sm text-[rgba(244,241,234,0.8)]">• {o.label}</li>
                ))}
              </ul>
            </div>
          )}

          {record.risks_accepted.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Risks accepted</p>
              <ul className="space-y-1.5">
                {record.risks_accepted.map((r, i) => (
                  <li key={i} className="text-sm">
                    <span className="text-amber-300">{r.risk}</span>
                    {r.mitigation && <span className="text-[rgba(244,241,234,0.5)]"> — mitigated by {r.mitigation}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {record.evidence.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Evidence relied on</p>
              <ul className="space-y-1">
                {record.evidence.map((e, i) => (
                  <li key={i} className="text-sm text-[rgba(244,241,234,0.8)]">• {e.label}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BoundaryRecordsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan>("free");
  const [records, setRecords] = useState<BoundaryAuthorizationRecord[]>([]);

  const isSentinel = plan === "sentinel";

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
          .from("boundary_authorization_records")
          .select("*")
          .order("decision_date", { ascending: false });
        setRecords(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  if (loading) return <div className="text-sm text-[rgba(244,241,234,0.4)] p-6">Loading…</div>;

  if (!isSentinel) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-[#F4F1EA] mb-1">Boundary Authorization Records</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)] mb-6">A structured decision log for every AI tool or system you approve — the decision, the named owner, the options weighed, the risk knowingly accepted, and the evidence it rests on. The record regulators and boards ask for when something goes wrong.</p>
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
        <h1 className="text-2xl font-bold text-[#F4F1EA]">Boundary Authorization Records</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)]">One record answers three questions: who approved it, when they approved it, and whether their authority was still valid when it mattered. Decision, named owner, evidence, and now a shelf life — the expiry date and the observable conditions that void the grant.</p>
      </div>

      <NewRecordForm onCreated={(record) => setRecords((prev) => [record, ...prev])} />

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.5)] mb-3">Recorded decisions</p>
        {records.length === 0 ? (
          <Card padding="none">
            <div className="px-5 py-10 text-center">
              <p className="text-[rgba(244,241,234,0.4)]">No boundary records yet. Log your first AI tool or system approval above.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
