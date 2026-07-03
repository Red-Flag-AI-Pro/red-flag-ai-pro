import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { updateContactPlan } from "@/lib/loops";
import type Stripe from "stripe";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// The Loops contact is created at signup with the auth account email, so the
// plan sync must key on that same email. A customer can pay Stripe with a
// different email, and keying on the Stripe side would upsert a second Loops
// contact while the real one stayed marked as free.
async function getAccountEmail(
  supabase: ReturnType<typeof getAdminClient>,
  userId: string
): Promise<string | null> {
  const { data } = await supabase.auth.admin.getUserById(userId);
  return data?.user?.email ?? null;
}

// Keeps the Loops contact's plan property in step with profiles.plan.
// Must never throw: a Loops or Stripe hiccup should not fail the webhook
// response, or Stripe would retry the whole event. Resolves the account
// email via the profiles row for this Stripe customer, and only falls back
// to the Stripe customer email if that lookup comes up empty.
async function syncLoopsPlanForCustomer(
  supabase: ReturnType<typeof getAdminClient>,
  customerId: string,
  plan: string
) {
  try {
    let email: string | null = null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    if (profile?.user_id) {
      email = await getAccountEmail(supabase, profile.user_id as string);
    }

    if (!email) {
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && customer.email) {
        email = customer.email;
      }
    }

    if (email) {
      await updateContactPlan(email, plan);
    }
  } catch (err) {
    console.error("Loops plan sync failed:", err);
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      if (!userId || !plan) break;

      // One-time audit purchase — record in audit_orders
      if (plan === "audit") {
        await supabase.from("audit_orders").insert({
          user_id: userId,
          email: session.customer_email ?? session.customer_details?.email ?? "",
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string ?? null,
          amount_gbp: 149,
          status: "paid",
        });
        break;
      }

      // Subscription plan — update profile
      await supabase
        .from("profiles")
        .update({
          plan,
          stripe_customer_id: session.customer as string,
        })
        .eq("user_id", userId);

      try {
        const email =
          (await getAccountEmail(supabase, userId)) ??
          session.customer_email ??
          session.customer_details?.email;
        if (email) {
          await updateContactPlan(email, plan);
        }
      } catch (err) {
        console.error("Loops plan sync failed:", err);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      const planMap: Record<string, string> = {
        [process.env.STRIPE_PRICE_SCANNER_ID!]: "scanner",
        [process.env.STRIPE_PRICE_SCANNER_SALE_ID!]: "scanner",
        [process.env.STRIPE_PRICE_ENTERPRISE_ID!]: "enterprise",
        [process.env.STRIPE_PRICE_SENTINEL_ID!]: "sentinel",
        [process.env.STRIPE_PRICE_SCANNER_NGN_ID!]: "scanner",
        [process.env.STRIPE_PRICE_ENTERPRISE_NGN_ID!]: "enterprise",
      };

      const priceId = sub.items.data[0]?.price.id;
      const plan = planMap[priceId] ?? "free";

      await supabase
        .from("profiles")
        .update({ plan })
        .eq("stripe_customer_id", customerId);

      await syncLoopsPlanForCustomer(supabase, customerId, plan);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      await supabase
        .from("profiles")
        .update({ plan: "free" })
        .eq("stripe_customer_id", customerId);

      await syncLoopsPlanForCustomer(supabase, customerId, "free");
      break;
    }
  }

  return NextResponse.json({ received: true });
}
