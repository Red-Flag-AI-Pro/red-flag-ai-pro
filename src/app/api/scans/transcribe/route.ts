import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { SEVERITY_DEDUCTIONS } from "@/lib/constants";
import OpenAI from "openai";
import type { Plan } from "@/types";

// Allow up to 25 MB uploads (Whisper's max)
export const maxDuration = 120; // seconds — transcription can take a moment

const SUPPORTED_TYPES = [
  "audio/mpeg",       // .mp3
  "audio/mp4",        // .m4a
  "audio/wav",        // .wav
  "audio/webm",       // .webm
  "audio/ogg",        // .ogg
  "video/mp4",        // .mp4
  "video/webm",       // .webm
  "video/quicktime",  // .mov
];

const SUPPORTED_EXT = [".mp3", ".mp4", ".m4a", ".wav", ".webm", ".ogg", ".mov"];

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

  if (plan !== "sentinel") {
    return NextResponse.json(
      { error: "Audio transcription is available on the Sentinel plan only." },
      { status: 403 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Transcription is not configured yet. Contact support." },
      { status: 503 }
    );
  }

  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read uploaded file." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  // Size check — Whisper max is 25 MB
  const MAX_BYTES = 25 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 25 MB. Compress the audio to MP3 and try again.` },
      { status: 400 }
    );
  }

  // Type check
  const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
  if (!SUPPORTED_TYPES.includes(file.type) && !SUPPORTED_EXT.includes(ext)) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload an MP3, MP4, M4A, WAV, or WebM file." },
      { status: 400 }
    );
  }

  // Transcribe with Whisper
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let transcript: string;
  try {
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "en",
      response_format: "text",
    });
    transcript = typeof transcription === "string" ? transcription : (transcription as { text: string }).text;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Transcription failed: ${msg}` },
      { status: 500 }
    );
  }

  if (!transcript || transcript.trim().length < 50) {
    return NextResponse.json(
      { error: "Could not extract enough speech from this file. Check the audio has clear spoken content." },
      { status: 400 }
    );
  }

  const cleanTranscript = transcript.trim();
  const scanTitle = `[VSL] ${file.name.replace(/\.[^.]+$/, "")}`;

  // Run compliance scan — Sentinel sees all 24 categories
  const { flags } = analyzeContent(scanTitle, cleanTranscript);
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .insert({
      user_id: user.id,
      title: scanTitle,
      content: `[Audio Transcription] ${file.name}\n\n${cleanTranscript.slice(0, 10000)}`,
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
    source: "transcription",
    wordCount: cleanTranscript.split(/\s+/).length,
    fileName: file.name,
  });
}
