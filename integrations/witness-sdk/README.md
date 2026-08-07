# Open Witness Standard — thin reference client

One file (`witness-client.js`), no dependencies, no build step. Copy it into your own codebase, or read it as the reference for implementing the standard in another language. Matches the published spec at [redflagaipro.com/witness-standard](https://www.redflagaipro.com/witness-standard) exactly — five fields, three jobs, plus the cadence/staleness thresholds from the exit and cadence semantics.

## Use it

```js
import { getTip, pushTip, validateIncomingPayload, isStale } from "./witness-client.js";

// Pull a peer's current tip
const peerTip = await getTip("https://www.redflagaipro.com");

// Push your own tip to a peer, asking them to seal it
const result = await pushTip("https://www.redflagaipro.com", {
  chain: "My Company Chain",
  tip: "a1b2c3...", // your chain's current 64-char hex hash
  count: 142,
  ts: new Date().toISOString(),
  url: "https://mycompany.com/api/witness/tip",
});
if (result.ok) {
  console.log("Sealed:", result.body);
}

// Validate a payload you received before sealing it into your own chain
const check = validateIncomingPayload(req.body);
if (!check.valid) {
  return res.status(400).json({ error: check.error });
}

// Check whether a peer has gone stale (72h+ since last accepted anchor)
const { stale, hoursSinceLastAnchor } = isStale(peer.lastAnchorTs);
```

## What's deliberately not in here

- No retry/backoff logic — the standard doesn't mandate any, and adding opinionated retry behaviour to a "thin" client would be scope creep
- No auth — the standard has none, by design
- Not published to npm — this is source you copy, not a package you install, keeping the "no lock in" spirit of the standard itself. Publishing to npm is a reasonable next step if real third-party implementers ask for it
