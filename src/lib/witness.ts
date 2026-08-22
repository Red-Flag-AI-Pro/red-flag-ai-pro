// The company's own append-only chain, used for authorship seals and now
// for witness network anchoring. Same account the "who, when, whether"
// concept document was sealed under on 30 Jul 2026.
export const WITNESS_CHAIN_USER_ID = "6fb19075-d78b-4395-bdd2-66c8f1aa73ee";

export const WITNESS_CHAIN_NAME = "red-flag-ai-pro";

export interface WitnessPeer {
  name: string;
  url: string;
}

// Every chain we actively push our tip to. This used to be a single
// hardcoded URL baked into the push logic itself, meaning bringing in a
// second chain would have meant editing the function, not just adding a
// line here. Adding a new approved peer is now the entire integration.
export const APPROVED_PEERS: WitnessPeer[] = [
  {
    name: "sebbi.pro / AILeash",
    // His own /x/witness/tip response says to hand peers their tip at
    // /observe, not the base path.
    url: "https://sebbi.pro/x/witness/observe",
  },
  {
    name: "NexusTrinity",
    url: "https://nexustrinity.io/api/witness/anchor",
  },
];

export interface WitnessPayload {
  chain: string;
  tip: string;
  count: number;
  ts: string;
  url?: string;
}

// Accepts the loose shapes real clients send (numbers as strings, etc) and
// validates only what matters: chain and tip must identify something,
// count must be a real count. Everything else is stored as given.
// Generous but bounded — real values here are short identifiers and hex
// hashes. Caps exist only to stop an abusive peer from stuffing an
// oversized string into a log row, not because any legitimate value comes
// close to these lengths.
const MAX_CHAIN_LENGTH = 200;
const MAX_TIP_LENGTH = 500;
const MAX_URL_LENGTH = 2000;

export function parseWitnessPayload(body: unknown): WitnessPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  // Some peers (AILeash/sebbi.pro's current build) send "peer" instead of
  // the spec's "chain" — accept either so their deviation doesn't 400 us.
  const chain = typeof b.chain === "string" ? b.chain.trim()
    : typeof b.peer === "string" ? b.peer.trim() : "";
  const tip = typeof b.tip === "string" ? b.tip.trim() : "";
  const countRaw = b.count;
  const count = typeof countRaw === "number" ? countRaw : Number(countRaw);
  const ts = typeof b.ts === "string" ? b.ts : new Date().toISOString();
  const url = typeof b.url === "string" ? b.url : undefined;

  if (!chain || !tip || !Number.isFinite(count) || count < 0) return null;
  if (chain.length > MAX_CHAIN_LENGTH || tip.length > MAX_TIP_LENGTH) return null;
  if (url && url.length > MAX_URL_LENGTH) return null;

  return { chain, tip, count, ts, url };
}
