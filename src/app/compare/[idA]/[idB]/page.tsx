import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { FLAG_CATEGORY_LABELS } from "@/lib/constants";
import type { Plan, ScanFlag } from "@/types";

function scoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ idA: string; idB: string }>;
}) {
  const { idA, idB } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: scanA }, { data: scanB }, { data: flagsA }, { data: flagsB }, { data: profile }] =
    await Promise.all([
      supabase.from("scans").select("*").eq("id", idA).eq("user_id", user.id).single(),
      supabase.from("scans").select("*").eq("id", idB).eq("user_id", user.id).single(),
      supabase.from("scan_flags").select("*").eq("scan_id", idA),
      supabase.from("scan_flags").select("*").eq("scan_id", idB),
      supabase.from("profiles").select("plan").eq("user_id", user.id).single(),
    ]);

  if (!scanA || !scanB) notFound();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  const redact = (list: ScanFlag[]) =>
    list.map((f) =>
      plan === "free" && f.suggestion
        ? { ...f, suggestion: "Unlock Pro to see the exact fix for this flag, rewritten and ready to use." }
        : f
    );

  const fa = redact((flagsA ?? []) as ScanFlag[]);
  const fb = redact((flagsB ?? []) as ScanFlag[]);

  const catsA = new Set(fa.map((f) => f.category));
  const catsB = new Set(fb.map((f) => f.category));

  const resolved = fa.filter((f) => !catsB.has(f.category)); // in A, not B
  const newFlags = fb.filter((f) => !catsA.has(f.category)); // in B, not A
  const persisted = fb.filter((f) => catsA.has(f.category)); // in both

  const scoreDelta = (scanB.score as number) - (scanA.score as number);
  const improved = scoreDelta > 0;

  const dateA = new Date(scanA.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const dateB = new Date(scanB.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/history" className="text-xs text-gray-400 hover:text-gray-600 mb-1 block">← Scan History</Link>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Changelog</h1>
        <p className="text-sm text-gray-500 mt-0.5 truncate">{scanB.title}</p>
      </div>

      {/* Score delta */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs text-gray-500 mb-1">Earlier scan</p>
          <p className="text-xs text-gray-400 mb-2">{dateA}</p>
          <p className={["text-3xl font-bold", scoreColor(scanA.score as number)].join(" ")}>{scanA.score}</p>
          <p className="text-xs text-gray-400 mt-1">{fa.length} flag{fa.length !== 1 ? "s" : ""}</p>
        </div>
        <div className={["rounded-xl border p-5 flex flex-col items-center justify-center text-center", improved ? "border-green-200 bg-green-50" : scoreDelta < 0 ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"].join(" ")}>
          <p className={["text-4xl font-extrabold", improved ? "text-green-600" : scoreDelta < 0 ? "text-red-600" : "text-gray-400"].join(" ")}>
            {scoreDelta > 0 ? "+" : ""}{scoreDelta}
          </p>
          <p className={["text-xs font-semibold mt-1", improved ? "text-green-700" : scoreDelta < 0 ? "text-red-700" : "text-gray-500"].join(" ")}>
            {improved ? "Improved" : scoreDelta < 0 ? "Declined" : "No change"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs text-gray-500 mb-1">Latest scan</p>
          <p className="text-xs text-gray-400 mb-2">{dateB}</p>
          <p className={["text-3xl font-bold", scoreColor(scanB.score as number)].join(" ")}>{scanB.score}</p>
          <p className="text-xs text-gray-400 mt-1">{fb.length} flag{fb.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2">
        {newFlags.length > 0 && (
          <span className="rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-semibold text-red-700">
            {newFlags.length} new flag{newFlags.length !== 1 ? "s" : ""} appeared
          </span>
        )}
        {resolved.length > 0 && (
          <span className="rounded-full bg-green-100 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
            {resolved.length} flag{resolved.length !== 1 ? "s" : ""} resolved
          </span>
        )}
        {persisted.length > 0 && (
          <span className="rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
            {persisted.length} flag{persisted.length !== 1 ? "s" : ""} still present
          </span>
        )}
        {newFlags.length === 0 && resolved.length === 0 && (
          <span className="rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
            No flag changes
          </span>
        )}
      </div>

      {/* New flags */}
      {newFlags.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-red-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            New flags — appeared in latest scan
          </h2>
          {newFlags.map((f) => (
            <div key={f.id} className="rounded-xl border border-red-200 bg-red-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-red-100">
                <span className="text-sm font-semibold text-gray-900">{FLAG_CATEGORY_LABELS[f.category] ?? f.category}</span>
                <Badge variant={f.severity}>{f.severity.toUpperCase()}</Badge>
              </div>
              <div className="px-4 py-3 space-y-2">
                <p className="text-xs text-gray-600">{f.flag_description}</p>
                {f.text_excerpt && (
                  <blockquote className="rounded border-l-4 border-red-400 bg-red-100/60 px-3 py-1.5 text-xs italic text-red-800">{f.text_excerpt}</blockquote>
                )}
                {f.suggestion && (
                  <div className="rounded bg-white border border-red-200 px-3 py-2">
                    <p className="text-xs font-semibold text-green-700 mb-0.5">Fix</p>
                    {plan === "free" ? (
                      <div className="relative">
                        <p className="text-xs text-green-800 blur-sm select-none">{f.suggestion}</p>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <a href="/billing?plan=scanner" className="rounded-full border border-green-700 bg-black/90 px-2 py-0.5 text-[10px] font-semibold text-green-300 hover:border-green-500 transition-colors">
                            Unlock with Pro
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-green-800">{f.suggestion}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolved flags */}
      {resolved.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-green-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            Resolved — fixed since earlier scan
          </h2>
          {resolved.map((f) => (
            <div key={f.id} className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-3">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <p className="text-sm font-medium text-gray-700">{FLAG_CATEGORY_LABELS[f.category] ?? f.category}</p>
                <p className="text-xs text-gray-400">No longer detected in latest scan</p>
              </div>
              <Badge variant={f.severity} className="ml-auto">{f.severity.toUpperCase()}</Badge>
            </div>
          ))}
        </div>
      )}

      {/* Still present */}
      {persisted.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
            Still present — unchanged
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            {persisted.map((f) => (
              <div key={f.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-700">{FLAG_CATEGORY_LABELS[f.category] ?? f.category}</span>
                <Badge variant={f.severity}>{f.severity.toUpperCase()}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Link href={`/scans/${idB}`} className="text-sm font-medium text-red-600 hover:underline">View latest scan →</Link>
        <Link href={`/scans/${idA}`} className="text-sm text-gray-400 hover:text-gray-600">View earlier scan →</Link>
      </div>
    </div>
  );
}
