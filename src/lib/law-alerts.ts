import { LAW_TIMELINE, daysUntil, formatLawDate, type LawEvent } from "@/lib/law-timeline";

// Law date alerts. One short email shortly before a date in the timeline
// takes effect, to people who asked for exactly that and nothing else.

export const ALERT_FROM = "Red Flag AI Pro <alerts@redflagaipro.com>";
const SITE = "https://www.redflagaipro.com";

/** An alert goes out when a date is this many days away. */
export const TRIGGER_DAYS = 3;
/**
 * Any other unsent dates inside this window ride along in the same email, so
 * three dates in nine days is one email, not three.
 */
export const BATCH_WINDOW_DAYS = 14;

export const eventKey = (e: LawEvent) => `${e.date}|${e.law}`;

export function upcomingEvents(now: Date = new Date(), limit = 4): LawEvent[] {
  return [...LAW_TIMELINE]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((e) => daysUntil(e.date, now) > 0)
    .slice(0, limit);
}

/**
 * The events today's alert should cover, or an empty list if nothing is due.
 * `alreadySent` is the set of event keys recorded in law_alert_sends.
 */
export function pickAlertBatch(now: Date, alreadySent: Set<string>): LawEvent[] {
  const unsent = [...LAW_TIMELINE]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((e) => !alreadySent.has(eventKey(e)));
  const due = unsent.some((e) => {
    const d = daysUntil(e.date, now);
    return d > 0 && d <= TRIGGER_DAYS;
  });
  if (!due) return [];
  return unsent.filter((e) => {
    const d = daysUntil(e.date, now);
    return d > 0 && d <= BATCH_WINDOW_DAYS;
  });
}

export function unsubscribeUrl(token: string): string {
  return `${SITE}/api/law-alerts/unsubscribe?t=${encodeURIComponent(token)}`;
}

const SIDE_LABEL: Record<LawEvent["side"], string> = {
  compliance: "What you said",
  governance: "What you did",
  both: "Both sides",
};

const dayWord = (d: number) => (d === 1 ? "tomorrow" : `in ${d} days`);

export function alertSubject(events: LawEvent[], now: Date): string {
  const first = events[0];
  const d = daysUntil(first.date, now);
  const more = events.length > 1 ? ` (and ${events.length - 1} more close behind)` : "";
  return `${d === 1 ? "Tomorrow" : `In ${d} days`}: ${first.headline.replace(/\.$/, "")}${more}`;
}

export function welcomeSubject(events: LawEvent[]): string {
  return events.length > 0
    ? `You're on the list. Next date: ${formatLawDate(events[0].date)}`
    : "You're on the list";
}

export function buildLawAlertEmail(opts: {
  kind: "welcome" | "alert";
  events: LawEvent[];
  now: Date;
  token: string;
}): string {
  const { kind, events, now, token } = opts;
  const intro =
    kind === "welcome"
      ? "You asked for an email before each AI law date lands. That is all you will get from this list. Here is what is coming next."
      : "You asked for an email before each AI law date lands. Here is what is about to take effect.";

  const rows = events
    .map((e) => {
      const d = daysUntil(e.date, now);
      return `
      <div style="border-top:1px solid #e5e7eb;padding:18px 0;">
        <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;margin-bottom:6px;">
          ${e.region} &middot; ${formatLawDate(e.date)} &middot; <strong style="color:#b91c1c;">${dayWord(d)}</strong> &middot; ${SIDE_LABEL[e.side]}
        </div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:19px;color:#0A1628;line-height:1.3;margin-bottom:6px;">${e.headline}</div>
        <div style="font-size:14px;color:#374151;line-height:1.6;">${e.detail}</div>
      </div>`;
    })
    .join("");

  const empty = `<p style="font-size:14px;color:#374151;line-height:1.6;">Nothing is due in the next few weeks. You will hear from us when the next date gets close.</p>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:#0A1628;border-radius:12px;padding:24px 28px;margin-bottom:20px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#F4F1EA;">The law didn't wait. <em style="color:#E5484D;">Neither did we.</em></div>
      <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#C9A66B;margin-top:8px;">Red Flag AI Pro &middot; law date alert</div>
    </div>

    <div style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:24px 28px;margin-bottom:20px;">
      <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 14px;">${intro}</p>
      ${events.length > 0 ? rows : empty}
    </div>

    <div style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:22px 28px;margin-bottom:20px;">
      <p style="font-size:14px;color:#374151;line-height:1.6;margin:0 0 14px;">Every one of these asks one of two questions. Both are free to answer.</p>
      <p style="margin:0 0 10px;"><a href="${SITE}/compliance-assessment" style="color:#b91c1c;font-weight:700;font-size:15px;">Catch what you said: check your marketing copy &rarr;</a></p>
      <p style="margin:0;"><a href="${SITE}/governance-audit" style="color:#b91c1c;font-weight:700;font-size:15px;">Prove what you did: run the AI governance assessment &rarr;</a></p>
    </div>

    <p style="font-size:14px;color:#374151;line-height:1.6;margin:0 4px 18px;">James Stokes<br>Red Flag AI Pro<br><a href="${SITE}" style="color:#374151;">redflagaipro.com</a></p>

    <p style="font-size:12px;color:#6b7280;line-height:1.6;margin:0 4px;">
      A plain English summary, not legal advice. The full list with live countdowns is on <a href="${SITE}" style="color:#6b7280;">our homepage</a>.<br>
      You are getting this because you asked for law date alerts at redflagaipro.com. <a href="${unsubscribeUrl(token)}" style="color:#6b7280;">Unsubscribe here</a>.
    </p>
  </div>
</body>
</html>`;
}

export function listUnsubscribeHeaders(token: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubscribeUrl(token)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
