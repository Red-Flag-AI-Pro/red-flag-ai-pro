import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderPagePdf } from "@/lib/pdf-render";
import { logAuditEvent } from "@/lib/audit-log";
import type { Plan } from "@/types";

export const maxDuration = 60;

export async function GET(
  request: Request,
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
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";

  if (plan === "free") {
    return NextResponse.json(
      { error: "PDF reports are available on Pro and above. Please upgrade." },
      { status: 403 }
    );
  }

  const { data: scan } = await supabase
    .from("scans")
    .select("id, score")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  const origin = new URL(request.url).origin;
  const pdfBuffer = await renderPagePdf({
    url: `${origin}/print/scans/${id}`,
    cookieHeader: request.headers.get("cookie"),
  });

  await logAuditEvent(user.id, "report_downloaded", { scan_id: id, score: scan.score });

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="scan-${id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
