#!/usr/bin/env node
// Offline verifier for Red Flag AI Pro signed decision bundles.
//
// No dependencies beyond Node's built in crypto module. Run entirely on
// your own machine, with no network access, no Red Flag account, and no
// trust in Red Flag's server at the moment you run it — that is the point.
// Save the public key alongside your bundles rather than fetching it fresh
// each time; a server that has already been compromised could serve a
// different key to hide a forged bundle.
//
// Usage:
//   node verify-decision-bundle.js bundle.json
//
// A bundle.json is the exact JSON returned by
// GET /api/enforcement/{id}/signed-bundle — save that response to a file
// and hand the file to whoever needs to verify it, no server round trip
// required at their end.

const fs = require("fs");
const crypto = require("crypto");

const path = process.argv[2];
if (!path) {
  console.error("Usage: node verify-decision-bundle.js <bundle.json>");
  process.exit(1);
}

let signed;
try {
  signed = JSON.parse(fs.readFileSync(path, "utf8"));
} catch (err) {
  console.error(`Could not read or parse ${path}: ${err.message}`);
  process.exit(1);
}

// Must exactly match the canonical form the server signs in
// src/lib/decision-bundle.ts — recursive key-sorted JSON, so the same bundle
// verifies regardless of what order any JSON library happens to serialize
// its keys in.
function canonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value).sort();
    const body = keys
      .filter((k) => value[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`)
      .join(",");
    return `{${body}}`;
  }
  return JSON.stringify(value) ?? "null";
}

if (!signed.bundle || !signed.signature || !signed.public_key_pem) {
  console.error("Not a signed decision bundle: missing bundle, signature, or public_key_pem.");
  process.exit(1);
}

let ok = false;
try {
  const message = Buffer.from(canonicalJson(signed.bundle), "utf8");
  const publicKey = crypto.createPublicKey(signed.public_key_pem);
  ok = crypto.verify(null, message, publicKey, Buffer.from(signed.signature, "base64"));
} catch (err) {
  console.error(`Verification error: ${err.message}`);
  process.exit(1);
}

const b = signed.bundle;

if (ok) {
  console.log("VALID SIGNATURE — this bundle was signed by the key in this file and has not been altered since.\n");
  console.log(`Decision:        ${b.title}`);
  console.log(`Checked at:      ${b.checked_at}`);
  console.log(`Allowed:         ${b.allowed}${b.block_reason ? ` (blocked: ${b.block_reason})` : ""}`);
  console.log(`Score/threshold: ${b.score}/${b.threshold}`);
  console.log(`Flags:           ${b.flag_count}`);
  if (b.governing_record) {
    console.log(`Governed by:     ${b.governing_record.decision} — ${b.governing_record.owner_name} (${b.governing_record.owner_role})`);
    console.log(`  Expires:              ${b.governing_record.expires_at ?? "no expiry set"}`);
    console.log(`  Fingerprint intact at export: ${b.governing_record.fingerprint_intact_at_export}`);
  } else {
    console.log("Governed by:     no boundary authorization record was linked at the time of this decision.");
  }
  console.log(`\nExported at:     ${b.exported_at}`);
  console.log(`Exported by:     ${b.exported_by}`);
  process.exit(0);
} else {
  console.log("INVALID SIGNATURE — this bundle does not match its claimed signature, or the public key does not match the signature. Do not trust this file.");
  process.exit(2);
}
