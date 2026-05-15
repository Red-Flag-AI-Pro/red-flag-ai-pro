import type { Scan, ScanFlag, Plan } from "@/types";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

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
          </div>
        </div>
      </div>
    </div>
  );
}
