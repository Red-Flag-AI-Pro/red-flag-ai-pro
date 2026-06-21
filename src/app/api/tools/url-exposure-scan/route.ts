import { NextResponse } from "next/server";
import { parse } from "node-html-parser";
import { analyzeContent } from "@/lib/analyzer";

export async function POST(request: Request) {
  const body = await request.json();
  let url: string = (body.url ?? "").trim();

  if (!url) {
    return NextResponse.json({ error: "A URL is required." }, { status: 400 });
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Please enter a valid URL." }, { status: 400 });
  }

  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const message = res.status === 403
        ? "This site's bot protection is blocking the scan (403 Forbidden)."
        : `Could not fetch that URL. The page returned status ${res.status}.`;
      return NextResponse.json({ error: message }, { status: 400 });
    }
    html = await res.text();
  } catch {
    return NextResponse.json({ error: "Could not reach that URL. Please check it is publicly accessible." }, { status: 400 });
  }

  const root = parse(html);
  root.querySelectorAll("script, style, noscript").forEach((el) => el.remove());
  const text = root.structuredText.replace(/\s+/g, " ").trim().slice(0, 20000);

  if (!text) {
    return NextResponse.json({ error: "Could not find any readable text on that page." }, { status: 400 });
  }

  const { score, flags } = analyzeContent(url, text);

  return NextResponse.json({
    score,
    url,
    flags: flags.map((f) => ({
      category: f.category,
      severity: f.severity,
      flag_description: f.flag_description,
      text_excerpt: f.text_excerpt,
      suggestion: f.suggestion,
    })),
  });
}
