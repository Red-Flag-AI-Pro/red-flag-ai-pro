import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { PLAN_PRICES, AUDIT_PRICE, REPORT_PRICE } from "@/lib/constants";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const plan = body.plan as "scanner" | "enterprise" | "sentinel" | "audit" | "report";
  const region = body.region as string | undefined;
  const toltReferral = body.tolt_referral as string | undefined;

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name")
    .eq("user_id", user.id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // One-time audit purchase. Priced inline from AUDIT_PRICE.amount so the
  // charge always matches the price displayed on /audit — the old fixed
  // STRIPE_PRICE_AUDIT_ID object still carries the pre-4-Jul £149 and Stripe
  // prices are immutable, so referencing it would undercharge against the
  // advertised £179.
  if (plan === "audit") {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer: profile?.stripe_customer_id ?? undefined,
      customer_email: profile?.stripe_customer_id ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: AUDIT_PRICE.amount * 100,
            product_data: { name: AUDIT_PRICE.label },
          },
          quantity: 1,
        },
      ],
      metadata: { user_id: user.id, plan: "audit", ...(toltReferral ? { tolt_referral: toltReferral } : {}) },
      success_url: `${appUrl}/audit?success=1&plan=audit&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/audit?canceled=1`,
    });
    return NextResponse.json({ url: session.url });
  }

  // One-time report purchase. Same inline price_data pattern as the audit —
  // instant, self-serve delivery handled by the webhook rather than the
  // audit's 48 hour manual fulfilment.
  if (plan === "report") {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      // Lets giveaway recipients enter a 100%-off code (e.g. for LinkedIn
      // giveaways) directly on the Stripe checkout page. Only the report
      // checkout exposes this — subscriptions and the audit do not.
      allow_promotion_codes: true,
      customer: profile?.stripe_customer_id ?? undefined,
      customer_email: profile?.stripe_customer_id ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: Math.round(REPORT_PRICE.amount * 100),
            product_data: { name: REPORT_PRICE.label },
          },
          quantity: 1,
        },
      ],
      metadata: { user_id: user.id, plan: "report", ...(toltReferral ? { tolt_referral: toltReferral } : {}) },
      success_url: `${appUrl}/reports/${REPORT_PRICE.slug}?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/reports/${REPORT_PRICE.slug}?canceled=1`,
    });
    return NextResponse.json({ url: session.url });
  }

  // Subscription plans
  if (!PLAN_PRICES[plan as keyof typeof PLAN_PRICES]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const ngnPriceMap: Partial<Record<string, string>> = {
    scanner: process.env.STRIPE_PRICE_SCANNER_NGN_ID,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE_NGN_ID,
  };
  const priceId =
    region === "ng" && ngnPriceMap[plan]
      ? ngnPriceMap[plan]!
      : PLAN_PRICES[plan as keyof typeof PLAN_PRICES].priceId;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: { user_id: user.id, plan, ...(toltReferral ? { tolt_referral: toltReferral } : {}) },
    success_url: `${appUrl}/billing?success=1&plan=${plan}${region ? `&region=${region}` : ""}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/billing?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
