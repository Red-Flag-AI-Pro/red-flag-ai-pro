import { createServiceClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/analyzer";
import { SEVERITY_DEDUCTIONS, getExcludedCategories } from "@/lib/constants";

// If this person already ran the free demo check with this email, convert
// it into their first real (fully unlocked) check — so their dashboard
// isn't empty on first load and they don't have to redo work they already
// did to get the same result. Shared by the auth callback (confirmation
// flow) and /api/signup-init (instant session flow) so both signup paths
// get identical side effects.
export async function convertDemoScanToFirstScan(userId: string, email: string) {
  try {
    const service = await createServiceClient();
    const { data: demoRow } = await service
      .from("demo_scan_emails")
      .select("content")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    const content = (demoRow as { content?: string | null } | null)?.content;
    if (!content || !content.trim()) return;

    const { flags: allFlags } = analyzeContent("Your demo scan", content);
    const excludedCategories = getExcludedCategories("free");
    const flags = allFlags.filter((f) => !excludedCategories.includes(f.category));
    const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

    const { data: scan } = await service
      .from("scans")
      .insert({ user_id: userId, title: "Your demo scan", content, score, status: "complete" })
      .select()
      .single();

    if (scan && flags.length > 0) {
      await service.from("scan_flags").insert(
        flags.map((f) => ({ ...f, scan_id: scan.id }))
      );
    }

    // Clear the stored content so it's only ever converted once
    await service.from("demo_scan_emails").update({ content: null }).eq("email", email.toLowerCase());
  } catch {
    // Best-effort — never block account creation over this
  }
}
