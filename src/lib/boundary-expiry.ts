// Only ever pulls a boundary record's expiry earlier, never later — a record
// already expiring sooner than today (already past, or already tighter than
// "now") is left alone rather than pushed later, same rule the manual
// trigger-falsifier route uses. Shared so drift detection (cron + the live
// enforce call) and the manual falsifier trigger can never quietly diverge.
export function pulledForwardExpiry(currentExpiresAt: string | null, today: string): string {
  return !currentExpiresAt || currentExpiresAt > today ? today : currentExpiresAt;
}
