import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { PLAN_PRICES, AUDIT_PRICE } from "@/lib/constants";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const plan = body.plan as "scanner" | "enterprise" | "sentinel" | "audit";
  const toltReferral = body.tolt_referral as string | undefined;

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name")
    .eq("user_id", user.id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // One-time audit purchase
  if (plan === "audit") {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer: profile?.stripe_customer_id ?? undefined,
      customer_email: profile?.stripe_customer_id ? undefined : user.email,
      line_items: [
        {
          price: AUDIT_PRICE.priceId,
          quantity: 1,
        },
      ],
      metadata: { user_id: user.id, plan: "audit", ...(toltReferral ? { tolt_referral: toltReferral } : {}) },
      success_url: `${appUrl}/audit?success=1`,
      cancel_url: `${appUrl}/audit?canceled=1`,
    });
    return NextResponse.json({ url: session.url });
  }

  // Subscription plans
  if (!PLAN_PRICES[plan as keyof typeof PLAN_PRICES]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user.email,
    line_items: [
      {
        price: PLAN_PRICES[plan as keyof typeof PLAN_PRICES].priceId,
        quantity: 1,
      },
    ],
    metadata: { user_id: user.id, plan, ...(toltReferral ? { tolt_referral: toltReferral } : {}) },
    success_url: `${appUrl}/billing?success=1`,
    cancel_url: `${appUrl}/billing?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
