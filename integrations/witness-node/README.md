# Witness Node

An installable, standalone reference implementation of a [Red Flag Witness Network](https://www.redflagaipro.com/witness-network) node. Run it on your own infrastructure to seal your own events into your own independent hash chain, verify that chain yourself, and — optionally — anchor its tip into the Red Flag chain, or any other [Open Witness Standard](https://www.redflagaipro.com/witness-standard) peer, on a schedule.

This is not a client of Red Flag's product. It is a self-contained peer. Nothing you seal here ever leaves your infrastructure except the tip hash this program chooses to push, and only if you set `WITNESS_PEER_URL`. Read `server.js` — it is one file, no dependencies, on purpose. There is nothing to audit but this.

## Why run your own node instead of the hosted version

The [hosted witnessing offering](https://www.redflagaipro.com/witness-network/hosting) has Red Flag host the dashboard and hold the chain on your behalf — simpler, but you are still trusting Red Flag's infrastructure. Running your own node makes you a genuine independent peer: your chain lives on your servers, under your control, and the only thing anyone outside your business ever sees is a hash, not your underlying data.

## Install and run

```bash
git clone https://github.com/Red-Flag-AI-Pro/red-flag-ai-pro
cd red-flag-ai-pro/integrations/witness-node
WITNESS_CHAIN_NAME="your-company-name" \
WITNESS_SEAL_TOKEN="$(openssl rand -hex 24)" \
node server.js
```

Requires Node 18 or later. No `npm install` needed — there are no dependencies.

## Configuration

| Variable | Required | Default | Meaning |
|---|---|---|---|
| `WITNESS_CHAIN_NAME` | Yes | — | The name your chain anchors under |
| `WITNESS_SEAL_TOKEN` | Yes | — | Bearer token required to POST `/api/seal` |
| `PORT` | No | `7979` | Local port |
| `WITNESS_DATA_DIR` | No | `./data` | Where `chain.jsonl` is written |
| `WITNESS_PEER_URL` | No | — | e.g. `https://www.redflagaipro.com` — set to anchor into a peer chain |
| `WITNESS_PEER_URL_PUBLIC` | No | — | Your own public URL, sent to the peer so your log can be read back |
| `WITNESS_PUSH_INTERVAL_HOURS` | No | `12` | How often to anchor, if `WITNESS_PEER_URL` is set |

## API

- `GET /` — a local dashboard: chain integrity, entry count, current tip, last peer anchor, recent entries.
- `GET /api/tip` — `{ chain, tip, count, ts, url? }`, the same five-field shape the Open Witness Standard uses everywhere else, so this node can push into any compliant peer unmodified.
- `GET /api/log?limit=100` — recent sealed entries.
- `GET /api/verify` — walks the whole local chain, recomputes every hash, confirms the links. `{ valid, checked, length, brokenAtId? }`.
- `POST /api/seal` — requires `Authorization: Bearer <WITNESS_SEAL_TOKEN>`. Body: `{ actor, action, details }`. Appends one entry to your chain and returns it, hash included.

## How the chain works

Every entry's hash is `sha256(prevHash|actor|action|canonicalJson(details)|canonicalTimestamp(createdAt))`, genesis is 64 zero characters. This is the identical algorithm the hosted Red Flag chain uses (`src/lib/audit-log.ts` in the main repo) — a customer running this node and an auditor reading `chain.jsonl` cold can both recompute every hash by hand with nothing but SHA-256 and this formula. Nobody has to trust either codebase; the arithmetic is checkable.

## Security

`GET` endpoints are unauthenticated by design — this is meant to run inside your own perimeter, not on the open internet. If you need to expose it beyond your own network, put your own authentication in front of it first. `POST /api/seal` is the one endpoint that requires a bearer token, because it is the one endpoint that changes anything.

## License

Same open terms as [`integrations/witness-sdk/witness-client.js`](../witness-sdk/witness-client.js): copy it, adapt it, run it as-is. MIT.
