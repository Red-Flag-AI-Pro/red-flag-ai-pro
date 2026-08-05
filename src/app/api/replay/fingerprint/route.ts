import { NextResponse } from "next/server";
import { RULESET_VERSION } from "@/lib/analyzer";

// Public. The "code fingerprint" a replay ticket is valid under — if this
// changes, old tickets stop matching, which is correct: the ruleset really
// did change, so the old verdict shouldn't silently still pass.
export async function GET() {
  return NextResponse.json({ ruleset_version: RULESET_VERSION });
}
