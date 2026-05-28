import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { PLAN_LIMITS, SENTINEL_ONLY_CATEGORIES, SEVERITY_DEDUCTIONS } from "@/lib/constants";
import { YoutubeTranscript } from "youtube-transcript";
import type { Plan } from "@/types";

function extractYouTubeId(input: string): string | null {
  // Handles: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, just the ID itself
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = input.trim().match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";

  // YouTube and audio VSL is Sentinel-only; script paste is Growth+
  const isGrowthOrAbove = plan === "enterprise" || plan === "sentinel";
  if (!isGrowthOrAbove) {
    return NextResponse.json(
      { error: "VSL scanning is available on Growth and Sentinel plans." },
      { status: 403 }
    );
  }

  // Sentinel has no scan quota - skip limit check

  const body = await request.json();
  const input: string = (body.url ?? "").trim();
  const mode: "youtube" | "script" = body.mode ?? "youtube";

  // --- Script paste mode ---
  if (mode === "script") {
    const content: string = (body.content ?? "").trim();
    const title: string = (body.title ?? "VSL Script").trim() || "VSL Script";

    if (content.length < 100) {
      return NextResponse.json(
        { error: "Script is too short. Paste the full VSL text to get an accurate scan." },
        { status: 400 }
      );
    }

    const { flags: allFlags } = analyzeContent(title, content);
    const flags = allFlags; // Sentinel sees all 21 categories
    const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

    const { data: scan, error: scanError } = await supabase
      .from("scans")
      .insert({
        user_id: user.id,
        title: `[VSL] ${title}`,
        content: content.slice(0, 10000),
        score,
        status: "complete",
      })
      .select()
      .single();

    if (scanError || !scan) {
      return NextResponse.json({ error: "Failed to save scan." }, { status: 500 });
    }

    if (flags.length > 0) {
      await supabase.from("scan_flags").insert(flags.map((f) => ({ ...f, scan_id: scan.id })));
    }

    return NextResponse.json({ id: scan.id, source: "script", wordCount: content.split(/\s+/).length });
  }

  // YouTube URL mode is Sentinel-only (Growth gets script paste only)
  if (mode === "youtube" && plan !== "sentinel") {
    return NextResponse.json(
      { error: "YouTube VSL scanning is available on the Sentinel plan only. Paste your script to scan on Growth." },
      { status: 403 }
    );
  }

  // --- YouTube URL mode ---
  if (!input) {
    return NextResponse.json({ error: "A YouTube URL or video ID is required." }, { status: 400 });
  }

  const videoId = extractYouTubeId(input);
  if (!videoId) {
    return NextResponse.json(
      { error: "Could not find a valid YouTube video ID. Paste the full YouTube URL or just the video ID." },
      { status: 400 }
    );
  }

  // Fetch transcript
  let transcriptSegments: { text: string }[];
  try {
    transcriptSegments = await YoutubeTranscript.fetchTranscript(videoId);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes("disabled") || msg.includes("Disabled")) {
      return NextResponse.json(
        { error: "This video has captions disabled. Paste the VSL script manually instead." },
        { status: 400 }
      );
    }
    if (msg.includes("unavailable") || msg.includes("private")) {
      return NextResponse.json(
        { error: "This video is private or unavailable. Check the URL and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Could not fetch the transcript. The video may have captions disabled - paste the script instead." },
      { status: 400 }
    );
  }

  if (!transcriptSegments || transcriptSegments.length === 0) {
    return NextResponse.json(
      { error: "No transcript found for this video. Paste the VSL script manually instead." },
      { status: 400 }
    );
  }

  // Join segments into clean text
  const content = transcriptSegments
    .map((s) => s.text.replace(/\[.*?\]/g, "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (content.length < 100) {
    return NextResponse.json(
      { error: "Transcript is too short to scan. The video may have auto-captions only." },
      { status: 400 }
    );
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const title = `VSL - youtube.com/watch?v=${videoId}`;

  // Run the analyzer - Sentinel sees all 21 categories
  const { flags: allFlags } = analyzeContent(title, content);
  const flags = allFlags;
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

  // Save scan
  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .insert({
      user_id: user.id,
      title: `[VSL] ${videoUrl}`,
      content: `[YouTube VSL] ${videoUrl}\n\n${content.slice(0, 10000)}`,
      score,
      status: "complete",
    })
    .select()
    .single();

  if (scanError || !scan) {
    return NextResponse.json({ error: "Failed to save scan." }, { status: 500 });
  }

  if (flags.length > 0) {
    await supabase.from("scan_flags").insert(flags.map((f) => ({ ...f, scan_id: scan.id })));
  }

  return NextResponse.json({
    id: scan.id,
    source: "youtube",
    videoId,
    wordCount: content.split(/\s+/).length,
  });
}
