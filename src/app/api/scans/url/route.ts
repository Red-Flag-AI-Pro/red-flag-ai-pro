import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { PLAN_LIMITS, SEVERITY_DEDUCTIONS, getExcludedCategories } from "@/lib/constants";
import { parse } from "node-html-parser";
import type { Plan } from "@/types";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";

  // URL scanning is Growth+ only
  if (plan === "free" || plan === "pro") {
    return NextResponse.json(
      { error: "URL scanning is available on Growth and Sentinel plans. Upgrade to scan live pages." },
      { status: 403 }
    );
  }

  const limit = PLAN_LIMITS[plan];

  // Quota check
  if (limit !== Infinity) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("scans")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    if ((count ?? 0) >= limit) {
      return NextResponse.json(
        { error: "You have reached your scan limit for this month. Please upgrade to continue." },
        { status: 403 }
      );
    }
  }

  const body = await request.json();
  let url: string = body.url ?? "";

  if (!url.trim()) {
    return NextResponse.json({ error: "A URL is required." }, { status: 400 });
  }

  // Ensure URL has a protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Please enter a valid URL." }, { status: 400 });
  }

  // Fetch the page
  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        Referer: "https://www.google.com/",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const message =
        res.status === 403
          ? "This site's bot protection is blocking the scan (403 Forbidden). Try copying the page text and pasting it into the scanner instead."
          : `Could not fetch that URL. The page returned status ${res.status}.`;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    html = await res.text();
  } catch {
    return NextResponse.json(
      { error: "Could not reach that URL. Please check it is publicly accessible." },
      { status: 400 }
    );
  }

  // Strip HTML to plain text
  const root = parse(html);

  // Remove scripts, styles, nav, footer noise
  root.querySelectorAll("script, style, nav, footer, header, noscript, iframe").forEach((el) => el.remove());

  const content = root.innerText
    .replace(/\s+/g, " ")
    .trim();

  if (content.length < 50) {
    return NextResponse.json(
      { error: "Not enough readable text found on that page to scan." },
      { status: 400 }
    );
  }

  // Use page title or URL as scan title
  const titleEl = root.querySelector("title");
  const title = titleEl?.innerText?.trim() || url;

  // Run the analyzer
  const { flags: allFlags } = analyzeContent(title, content);

  // Filter categories based on plan
  const excludedCategories = getExcludedCategories(plan);
  const flags = excludedCategories.length === 0
    ? allFlags
    : allFlags.filter((f) => !excludedCategories.includes(f.category));

  // Recalculate score
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

  // Save scan
  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .insert({
      user_id: user.id,
      title,
      content: `[URL Scan] ${url}\n\n${content.slice(0, 5000)}`,
      score,
      status: "complete",
    })
    .select()
    .single();

  if (scanError || !scan) {
    return NextResponse.json({ error: "Failed to save scan." }, { status: 500 });
  }

  if (flags.length > 0) {
    await supabase.from("scan_flags").insert(
      flags.map((f) => ({ ...f, scan_id: scan.id }))
    );
  }

  return NextResponse.json({ id: scan.id, url, characterCount: content.length });
}
