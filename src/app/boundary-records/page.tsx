"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import type { Plan, BoundaryAuthorizationRecord, BoundaryOption, BoundaryRisk, BoundaryEvidence, BoundaryFalsifier, AuthorityMode } from "@/types";

// The authority spectrum, plainly worded. The distinction that matters most
// is between the second and the third: whether a human clears each instance,
// or whether the system was given the decision outright.
const AUTHORITY_MODE_LABELS: Record<AuthorityMode, string> = {
  human_decides: "A human decides",
  ai_recommends: "AI recommends, a human approves",
  ai_decides: "AI decides outright",
};

const AUTHORITY_MODE_HINTS: Record<AuthorityMode, string> = {
  human_decides: "The system drafts or assists. Every decision is made by a person.",
  ai_recommends: "The system proposes. Nothing takes effect until someone clears it.",
  ai_decides: "The system acts without anyone clearing each instance. Authority was delegated.",
};

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

function RequiredByConfirmation({ record }: { record: BoundaryAuthorizationRecord }) {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (record.required_by_confirmed_at) {
    return (
      <p className="text-xs text-emerald-300">
        ✓ Confirmed by {record.required_by_confirmed_name} on{" "}
        {new Date(record.required_by_confirmed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        {" "}— in their own words, not this account&apos;s claim about them.
      </p>
    );
  }

  async function requestLink() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/boundary-records/${record.id}/request-confirmation`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create the link.");
        return;
      }
      setLink(data.confirm_url);
    } catch {
      setError("Could not create the link.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — link is selectable regardless
    }
  }

  if (link) {
    return (
      <div className="mt-1">
        <p className="text-xs text-[rgba(244,241,234,0.5)] mb-1">
          Send this to {record.required_by_name || "them"} yourself, only they can confirm it:
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <code className="text-xs bg-black/30 border border-white/10 rounded px-2 py-1 text-[#C9A66B] break-all">{link}</code>
          <button onClick={copy} className="text-xs px-2 py-1 rounded border border-white/15 text-[rgba(244,241,234,0.7)] hover:bg-white/5">
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-1">
      <button
        onClick={requestLink}
        disabled={loading}
        className="text-xs px-2.5 py-1 rounded border border-white/15 text-[rgba(244,241,234,0.7)] hover:bg-white/5 disabled:opacity-50"
      >
        {loading ? "Creating link…" : "Get a confirmation link to send them"}
      </button>
      {error && <p className="text-xs text-red-300 mt-1">{error}</p>}
    </div>
  );
}

function NewRecordForm({ onCreated, existingRecords }: { onCreated: (record: BoundaryAuthorizationRecord) => void; existingRecords: BoundaryAuthorizationRecord[] }) {
  const [decision, setDecision] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerRole, setOwnerRole] = useState("");
  const [continuityOwnerName, setContinuityOwnerName] = useState("");
  const [continuityOwnerRole, setContinuityOwnerRole] = useState("");
  const [continuityOwnerEmail, setContinuityOwnerEmail] = useState("");
  const [requiredByName, setRequiredByName] = useState("");
  const [requiredByOrganisation, setRequiredByOrganisation] = useState("");
  const [completionCondition, setCompletionCondition] = useState("");
  const [stopAuthorityName, setStopAuthorityName] = useState("");
  const [stopAuthorityRole, setStopAuthorityRole] = useState("");
  const [defendAuthorityName, setDefendAuthorityName] = useState("");
  const [defendAuthorityRole, setDefendAuthorityRole] = useState("");
  const [escalationCeiling, setEscalationCeiling] = useState("");
  const [decisionDate, setDecisionDate] = useState(todayISO());
  const [expiresAt, setExpiresAt] = useState("");
  const [supersedesId, setSupersedesId] = useState("");
  const [grantType, setGrantType] = useState<"decision" | "credential">("decision");
  const [credentialReference, setCredentialReference] = useState("");
  const [apiKeyId, setApiKeyId] = useState("");
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key_prefix: string }[]>([]);

  useEffect(() => {
    fetch("/api/keys")
      .then((r) => (r.ok ? r.json() : []))
      .then((keys) => setApiKeys(Array.isArray(keys) ? keys : []))
      .catch(() => {});
  }, []);
  const [authorityMode, setAuthorityMode] = useState<AuthorityMode | "">("");
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
    setContinuityOwnerName("");
    setContinuityOwnerRole("");
    setContinuityOwnerEmail("");
    setRequiredByName("");
    setRequiredByOrganisation("");
    setCompletionCondition("");
    setStopAuthorityName("");
    setStopAuthorityRole("");
    setDefendAuthorityName("");
    setDefendAuthorityRole("");
    setEscalationCeiling("");
    setDecisionDate(todayISO());
    setExpiresAt("");
    setSupersedesId("");
    setGrantType("decision");
    setCredentialReference("");
    setApiKeyId("");
    setAuthorityMode("");
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
          continuity_owner_name: continuityOwnerName || null,
          continuity_owner_role: continuityOwnerRole || null,
          continuity_owner_email: continuityOwnerEmail || null,
          required_by_name: requiredByName || null,
          required_by_organisation: requiredByOrganisation || null,
          completion_condition: completionCondition || null,
          stop_authority_name: stopAuthorityName || null,
          stop_authority_role: stopAuthorityRole || null,
          defend_authority_name: defendAuthorityName || null,
          defend_authority_role: defendAuthorityRole || null,
          escalation_ceiling: escalationCeiling || null,
          decision_date: decisionDate,
          expires_at: expiresAt,
          expiry_conditions: falsifiers,
          options_considered: options,
          risks_accepted: risks,
          evidence,
          supersedes_id: supersedesId || null,
          grant_type: grantType,
          credential_reference: credentialReference || null,
          api_key_id: apiKeyId || null,
          authority_mode: authorityMode || null,
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
          <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">What is being authorized</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setGrantType("decision")}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${grantType === "decision" ? "border-[#E5484D] bg-[rgba(229,72,77,0.12)] text-[#F4F1EA]" : "border-white/10 bg-white/5 text-[rgba(244,241,234,0.5)]"}`}
            >
              An AI system or decision
            </button>
            <button
              type="button"
              onClick={() => setGrantType("credential")}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${grantType === "credential" ? "border-[#E5484D] bg-[rgba(229,72,77,0.12)] text-[#F4F1EA]" : "border-white/10 bg-white/5 text-[rgba(244,241,234,0.5)]"}`}
            >
              An API key or agent credential
            </button>
          </div>
        </div>

        {grantType === "credential" && (
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Which credential</label>
            <input
              value={credentialReference}
              onChange={(e) => setCredentialReference(e.target.value)}
              placeholder="A key name or last four characters — never the secret itself"
              maxLength={60}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
            <p className="text-xs text-[rgba(244,241,234,0.35)] mt-1">A credential is a standing grant of authority the same way a decision is. Record who authorized it and when it expires, never paste the actual key.</p>

            {apiKeys.length > 0 && (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Link the actual Red Flag API key (optional)</label>
                <select
                  value={apiKeyId}
                  onChange={(e) => setApiKeyId(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-white/25"
                >
                  <option value="">Not linked — description only</option>
                  {apiKeys.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name} ({k.key_prefix})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[rgba(244,241,234,0.35)] mt-1">
                  Linking seals a fingerprint of the key&apos;s approved permissions into this record. If the key&apos;s live permissions ever stop matching what was approved here, the record flags itself as drifted automatically — you don&apos;t have to notice.
                </p>
              </div>
            )}
          </div>
        )}

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

        <div>
          <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Where authority sits</label>
          <div className="space-y-1.5">
            {(Object.keys(AUTHORITY_MODE_LABELS) as AuthorityMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setAuthorityMode(authorityMode === m ? "" : m)}
                className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                  authorityMode === m
                    ? "border-[#E5484D] bg-[rgba(229,72,77,0.12)]"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }`}
              >
                <span className={`block text-sm font-semibold ${authorityMode === m ? "text-[#F4F1EA]" : "text-[rgba(244,241,234,0.6)]"}`}>
                  {AUTHORITY_MODE_LABELS[m]}
                </span>
                <span className="block text-xs text-[rgba(244,241,234,0.4)] mt-0.5">{AUTHORITY_MODE_HINTS[m]}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-[rgba(244,241,234,0.35)] mt-1.5">
            Left unstated, this record cannot answer the question a board asks first. Records without it are marked incomplete.
          </p>
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
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Continuity owner name (optional)</label>
            <input
              value={continuityOwnerName}
              onChange={(e) => setContinuityOwnerName(e.target.value)}
              placeholder="Who arranges renewal or cover"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Continuity owner role (optional)</label>
            <input
              value={continuityOwnerRole}
              onChange={(e) => setContinuityOwnerRole(e.target.value)}
              placeholder="e.g. Line manager, Ops lead"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Continuity owner email (optional)</label>
          <input
            type="email"
            value={continuityOwnerEmail}
            onChange={(e) => setContinuityOwnerEmail(e.target.value)}
            placeholder="Where the renewal reminder goes, if different from your own login"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
          />
        </div>
        <p className="text-xs text-[rgba(244,241,234,0.35)] -mt-2">
          Distinct from the owner above: this is whoever holds the duty to renew this or arrange a successor before it lapses. A lapse only proves the seat went empty — naming this means the lapse event can say who was on the hook for it going empty, not leave that as an inference. Red Flag emails a renewal reminder at 30, 14, 7 and 1 day before expiry, to this address if given, otherwise to your account email — so the decision to revisit gets put in front of someone, not left to depend on whether they remembered to ask.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Required by (optional)</label>
            <input
              value={requiredByName}
              onChange={(e) => setRequiredByName(e.target.value)}
              placeholder="A named person, if anyone outside required this"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Their organisation (optional)</label>
            <input
              value={requiredByOrganisation}
              onChange={(e) => setRequiredByOrganisation(e.target.value)}
              placeholder="e.g. a lender, an insurer, the board"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
        </div>
        <p className="text-xs text-[rgba(244,241,234,0.35)] -mt-2">
          Who, if anyone, actually required this boundary to exist, not who wrote it down. Leave blank if this was your own decision, nobody outside required it. A boundary nobody outside required is a real limit, but it is a volunteered one, not a condition somebody else is holding you to.
        </p>

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

        {existingRecords.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Supersedes an earlier record (optional)</label>
            <select
              value={supersedesId}
              onChange={(e) => setSupersedesId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-white/25 [color-scheme:dark]"
            >
              <option value="">No, this is a new, unrelated authorization</option>
              {existingRecords.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.decision.slice(0, 60)} — {r.owner_name} ({r.owner_role})
                </option>
              ))}
            </select>
            <p className="text-xs text-[rgba(244,241,234,0.35)] mt-1">
              If the role holder changed and this record replaces one already logged, link it here — the chain of custody for the mandate gets sealed as part of this record, not left implicit.
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">This is complete when… (optional)</label>
          <input
            value={completionCondition}
            onChange={(e) => setCompletionCondition(e.target.value)}
            placeholder="What success looks like, e.g. the migration finishes and the old system is decommissioned"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
          />
          <p className="text-xs text-[rgba(244,241,234,0.35)] mt-1">
            The conditions below name how this stops. This names what it looks like to actually succeed — a different fact, not the same one stated twice.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Stop authority name (optional)</label>
            <input
              value={stopAuthorityName}
              onChange={(e) => setStopAuthorityName(e.target.value)}
              placeholder="Who can halt this, not the owner"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Stop authority role (optional)</label>
            <input
              value={stopAuthorityRole}
              onChange={(e) => setStopAuthorityRole(e.target.value)}
              placeholder="e.g. Risk Committee Chair"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
        </div>
        <p className="text-xs text-[rgba(244,241,234,0.35)] -mt-2">
          Who has standing to halt this before its natural expiry without asking permission from whoever depends on the timeline — distinct from the owner (who approved it) and the continuity owner (whose job is renewal). Often nobody distinct exists to name, which is itself an honest answer, not a gap to fake.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Defend authority name (optional)</label>
            <input
              value={defendAuthorityName}
              onChange={(e) => setDefendAuthorityName(e.target.value)}
              placeholder="Who must justify this if challenged"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Defend authority role (optional)</label>
            <input
              value={defendAuthorityRole}
              onChange={(e) => setDefendAuthorityRole(e.target.value)}
              placeholder="e.g. General Counsel"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>
        </div>
        <p className="text-xs text-[rgba(244,241,234,0.35)] -mt-2">
          Who is obligated to justify this decision to a regulator, board, or court if it's disputed — a distinct duty from approving it or halting it.
        </p>

        <div>
          <label className="block text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-1">Escalation ceiling (optional)</label>
          <input
            value={escalationCeiling}
            onChange={(e) => setEscalationCeiling(e.target.value)}
            placeholder="Where this stops escalating, e.g. the Board"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F1EA] placeholder-white/25 focus:outline-none focus:border-white/25"
          />
          <p className="text-xs text-[rgba(244,241,234,0.35)] mt-1">
            An explicit statement of where the buck stops in a dispute — different from the delegation chain, which shows who delegated to whom, not where it ultimately ends.
          </p>
        </div>

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
          {supersedesId && (() => {
            const prior = existingRecords.find((r) => r.id === supersedesId);
            const priorConditions = (prior?.expiry_conditions ?? []).filter((c) => c.condition.trim());
            if (priorConditions.length === 0) return null;
            return (
              <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <p className="text-xs text-[rgba(244,241,234,0.4)] mb-1">Conditions on the record this supersedes — at least one below must be genuinely reconsidered, not retyped the same:</p>
                <ul className="text-xs text-[rgba(244,241,234,0.5)] space-y-0.5">
                  {priorConditions.map((c, i) => (
                    <li key={i}>· {c.condition}</li>
                  ))}
                </ul>
              </div>
            );
          })()}
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

