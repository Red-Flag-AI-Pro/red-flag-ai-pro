import { NextResponse } from "next/server";
import { verifyPublicEntry } from "@/lib/audit-log";

const ACTION_LABELS: Record<string, string> = {
  vendor_added: "Vendor added",
  vendor_updated: "Vendor updated",
  vendor_removed: "Vendor removed",
  vendor_reviewed: "Vendor marked reviewed",
  report_downloaded: "Compliance report downloaded",
  scan_completed: "Compliance check run",
  flag_reviewed: "Compliance flag signed off",
  "boundary_record.created": "Boundary authorization recorded",
  "boundary_record.updated": "Boundary authorization updated",
  "boundary_record.lapsed": "Boundary authorization lapse detected",
  "concept.sealed": "Concept authorship sealed",
  "witness.anchor_received": "Witness anchor received",
  "witness.anchor_sent": "Witness anchor sent",
  "enforcement.blocked": "Real Time Gate block",
  "data_room.exported": "AI Governance Data Room export",
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
    actionLabel: result.category ?? (result.action ? ACTION_LABELS[result.action] ?? result.action : null),
    description: result.description ?? null,
    contentSha256: result.contentSha256 ?? null,
    sealedByName: result.sealedByName ?? null,
    sealedByOrg: result.sealedByOrg ?? null,
    createdAt: result.createdAt,
    timestampedAt: result.timestampedAt ?? null,
    timestampAuthority: result.timestampAuthority ?? null,
  });
}
