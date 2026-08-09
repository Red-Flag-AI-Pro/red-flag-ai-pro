// Content-derived fingerprint of an API key's approved permission scope,
// sealed into a boundary authorization record at approval time. Same FNV-1a
// approach as RULESET_VERSION: any change to the approved scope produces a
// different fingerprint, so "the live key no longer matches what was
// approved" is a mechanical comparison, not something a person has to notice.
//
// The material string is versioned by construction: adding future scope
// fields (rate limits, allowed categories) extends the material, which
// changes every fingerprint, which flags every linked record for
// re-approval — the correct behaviour when the definition of "scope" itself
// widens.

export function computePermissionFingerprint(scope: { approvedThreshold: number; modelVersion?: string | null }): string {
  const material = `threshold|${scope.approvedThreshold}|model|${scope.modelVersion?.trim() || "unspecified"}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < material.length; i++) {
    h ^= material.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `pf-${h.toString(16).padStart(8, "0")}`;
}
