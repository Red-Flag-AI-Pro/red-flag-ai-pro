"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Organisation {
  id: string;
  name: string;
  invite_code: string;
  owner_id: string;
}

interface Member {
  user_id: string;
  full_name: string | null;
  created_at: string;
}

interface JoinRequest {
  id: string;
  user_id: string;
  full_name: string | null;
  requested_at: string;
}

interface Props {
  org: Organisation | null;
  members: Member[];
  isOwner: boolean;
  userId: string;
}

export function TeamManager({ org, members, isOwner, userId }: Props) {
  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [decidingId, setDecidingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOwner || !org) return;
    fetch("/api/team/requests")
      .then((r) => r.json())
      .then((data) => setRequests(data.requests ?? []))
      .catch(() => {});
  }, [isOwner, org]);

  async function decide(requestId: string, approve: boolean) {
    setDecidingId(requestId);
    const res = await fetch("/api/team/requests/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId, approve }),
    });
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      if (approve) setTimeout(() => window.location.reload(), 800);
    }
    setDecidingId(null);
  }

  async function handleCreate() {
    if (!orgName.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/team/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: orgName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setSuccess("Organisation created. Refresh to see your invite code.");
      setTimeout(() => window.location.reload(), 1500);
    }
    setLoading(false);
  }

  async function handleJoin() {
    if (!inviteCode.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/team/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invite_code: inviteCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setSuccess(`Request sent to join ${data.organisation.name}. The organisation admin needs to approve it before you get access.`);
      setInviteCode("");
    }
    setLoading(false);
  }

  function copyInviteCode() {
    if (!org?.invite_code) return;
    navigator.clipboard.writeText(org.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // No org yet - show create or join
  if (!org) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold text-[#F4F1EA] mb-1">Create your organisation</h2>
          <p className="text-xs text-[rgba(244,241,234,0.5)] mb-4">
            Set up a team for your agency. You will get an invite code to share with your team.
          </p>
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="e.g. Loom Digital"
            className="w-full rounded-lg border border-white/15 bg-[#0A1628] px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] mb-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          {error && <p className="text-xs text-[#E5484D] mb-3">{error}</p>}
          {success && <p className="text-xs text-green-400 mb-3">{success}</p>}
          <Button size="sm" loading={loading} onClick={handleCreate} disabled={!orgName.trim()}>
            Create organisation
          </Button>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-[#F4F1EA] mb-1">Join an organisation</h2>
          <p className="text-xs text-[rgba(244,241,234,0.5)] mb-4">
            Have an invite code from your team admin? Enter it here.
          </p>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="e.g. A1B2C3D4"
            className="w-full rounded-lg border border-white/15 bg-[#0A1628] px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] font-mono mb-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          {error && <p className="text-xs text-[#E5484D] mb-3">{error}</p>}
          {success && <p className="text-xs text-green-400 mb-3">{success}</p>}
          <Button size="sm" variant="secondary" loading={loading} onClick={handleJoin} disabled={!inviteCode.trim()}>
            Request to join
          </Button>
        </Card>
      </div>
    );
  }

  // Has org - show management
  return (
    <div className="space-y-4">
      {isOwner && (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[#F4F1EA]">{org.name}</h2>
              <p className="text-xs text-[rgba(244,241,234,0.5)] mt-0.5">Share this invite code with your team members</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-lg border border-white/10 bg-[#0A1628] px-4 py-2 text-lg font-mono font-bold tracking-widest text-[#F4F1EA]">
                  {org.invite_code}
                </span>
                <Button size="sm" variant="secondary" onClick={copyInviteCode}>
                  {copied ? "Copied!" : "Copy code"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {isOwner && requests.length > 0 && (
        <Card padding="none">
          <div className="border-b border-white/5 px-5 py-4">
            <h2 className="text-sm font-semibold text-[#F4F1EA]">
              Pending requests ({requests.length})
            </h2>
            <p className="text-xs text-[rgba(244,241,234,0.5)] mt-0.5">
              Someone used your invite code. Nothing shares until you approve.
            </p>
          </div>
          <ul className="divide-y divide-white/10">
            {requests.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-5 py-3.5 gap-3">
                <div>
                  <p className="text-sm font-medium text-[#F4F1EA]">{r.full_name || "Someone"}</p>
                  <p className="text-xs text-[rgba(244,241,234,0.4)]">
                    Requested {new Date(r.requested_at).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" loading={decidingId === r.id} onClick={() => decide(r.id, true)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="secondary" loading={decidingId === r.id} onClick={() => decide(r.id, false)}>
                    Deny
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card padding="none">
        <div className="border-b border-white/5 px-5 py-4">
          <h2 className="text-sm font-semibold text-[#F4F1EA]">
            Team members ({members.length})
          </h2>
        </div>
        {members.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[rgba(244,241,234,0.4)]">
            No members yet. Share the invite code to add your team.
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {members.map((m) => (
              <li key={m.user_id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-[#F4F1EA]">
                    {m.full_name || "Team member"}
                    {m.user_id === userId && (
                      <span className="ml-2 text-xs text-[rgba(244,241,234,0.4)]">(you)</span>
                    )}
                    {m.user_id === org.owner_id && (
                      <span className="ml-2 text-xs text-[#E5484D] font-semibold">Admin</span>
                    )}
                  </p>
                  <p className="text-xs text-[rgba(244,241,234,0.4)]">
                    Joined {new Date(m.created_at).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
