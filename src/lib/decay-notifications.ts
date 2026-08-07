// Pushes a boundary authorization decay alert (a lapse, or a renewal
// reminder threshold) to a customer's own Slack or Teams incoming webhook,
// alongside the email that already goes to the named owner. Email reaches
// one person; a channel is what actually gets seen by a team before the
// person who's meant to act on it has read their inbox.
//
// Both Slack's incoming webhooks and Microsoft's classic Office 365
// Connector webhooks accept a flat {"text": "..."} payload for a plain
// message — that's the lowest common denominator this targets rather than
// building two separate formatted-card integrations. No custom formatting,
// just the same plain text either platform renders on its own.
export async function sendDecayAlert(webhookUrl: string | null | undefined, text: string): Promise<void> {
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    // Best effort. A customer's webhook being down or misconfigured must
    // never block the underlying seal — the email and the sealed audit
    // entry are the record of truth, this is a convenience notification
    // layered on top of them.
  }
}
