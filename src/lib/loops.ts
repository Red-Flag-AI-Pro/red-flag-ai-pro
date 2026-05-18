const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_API_URL = "https://app.loops.so/api/v1";

export async function addContactToLoops({
  email,
  name,
  plan = "free",
}: {
  email: string;
  name?: string;
  plan?: string;
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
        source: "signup",
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
