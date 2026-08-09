// Witness Node — an installable, standalone reference implementation of a
// Red Flag Witness Network node. Run this on your own infrastructure to seal
// your own events into your own independent hash chain, verify that chain
// yourself, and (optionally) anchor its tip into the Red Flag chain, or any
// other Open Witness Standard peer, on a schedule.
//
// This is not a client of Red Flag's product. It is a self-contained peer.
// Nothing you seal here ever leaves your infrastructure except the tip hash
// this file chooses to push, and only if WITNESS_PEER_URL is set.
//
// Same open terms as integrations/witness-sdk/witness-client.js: copy it
// into your own codebase, adapt it, run it as-is. No dependencies on
// purpose, so there is nothing to audit but this one file.
//
// Config (env vars):
//   PORT                        default 7979
//   WITNESS_CHAIN_NAME          required — the name this node anchors under
//   WITNESS_DATA_DIR            default ./data — where chain.jsonl lives
//   WITNESS_SEAL_TOKEN          required — bearer token needed to POST /api/seal
//   WITNESS_PEER_URL            optional — e.g. https://www.redflagaipro.com
//   WITNESS_PEER_URL_PUBLIC     optional — this node's own public URL, sent
//                                as `url` in the anchor payload so the peer
//                                can read your log back, if you expose one
//   WITNESS_PUSH_INTERVAL_HOURS default 12
//
// Security note: this server trusts its own network. GET endpoints (tip,
// log, verify, the dashboard) are unauthenticated by design, because this
// is meant to run inside your own perimeter. Do not expose it to the public
// internet without putting your own auth in front of it.

const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 7979);
const CHAIN_NAME = process.env.WITNESS_CHAIN_NAME || "";
const DATA_DIR = process.env.WITNESS_DATA_DIR || path.join(__dirname, "data");
const SEAL_TOKEN = process.env.WITNESS_SEAL_TOKEN || "";
const PEER_URL = (process.env.WITNESS_PEER_URL || "").replace(/\/$/, "");
const PEER_URL_PUBLIC = process.env.WITNESS_PEER_URL_PUBLIC || undefined;
const PUSH_INTERVAL_HOURS = Number(process.env.WITNESS_PUSH_INTERVAL_HOURS || 12);

if (!CHAIN_NAME) {
  console.error("WITNESS_CHAIN_NAME is required. Set it to the name your chain anchors under, then restart.");
  process.exit(1);
}
if (!SEAL_TOKEN) {
  console.error("WITNESS_SEAL_TOKEN is required. Generate one (e.g. `openssl rand -hex 24`) and set it, then restart.");
  process.exit(1);
}

const GENESIS_HASH = "0".repeat(64);
const CHAIN_FILE = path.join(DATA_DIR, "chain.jsonl");

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(CHAIN_FILE)) fs.writeFileSync(CHAIN_FILE, "");

// Same canonicalization the hosted Red Flag chain uses, so this algorithm
// is reproducible independently of both codebases: recursively key-sorted
// JSON, millisecond-precision ISO timestamps. Anyone can re-derive every
// hash in chain.jsonl by hand with nothing but this function and openssl.
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

function canonicalTimestamp(ts) {
  const parsed = new Date(ts);
  return isNaN(parsed.getTime()) ? ts : parsed.toISOString();
}

function computeHash(prevHash, entry) {
  const payload = `${prevHash}|${entry.actor}|${entry.action}|${canonicalJson(entry.details)}|${canonicalTimestamp(entry.created_at)}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

// Loaded into memory at boot, appended to on every seal. Fine at the scale
// a single installed node is meant for; chain.jsonl is the durable copy.
let entries = fs
  .readFileSync(CHAIN_FILE, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

let lastPush = null; // { ok, tip, count, at, error? }

function tip() {
  const last = entries[entries.length - 1];
  return {
    chain: CHAIN_NAME,
    tip: last ? last.hash : GENESIS_HASH,
    count: entries.length,
    ts: new Date().toISOString(),
    ...(PEER_URL_PUBLIC ? { url: PEER_URL_PUBLIC } : {}),
  };
}

function seal(actor, action, details) {
  const prevHash = entries.length ? entries[entries.length - 1].hash : GENESIS_HASH;
  const createdAt = new Date().toISOString();
  const hash = computeHash(prevHash, { actor, action, details, created_at: createdAt });
  const entry = {
    id: crypto.randomUUID(),
    actor,
    action,
    details,
    created_at: createdAt,
    prev_hash: prevHash,
    hash,
  };
  entries.push(entry);
  fs.appendFileSync(CHAIN_FILE, JSON.stringify(entry) + "\n");
  return entry;
}

function verify() {
  let expected = GENESIS_HASH;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.prev_hash !== expected) {
      return { valid: false, checked: i, length: entries.length, brokenAtId: e.id };
    }
    const recomputed = computeHash(e.prev_hash, {
      actor: e.actor,
      action: e.action,
      details: e.details,
      created_at: e.created_at,
    });
    if (recomputed !== e.hash) {
      return { valid: false, checked: i, length: entries.length, brokenAtId: e.id, reason: "hash mismatch" };
    }
    expected = e.hash;
  }
  return { valid: true, checked: entries.length, length: entries.length };
}

async function pushTipToPeer() {
  if (!PEER_URL) return;
  const payload = tip();
  try {
    const res = await fetch(`${PEER_URL}/api/witness/anchor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => null);
    lastPush = { ok: res.ok, tip: payload.tip, count: payload.count, at: new Date().toISOString(), status: res.status, body };
    console.log(`[witness-node] anchored to ${PEER_URL} — ${res.ok ? "accepted" : "rejected"} (${res.status})`);
  } catch (err) {
    lastPush = { ok: false, tip: payload.tip, count: payload.count, at: new Date().toISOString(), error: String(err) };
    console.error(`[witness-node] anchor to ${PEER_URL} failed:`, err);
  }
}

