import { createPrivateKey, createPublicKey, sign as edSign, verify as edVerify } from "crypto";

// Ed25519 keypair, private key only ever stored as an env var
// (RFP_BUNDLE_SIGNING_KEY, base64 DER pkcs8). The public key is derived from
// it at runtime rather than stored separately, so there is exactly one
// value to rotate and one place it can leak from.
function getPrivateKey() {
  const raw = process.env.RFP_BUNDLE_SIGNING_KEY;
  if (!raw) throw new Error("RFP_BUNDLE_SIGNING_KEY is not set.");
  return createPrivateKey({ key: Buffer.from(raw, "base64"), format: "der", type: "pkcs8" });
}

export function getBundlePublicKeyPem(): string {
  const pub = createPublicKey(getPrivateKey());
  return pub.export({ type: "spki", format: "pem" }).toString();
}

// Same key sorted, recursive canonical JSON used by the audit log
// (src/lib/audit-log.ts) — one canonical form so a bundle re-serialized by
// any JSON library, in any key order, still verifies against its signature.
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>).sort();
    const body = keys
      .filter((k) => (value as Record<string, unknown>)[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${canonicalJson((value as Record<string, unknown>)[k])}`)
      .join(",");
    return `{${body}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export interface DecisionBundleFlag {
  category: string;
  severity: string;
}

export interface DecisionBundleGoverningRecord {
  id: string;
  decision: string;
  owner_name: string;
  owner_role: string;
  authority_mode: string | null;
  expires_at: string | null;
  permission_fingerprint: string | null;
  // Whether the linked credential's live scope still matched the sealed
  // fingerprint AT THE MOMENT THIS BUNDLE WAS EXPORTED — a later export of
  // the same decision could show a different value if drift is detected in
  // between, since this is a property of the credential's current state,
  // not of the decision itself.
  fingerprint_intact_at_export: boolean | null;
}

// The full authority state at one moment for one decision — deliberately
// including the governing record's terms as they stood at export time, not
// just a pointer to it, since the record itself can change (or lapse) after
// the bundle is handed to someone offline who can no longer look it up.
export interface DecisionBundle {
  version: 1;
  decision_id: string;
  checked_at: string;
  title: string;
  score: number;
  threshold: number;
  allowed: boolean;
  block_reason: string | null;
  flag_count: number;
  flags: DecisionBundleFlag[];
  governing_record: DecisionBundleGoverningRecord | null;
  exported_at: string;
  exported_by: "redflagaipro.com";
}

export interface SignedDecisionBundle {
  bundle: DecisionBundle;
  signature: string;
  algorithm: "ed25519";
  public_key_pem: string;
  public_key_url: string;
}

export function signDecisionBundle(bundle: DecisionBundle): SignedDecisionBundle {
  const message = Buffer.from(canonicalJson(bundle), "utf8");
  const signature = edSign(null, message, getPrivateKey()).toString("base64");
  return {
    bundle,
    signature,
    algorithm: "ed25519",
    public_key_pem: getBundlePublicKeyPem(),
    public_key_url: "https://www.redflagaipro.com/api/verify/signing-key",
  };
}

// Used by the offline verifier's sibling check (src/app/api/verify/signing-key
// tests against this) and by the API route's own self-check before it ever
// hands a bundle to a customer — never trust a signature without also
// confirming the code that made it can still verify it.
export function verifyDecisionBundle(signed: SignedDecisionBundle): boolean {
  try {
    const message = Buffer.from(canonicalJson(signed.bundle), "utf8");
    const publicKey = createPublicKey(signed.public_key_pem);
    return edVerify(null, message, publicKey, Buffer.from(signed.signature, "base64"));
  } catch {
    return false;
  }
}
