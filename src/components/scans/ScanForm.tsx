"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function ScanForm() {
  const router = useRouter();
  const [tab, setTab] = useState<"paste" | "upload">("paste");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContent(text);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Untitled Scan",
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push(`/scans/${data.id}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Scan title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Homepage Funnel — April 2025"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
          {(["paste", "upload"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                tab === t
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700",
              ].join(" ")}
            >
              {t === "paste" ? "Paste text" : "Upload .txt"}
            </button>
          ))}
        </div>

        <div className="mt-3">
          {tab === "paste" ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              placeholder="Paste your sales page, email sequence, landing page copy, or any funnel content here…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-mono shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <p className="text-2xl">📄</p>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Drop a .txt file or click to browse
              </p>
              <p className="text-xs text-gray-400">Plain text files only</p>
              {content && (
                <p className="mt-2 text-xs text-green-600 font-medium">
                  ✓ {content.length.toLocaleString()} characters loaded
                </p>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".txt"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        loading={loading}
        disabled={!content.trim()}
        className="w-full"
      >
        Analyze for compliance risks
      </Button>
    </form>
  );
}
