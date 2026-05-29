import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { SENTINEL_ONLY_CATEGORIES, SEVERITY_DEDUCTIONS } from "@/lib/constants";
import { parse } from "node-html-parser";
import { Resend } from "resend";
import type { Plan } from "@/types";

export const maxDuration = 300; // 5 minutes — may scan many URLs

// Called by Vercel Cron — secured with CRON_SECRET header
export async function GET(request: Request) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  // Find all monitored URLs not scanned in the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: urls } = await supabase
    .from("monitored_urls")
    .select("id, url, user_id, client_id")
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

        // Send auto-report to client if they have a contact email
        if (resend && monitored.client_id) {
          const { data: client } = await supabase
            .from("clients")
            .select("name, contact_email")
            .eq("id", monitored.client_id)
            .single();

          if (client?.contact_email) {
            const riskLabel = score >= 70 ? "Low Risk" : score >= 40 ? "Medium Risk" : "High Risk";
            const riskColor = score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";

            await resend.emails.send({
              from: "Red Flag AI Pro <reports@redflagaipro.com>",
              to: client.contact_email,
              subject: `Weekly compliance report — ${monitored.url}`,
              html: `
                <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;">
                  <div style="background:#0f0f1a;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                    <div style="font-size:18px;font-weight:800;color:#fff;">Red Flag AI Pro</div>
                    <div style="font-size:12px;color:#6b7280;">Weekly compliance report for ${client.name}</div>
                  </div>
                  <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:16px;">
                    <p style="font-size:14px;color:#374151;margin:0 0 16px;">Your weekly compliance scan for <strong>${monitored.url}</strong> is complete.</p>
                    <div style="text-align:center;padding:20px;background:#f9fafb;border-radius:8px;margin-bottom:16px;">
                      <div style="font-size:48px;font-weight:800;color:${riskColor};">${score}</div>
                      <div style="font-size:13px;font-weight:600;color:${riskColor};">${riskLabel}</div>
                      <div style="font-size:12px;color:#9ca3af;margin-top:4px;">${flags.length} flag${flags.length !== 1 ? "s" : ""} detected</div>
                    </div>
                    <a href="https://redflagaipro.com/scans/${scan.id}" style="display:block;text-align:center;background:#dc2626;color:#fff;padding:12px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View full report →</a>
                  </div>
                  <p style="text-align:center;font-size:11px;color:#9ca3af;">Powered by Red Flag AI Pro</p>
                </div>`,
            }).catch(() => {});
          }
        }
      }

      scanned++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ scanned, failed, total: urls.length });
}
