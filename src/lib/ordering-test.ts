// Serving layer for Red Flag's own mirror of the Ordering Test discovery
// document, matching the shape AILeash (sebbi.pro) publishes at
// /.well-known/ordering-test.json, but honest about what Red Flag itself
// can actually demonstrate today.
//
// Deliberately does not embed a shared runner file. Justin sent the serving
// glue (modules/standard.py) on 5 Aug 2026, not the actual test file with
// the eight checks, and that file has not been jointly agreed yet. Publishing
// something here that claims to be "the standard" before both sides have
// actually agreed the checks (planned for 16 Aug) would misrepresent a draft
// as settled. This document only describes Red Flag's own side.

export const VENDOR = "Red Flag AI Pro";
export const BASE_URL = "https://www.redflagaipro.com";
export const ORDERING_TEST_DOC_VERSION = "0.1";

interface CheckStatus {
  supported: boolean;
  demonstrable_publicly: boolean;
  endpoint: string | null;
  note: string;
}

// Every check kept honest against what is actually built, not aspirational.
export const CHECKS: Record<string, CheckStatus> = {
  rule_binding: {
    supported: true,
    demonstrable_publicly: false,
    endpoint: null,
    note:
      "Every scan is tied to the ruleset version that judged it at the moment " +
      "of decision, not attached afterward. Built and live. Not yet exposed " +
      "as a public unauthenticated endpoint, only viewable inside an account.",
  },
  commit_before_reveal: {
    supported: true,
    demonstrable_publicly: false,
    endpoint: null,
    note:
      "A Sentinel reviewer's own read of a flag is sealed before the AI's " +
      "reasoning is shown to them, both timestamps stored. Built and live. " +
      "Requires a Sentinel-plan account to demonstrate, no public endpoint yet.",
  },
  authority_tokens: {
    supported: true,
    demonstrable_publicly: false,
    endpoint: null,
    note:
      "Boundary authorization records extend to API keys and agent " +
      "credentials, authority granted before the action rather than " +
      "justified after. Built and live. Account-gated, not yet public.",
  },
  mutual_witnessing: {
    supported: true,
    demonstrable_publicly: true,
    endpoint: "/api/witness/tip",
    note:
      "Live, working both directions with an external peer chain right now. " +
      "No account needed, run it yourself.",
  },
  completeness_proof: {
    supported: true,
    demonstrable_publicly: true,
    endpoint: "/api/complete/root",
    note:
      "A record-count checkpoint for Red Flag's own public chain is sealed " +
      "daily, before any export could reference it. Built off the existing " +
      "hash chain rather than a separate Merkle tree — a sealed count catches " +
      "tail truncation the same way an inclusion proof would, without needing " +
      "a tree structure. No account needed, run it yourself.",
  },
  absence_proof: {
    supported: true,
    demonstrable_publicly: true,
    endpoint: "/api/complete/prove?value={value}",
    note:
      "Given a hash, returns either where it's present, or the two real " +
      "adjacent chain entries that bracket where it would sort if it existed " +
      "— proof by adjacency on the existing linear chain, not a Merkle tree. " +
      "Try a value that isn't there.",
  },
  reconciliation: {
    supported: true,
    demonstrable_publicly: false,
    endpoint: null,
    note:
      "A sample of a customer's own audit entries is sealed before it's used " +
      "for anything, so a flattering sample can't be picked after the fact. " +
      "Built and live, account-gated by nature — a sample needs a real " +
      "account's real data, so there's no honest way to demonstrate it " +
      "without one.",
  },
  reproducibility: {
    supported: true,
    demonstrable_publicly: true,
    endpoint: "/api/replay/challenge",
    note:
      "The scanner's core scoring has no model call and no randomness, so " +
      "the same input under the same ruleset always produces the same " +
      "output. Submit content, get a sealed ticket back; resubmit the exact " +
      "same input to /api/replay/verify later and the ticket must match. " +
      "Ruleset fingerprint at /api/replay/fingerprint.",
  },
  consistency_proof: {
    supported: false,
    demonstrable_publicly: false,
    endpoint: null,
    note:
      "Proving the chain only ever grew (nothing was reordered or rewritten " +
      "in the middle) needs a formal cryptographic consistency proof between " +
      "two chain states. Not built. Reports NOT SUPPORTED rather than " +
      "overclaiming — kept separate from external_anchoring below, since " +
      "they answer different questions.",
  },
  external_anchoring: {
    supported: true,
    demonstrable_publicly: true,
    endpoint: "/api/anchor-status",
    note:
      "Proves the time itself was fixed somewhere Red Flag doesn't control, " +
      "answering a different question than consistency_proof above: a chain " +
      "can be perfectly append-only and still have been built last week. " +
      "Anchored via RFC 3161, a third-party timestamp authority — a " +
      "different external mechanism than a peer using OpenTimestamps into " +
      "Bitcoin, same underlying claim. The spec should name the mechanism " +
      "rather than mandate one.",
  },
};

export function buildDiscoveryDocument() {
  return {
    ordering_test_version: ORDERING_TEST_DOC_VERSION,
    vendor: VENDOR,
    base_url: BASE_URL,
    runner: null,
    runner_note:
      "No shared runner file is published here yet. The actual test (the " +
      "checks themselves) has not been jointly agreed with other mirrors as " +
      "of this document's publication. This describes Red Flag's own side " +
      "only, not a settled cross-vendor standard.",
    checks: CHECKS,
    witness_peers: BASE_URL + "/api/witness/tip",
    note:
      "Every endpoint marked demonstrable_publicly is unauthenticated by " +
      "design, run it yourself without asking us. Checks marked supported " +
      "but not demonstrable_publicly are real and built, but currently " +
      "require a logged-in Sentinel account to see, not yet a public " +
      "unauthenticated proof. Checks marked not supported report that " +
      "plainly rather than passing on the day this was published.",
  };
}
