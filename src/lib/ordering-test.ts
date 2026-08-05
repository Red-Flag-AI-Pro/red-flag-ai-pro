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
    supported: false,
    demonstrable_publicly: false,
    endpoint: null,
    note:
      "Record count committed before export. Not built yet. Reports " +
      "NOT SUPPORTED rather than a false pass.",
  },
  absence_proof: {
    supported: false,
    demonstrable_publicly: false,
    endpoint: null,
    note: "Not built. Reports NOT SUPPORTED rather than a false pass.",
  },
  reconciliation: {
    supported: false,
    demonstrable_publicly: false,
    endpoint: null,
    note:
      "Sample chosen before data is requested. Not built. Reports NOT " +
      "SUPPORTED rather than a false pass.",
  },
  reproducibility: {
    supported: false,
    demonstrable_publicly: false,
    endpoint: null,
    note:
      "Deterministic replay of sealed inputs. Not built. Reports NOT " +
      "SUPPORTED rather than a false pass.",
  },
  consistency_proof: {
    supported: false,
    demonstrable_publicly: false,
    endpoint: null,
    note:
      "Hash chain plus an external RFC 3161 timestamp gives tamper evidence " +
      "today, but not a formal cryptographic consistency proof between two " +
      "chain states. Reports NOT SUPPORTED rather than overclaiming.",
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
