// .trim() also strips a leading U+FEFF byte-order-mark, which is what the
// Vercel env var actually has — without it, "Bearer <key>" becomes an invalid
// header value and every Loops call throws before the request is even sent.
const LOOPS_API_KEY = process.env.LOOPS_API_KEY?.trim();
const LOOPS_API_URL = "https://app.loops.so/api/v1";

// Which product journey a contact entered through, so Loops automations can
// branch a compliance-flavoured welcome vs a governance-flavoured one instead
// of a single generic sequence. Left undefined when the entry point genuinely
// doesn't know (e.g. a nav-bar "Start free" click with no product context) —
// guessing a track is worse than leaving it unset.
export type ProductTrack = "compliance" | "governance" | "both";

export async function addContactToLoops({
  email,
  name,
  plan = "free",
  source = "signup",
  track,
}: {
  email: string;
  name?: string;
  plan?: string;
  source?: string;
  track?: ProductTrack;
}) {
  if (!LOOPS_API_KEY) {
    console.warn("LOOPS_API_KEY not set");
    return;
  }

  try {
    const res = await fetch(`${LOOPS_API_URL}/contacts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        firstName: name?.split(" ")[0] ?? "",
        lastName: name?.split(" ").slice(1).join(" ") ?? "",
        plan,
        source,
        ...(track ? { track } : {}),
        subscribed: true,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Loops contact creation failed:", error);
    }
  } catch (err) {
    console.error("Loops API error:", err);
  }
}

// Fires a named event to Loops so an email automation can be built around it
// in the Loops dashboard (Loops > Automations > "Event triggered"). We don't
// send the email directly — Loops owns the template/timing — we just report
// that the event happened.
export async function sendLoopsEvent({
  email,
  eventName,
  properties = {},
}: {
  email: string;
  eventName: string;
  properties?: Record<string, string | number | boolean>;
}) {
  if (!LOOPS_API_KEY) return;

  try {
    const res = await fetch(`${LOOPS_API_URL}/events/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOOPS_API_KEY}`,
      },
      body: JSON.stringify({ email, eventName, ...properties }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Loops event send failed:", error);
    }
  } catch (err) {
    console.error("Loops event API error:", err);
  }
}

export async function updateContactPlan(email: string, plan: string) {
  if (!LOOPS_API_KEY) return;

  try {
    await fetch(`${LOOPS_API_URL}/contacts/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOOPS_API_KEY}`,
      },
      body: JSON.stringify({ email, plan }),
    });
  } catch (err) {
    console.error("Loops update error:", err);
  }
}
