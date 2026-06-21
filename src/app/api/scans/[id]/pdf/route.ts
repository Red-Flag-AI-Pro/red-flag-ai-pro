import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateScanPdf } from "@/lib/pdf";
import { logAuditEvent } from "@/lib/audit-log";
import type { Plan } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, agency_name")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  const agencyName = (profile as { agency_name?: string | null })?.agency_name ?? null;

  if (plan === "free") {
    return NextResponse.json(
      { error: "PDF reports are available on Pro and above. Please upgrade." },
      { status: 403 }
    );
  }

  const { data: scan } = await supabase
    .from("scans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  const { data: flags } = await supabase
    .from("scan_flags")
    .select("*")
    .eq("scan_id", id);

  const pdfBytes = await generateScanPdf(scan, flags ?? [], agencyName);
  await logAuditEvent(user.id, "report_downloaded", { scan_id: id, score: scan.score });

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="scan-${id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
