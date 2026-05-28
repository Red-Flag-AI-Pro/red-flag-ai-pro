import { NextResponse } from "next/server";
import { analyzeContent } from "@/lib/analyzer";
import { SENTINEL_ONLY_CATEGORIES, SEVERITY_DEDUCTIONS } from "@/lib/constants";

const PREVIEW_COUNT = 3;

export async function POST(request: Request) {
  const body = await request.json();
  const content: string = body.content ?? "";

  if (!content.trim()) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  if (content.trim().length < 30) {
    return NextResponse.json(
      { error: "Please paste at least 30 characters of copy to scan." },
      { status: 400 }
    );
  }

  const { flags: allFlags } = analyzeContent("Demo Scan", content);

  // Demo never shows Sentinel-only categories
  const flags = allFlags.filter(
    (f) => !(SENTINEL_ONLY_CATEGORIES as readonly string[]).includes(f.category)
  );

  // Recalculate score from allowed flags only
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

  const preview = flags.slice(0, PREVIEW_COUNT);
  const totalFlags = flags.length;
  const hiddenCount = Math.max(0, totalFlags - PREVIEW_COUNT);

  return NextResponse.json({ score, totalFlags, hiddenCount, flags: preview });
}
