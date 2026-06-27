const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_API_URL = "https://app.loops.so/api/v1";

export async function addContactToLoops({
  email,
  name,
  plan = "free",
  source = "signup",
}: {
  email: string;
  name?: string;
  plan?: string;
  source?: string;
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
