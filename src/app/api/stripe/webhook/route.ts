import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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
          amount_gbp: 97,
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
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      const planMap: Record<string, string> = {
        [process.env.STRIPE_PRICE_SCANNER_ID!]: "scanner",
        [process.env.STRIPE_PRICE_PRO_ID!]: "pro",
        [process.env.STRIPE_PRICE_ENTERPRISE_ID!]: "enterprise",
        [process.env.STRIPE_PRICE_SENTINEL_ID!]: "sentinel",
      };

      const priceId = sub.items.data[0]?.price.id;
      const plan = planMap[priceId] ?? "free";

      await supabase
        .from("profiles")
        .update({ plan })
        .eq("stripe_customer_id", customerId);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      await supabase
        .from("profiles")
        .update({ plan: "free" })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