function requireSealToken(req) {
  const header = req.headers["authorization"] || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token === SEAL_TOKEN;
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function dashboardHtml() {
  const v = verify();
  const t = tip();
  const rows = entries
    .slice(-50)
    .reverse()
    .map(
      (e) =>
        `<tr><td>${e.created_at}</td><td>${escapeHtml(e.actor)}</td><td>${escapeHtml(e.action)}</td><td class="mono">${e.hash.slice(0, 16)}…</td></tr>`
    )
    .join("");
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Witness Node — ${escapeHtml(CHAIN_NAME)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { background:#0A1628; color:#F4F1EA; font-family: system-ui, sans-serif; margin:0; padding:2.5rem 1.5rem; }
  .mono { font-family: 'DM Mono', 'Courier New', monospace; font-size: 0.8em; opacity:0.7; }
  h1 { font-weight:500; font-size:1.6rem; margin-bottom:0.25rem; }
  .sub { opacity:0.55; font-size:0.9rem; margin-bottom:2rem; }
  .stats { display:flex; gap:1.5rem; flex-wrap:wrap; margin-bottom:2rem; }
  .stat { border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:1rem 1.25rem; min-width:140px; }
  .stat .label { font-size:0.7rem; text-transform:uppercase; letter-spacing:0.08em; opacity:0.5; margin-bottom:0.4rem; }
  .stat .value { font-size:1.3rem; font-weight:700; }
  .ok { color:#4ade80; } .bad { color:#ef4444; }
  table { width:100%; border-collapse:collapse; font-size:0.85rem; }
  th, td { text-align:left; padding:0.5rem 0.75rem; border-bottom:1px solid rgba(255,255,255,0.06); }
  th { opacity:0.5; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.06em; }
</style></head>
<body>
  <h1>Witness Node — ${escapeHtml(CHAIN_NAME)}</h1>
  <p class="sub">Self-hosted. Every hash on this page is independently recomputable from chain.jsonl with nothing but SHA-256.</p>
  <div class="stats">
    <div class="stat"><div class="label">Chain integrity</div><div class="value ${v.valid ? "ok" : "bad"}">${v.valid ? "Intact" : "Broken"}</div></div>
    <div class="stat"><div class="label">Entries sealed</div><div class="value">${t.count}</div></div>
    <div class="stat"><div class="label">Current tip</div><div class="value mono">${t.tip.slice(0, 12)}…</div></div>
    <div class="stat"><div class="label">Last peer anchor</div><div class="value ${lastPush ? (lastPush.ok ? "ok" : "bad") : ""}" style="font-size:0.95rem">${
    lastPush ? (lastPush.ok ? "Accepted" : "Failed") + " " + lastPush.at : PEER_URL ? "Not yet" : "No peer configured"
  }</div></div>
  </div>
  <table>
    <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Hash</th></tr></thead>
    <tbody>${rows || `<tr><td colspan="4" style="opacity:0.5">Nothing sealed yet. POST to /api/seal to start the chain.</td></tr>`}</tbody>
  </table>
</body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(dashboardHtml());
  }

  if (req.method === "GET" && url.pathname === "/api/tip") {
    return json(res, 200, tip());
  }

  if (req.method === "GET" && url.pathname === "/api/log") {
    const limit = Math.min(Number(url.searchParams.get("limit") || 100), 1000);
    return json(res, 200, { chain: CHAIN_NAME, entries: entries.slice(-limit) });
  }

  if (req.method === "GET" && url.pathname === "/api/verify") {
    return json(res, 200, verify());
  }

  if (req.method === "POST" && url.pathname === "/api/seal") {
    if (!requireSealToken(req)) return json(res, 401, { error: "Missing or invalid bearer token." });
    let body = "";
    for await (const chunk of req) body += chunk;
    let parsed;
    try {
      parsed = JSON.parse(body || "{}");
    } catch {
      return json(res, 400, { error: "Body must be JSON." });
    }
    const actor = String(parsed.actor || "").trim();
    const action = String(parsed.action || "").trim();
    const details = parsed.details && typeof parsed.details === "object" ? parsed.details : {};
    if (!actor || !action) return json(res, 400, { error: "actor and action are required." });
    const entry = seal(actor, action, details);
    return json(res, 201, entry);
  }

  json(res, 404, { error: "Not found." });
});

server.listen(PORT, () => {
  console.log(`[witness-node] "${CHAIN_NAME}" listening on :${PORT} — ${entries.length} entries loaded from ${CHAIN_FILE}`);
  if (PEER_URL) {
    console.log(`[witness-node] will anchor to ${PEER_URL} every ${PUSH_INTERVAL_HOURS}h`);
    pushTipToPeer();
    setInterval(pushTipToPeer, PUSH_INTERVAL_HOURS * 60 * 60 * 1000);
  } else {
    console.log("[witness-node] WITNESS_PEER_URL not set — running standalone, not anchoring anywhere.");
  }
});
