import { NextResponse } from "next/server";
import { VENDOR, BASE_URL, ORDERING_TEST_DOC_VERSION, CHECKS } from "@/lib/ordering-test";

export async function GET() {
  const supportedCount = Object.values(CHECKS).filter((c) => c.supported).length;
  const publicCount = Object.values(CHECKS).filter((c) => c.demonstrable_publicly).length;

  return NextResponse.json({
    vendor: VENDOR,
    base_url: BASE_URL,
    version: ORDERING_TEST_DOC_VERSION,
    checks_supported: supportedCount,
    checks_total: Object.keys(CHECKS).length,
    checks_publicly_demonstrable: publicCount,
    discovery_document: BASE_URL + "/.well-known/ordering-test.json",
  });
}
