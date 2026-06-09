import { NextResponse } from "next/server";
import { analyzeContent } from "@/lib/analyzer";
import { enhanceWithAI } from "@/lib/ai-enhance";
import { SENTINEL_ONLY_CATEGORIES, SEVERITY_DEDUCTIONS } from "@/lib/constants";
import { createServiceClient } from "@/lib/supabase/server";

const PREVIEW_COUNT = 3;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const content: string = body.content ?? "";
  const rawEmail: string = body.email ?? "";
  const email = rawEmail.trim().toLowerCase();
  const selectedJurisdictions = body.jurisdictions ?? [];

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address to run your free scan." },
      { status: 400 }
    );
  }

  if (!content.trim()) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  if (content.trim().length < 30) {
    return NextResponse.json(
      { error: "Please paste at least 30 characters of copy to scan." },
      { status: 400 }
    );
  }

  // One free scan per email address — claim it atomically via the unique
  // constraint on `email`. If the insert is rejected as a duplicate, this
  // address has already used its scan.
  const supabase = await createServiceClient();
  const { error: claimError } = await supabase
    .from("demo_scan_emails")
    .insert({ email, content: content.trim() });

  if (claimError) {
    if (claimError.code === "23505") {
      return NextResponse.json(
        {
          error:
            "This email has already used its free scan. Sign up for a free account to keep scanning.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  const { flags: rawFlags } = analyzeContent("Demo Scan", content, selectedJurisdictions.length > 0 ? selectedJurisdictions : undefined);

  // AI enhancement: specific rewrites + catch implied violations
  const allFlags = await enhanceWithAI(content, rawFlags);

  // Demo never shows Sentinel-only categories
  const flags = allFlags.filter(
    (f) => !(SENTINEL_ONLY_CATEGORIES as readonly string[]).includes(f.category)
  );

  // Recalculate score from allowed flags only
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

  // Sort highest-severity first so the one flag we fully reveal is the
  // most compelling one — the "look what we just found" moment.
  const severityRank: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const sorted = [...flags].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  const preview = sorted.slice(0, PREVIEW_COUNT).map((f, i) => {
    const base = { category: f.category, severity: f.severity };
    // Fully reveal the single highest-severity flag — proof the scan is
    // real, not a black box — the rest stay locked behind signup.
    if (i === 0) {
      return {
        ...base,
        unlocked: true,
        text_excerpt: f.text_excerpt,
        flag_description: f.flag_description,
        suggestion: f.suggestion,
      };
    }
    return { ...base, unlocked: false };
  });

  const totalFlags = flags.length;
  const hiddenCount = Math.max(0, totalFlags - PREVIEW_COUNT);

  return NextResponse.json({ score, totalFlags, hiddenCount, flags: preview });
}
