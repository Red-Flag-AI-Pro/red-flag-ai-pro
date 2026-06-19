"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreTrend } from "@/components/ui/ScoreTrend";
import type { Plan } from "@/types";

interface MonitoredUrl {
  id: string;
  url: string;
  label: string | null;
  last_scanned_at: string | null;
  last_score: number | null;
  last_scan_id: string | null;
  created_at: string;
}

interface Props {
  initialUrls: MonitoredUrl[];
  plan: Plan;
}

function scoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-[#E5484D]";
}

function scoreBg(score: number) {
  if (score >= 70) return "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)]";
  if (score >= 40) return "bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]";
  return "bg-[rgba(229,72,77,0.1)] border-[rgba(229,72,77,0.3)]";
}

export function MonitorManager({ initialUrls, plan }: Props) {
  const [urls, setUrls] = useState<MonitoredUrl[]>(initialUrls);
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState<string | null>(null);

  const limit = plan === "sentinel" ? Infinity : 5;
  const atLimit = limit !== Infinity && urls.length >= limit;

  async function handleAdd() {
    if (!newUrl.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/monitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: newUrl.trim(), label: newLabel.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setUrls((prev) => [data, ...prev]);
      setNewUrl("");
      setNewLabel("");
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await fetch("/api/monitor", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setUrls((prev) => prev.filter((u) => u.id !== id));
  }

  async function handleScanNow(monitored: MonitoredUrl) {
    setScanning(monitored.id);
    const res = await fetch("/api/scans/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: monitored.url }),
    });
    const data = await res.json();
    if (res.ok && data.id) {
      // Update the last_score locally
      setUrls((prev) =>
        prev.map((u) =>
          u.id === monitored.id
            ? { ...u, last_scanned_at: new Date().toISOString(), last_score: data.score ?? u.last_score, last_scan_id: data.id }
            : u
        )
      );
      window.location.href = `/scans/${data.id}`;
    }
    setScanning(null);
  }

  return (
    <div className="space-y-4">
      {/* Add URL form */}
      {!atLimit && (
        <Card>
          <h2 className="text-sm font-semibold text-[#F4F1EA] mb-3">Add a URL to monitor</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Label (e.g. Client homepage)"
              className="rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] w-full sm:w-48 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/sales"
              className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button size="sm" loading={loading} onClick={handleAdd} disabled={!newUrl.trim()}>
              Add URL
            </Button>
          </div>
          {error && <p className="mt-2 text-xs text-[#E5484D]">{error}</p>}
          <p className="mt-2 text-xs text-[rgba(244,241,234,0.4)]">
            Pages are automatically rescanned every Monday morning. Results appear in Scan History.
          </p>
        </Card>
      )}

      {atLimit && (
        <div className="rounded-xl border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.1)] px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-amber-300">
            You have reached the 5 URL limit on Growth. Upgrade to Sentinel for unlimited monitoring.
          </p>
          <Link href="/sentinel" className="shrink-0 text-sm font-semibold text-[#E5484D] hover:underline">
            Upgrade →
          </Link>
        </div>
      )}

      {/* URL list */}
      {urls.length === 0 ? (
        <Card>
          <div className="py-8 text-center text-sm text-[rgba(244,241,234,0.4)]">
            <p className="text-3xl mb-3">📡</p>
            No URLs being monitored yet. Add one above and we will check it every Monday.
          </div>
        </Card>
      ) : (
        <Card padding="none">
          <div className="border-b border-white/5 px-5 py-4">
            <h2 className="text-sm font-semibold text-[#F4F1EA]">
              Monitored pages ({urls.length}{limit !== Infinity ? ` / ${limit}` : ""})
            </h2>
          </div>
          <ul className="divide-y divide-white/10">
            {urls.map((u) => (
              <li key={u.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {u.label && (
                        <span className="text-sm font-semibold text-[#F4F1EA]">{u.label}</span>
                      )}
                      <a
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[rgba(244,241,234,0.4)] hover:text-[#E5484D] truncate max-w-xs"
                      >
                        {u.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {u.last_scanned_at ? (
                        <span className="text-xs text-[rgba(244,241,234,0.4)]">
                          Last checked {new Date(u.last_scanned_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </span>
                      ) : (
                        <span className="text-xs text-[rgba(244,241,234,0.4)]">Not yet scanned</span>
                      )}
                      {u.last_scan_id && (
                        <>
                          <Link href={`/scans/${u.last_scan_id}`} className="text-xs text-[#E5484D] hover:underline">
                            View last report →
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {u.last_score !== null && (
                      <span className={["text-lg font-bold", scoreColor(u.last_score)].join(" ")}>
                        {u.last_score}
                      </span>
                    )}
                    <button
                      onClick={() => handleScanNow(u)}
                      disabled={scanning === u.id}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[rgba(244,241,234,0.6)] hover:bg-white/5 hover:border-white/15 disabled:opacity-50 transition-colors"
                    >
                      {scanning === u.id ? "Scanning…" : "Scan now"}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-[rgba(244,241,234,0.35)] hover:text-red-500 transition-colors text-sm"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {u.last_score !== null && (
                  <div className={["mt-2 inline-flex items-center gap-2 rounded-lg border px-3 py-1", scoreBg(u.last_score)].join(" ")}>
                    <span className={["text-xs font-semibold", scoreColor(u.last_score)].join(" ")}>
                      Score: {u.last_score}
                    </span>
                    <span className="text-xs text-[rgba(244,241,234,0.5)]">
                      {u.last_score >= 70 ? "Low risk" : u.last_score >= 40 ? "Medium risk" : "High risk"}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
