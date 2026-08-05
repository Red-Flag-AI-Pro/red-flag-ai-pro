import { NextResponse } from "next/server";
import crypto from "crypto";
import { buildDiscoveryDocument } from "@/lib/ordering-test";

// Hashes our own discovery document (not a separate runner file, since no
// jointly agreed runner exists yet). Once a shared ordering_test.py is
// actually agreed, this should hash that file instead, the same way
// sebbi.pro's /x/standard/hash lets a third party compare mirrors without
// asking either operator.
export async function GET() {
  const doc = buildDiscoveryDocument();
  const text = JSON.stringify(doc, null, 2);
  const sha256 = crypto.createHash("sha256").update(text, "utf8").digest("hex");

  return NextResponse.json({
    file: "discovery-document",
    sha256,
    bytes: Buffer.byteLength(text, "utf8"),
    served_from: "https://www.redflagaipro.com/.well-known/ordering-test.json",
    why:
      "Fetch the discovery document and hash it yourself to confirm this " +
      "matches. Once a shared runner file exists across mirrors, this " +
      "endpoint should hash that instead.",
  });
}
