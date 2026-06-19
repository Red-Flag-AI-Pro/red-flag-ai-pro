"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { JurisdictionPicker, JURISDICTIONS } from "@/components/ui/JurisdictionPicker";
import type { JurisdictionCode } from "@/lib/analyzer";
import type { Plan } from "@/types";

interface Props {
  plan?: Plan;
}

type Tab = "paste" | "url" | "upload" | "vsl";
type VslMode = "youtube" | "audio" | "script";

export function ScanForm({ plan = "free" }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("paste");
  const [vslMode, setVslMode] = useState<VslMode>("youtube");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [vslUrl, setVslUrl] = useState("");
  const [vslScript, setVslScript] = useState("");
  const [vslTitle, setVslTitle] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  const isSentinel = plan === "sentinel";
  const isGrowthOrAbove = plan === "enterprise" || plan === "sentinel";
  const canScanUrl = isGrowthOrAbove;
  const [jurisdictions, setJurisdictions] = useState<JurisdictionCode[]>(
    JURISDICTIONS.map(j => j.code)
  );

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContent(text);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res: Response;

      if (tab === "url") {
        if (!url.trim()) { setLoading(false); return; }
        res = await fetch("/api/scans/url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });

      } else if (tab === "vsl") {
        if (vslMode === "youtube") {
          if (!vslUrl.trim()) { setLoading(false); return; }
          res = await fetch("/api/scans/vsl", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "youtube", url: vslUrl.trim() }),
          });
        } else if (vslMode === "audio") {
          if (!audioFile) { setLoading(false); return; }
          const fd = new FormData();
          fd.append("file", audioFile);
          res = await fetch("/api/scans/transcribe", {
            method: "POST",
            body: fd,
          });
        } else {
          if (!vslScript.trim()) { setLoading(false); return; }
          res = await fetch("/api/scans/vsl", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "script",
              title: vslTitle.trim() || "VSL Script",
              content: vslScript.trim(),
            }),
          });
        }

      } else {
        if (!content.trim()) { setLoading(false); return; }
        res = await fetch("/api/scans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim() || content.trim().split(/[\n.!?]/)[0].replace(/\s+/g, " ").trim().slice(0, 60) || "Untitled Scan",
            content: content.trim(),
            jurisdictions: jurisdictions.length === JURISDICTIONS.length ? [] : jurisdictions,
          }),
        });
      }

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

  function canSubmit(): boolean {
    if (tab === "url") return canScanUrl && url.trim().length > 0;
    if (tab === "vsl") {
      if (!isGrowthOrAbove) return false;
      if (vslMode === "youtube") return isSentinel && vslUrl.trim().length > 0;
      if (vslMode === "audio") return isSentinel && audioFile !== null;
      return vslScript.trim().length > 0;
    }
    return content.trim().length > 0;
  }

  function submitLabel(): string {
    if (tab === "url") return "Scan this page →";
    if (tab === "vsl") {
      if (vslMode === "youtube") return "Fetch and scan VSL →";
      if (vslMode === "audio") return loading ? "Transcribing audio…" : "Transcribe and scan →";
      return "Scan VSL script →";
    }
    return "Analyze for compliance risks";
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "paste", label: "Paste text" },
    { id: "url", label: "🌐 Scan URL" },
    { id: "vsl", label: "🎬 VSL" },
    { id: "upload", label: "Upload .txt" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {(tab === "paste" || tab === "upload") && (
        <div>
          <label className="block text-sm font-medium text-[rgba(244,241,234,0.8)]">
            Scan title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Homepage Funnel — April 2025"
            className="mt-1 w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      )}

      {/* Tabs */}
      <div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-[#0A1628] p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={[
                "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-[#102943] shadow text-[#F4F1EA]"
                  : "text-[rgba(244,241,234,0.5)] hover:text-[rgba(244,241,234,0.8)]",
              ].join(" ")}
            >
              {t.label}
              {t.id === "url" && !canScanUrl && (
                <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-[rgba(244,241,234,0.5)]">
                  Growth+
                </span>
              )}
          {t.id === "vsl" && !isGrowthOrAbove && (
                <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-[rgba(244,241,234,0.5)]">
                  Growth+
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-3">

          {/* Paste tab */}
          {tab === "paste" && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              placeholder="Paste your sales page, email sequence, landing page copy, VSL script or any funnel content here…"
              className="w-full rounded-lg border border-white/15 px-3 py-2.5 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] font-mono shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          )}

          {/* URL tab - locked for free/pro */}
          {tab === "url" && !canScanUrl && (
            <div className="rounded-xl border border-white/10 bg-[#0A1628] p-8 text-center">
              <p className="text-3xl mb-3">🌐</p>
              <h3 className="text-base font-semibold text-[#F4F1EA]">URL scanning starts on Growth</h3>
              <p className="mt-2 text-sm text-[rgba(244,241,234,0.5)] max-w-sm mx-auto">
                Paste a URL and we fetch the live page and scan what is actually published. Available on Growth and Sentinel plans.
              </p>
              <Link
                href="/pricing"
                className="mt-5 inline-block rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                See plans →
              </Link>
            </div>
          )}

          {/* URL tab */}
          {tab === "url" && canScanUrl && (<div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[rgba(244,241,234,0.8)] mb-1">
                  Page URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourlandingpage.com/sales"
                  className="w-full rounded-lg border border-white/15 px-3 py-2.5 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700 space-y-1">
                <p className="font-semibold">What URL scanning does</p>
                <p>We fetch the live page, strip navigation and boilerplate, and run the full compliance scan against the copy. Works on sales pages, landing pages, product pages and any publicly accessible URL.</p>
              </div>
            </div>
          )}

          {/* VSL tab */}
          {tab === "vsl" && !isGrowthOrAbove && (
            <div className="rounded-xl border border-white/10 bg-[#0A1628] p-8 text-center">
              <p className="text-3xl">🎬</p>
              <h3 className="mt-3 text-base font-semibold text-[#F4F1EA]">VSL scanning starts on Growth</h3>
              <p className="mt-2 text-sm text-[rgba(244,241,234,0.5)] max-w-sm mx-auto">
                Growth lets you paste and scan VSL scripts. Sentinel adds YouTube transcript fetching and audio transcription via Whisper.
              </p>
              <Link
                href="/pricing"
                className="mt-5 inline-block rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                See plans →
              </Link>
            </div>
          )}

          {tab === "vsl" && isGrowthOrAbove && (
            <div className="space-y-4">
              {/* VSL mode toggle */}
              <div className="flex gap-1 rounded-lg border border-white/10 bg-[#0A1628] p-1 w-fit">
                {(isSentinel
                  ? [["youtube", "YouTube URL"], ["audio", "Upload audio"], ["script", "Paste script"]] as [string, string][]
                  : [["script", "Paste script"]] as [string, string][]
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setVslMode(mode as VslMode)}
                    className={[
                      "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                      vslMode === mode ? "bg-[#102943] shadow text-[#F4F1EA]" : "text-[rgba(244,241,234,0.5)] hover:text-[rgba(244,241,234,0.8)]",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {!isSentinel && isGrowthOrAbove && (
                <div className="rounded-lg border border-white/10 bg-[#0A1628] px-4 py-2.5 flex items-center justify-between gap-3">
                  <p className="text-xs text-[rgba(244,241,234,0.5)]">
                    <span className="font-semibold text-[rgba(244,241,234,0.8)]">Sentinel</span> adds YouTube transcript fetching and audio transcription via Whisper.
                  </p>
                  <Link href="/sentinel" className="shrink-0 text-xs font-semibold text-[#E5484D] hover:underline">
                    Upgrade →
                  </Link>
                </div>
              )}

              {vslMode === "youtube" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[rgba(244,241,234,0.8)] mb-1">
                      YouTube video URL or ID
                    </label>
                    <input
                      type="text"
                      value={vslUrl}
                      onChange={(e) => setVslUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="w-full rounded-lg border border-white/15 px-3 py-2.5 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="rounded-lg border border-amber-100 bg-[rgba(245,158,11,0.1)] px-4 py-3 text-xs text-amber-300 space-y-1">
                    <p className="font-semibold">How VSL scanning works</p>
                    <p>We fetch the video&apos;s captions from YouTube and scan the full transcript for compliance risks. The video must have captions enabled. If it doesn&apos;t, use Paste script instead.</p>
                  </div>
                </div>
              )}

              {vslMode === "audio" && (
                <div className="space-y-3">
                  <div
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 bg-[#0A1628] p-10 text-center hover:border-red-400 hover:bg-[rgba(229,72,77,0.1)] transition-colors cursor-pointer"
                    onClick={() => audioRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f) setAudioFile(f);
                    }}
                  >
                    <p className="text-2xl">🎙️</p>
                    <p className="mt-2 text-sm font-medium text-[rgba(244,241,234,0.8)]">
                      {audioFile ? audioFile.name : "Drop audio or video file here, or click to browse"}
                    </p>
                    {audioFile ? (
                      <p className="mt-1 text-xs text-green-400 font-medium">
                        ✓ {(audioFile.size / 1024 / 1024).toFixed(1)} MB — ready to transcribe
                      </p>
                    ) : (
                      <p className="text-xs text-[rgba(244,241,234,0.4)] mt-1">MP3, MP4, M4A, WAV, WebM — max 25 MB</p>
                    )}
                    <input
                      ref={audioRef}
                      type="file"
                      accept=".mp3,.mp4,.m4a,.wav,.webm,.ogg,.mov"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setAudioFile(f);
                      }}
                    />
                  </div>
                  <div className="rounded-lg border border-amber-100 bg-[rgba(245,158,11,0.1)] px-4 py-3 text-xs text-amber-300 space-y-1">
                    <p className="font-semibold">How audio transcription works</p>
                    <p>We send your file to OpenAI Whisper, the most accurate speech-to-text model available. The transcript is then scanned for all 24 compliance risk categories. Works on any VSL, webinar recording, podcast or ad voiceover.</p>
                  </div>
                </div>
              )}

              {vslMode === "script" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[rgba(244,241,234,0.8)] mb-1">
                      VSL title (optional)
                    </label>
                    <input
                      type="text"
                      value={vslTitle}
                      onChange={(e) => setVslTitle(e.target.value)}
                      placeholder="e.g. Product Launch VSL — June 2025"
                      className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[rgba(244,241,234,0.8)] mb-1">
                      VSL script
                    </label>
                    <textarea
                      value={vslScript}
                      onChange={(e) => setVslScript(e.target.value)}
                      rows={14}
                      placeholder="Paste your full video sales letter script here. Include the complete voiceover text for the most accurate scan."
                      className="w-full rounded-lg border border-white/15 px-3 py-2.5 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] font-mono shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload tab */}
          {tab === "upload" && (
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 bg-[#0A1628] p-10 text-center hover:border-red-400 hover:bg-[rgba(229,72,77,0.1)] transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <p className="text-2xl">📄</p>
              <p className="mt-2 text-sm font-medium text-[rgba(244,241,234,0.8)]">
                Drop a .txt file or click to browse
              </p>
              <p className="text-xs text-[rgba(244,241,234,0.4)]">Plain text files only</p>
              {content && (
                <p className="mt-2 text-xs text-green-400 font-medium">
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

      {/* Jurisdiction picker */}
      <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
          Builders — pick the markets you sell into.&nbsp;&nbsp;Buyers — pick where you are.
        </p>
        <JurisdictionPicker
          value={jurisdictions}
          onChange={setJurisdictions}
          compact
        />
      </div>

      {error && (
        <div className="rounded-lg bg-[rgba(229,72,77,0.1)] border border-[rgba(229,72,77,0.3)] px-4 py-3 text-sm text-[#ff9b9e]">
          {error}
        </div>
      )}

      {/* Don't show submit button when VSL tab is open for non-Sentinel */}
      {!(tab === "vsl" && !isSentinel) && (
        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={!canSubmit()}
          className="w-full"
        >
          {submitLabel()}
        </Button>
      )}
    </form>
  );
}
