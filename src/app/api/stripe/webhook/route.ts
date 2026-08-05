import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { updateContactPlan, sendLoopsEvent } from "@/lib/loops";
import { logAuditEvent } from "@/lib/audit-log";
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
      const paid = session.amount_total != null ? (session.amount_total / 100).toFixed(2) : "4.99";
      await sendLoopsEvent({ email, eventName: "report_purchased", properties: { amount: paid, report: "mystery-of-ai-governance" } });
    }
  } catch (err) {
    console.error("report delivery error:", err);
  }
}

// A paid £199 audit starts a 48 hour delivery promise — the founder must
// know the moment it happens, not whenever Stripe is next checked. Never
// throws: a mail failure must not fail the webhook or Stripe retries the
// whole event.
async function notifyAuditPaid(session: Stripe.Checkout.Session, isProgram = false) {
  const email = session.customer_email ?? session.customer_details?.email ?? "unknown";
  const name = session.customer_details?.name ?? "";
  const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : isProgram ? "497.00" : "199.00";
  const product = isProgram ? "Full Governance Program" : "audit";
  const window = isProgram ? "self serve, automated" : "48 hour";
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "Red Flag AI Pro <audit@redflagaipro.com>",
        to: NOTIFY_TO,
        ...(email !== "unknown" ? { replyTo: email } : {}),
        subject: `PAID ${product} order: £${amount} from ${name || email}`,
        html: `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">
          <p><strong>A ${product} was just paid for via instant checkout.</strong> Delivery is ${window}.</p>
          <p>Buyer: ${name ? `${name}, ` : ""}${email}<br/>
          Amount: £${amount}<br/>
          Stripe session: ${session.id}</p>
          ${isProgram ? `<p>This is the six document program (DPIA, FRIA, AI use policy, incident reporting checklist, post market monitoring plan and Annex IV documentation). The customer is taken straight to the intake form after checkout and the documents generate automatically once they submit it — nothing for you to do unless they get in touch.</p>` : `<p>Reply straight to this email to reach the buyer and ask for their URL if they haven't sent it.</p>`}
        </div>`,
      });
      if (error) console.error("audit-paid notify failed:", error);
    } else {
      console.error("audit paid but RESEND_API_KEY not set:", { email, amount });
    }
    if (email !== "unknown") {
      await sendLoopsEvent({
        email,
        eventName: isProgram ? "program_purchased" : "audit_purchased",
        properties: { amount },
      });
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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.redflagaipro.com";

// Never blocks or breaks the webhook: a mail failure here must not stop the
// coverage lapse itself from being sealed. Best-effort only.
async function sendCoverageLapseEmail(email: string, certificateId: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const url = `${APP_URL}/continuity-certificate/${certificateId}`;
    await resend.emails.send({
      from: "Red Flag AI Pro <support@redflagaipro.com>",
      to: email,
      replyTo: "support@redflagaipro.com",
      subject: "Your governance coverage record",
      html: `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#1A2333">
        <p>Hi,</p>
        <p>Your Sentinel coverage just ended. Before anything else, here is the record of what it covered: how long it ran and how much of it is sealed and independently verifiable.</p>
        <p><a href="${url}" style="color:#B8393D;font-weight:bold;">View your continuity certificate</a></p>
        <p>It grew with every check. It only stayed continuous for as long as the plan did. You can pick it back up any time, and the record continues from where it left off, it does not reset.</p>
        <p>James Stokes<br/>Founder, Red Flag AI Pro</p>
      </div>`,
    });
  } catch (err) {
    console.error("coverage lapse email failed:", err);
  }
}

// Sealed the moment Sentinel coverage actually lapses, from the Stripe event
// itself rather than inferred later from a plan column. Fetches the plan and
// user_id BEFORE the caller applies the new plan, since this is the only
// point where "was sentinel a second ago" is still knowable — profiles.plan
// gets overwritten immediately after this runs. The stats (member_since,
// total_checks, sealed_events) are captured into the sealed record itself
// rather than computed later on demand, so the certificate always reflects
// the state at the moment coverage actually ended, not whatever the account
// looks like whenever someone happens to view it afterward.
async function sealCoverageLapseIfSentinel(
  supabase: ReturnType<typeof getAdminClient>,
  customerId: string,
  toPlan: string,
  reason: "downgrade" | "cancelled"
) {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id, plan, created_at")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    if (!profile?.user_id || profile.plan !== "sentinel" || toPlan === "sentinel") return;

    const userId = profile.user_id as string;

    const [{ count: totalChecks }, { count: sealedEvents }] = await Promise.all([
      supabase.from("scans").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("audit_log").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]);

    const entryId = await logAuditEvent(
      userId,
      "account_coverage_lapsed",
      {
        from_plan: "sentinel",
        to_plan: toPlan,
        reason,
        member_since: profile.created_at ?? null,
        total_checks: totalChecks ?? 0,
        sealed_events: sealedEvents ?? 0,
      },
      { timestamp: true }
    );

    if (entryId) {
      const email = await getAccountEmail(supabase, userId);
      if (email) await sendCoverageLapseEmail(email, entryId);
    }
  } catch (err) {
    console.error("coverage lapse seal failed:", err);
  }
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

      if (!plan) break;

      // One-time report purchase — record in report_orders, deliver instantly.
      // Guest checkout means user_id may legitimately be absent here.
      if (plan === "report") {
        await supabase.from("report_orders").insert({
          user_id: userId ?? null,
          email: session.customer_email ?? session.customer_details?.email ?? "",
          stripe_session_id: session.id,
          stripe_payment_intent: (session.payment_intent as string) ?? null,
          // amount_total is legitimately 0 when a 100%-off promo code (e.g. a
          // giveaway) is applied — a truthiness check here recorded those free
          // orders as £4.99 and overstated revenue in report_orders.
          amount_gbp: session.amount_total != null ? session.amount_total / 100 : 4.99,
          report_slug: "mystery-of-ai-governance",
          status: "delivered",
        });
        await deliverReportPurchase(supabase, session);
        break;
      }

      // Everything below (audit, subscriptions) requires an authenticated
      // purchaser, matching the checkout route's auth guard.
      if (!userId) break;

      // One-time audit purchase — manually fulfilled done-for-you work, lands
      // in audit_orders for James to work from.
      if (plan === "audit") {
        await supabase.from("audit_orders").insert({
          user_id: userId,
          email: session.customer_email ?? session.customer_details?.email ?? "",
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string ?? null,
          // Record what Stripe actually charged rather than a hardcoded figure
          // (was stuck at the old £149 after the 4 Jul price rise to £199).
          amount_gbp: session.amount_total != null ? session.amount_total / 100 : 199,
          status: "paid",
        });
        await notifyAuditPaid(session, false);
        break;
      }

      // Full Governance Program purchase — unlike the audit, this is
      // delivered automatically through the intake form and generation
      // pipeline (src/lib/program-generate.ts), so it lands in its own
      // program_orders table rather than audit_orders. Idempotent on
      // stripe_session_id: the program-intake success page
      // (src/app/audit/program-intake/page.tsx) verifies the Stripe session
      // directly and may already have created this row before the webhook
      // ran, same "whichever gets there first" pattern as the report page's
      // independent verification.
      if (plan === "program") {
        const { data: existingOrder } = await supabase
          .from("program_orders")
          .select("id")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        if (!existingOrder) {
          await supabase.from("program_orders").insert({
            user_id: userId,
            email: session.customer_email ?? session.customer_details?.email ?? "",
            stripe_session_id: session.id,
            stripe_payment_intent: (session.payment_intent as string) ?? null,
            amount_gbp: session.amount_total != null ? session.amount_total / 100 : 497,
            status: "pending",
          });
        }
        // Kept cheap and non-blocking: James still hears about every paid
        // order even though delivery no longer depends on him.
        await notifyAuditPaid(session, true);
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

      await sealCoverageLapseIfSentinel(supabase, customerId, plan, "downgrade");

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

      await sealCoverageLapseIfSentinel(supabase, customerId, "free", "cancelled");

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
