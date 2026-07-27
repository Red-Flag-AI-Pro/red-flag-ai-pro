import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { updateContactPlan, sendLoopsEvent } from "@/lib/loops";
import { Resend } from "resend";
import type Stripe from "stripe";

const NOTIFY_TO = "support@redflagaipro.com";
const REPORT_STORAGE_BUCKET = "reports";
const REPORT_STORAGE_PATH = "the-mystery-of-ai-governance.pdf";
const REPORT_SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

// A paid report is instant, self-serve delivery — no 48 hour promise, no
// human in the loop. Never throws: a mail failure must not fail the webhook
// or Stripe retries the whole event.
async function deliverReportPurchase(
  supabase: ReturnType<typeof getAdminClient>,
  session: Stripe.Checkout.Session
) {
  const email = session.customer_email ?? session.customer_details?.email ?? null;
  const name = session.customer_details?.name ?? "";
  try {
    const { data: signed, error: signError } = await supabase.storage
      .from(REPORT_STORAGE_BUCKET)
      .createSignedUrl(REPORT_STORAGE_PATH, REPORT_SIGNED_URL_TTL_SECONDS);

    if (signError || !signed?.signedUrl) {
      console.error("report signed URL failed:", signError);
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Red Flag AI Pro <reports@redflagaipro.com>",
          to: NOTIFY_TO,
          subject: `URGENT: report delivery failed for ${email ?? "unknown buyer"}`,
          html: `<p>Signed URL generation failed for a paid report purchase (session ${session.id}). Deliver manually to ${email ?? "unknown"}.</p>`,
        });
      }
      return;
    }

    if (email && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "Red Flag AI Pro <reports@redflagaipro.com>",
        to: email,
        replyTo: "support@redflagaipro.com",
        subject: "Your copy of The Mystery of AI Governance",
        html: `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#1A2333">
          <p>${name ? `Hi ${name},` : "Hi,"}</p>
          <p>Thanks for buying <strong>The Mystery of AI Governance</strong>. Here is your copy:</p>
          <p><a href="${signed.signedUrl}" style="color:#B8393D;font-weight:bold;">Download the report (PDF)</a></p>
          <p>This link stays valid for 14 days. If it expires before you get to it, just reply to this email and we will send a fresh one.</p>
          <p>If you find a factual error anywhere in it, tell us, we correct publicly.</p>
          <p>James Stokes<br/>Founder, Red Flag AI Pro</p>
        </div>`,
      });
      if (error) console.error("report delivery email failed:", error);
    } else if (!email) {
      console.error("report paid but no customer email on session:", session.id);
    }

    if (email) {
      await sendLoopsEvent({ email, eventName: "report_purchased", properties: { amount: "4.99", report: "mystery-of-ai-governance" } });
    }
  } catch (err) {
    console.error("report delivery error:", err);
  }
}

// A paid £179 audit starts a 48 hour delivery promise — the founder must
// know the moment it happens, not whenever Stripe is next checked. Never
// throws: a mail failure must not fail the webhook or Stripe retries the
// whole event.
async function notifyAuditPaid(session: Stripe.Checkout.Session) {
  const email = session.customer_email ?? session.customer_details?.email ?? "unknown";
  const name = session.customer_details?.name ?? "";
  const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : "179.00";
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "Red Flag AI Pro <audit@redflagaipro.com>",
        to: NOTIFY_TO,
        ...(email !== "unknown" ? { replyTo: email } : {}),
        subject: `PAID audit order: £${amount} from ${name || email}`,
        html: `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">
          <p><strong>An audit was just paid for via instant checkout.</strong> The 48 hour delivery window starts now.</p>
          <p>Buyer: ${name ? `${name}, ` : ""}${email}<br/>
          Amount: £${amount}<br/>
          Stripe session: ${session.id}</p>
          <p>Reply straight to this email to reach the buyer and ask for their URL if they haven't sent it.</p>
        </div>`,
      });
      if (error) console.error("audit-paid notify failed:", error);
    } else {
      console.error("audit paid but RESEND_API_KEY not set:", { email, amount });
    }
    if (email !== "unknown") {
      await sendLoopsEvent({ email, eventName: "audit_purchased", properties: { amount } });
    }
  } catch (err) {
    console.error("audit-paid notification error:", err);
  }
}

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

      // One-time report purchase — record in report_orders, deliver instantly
      if (plan === "report") {
        await supabase.from("report_orders").insert({
          user_id: userId,
          email: session.customer_email ?? session.customer_details?.email ?? "",
          stripe_session_id: session.id,
          stripe_payment_intent: (session.payment_intent as string) ?? null,
          amount_gbp: session.amount_total ? session.amount_total / 100 : 4.99,
          report_slug: "mystery-of-ai-governance",
          status: "delivered",
        });
        await deliverReportPurchase(supabase, session);
        break;
      }

      // One-time audit purchase — record in audit_orders
      if (plan === "audit") {
        await supabase.from("audit_orders").insert({
          user_id: userId,
          email: session.customer_email ?? session.customer_details?.email ?? "",
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string ?? null,
          // Record what Stripe actually charged rather than a hardcoded figure
          // (was stuck at the old £149 after the 4 Jul price rise to £179).
          amount_gbp: session.amount_total ? session.amount_total / 100 : 179,
          status: "paid",
        });
        await notifyAuditPaid(session);
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
