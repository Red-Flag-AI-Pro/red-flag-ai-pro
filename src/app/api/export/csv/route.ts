import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: scans } = await supabase
    .from("scans")
    .select("id, title, score, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (!scans || scans.length === 0) {
    return new NextResponse("No scans found", { status: 404 });
  }

  const header = ["Date", "Title", "Score", "Risk Level", "Status", "Scan ID"];

  function riskLevel(score: number) {
    if (score >= 70) return "Low Risk";
    if (score >= 40) return "Medium Risk";
    return "High Risk";
  }

  function csvCell(val: string) {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  }

  const rows = scans.map((s) => [
    new Date(s.created_at).toLocaleDateString("en-GB"),
    csvCell(s.title),
    String(s.score),
    riskLevel(s.score as number),
    s.status,
    s.id,
  ].join(","));

  const csv = [header.join(","), ...rows].join("\n");
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="compliance-scans-${date}.csv"`,
    },
  });
}
