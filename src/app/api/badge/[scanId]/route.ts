import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600; // cache badge for 1 hour

function riskLabel(score: number) {
  if (score >= 70) return "Low Risk";
  if (score >= 40) return "Medium Risk";
  return "High Risk";
}

function riskColor(score: number) {
  if (score >= 70) return { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d", dot: "#16a34a" };
  if (score >= 40) return { bg: "#fffbeb", border: "#fde68a", text: "#b45309", dot: "#d97706" };
  return { bg: "#fef2f2", border: "#fecaca", text: "#b91c1c", dot: "#dc2626" };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ scanId: string }> }
) {
  const { scanId } = await params;

  // Public read - use server client, RLS allows scan owner to read
  // We make this publicly readable by querying without user filter
  const supabase = await createClient();
  const { data: scan } = await supabase
    .from("scans")
    .select("score, title, created_at")
    .eq("id", scanId)
    .single();

  if (!scan) {
    return new NextResponse("Not found", { status: 404 });
  }

  const score = scan.score as number;
  const colors = riskColor(score);
  const label = riskLabel(score);
  const date = new Date(scan.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="60" role="img" aria-label="Compliance score: ${score}">
  <title>Compliance score: ${score} — ${label}</title>
  <rect width="220" height="60" rx="10" fill="${colors.bg}" stroke="${colors.border}" stroke-width="1.5"/>
  <circle cx="20" cy="30" r="5" fill="${colors.dot}"/>
  <text x="34" y="22" font-family="system-ui,-apple-system,sans-serif" font-size="10" font-weight="700" fill="#6b7280" letter-spacing="0.08em">COMPLIANCE VERIFIED</text>
  <text x="34" y="40" font-family="system-ui,-apple-system,sans-serif" font-size="18" font-weight="800" fill="${colors.text}">${score}<tspan font-size="11" font-weight="600" fill="${colors.text}" dx="2">/100</tspan></text>
  <text x="34" y="53" font-family="system-ui,-apple-system,sans-serif" font-size="9" fill="#9ca3af">${label} · Checked ${date}</text>
  <text x="196" y="55" font-family="system-ui,-apple-system,sans-serif" font-size="8" fill="#d1d5db" text-anchor="end">Red Flag AI Pro</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
