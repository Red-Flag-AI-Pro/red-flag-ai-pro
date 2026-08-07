import { NextResponse } from "next/server";
import { tombstoneAuditEntry } from "@/lib/audit-log";

// Admin-only, not self-serve. A GDPR Article 17 erasure request still needs
// a human to verify who's asking and that the entry genuinely contains their
// personal data before anything gets redacted — this route performs the
// redaction once that judgment call has been made, it doesn't make it.
export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET;
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const { userId, entryId, reason, redactedBy } = (body ?? {}) as {
    userId?: unknown;
    entryId?: unknown;
    reason?: unknown;
    redactedBy?: unknown;
  };

  if (
    typeof userId !== "string" || !userId.trim() ||
    typeof entryId !== "string" || !entryId.trim() ||
    typeof reason !== "string" || !reason.trim() ||
    typeof redactedBy !== "string" || !redactedBy.trim()
  ) {
    return NextResponse.json(
      { error: "Expected userId, entryId, reason and redactedBy, all non-empty strings." },
      { status: 400 }
    );
  }

  const result = await tombstoneAuditEntry(userId, entryId, reason, redactedBy);

  if (!result) {
    return NextResponse.json({ error: "Entry not found for that user, or the redaction failed." }, { status: 404 });
  }

  return NextResponse.json({
    tombstoned: true,
    ...result,
    certificateVerify: result.certificateEntryId
      ? `https://www.redflagaipro.com/verify?id=${result.certificateEntryId}`
      : null,
  });
}
