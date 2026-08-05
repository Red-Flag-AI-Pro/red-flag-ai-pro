import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProgramIntakeForm } from "@/components/tools/ProgramIntakeForm";
import { PROGRAM_PRICE } from "@/lib/constants";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Lands here straight from Stripe checkout (see the program success_url in
// src/app/api/stripe/checkout/route.ts). Verifies the session directly with
// Stripe rather than waiting on the webhook to have already run — same
// independent-verification pattern as the report success page
// (src/app/reports/mystery-of-ai-governance/page.tsx) — then creates the
// program_orders row itself if the webhook hasn't landed yet, so the
// customer is never stuck looking at a blank page after paying.
export default async function ProgramIntakePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/audit/program-intake${session_id ? `?session_id=${session_id}` : ""}`);
  }

  const admin = getAdminClient();
  let orderId: string | null = null;
  let initialIntake: Record<string, unknown> | undefined;

  if (session_id?.startsWith("cs_")) {
    try {
      const { stripe } = await import("@/lib/stripe");
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const settled = session.payment_status === "paid" || session.payment_status === "no_payment_required";

      if (settled && session.metadata?.plan === "program" && session.metadata?.user_id === user.id) {
        const { data: existing } = await admin
          .from("program_orders")
          .select("id, status, intake")
          .eq("stripe_session_id", session_id)
          .maybeSingle();

        if (existing) {
          orderId = existing.id as string;
          initialIntake = (existing.intake as Record<string, unknown>) ?? undefined;
          if (existing.status && existing.status !== "pending") {
            redirect(`/audit/program/${orderId}`);
          }
        } else {
          const { data: created, error: insertError } = await admin
            .from("program_orders")
            .insert({
              user_id: user.id,
              email: session.customer_email ?? session.customer_details?.email ?? user.email ?? "",
              stripe_session_id: session_id,
              stripe_payment_intent: (session.payment_intent as string) ?? null,
              amount_gbp: session.amount_total != null ? session.amount_total / 100 : PROGRAM_PRICE.amount,
              status: "pending",
            })
            .select("id")
            .single();

          if (!insertError && created) orderId = created.id as string;
        }
      }
    } catch (err) {
      console.error("program-intake session verification failed:", err);
    }
  }

  // No valid session on the URL — fall back to the customer's own most
  // recent unfinished order, so returning to this page later (or refreshing)
  // still works without the session_id round trip.
  if (!orderId) {
    const { data: fallback } = await admin
      .from("program_orders")
      .select("id, status, intake")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fallback) {
      orderId = fallback.id as string;
      initialIntake = (fallback.intake as Record<string, unknown>) ?? undefined;
      if (fallback.status && fallback.status !== "pending") {
        redirect(`/audit/program/${orderId}`);
      }
    }
  }

  if (!orderId) {
    return (
      <div style={{ background: "#0A1628", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "18px", fontWeight: 700, color: "white", marginBottom: "1rem" }}>
            We can&apos;t find a Full Governance Program order for your account.
          </p>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            If you just paid, give it a moment and refresh this page. If that doesn&apos;t help, email support@redflagaipro.com with your receipt and it will be sorted directly.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3.5rem 1.5rem 2rem" }}>
        <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.75rem", textAlign: "center" }}>
          Full Governance Program · £{PROGRAM_PRICE.amount}
        </p>
        <h1 style={{ ...syne, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "white", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "0.75rem", textAlign: "center" }}>
          Answer this once. It builds all six documents.
        </h1>
        <p style={{ ...syne, fontSize: "13.5px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2.5rem", textAlign: "center", maxWidth: "560px", margin: "0 auto 2.5rem" }}>
          One shared set of answers about your business and your AI system, mapped into your DPIA, FRIA, AI use policy, incident checklist, monitoring plan, and Annex IV documentation. Nothing generates until you submit.
        </p>
      </div>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <ProgramIntakeForm orderId={orderId} initialIntake={initialIntake} />
      </div>
      <Footer />
    </div>
  );
}
