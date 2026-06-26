import { NextResponse } from "next/server";
import { verifyPublicEntry } from "@/lib/audit-log";

const ACTION_LABELS: Record<string, string> = {
  vendor_added: "Vendor added",
  vendor_updated: "Vendor updated",
  vendor_removed: "Vendor removed",
  vendor_reviewed: "Vendor marked reviewed",
  report_downloaded: "Compliance report downloaded",
  scan_completed: "Compliance scan run",
};

// No auth required by design — this is meant to be checkable by anyone
// holding an entry id from a Red Flag report, without an account.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await verifyPublicEntry(id);

  if (!result.found) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json({
    found: true,
    intact: result.intact,
    actionLabel: result.action ? ACTION_LABELS[result.action] ?? result.action : null,
    createdAt: result.createdAt,
  });
}
