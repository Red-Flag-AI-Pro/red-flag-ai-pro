import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// Blocks server side request forgery on the public URL tools. Anyone can POST
// a URL to the free checkers, so before fetching we must reject anything that
// resolves to a private, loopback, link local or otherwise internal address,
// or the cloud metadata endpoint. Without this, an attacker can make the
// Vercel function fetch internal services and read the response back.

function ipIsBlocked(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const p = ip.split(".").map(Number);
    if (p[0] === 10) return true; // 10.0.0.0/8
    if (p[0] === 127) return true; // loopback
    if (p[0] === 0) return true; // 0.0.0.0/8
    if (p[0] === 169 && p[1] === 254) return true; // link local + metadata 169.254.169.254
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true; // 172.16.0.0/12
    if (p[0] === 192 && p[1] === 168) return true; // 192.168.0.0/16
    if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true; // CGNAT 100.64.0.0/10
    return false;
  }
  if (v === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true; // loopback / unspecified
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local
    if (lower.startsWith("fe80")) return true; // link local
    if (lower.startsWith("::ffff:")) {
      // IPv4 mapped — re-check the embedded v4 address
      const embedded = lower.split(":").pop() ?? "";
      if (isIP(embedded) === 4) return ipIsBlocked(embedded);
    }
    return false;
  }
  return true; // not a literal IP and could not be classified — refuse
}

// Validates a user supplied URL and returns the safe, normalised URL string,
// or an error message. Only http/https on the default web ports are allowed,
// and the host must resolve to a public address.
export async function assertSafePublicUrl(
  raw: string
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  let candidate = raw.trim();
  if (!candidate) return { ok: false, error: "A URL is required." };
  if (!candidate.startsWith("http://") && !candidate.startsWith("https://")) {
    candidate = `https://${candidate}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, error: "Please enter a valid URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are supported." };
  }
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    return { ok: false, error: "Only standard web ports are supported." };
  }

  const host = parsed.hostname.replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".internal") ||
    host.endsWith(".local")
  ) {
    return { ok: false, error: "That address is not reachable." };
  }

  // If the host is a literal IP, classify it directly; otherwise resolve every
  // address it maps to and reject if any is internal (defends against a
  // hostname that resolves to a private IP).
  try {
    if (isIP(host)) {
      if (ipIsBlocked(host)) return { ok: false, error: "That address is not reachable." };
    } else {
      const results = await lookup(host, { all: true });
      if (results.length === 0) return { ok: false, error: "That address is not reachable." };
      for (const r of results) {
        if (ipIsBlocked(r.address)) return { ok: false, error: "That address is not reachable." };
      }
    }
  } catch {
    return { ok: false, error: "Could not resolve that URL." };
  }

  return { ok: true, url: parsed.toString() };
}
