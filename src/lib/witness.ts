// The company's own append-only chain, used for authorship seals and now
// for witness network anchoring. Same account the "who, when, whether"
// concept document was sealed under on 30 Jul 2026.
export const WITNESS_CHAIN_USER_ID = "6fb19075-d78b-4395-bdd2-66c8f1aa73ee";

export const WITNESS_CHAIN_NAME = "red-flag-ai-pro";

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
export function parseWitnessPayload(body: unknown): WitnessPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const chain = typeof b.chain === "string" ? b.chain.trim() : "";
  const tip = typeof b.tip === "string" ? b.tip.trim() : "";
  const countRaw = b.count;
  const count = typeof countRaw === "number" ? countRaw : Number(countRaw);
  const ts = typeof b.ts === "string" ? b.ts : new Date().toISOString();
  const url = typeof b.url === "string" ? b.url : undefined;

  if (!chain || !tip || !Number.isFinite(count) || count < 0) return null;

  return { chain, tip, count, ts, url };
}
