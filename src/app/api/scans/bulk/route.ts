import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { PLAN_LIMITS, SENTINEL_ONLY_CATEGORIES, SEVERITY_DEDUCTIONS } from "@/lib/constants";
import { parse } from "node-html-parser";
import type { Plan } from "@/types";

export const maxDuration = 120;

const GROWTH_LIMIT = 10;
const SENTINEL_LIMIT = 50;

const UA = "Mozilla/5.0 (compatible; RedFlagAIPro/1.0; +https://redflagaipro.com)";

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function extractUrlsFromSitemap(domain: string): Promise<string[]> {
  const base = domain.replace(/\/$/, "");
  const candidates = [
    `${base}/sitemap.xml`,
    `${base}/sitemap_index.xml`,
    `${base}/sitemap/sitemap.xml`,
  ];

  for (const url of candidates) {
    const xml = await fetchText(url);
    if (!xml) continue;

    // Extract <loc> entries
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((m) => m[1].trim());
    if (locs.length === 0) continue;

    // If this is a sitemap index, fetch the first child sitemap
    if (xml.includes("<sitemapindex")) {
      const childXml = await fetchText(locs[0]);
      if (childXml) {
        const childLocs = [...childXml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((m) => m[1].trim());
        return [...locs.slice(1), ...childLocs]; // mix in child URLs
      }
    }

    return locs;
  }

  // Fallback — just scan the domain homepage
  return [base];
}

async function scanUrl(url: string, plan: Plan): Promise<{
  url: string;
  title: string;
  score: number;
  flagCount: number;
  error?: string;
}> {
  const html = await fetchText(url);
  if (!html) return { url, title: url, score: 0, flagCount: 0, error: "Could not fetch page" };

  const root = parse(html);
  root.querySelectorAll("script, style, nav, footer, header, noscript, iframe").forEach((el) => el.remove());
  const content = root.innerText.replace(/\s+/g, " ").trim();

  if (content.length < 50) return { url, title: url, score: 100, flagCount: 0 };

  const titleEl = root.querySelector("title");
  const title = titleEl?.innerText?.trim() || url;

  const { flags: allFlags } = analyzeContent(title, content);
  const flags = plan === "sentinel"
    ? allFlags
    : allFlags.filter((f) => !(SENTINEL_ONLY_CATEGORIES as readonly string[]).includes(f.category));
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

  return { url, title, score, flagCount: flags.length };
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

  if (plan !== "enterprise" && plan !== "sentinel") {
    return NextResponse.json(
      { error: "Bulk scanning is available on Growth and Sentinel plans." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const domain: string = (body.domain ?? "").trim();
  const pastedUrls: string[] = body.urls ?? [];
  const urlLimit = plan === "sentinel" ? SENTINEL_LIMIT : GROWTH_LIMIT;

  let urls: string[] = [];

  if (pastedUrls.length > 0) {
    urls = pastedUrls.filter((u: string) => { try { new URL(u); return true; } catch { return false; } }).slice(0, urlLimit);
    if (urls.length === 0) return NextResponse.json({ error: "No valid URLs found. Make sure URLs start with https://" }, { status: 400 });
  } else {
    if (!domain) return NextResponse.json({ error: "Domain is required." }, { status: 400 });
    const fullDomain = domain.startsWith("http") ? domain : `https://${domain}`;
    try { new URL(fullDomain); } catch {
      return NextResponse.json({ error: "Please enter a valid domain." }, { status: 400 });
    }
    const allUrls = await extractUrlsFromSitemap(fullDomain);
    urls = allUrls.slice(0, urlLimit);
    if (urls.length === 0) return NextResponse.json({ error: "No URLs found for this domain." }, { status: 400 });
  }

  // Scan all URLs (sequential to avoid hammering servers)
  const results = [];
  for (const url of urls) {
    const result = await scanUrl(url, plan);
    results.push(result);
  }

  // Save a summary scan
  const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
  const highRisk = results.filter((r) => r.score < 40).length;
  const scanLabel = pastedUrls.length > 0 ? `${urls[0]} +${urls.length - 1} more` : (domain.startsWith("http") ? domain : `https://${domain}`);
  const summary = `Bulk scan of ${scanLabel} — ${urls.length} pages scanned. Average score: ${avgScore}. High risk pages: ${highRisk}.`;

  const { data: scan } = await supabase
    .from("scans")
    .insert({
      user_id: user.id,
      title: `[Bulk] ${scanLabel}`,
      content: summary,
      score: avgScore,
      status: "complete",
    })
    .select()
    .single();

  return NextResponse.json({
    scanId: scan?.id,
    domain: scanLabel,
    total: results.length,
    avgScore,
    highRisk,
    results,
  });
}
