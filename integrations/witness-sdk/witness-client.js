// A thin, dependency-free reference client for the Open Witness Standard
// (https://www.redflagaipro.com/witness-standard). One file, no build step,
// no package to install — copy it into your own codebase and use it, or
// treat it as the reference for writing your own in another language.
// Works in Node 18+ (global fetch) and in the browser.
//
// The standard is deliberately small: five fields, three jobs. This file
// does not add anything on top of that — no auth, no retries beyond what's
// documented, no hidden defaults. What you see here is the whole client.

/**
 * @typedef {Object} WitnessPayload
 * @property {string} chain - The name your chain is known by on the network.
 * @property {string} tip - The current hash at the end of your chain (64 hex chars for SHA-256).
 * @property {number} count - How many entries your chain holds.
 * @property {string} ts - ISO 8601 timestamp for when this tip was current.
 * @property {string} [url] - Optional. Where a peer can pull your tip back.
 */

/**
 * Job 1: pull a peer's current tip.
 * @param {string} peerBaseUrl - e.g. "https://www.redflagaipro.com"
 * @returns {Promise<WitnessPayload>}
 */
export async function getTip(peerBaseUrl) {
  const res = await fetch(`${peerBaseUrl.replace(/\/$/, "")}/api/witness/tip`);
  if (!res.ok) throw new Error(`getTip failed: ${res.status} ${await res.text()}`);
  return res.json();
}

/**
 * Job 2 (as the sender): push your own tip to a peer's anchor endpoint,
 * asking them to seal it. Only treat this as a successful anchor if the
 * response is 2xx — do not log a send as successful on any other status,
 * per the standard's "never claim more than happened" rule.
 * @param {string} peerBaseUrl
 * @param {WitnessPayload} payload
 * @returns {Promise<{ ok: boolean, status: number, body: any }>}
 */
export async function pushTip(peerBaseUrl, payload) {
  const res = await fetch(`${peerBaseUrl.replace(/\/$/, "")}/api/witness/anchor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let body;
  try {
    body = await res.json();
  } catch {
    body = await res.text();
  }
  return { ok: res.ok, status: res.status, body };
}

/**
 * Job 2 (as the receiver): validate an incoming payload has the five
 * required fields in the right shape before you seal it. Does not seal
 * anything itself — sealing is your own chain's job, this only checks the
 * payload is well formed so you don't seal garbage.
 * @param {unknown} payload
 * @returns {{ valid: true, payload: WitnessPayload } | { valid: false, error: string }}
 */
export function validateIncomingPayload(payload) {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, error: "Payload must be a JSON object." };
  }
  const p = /** @type {Record<string, unknown>} */ (payload);
  if (typeof p.chain !== "string" || !p.chain.trim()) return { valid: false, error: "chain must be a non-empty string." };
  if (typeof p.tip !== "string" || !/^[a-f0-9]{64}$/i.test(p.tip)) return { valid: false, error: "tip must be a 64 character hex string." };
  if (typeof p.count !== "number" || p.count < 0) return { valid: false, error: "count must be a non-negative number." };
  if (typeof p.ts !== "string" || isNaN(Date.parse(p.ts))) return { valid: false, error: "ts must be a valid ISO 8601 timestamp." };
  if (p.url !== undefined && typeof p.url !== "string") return { valid: false, error: "url, if present, must be a string." };
  return { valid: true, payload: /** @type {WitnessPayload} */ (p) };
}

/**
 * Cadence/staleness helper, matching the standard's published thresholds:
 * push at least every 24 hours, treat a peer as stale after 72 hours with
 * no accepted anchor. Pure function, no I/O — feed it a last-seen timestamp.
 * @param {string} lastAcceptedTs - ISO 8601 timestamp of the last accepted anchor from this peer.
 * @param {Date} [now]
 * @returns {{ stale: boolean, hoursSinceLastAnchor: number }}
 */
export function isStale(lastAcceptedTs, now = new Date()) {
  const hours = (now.getTime() - new Date(lastAcceptedTs).getTime()) / (1000 * 60 * 60);
  return { stale: hours > 72, hoursSinceLastAnchor: Math.round(hours * 10) / 10 };
}
