"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Plan } from "@/types";

interface Result {
  url: string;
  title: string;
  score: number;
  flagCount: number;
  error?: string;
}

interface ScanResponse {
  scanId: string;
  domain: string;
  total: number;
  avgScore: number;
  highRisk: number;
  results: Result[];
}

interface Props {
  plan: Plan;
}

function scoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

function scoreBg(score: number) {
  if (score >= 70) return "bg-green-50";
  if (score >= 40) return "bg-amber-50";
  return "bg-red-50";
}

export function BulkScanner({ plan }: Props) {
  const [domain, setDomain] = useState("");
  const [pastedUrls, setPastedUrls] = useState("");
  const [mode, setMode] = useState<"domain" | "paste">("domain");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ScanResponse | null>(null);

  const limit = plan === "sentinel" ? 50 : 10;

  async function handleScan() {
    if (mode === "domain" && !domain.trim()) return;
    if (mode === "paste" && !pastedUrls.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    const body = mode === "paste"
      ? { urls: pastedUrls.split("\n").map((u) => u.trim()).filter((u) => u.startsWith("http")) }
      : { domain: domain.trim() };

    const res = await fetch("/api/scans/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setResponse(data);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit mb-4">
          {(["domain", "paste"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={["rounded-md px-4 py-1.5 text-sm font-medium transition-colors", mode === m ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"].join(" ")}
            >
              {m === "domain" ? "Scan domain" : "Paste URLs"}
            </button>
          ))}
        </div>

        {mode === "domain" ? (
          <>
            <p className="text-xs text-gray-500 mb-3">We find your sitemap, pull up to {limit} pages, and scan each one.</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. youragencyclient.co.uk"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                disabled={loading}
              />
              <Button onClick={handleScan} loading={loading} disabled={!domain.trim()}>
                {loading ? "Scanning…" : "Audit site →"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-3">Paste up to {limit} URLs — one per line. We scan each one individually.</p>
            <textarea
              value={pastedUrls}
              onChange={(e) => setPastedUrls(e.target.value)}
              rows={6}
              placeholder={"https://example.com/sales\nhttps://example.com/landing\nhttps://example.com/checkout"}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-mono focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 mb-3"
              disabled={loading}
            />
            <Button onClick={handleScan} loading={loading} disabled={!pastedUrls.trim()}>
              {loading ? "Scanning…" : `Scan ${pastedUrls.split("\n").filter((u) => u.trim().startsWith("http")).length || ""} pages →`}
            </Button>
          </>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {loading && (
          <p className="mt-3 text-xs text-gray-400 animate-pulse">
            Fetching sitemap and scanning pages — this takes 20-60 seconds depending on site size…
          </p>
        )}
      </div>

      {/* Results */}
      {response && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs text-gray-500">Pages scanned</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{response.total}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs text-gray-500">Average score</p>
              <p className={["mt-1 text-3xl font-bold", scoreColor(response.avgScore)].join(" ")}>
                {response.avgScore}
              </p>
            </div>
            <div className={["rounded-xl border p-5", response.highRisk > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"].join(" ")}>
              <p className="text-xs text-gray-500">High risk pages</p>
              <p className={["mt-1 text-3xl font-bold", response.highRisk > 0 ? "text-red-600" : "text-green-600"].join(" ")}>
                {response.highRisk}
              </p>
            </div>
          </div>

          {/* Page-by-page results */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Page results</h2>
              <span className="text-xs text-gray-400">{response.domain}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Page</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Flags</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {response.results
                    .sort((a, b) => a.score - b.score)
                    .map((r) => (
                      <tr key={r.url} className={["transition-colors", scoreBg(r.score)].join(" ")}>
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900 truncate max-w-xs">{r.title}</p>
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-red-600 truncate block max-w-xs"
                          >
                            {r.url}
                          </a>
                          {r.error && <p className="text-xs text-red-500 mt-0.5">{r.error}</p>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={["text-lg font-bold", scoreColor(r.score)].join(" ")}>{r.score}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{r.flagCount}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={r.score >= 70 ? "low" : r.score >= 40 ? "medium" : "high"}>
                            {r.score >= 70 ? "Low" : r.score >= 40 ? "Med" : "High"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Summary saved to{" "}
            <Link href="/history" className="text-red-600 hover:underline">
              Scan History
            </Link>
            . Run individual pages through New Scan for a full flag breakdown.
          </p>
        </div>
      )}
    </div>
  );
}
