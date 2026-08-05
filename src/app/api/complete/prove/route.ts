import { NextResponse } from "next/server";
import { getAbsenceProof } from "@/lib/audit-proofs";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// Public, unauthenticated. ?value=<hash> — proves whether that hash is
// present in Red Flag's own public chain, or absent, shown by the two real
// adjacent entries that bracket where it would sort if it existed. Try a
// value that isn't there.
export async function GET(request: Request) {
  const { allowed } = await checkRateLimit(`complete_prove:${clientIp(request)}`, 30, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const value = searchParams.get("value");

  if (!value || typeof value !== "string" || value.length > 500) {
    return NextResponse.json({ error: "Expected a ?value=<hash> query parameter." }, { status: 400 });
  }

  const result = await getAbsenceProof(value);

  if (result.present) {
    return NextResponse.json({
      value,
      present: true,
      entry_id: result.entryId,
      verify: `https://www.redflagaipro.com/verify?id=${result.entryId}`,
    });
  }

  return NextResponse.json({
    value,
    present: false,
    lower_neighbor: result.lowerNeighbor,
    upper_neighbor: result.upperNeighbor,
    why:
      "These are the two real chain entries immediately either side of where this value would sort " +
      "if it existed. Nothing sits between them, so nothing was removed to make room for it.",
  });
}
