import { createHash } from "crypto";

// RFC 3161 trusted timestamping. Sends the SHA-256 of an audit-log entry's
// hash to a third-party Time Stamping Authority (TSA) and stores the signed
// token it returns. This upgrades the audit trail from "trust our database"
// to "independently timestamped by a third party", verifiable by anyone with
// standard tools (openssl ts -verify) without trusting Red Flag at all.
//
// Verified working against DigiCert and freeTSA (RFC 3161, application/
// timestamp-query). The token is cryptographically signed, so the http vs
// https transport of the TSA endpoint does not affect its integrity.

// DER encoding helpers ------------------------------------------------------

function derLen(n: number): Buffer {
  if (n < 0x80) return Buffer.from([n]);
  const bytes: number[] = [];
  let x = n;
  while (x > 0) {
    bytes.unshift(x & 0xff);
    x >>= 8;
  }
  return Buffer.from([0x80 | bytes.length, ...bytes]);
}

function derTLV(tag: number, content: Buffer): Buffer {
  return Buffer.concat([Buffer.from([tag]), derLen(content.length), content]);
}

const SHA256_OID = Buffer.from([0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01]);
const DER_NULL = Buffer.from([0x05, 0x00]);

// Builds an RFC 3161 TimeStampReq for a 32-byte SHA-256 digest (hex string).
function buildTimestampRequest(sha256Hex: string): Buffer {
  const hash = Buffer.from(sha256Hex, "hex");
  const version = derTLV(0x02, Buffer.from([0x01])); // INTEGER 1
  const algId = derTLV(0x30, Buffer.concat([SHA256_OID, DER_NULL]));
  const imprint = derTLV(0x30, Buffer.concat([algId, derTLV(0x04, hash)]));
  // Nonce: 8 random bytes, high bit cleared so it is a positive INTEGER.
  const nonceBytes = Buffer.from(cryptoRandom(8));
  nonceBytes[0] &= 0x7f;
  const nonce = derTLV(0x02, nonceBytes);
  const certReq = derTLV(0x01, Buffer.from([0xff])); // BOOLEAN TRUE — include the TSA cert
  return derTLV(0x30, Buffer.concat([version, imprint, nonce, certReq]));
}

function cryptoRandom(n: number): Uint8Array {
  // Node crypto without importing the whole module surface at top level.
  return require("crypto").randomBytes(n);
}

// Pulls the first GeneralizedTime (the TSA's genTime) out of the token DER.
// A light scan is enough for display; full verification is done by the TSA
// signature, checkable independently with openssl.
function extractGenTime(der: Buffer): string | null {
  for (let i = 0; i < der.length - 2; i++) {
    if (der[i] === 0x18) {
      const len = der[i + 1];
      if (len > 0 && len < 0x30) {
        const val = der.slice(i + 2, i + 2 + len).toString("ascii");
        const m = val.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
        if (m) {
          return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`;
        }
      }
    }
  }
  return null;
}

// The TSAs to try, in order. DigiCert first for name recognition with a
// compliance audience; freeTSA as a fallback so a single outage does not
// leave a record unstamped.
const TSAS = [
  { name: "DigiCert", url: "http://timestamp.digicert.com" },
  { name: "freeTSA", url: "https://freetsa.org/tsr" },
];

export interface TimestampResult {
  tsa: string;
  token: string; // base64 of the RFC 3161 TimeStampToken
  time: string; // ISO genTime asserted by the TSA
}

// Requests a trusted timestamp for the given content hash (the audit entry's
// chain hash). Returns null on any failure — timestamping must never break
// the action being logged.
export async function requestTimestamp(contentHashHex: string): Promise<TimestampResult | null> {
  // Timestamp the SHA-256 of the entry hash, so the imprint is always a
  // 32-byte digest regardless of the input encoding.
  const digest = createHash("sha256").update(contentHashHex).digest("hex");
  const req = buildTimestampRequest(digest);

  for (const tsa of TSAS) {
    try {
      const res = await fetch(tsa.url, {
        method: "POST",
        headers: { "Content-Type": "application/timestamp-query" },
        body: new Uint8Array(req),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      const time = extractGenTime(buf);
      if (!time) continue;
      return { tsa: tsa.name, token: buf.toString("base64"), time };
    } catch {
      // try the next TSA
    }
  }
  return null;
}
