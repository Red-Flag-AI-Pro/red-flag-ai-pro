import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { WITNESS_CHAIN_USER_ID } from "@/lib/witness";

export const revalidate = 300; // recheck live status every 5 minutes

// A badge for the Witness Network itself, not the per-scan compliance
// badge at /api/badge/[scanId]. This one answers a narrower question: is
// this chain actively being witnessed right now, not what any single
// record says. Status is read off the real anchor cadence rather than a
// static "verified" claim that could go stale the moment syncing stops —
// the whole point of the network is that the claim survives being checked,
// so the badge has to survive being checked too.
async function getLiveStatus(): Promise<{ live: boolean; hoursSinceLastAnchor: number | null }> {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("audit_log")
    .select("created_at")
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .eq("action", "witness.anchor_sent")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return { live: false, hoursSinceLastAnchor: null };
  const hours = (Date.now() - new Date(data.created_at).getTime()) / 3_600_000;
  // Anchoring runs hourly — anything under 3 hours old means the cadence is
  // healthy; past that, the badge honestly shows amber rather than keep
  // claiming "live" off a sync that's actually stopped.
  return { live: hours < 3, hoursSinceLastAnchor: hours };
}

export async function GET() {
  const { live } = await getLiveStatus();
  const colors = live
    ? { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d", dot: "#16a34a" }
    : { bg: "#fffbeb", border: "#fde68a", text: "#b45309", dot: "#d97706" };
  const statusLabel = live ? "Live" : "Not currently syncing";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="60" role="img" aria-label="Witnessed: ${statusLabel}">
  <title>Witnessed under the Open Witness Standard — ${statusLabel}</title>
  <rect width="240" height="60" rx="10" fill="${colors.bg}" stroke="${colors.border}" stroke-width="1.5"/>
  <circle cx="20" cy="30" r="5" fill="${colors.dot}"/>
  <text x="34" y="22" font-family="system-ui,-apple-system,sans-serif" font-size="10" font-weight="700" fill="#6b7280" letter-spacing="0.06em">WITNESSED</text>
  <text x="34" y="38" font-family="system-ui,-apple-system,sans-serif" font-size="12" font-weight="700" fill="${colors.text}">Open Witness Standard</text>
  <text x="34" y="52" font-family="system-ui,-apple-system,sans-serif" font-size="9" fill="#9ca3af">${statusLabel} · verify this claim yourself</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
