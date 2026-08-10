import { NextResponse } from "next/server";
import { getBundlePublicKeyPem } from "@/lib/decision-bundle";

// Public, unauthenticated. The public key is not a secret — it is the one
// thing a verifier needs that they should NOT have to take Red Flag's word
// for at the moment they need it, so it is served as a stable value they can
// fetch once, save, and check bundles against forever without calling this
// route again.
export async function GET() {
  return NextResponse.json({
    algorithm: "ed25519",
    public_key_pem: getBundlePublicKeyPem(),
    note: "Signs offline verifiable Real-Time Gate decision bundles. Save this key rather than re-fetching it before every check.",
  });
}