function RecordCard({ record, supersededRecord, lapseSealed, authorEmail, onUpdated }: { record: BoundaryAuthorizationRecord; supersededRecord: BoundaryAuthorizationRecord | null; lapseSealed: boolean; authorEmail: string | null; onUpdated: (record: BoundaryAuthorizationRecord) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [triggeringIndex, setTriggeringIndex] = useState<number | null>(null);

  async function triggerFalsifier(index: number) {
    setTriggeringIndex(index);
    try {
      const res = await fetch(`/api/boundary-records/${record.id}/trigger-falsifier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      if (res.ok) {
        const { record: updated } = await res.json();
        onUpdated(updated);
      }
    } finally {
      setTriggeringIndex(null);
    }
  }
  const status = authorityStatus(record);
  const chip = STATUS_CHIP[status];
  // Fail-closed on completeness: a record with no continuity owner or no
  // falsifier conditions still gets created, but it should never look the
  // same as one that actually has both. Incomplete stays visibly incomplete.
  const isIncomplete =
    !record.continuity_owner_name ||
    !record.expiry_conditions ||
    record.expiry_conditions.length === 0 ||
    !record.authority_mode;

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
          {record.grant_type === "credential" && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider rounded-full border border-sky-500/40 bg-sky-900/30 text-sky-300 px-2 py-0.5"
              title={record.credential_reference ? `Credential: ${record.credential_reference}` : "API key / agent credential grant"}
            >
              Credential
            </span>
          )}
          {record.fingerprint_intact === false && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider rounded-full border border-red-500/40 bg-red-900/30 text-red-300 px-2 py-0.5"
              title="The linked API key's live permissions no longer match the fingerprint sealed when this was approved. The scope changed and nobody re-approved it."
            >
              Drifted
            </span>
          )}
          {record.fingerprint_intact === true && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/40 bg-emerald-900/30 text-emerald-300 px-2 py-0.5"
              title="The linked API key's live permissions still match the fingerprint sealed at approval — checked on every load, not a stored flag."
            >
              Scope intact
            </span>
          )}
          {isIncomplete && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-500/40 bg-amber-900/30 text-amber-300 px-2 py-0.5"
              title="Missing a continuity owner, expiry conditions, or a stated authority mode — the record was sealed as incomplete, not fixed automatically"
            >
              Incomplete
            </span>
          )}
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
            <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Where authority sits</p>
            {record.authority_mode ? (
              <p className="text-sm text-[rgba(244,241,234,0.8)]">
                {AUTHORITY_MODE_LABELS[record.authority_mode]}
                <span className="text-[rgba(244,241,234,0.45)]"> — {AUTHORITY_MODE_HINTS[record.authority_mode]}</span>
              </p>
            ) : (
              <p className="text-sm text-[rgba(244,241,234,0.5)]">
                Never stated. Nobody can tell from this record whether a human was required before this system acted.
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Authority shelf life</p>
            {record.expires_at ? (
              <>
                <p className="text-sm text-[rgba(244,241,234,0.8)]">
                  {status === "expired" ? "Expired " : "Expires "}
                  {new Date(record.expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  {status === "expired" && (
                    <span className="text-red-300"> — this authorization has lapsed. Anything still acting on it is acting without valid authority.</span>
                  )}
                </p>
                {status === "expired" && (
                  <p className="text-xs mt-1">
                    {lapseSealed ? (
                      <span className="text-emerald-300">
                        ✓ Lapse sealed — the gap in coverage is its own recorded fact, not just something reconstructed later.
                        {record.continuity_owner_name && (
                          <> Cover was {record.continuity_owner_name}&apos;s responsibility.</>
                        )}
                      </span>
                    ) : (
                      <span className="text-amber-300">Lapse not yet sealed — the daily check hasn't run since this expired.</span>
                    )}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-[rgba(244,241,234,0.5)]">
                No expiry recorded — this grant predates expiry capture. An authorization without a stated end never stops being your risk: re-log it with a shelf life.
              </p>
            )}
          </div>

          {record.performance && record.performance.total > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">What this has actually governed</p>
              <p className="text-sm text-[rgba(244,241,234,0.8)]">
                Governed {record.performance.total} Real Time Gate decision{record.performance.total === 1 ? "" : "s"} since approval.
                {" "}{record.performance.blocked} blocked ({Math.round(record.performance.block_rate * 100)}%).
                {record.performance.trend === "up" && (
                  <span className="text-amber-300"> Block rate rising over the record&apos;s life — worth a look before renewing on elapsed time alone.</span>
                )}
                {record.performance.trend === "down" && (
                  <span className="text-emerald-300"> Block rate falling over the record&apos;s life.</span>
                )}
                {record.performance.trend === "flat" && (
                  <span> Block rate steady over the record&apos;s life.</span>
                )}
                {record.performance.trend === null && (
                  <span className="text-[rgba(244,241,234,0.5)]"> Not enough decisions yet to show a trend.</span>
                )}
              </p>
            </div>
          )}

          {record.firing_rate_declined && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400/70 mb-1.5">Falsifier firing rate declined at renewal</p>
              <p className="text-sm text-[rgba(244,241,234,0.8)]">
                {record.firing_rate_declined.previous_rate.toFixed(1)}/yr in the record this superseded, {record.firing_rate_declined.current_rate.toFixed(1)}/yr in this one.
                <span className="text-amber-300"> Either a genuinely quieter period, or the condition was loosened at renewal. Worth checking which.</span>
              </p>
            </div>
          )}

          {record.continuity_owner_name && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Continuity owner</p>
              <p className="text-sm text-[rgba(244,241,234,0.8)]">
                {record.continuity_owner_name}{record.continuity_owner_role ? ` (${record.continuity_owner_role})` : ""} — responsible for renewal or arranging cover before this lapses.
              </p>
            </div>
          )}

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Who required this</p>
            {record.required_by_name || record.required_by_organisation ? (
              <div>
                <p className="text-sm text-[rgba(244,241,234,0.8)] mb-1">
                  {record.required_by_name}
                  {record.required_by_name && record.required_by_organisation ? ", " : ""}
                  {record.required_by_organisation}
                  {" "}— a real condition someone outside is holding this account to.
                </p>
                <RequiredByConfirmation record={record} />
              </div>
            ) : (
              <p className="text-sm text-[rgba(244,241,234,0.5)]">
                Self imposed — nobody outside required this. A real limit, but a volunteered one, not a condition.
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Authorship</p>
            <p className="text-sm text-[rgba(244,241,234,0.8)]">
              Named owner is asserted: {record.owner_name} ({record.owner_role}).
              {authorEmail && (
                <> Recorded under the authenticated account <span className="text-[#C9A66B]">{authorEmail}</span> — the session identity is bound to this record, not just the typed name.</>
              )}
            </p>
          </div>

          {supersededRecord && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Supersedes</p>
              <p className="text-sm text-[rgba(244,241,234,0.8)]">
                {supersededRecord.decision.slice(0, 80)} — {supersededRecord.owner_name} ({supersededRecord.owner_role})
              </p>
            </div>
          )}

          {record.completion_condition && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Complete when</p>
              <p className="text-sm text-[rgba(244,241,234,0.8)]">{record.completion_condition}</p>
            </div>
          )}

          {(record.stop_authority_name || record.defend_authority_name || record.escalation_ceiling) && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Stop, defend, escalate</p>
              <div className="space-y-1">
                {record.stop_authority_name && (
                  <p className="text-sm text-[rgba(244,241,234,0.8)]">
                    Can halt: {record.stop_authority_name}{record.stop_authority_role ? ` (${record.stop_authority_role})` : ""}
                  </p>
                )}
                {record.defend_authority_name && (
                  <p className="text-sm text-[rgba(244,241,234,0.8)]">
                    Must defend: {record.defend_authority_name}{record.defend_authority_role ? ` (${record.defend_authority_role})` : ""}
                  </p>
                )}
                {record.escalation_ceiling && (
                  <p className="text-sm text-[rgba(244,241,234,0.8)]">Escalation ends: {record.escalation_ceiling}</p>
                )}
              </div>
            </div>
          )}

          {(record.expiry_conditions ?? []).length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.4)] mb-1.5">Stops being valid if</p>
              <ul className="space-y-1.5">
                {(record.expiry_conditions ?? []).map((f, i) => (
                  <li key={i} className="text-sm">
                    {f.triggered_at ? (
                      <span className="text-amber-300">
                        • {f.condition} — <span className="font-semibold">observed {new Date(f.triggered_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, pulled the expiry forward.</span>
                      </span>
                    ) : (
                      <span className="text-[rgba(244,241,234,0.8)] flex items-center gap-2 flex-wrap">
                        • {f.condition}
                        <button
                          onClick={() => triggerFalsifier(i)}
                          disabled={triggeringIndex === i}
                          className="text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-500/40 bg-amber-900/20 text-amber-300 px-2 py-0.5 hover:bg-amber-900/40 transition-colors disabled:opacity-50"
                          title="This did not require anyone's approval to set — anyone who has noticed it become true can say so."
                        >
                          {triggeringIndex === i ? "Recording…" : "This happened"}
                        </button>
                      </span>
                    )}
                  </li>
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

function AuthorityHealth({ records }: { records: BoundaryAuthorizationRecord[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const total = records.length;
  const unbounded = records.filter(
    (r) => !r.expires_at && (r.expiry_conditions?.length ?? 0) === 0
  ).length;
  const expired = records.filter(
    (r) => r.expires_at && r.expires_at < today
  ).length;

  const pct = (n: number) => Math.round((n / total) * 100);

  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.5)] mb-3">Authority health</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-2xl font-bold text-[#F4F1EA]">{total}</p>
          <p className="text-xs text-[rgba(244,241,234,0.5)]">Recorded decisions</p>
        </div>
        <div>
          <p className={`text-2xl font-bold ${unbounded > 0 ? "text-[#E5484D]" : "text-emerald-400"}`}>
            {unbounded} <span className="text-sm font-semibold">({pct(unbounded)}%)</span>
          </p>
          <p className="text-xs text-[rgba(244,241,234,0.5)]">Unbounded grants, no expiry and no voiding conditions. An open ended grant is authority nobody can prove was ever reviewed.</p>
        </div>
        <div>
          <p className={`text-2xl font-bold ${expired > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {expired} <span className="text-sm font-semibold">({pct(expired)}%)</span>
          </p>
          <p className="text-xs text-[rgba(244,241,234,0.5)]">Running past their own stated expiry. The authority behind these decisions has lapsed and nobody has renewed it.</p>
        </div>
      </div>
    </Card>
  );
}

// The decision authority map: one view above the individual records showing
// where authority actually sits across everything authorized. AuthorityHealth
// answers "is this grant still valid" (the when/whether legs). This answers
// the who leg — how much has been handed over, and how much was never stated.
function DecisionAuthorityMap({ records }: { records: BoundaryAuthorizationRecord[] }) {
  const total = records.length;
  const counts: Record<AuthorityMode | "unstated", number> = {
    human_decides: 0,
    ai_recommends: 0,
    ai_decides: 0,
    unstated: 0,
  };
  for (const r of records) {
    counts[r.authority_mode ?? "unstated"] += 1;
  }

  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const rows: { key: AuthorityMode | "unstated"; label: string; bar: string; text: string }[] = [
    { key: "human_decides", label: AUTHORITY_MODE_LABELS.human_decides, bar: "bg-emerald-400", text: "text-emerald-400" },
    { key: "ai_recommends", label: AUTHORITY_MODE_LABELS.ai_recommends, bar: "bg-[#C9A66B]", text: "text-[#C9A66B]" },
    { key: "ai_decides", label: AUTHORITY_MODE_LABELS.ai_decides, bar: "bg-[#E5484D]", text: "text-[#E5484D]" },
    { key: "unstated", label: "Never stated", bar: "bg-white/25", text: "text-[rgba(244,241,234,0.5)]" },
  ];

  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-wider text-[rgba(244,241,234,0.5)] mb-1">Decision authority map</p>
      <p className="text-xs text-[rgba(244,241,234,0.45)] mb-4">
        Across every system you have authorized, who actually makes the call.
      </p>

      <div className="space-y-3">
        {rows.map((row) => {
          const n = counts[row.key];
          return (
            <div key={row.key}>
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <span className="text-sm text-[rgba(244,241,234,0.75)]">{row.label}</span>
                <span className={`text-sm font-bold shrink-0 ${row.text}`}>
                  {n} <span className="text-xs font-semibold">({pct(n)}%)</span>
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full ${row.bar}`} style={{ width: `${pct(n)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {(counts.ai_decides > 0 || counts.unstated > 0) && (
        <div className="mt-4 border-t border-white/10 pt-3 space-y-1.5">
          {counts.ai_decides > 0 && (
            <p className="text-xs text-[rgba(244,241,234,0.6)]">
              <span className="text-[#E5484D] font-semibold">{counts.ai_decides}</span>{" "}
              {counts.ai_decides === 1 ? "system has" : "systems have"} the decision outright. That is not a fault, it is a position, and it is the one a board will ask you to justify by name.
            </p>
          )}
          {counts.unstated > 0 && (
            <p className="text-xs text-[rgba(244,241,234,0.6)]">
              <span className="font-semibold text-[rgba(244,241,234,0.85)]">{counts.unstated}</span>{" "}
              {counts.unstated === 1 ? "record does not say" : "records do not say"} where authority sits. Until that is stated, nobody can tell from the record whether a human was ever required.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

export default function BoundaryRecordsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan>("free");
  const [records, setRecords] = useState<BoundaryAuthorizationRecord[]>([]);
  const [lapsedRecordIds, setLapsedRecordIds] = useState<Set<string>>(new Set());
  const [authorEmail, setAuthorEmail] = useState<string | null>(null);

  const isSentinel = plan === "sentinel";

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setAuthorEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("user_id", user.id)
        .single();
      setPlan((profile?.plan as Plan) ?? "free");

      const { data } = await supabase
        .from("boundary_authorization_records")
        .select("*")
        .order("decision_date", { ascending: false });
      setRecords(data ?? []);

      // Which expired records already have their lapse sealed as its own
      // event (see the boundary-lapse-check cron), rather than left as
      // something only inferable from the expiry date itself.
      const { data: lapseEvents } = await supabase
        .from("audit_log")
        .select("details")
        .eq("user_id", user.id)
        .eq("action", "boundary_record.lapsed");
      const ids = new Set<string>(
        (lapseEvents ?? [])
          .map((e) => (e.details as { record_id?: string })?.record_id)
          .filter((id): id is string => typeof id === "string")
      );
      setLapsedRecordIds(ids);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  const recordsById = new Map(records.map((r) => [r.id, r]));

  if (loading) return <div className="text-sm text-[rgba(244,241,234,0.4)] p-6">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F4F1EA]">Boundary Authorization Records</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)]">One record answers three questions: who approved it, when they approved it, and whether their authority was still valid when it mattered. Decision, named owner, evidence, and now a shelf life — the expiry date and the observable conditions that void the grant.</p>
      </div>

      {isSentinel ? (
        <NewRecordForm onCreated={(record) => setRecords((prev) => [record, ...prev])} existingRecords={records} />
      ) : (
        <Card>
          <p className="text-sm text-[#F4F1EA] mb-3">Viewing is available on every plan. Creating and editing records is a Sentinel feature.</p>
          <Link href="/sentinel" className="inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
            Explore Sentinel →
          </Link>
        </Card>
      )}

      {records.length > 0 && <AuthorityHealth records={records} />}

      {records.length > 0 && <DecisionAuthorityMap records={records} />}

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
              <RecordCard
                key={r.id}
                record={r}
                supersededRecord={r.supersedes_id ? recordsById.get(r.supersedes_id) ?? null : null}
                lapseSealed={lapsedRecordIds.has(r.id)}
                authorEmail={authorEmail}
                onUpdated={(updated) => setRecords((prev) => prev.map((rec) => (rec.id === updated.id ? updated : rec)))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
