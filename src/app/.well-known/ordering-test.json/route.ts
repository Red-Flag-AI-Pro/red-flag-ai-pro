import { NextResponse } from "next/server";
import { buildDiscoveryDocument } from "@/lib/ordering-test";

// Public, unauthenticated by design, same reasoning as the witness endpoints:
// an auditor should be able to fetch this from their own machine without
// asking Red Flag for anything first.
export async function GET() {
  return NextResponse.json(buildDiscoveryDocument());
}
