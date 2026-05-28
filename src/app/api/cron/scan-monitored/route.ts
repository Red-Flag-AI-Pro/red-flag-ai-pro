import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { SENTINEL_ONLY_CATEGORIES, SEVERITY_DEDUCTIONS } from "@/lib/constants";
import { parse } from "node-html-parser";
import type { Plan } from "@/types";

export const maxDuration = 300; // 5 minutes — may scan many URLs

// Called by Vercel Cron — secured with CRON_SECRET header
export async function GET(request: Request) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Find all monitored URLs not scanned in the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: urls } = await supabase
    .from("monitored_urls")
    .select("id, url, user_id")
    .or(`last_scanned_at.is.null,last_scanned_at.lt.${sevenDaysAgo}`)
    .limit(50); // cap per run

  if (!urls || urls.length === 0) {
    return NextResponse.json({ scanned: 0 });
  }

  let scanned = 0;
  let failed = 0;

  for (const monitored of urls) {
    try {
      // Get user's plan
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("user_id", monitored.user_id)
        .single();

      const plan: Plan = (profile?.plan as Plan) ?? "free";

      // Fetch the page
      const res = await fetch(monitored.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RedFlagAIPro/1.0; +https://redflagaipro.com)" },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) { failed++; continue; }

      const html = await res.text();
      const root = parse(html);
      root.querySelectorAll("script, style, nav, footer, header, noscript, iframe").forEach((el) => el.remove());
      const content = root.innerText.replace(/\s+/g, " ").trim();

      if (content.length < 50) { failed++; continue; }

      const titleEl = root.querySelector("title");
      const title = titleEl?.innerText?.trim() || monitored.url;

      const { flags: allFlags } = analyzeContent(title, content);
      const flags = plan === "sentinel"
        ? allFlags
        : allFlags.filter((f) => !(SENTINEL_ONLY_CATEGORIES as readonly string[]).includes(f.category));
      const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

      // Save the scan
      const { data: scan } = await supabase
        .from("scans")
        .insert({
          user_id: monitored.user_id,
          title: `[Monitor] ${title}`,
          content: `[Monitored URL] ${monitored.url}\n\n${content.slice(0, 5000)}`,
          score,
          status: "complete",
        })
        .select()
        .single();

      if (scan) {
        if (flags.length > 0) {
          await supabase.from("scan_flags").insert(flags.map((f) => ({ ...f, scan_id: scan.id })));
        }

        // Update the monitored URL record
        await supabase
          .from("monitored_urls")
          .update({ last_scanned_at: new Date().toISOString(), last_score: score, last_scan_id: scan.id })
          .eq("id", monitored.id);
      }

      scanned++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ scanned, failed, total: urls.length });
}
