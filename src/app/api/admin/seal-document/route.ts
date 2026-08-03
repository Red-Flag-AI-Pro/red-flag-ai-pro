import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { logAuditEvent } from "@/lib/audit-log";
import { WITNESS_CHAIN_USER_ID } from "@/lib/witness";

// Admin-only, not a public endpoint. Seals the hash of an arbitrary piece of
// content (a spec, a whitepaper, a concept document) into our own chain with
// an RFC 3161 timestamp — proof this exact content existed no later than a
// moment nobody here controls, the same mechanism used for every other claim
// on the site, just pointed at a document instead of a decision or an anchor.
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

  const { title, url, content, category } = (body ?? {}) as {
    title?: unknown;
    url?: unknown;
    content?: unknown;
    category?: unknown;
  };

  if (typeof title !== "string" || !title.trim() || typeof content !== "string" || !content.trim()) {
    return NextResponse.json(
      { error: "Expected title (string), content (string), url (optional string), category (optional string)." },
      { status: 400 }
    );
  }

  const contentHash = createHash("sha256").update(content, "utf8").digest("hex");

  const entryId = await logAuditEvent(
    WITNESS_CHAIN_USER_ID,
    "concept.sealed",
    {
      title,
      url: typeof url === "string" ? url : null,
      // What kind of thing this actually was (code fix, legal document,
      // specification, etc), so the public verify page can show a specific
      // label instead of the same generic "Concept authorship sealed" for
      // everything. Optional — old entries without it keep the generic label.
      category: typeof category === "string" && category.trim() ? category.trim() : null,
      content_sha256: contentHash,
    },
    { timestamp: true }
  );

  if (!entryId) {
    return NextResponse.json({ error: "Could not seal the document. Try again." }, { status: 502 });
  }

  return NextResponse.json({
    sealed: true,
    id: entryId,
    content_sha256: contentHash,
    verify: `https://www.redflagaipro.com/verify?id=${entryId}`,
  });
}
