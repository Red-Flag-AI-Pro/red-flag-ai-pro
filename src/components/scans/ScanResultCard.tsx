"use client";

import { useState } from "react";
import type { Scan, ScanFlag, Plan } from "@/types";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

function ShareButton({ scanId }: { scanId: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : "https://redflagaipro.com"}/share/${scanId}`;

  function copy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {copied ? "✓ Link copied" : "🔗 Share"}
    </button>
  );
}

function BadgeButton({ scanId }: { scanId: string }) {
  const [open, setOpen] = useState(false);
  const badgeUrl = `${typeof window !== "undefined" ? window.location.origin : "https://redflagaipro.com"}/api/badge/${scanId}`;
  const embedCode = `<a href="https://redflagaipro.com" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="Compliance verified by Red Flag AI Pro" style="height:60px;border:none;"/></a>`;
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        🏷️ Embed badge
      </button>
      {open && (
        <div className="w-full mt-1 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={badgeUrl} alt="Compliance badge" style={{ height: 60 }} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">Embed code — paste into your website or client portal</p>
            <div className="flex gap-2">
              <code className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 break-all font-mono">
                {embedCode}
              </code>
              <button
                onClick={copy}
                className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400">The badge updates automatically when you rescan. Share with clients as proof of compliance review.</p>
        </div>
      )}
    </>
  );
}

type VideoState = "idle" | "queued" | "processing" | "error";

function VideoButton({ scanId }: { scanId: string }) {
  const [state, setState] = useState<VideoState>("idle");

  async function start() {
    setState("queued");
    try {
      const res = await fetch(`/api/scans/${scanId}/video/jobs`, { method: "POST" });
      if (!res.ok) throw new Error("Could not start render");
      const { jobId } = await res.json();
      setState("processing");
      poll(jobId);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  function poll(jobId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/scans/${scanId}/video/jobs/${jobId}`);
        if (!res.ok) throw new Error("Lost track of job");
        const job = await res.json();

        if (job.status === "complete" && job.video_url) {
          clearInterval(interval);
          window.location.href = job.video_url;
          setState("idle");
        } else if (job.status === "error") {
          clearInterval(interval);
          throw new Error(job.error ?? "Render failed");
        }
      } catch {
        clearInterval(interval);
        setState("error");
        setTimeout(() => setState("idle"), 3000);
      }
    }, 4000);
  }

  const labels: Record<VideoState, string> = {
    idle: "🎬 Video summary",
    queued: "🎬 Queuing render…",
    processing: "🎬 Rendering… (usually ~1 min)",
    error: "⚠️ Couldn't render — try again",
  };

  return (
    <button
      onClick={start}
      disabled={state === "queued" || state === "processing"}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
    >
      {labels[state]}
    </button>
  );
}

interface ScanResultCardProps {
  scan: Scan;
  flags: ScanFlag[];
  plan: Plan;
}

export function ScanResultCard({ scan, flags, plan }: ScanResultCardProps) {
  const highCount = flags.filter((f) => f.severity === "high").length;
  const medCount = flags.filter((f) => f.severity === "medium").length;
  const lowCount = flags.filter((f) => f.severity === "low").length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <ScoreGauge score={scan.score} size={140} />

        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{scan.title}</h2>
            <p className="text-sm text-gray-500">
              Scanned{" "}
              {new Date(scan.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-center">
              <p className="text-lg font-bold text-gray-900">{flags.length}</p>
              <p className="text-xs text-gray-500">Total flags</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-center">
              <p className="text-lg font-bold text-red-700">{highCount}</p>
              <p className="text-xs text-red-500">High</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-center">
              <p className="text-lg font-bold text-amber-700">{medCount}</p>
              <p className="text-xs text-amber-500">Medium</p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-center">
              <p className="text-lg font-bold text-green-700">{lowCount}</p>
              <p className="text-xs text-green-500">Low</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {plan !== "free" ? (
              <a
                href={`/api/scans/${scan.id}/pdf`}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              >
                Download PDF Report
              </a>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2">
                <span className="text-sm text-gray-500">
                  PDF reports require Pro
                </span>
                <Link
                  href="/billing"
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Upgrade →
                </Link>
              </div>
            )}
            <Link
              href="/scans/new"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              New scan
            </Link>
            <ShareButton scanId={scan.id} />
            <BadgeButton scanId={scan.id} />
            <VideoButton scanId={scan.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
