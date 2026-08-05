"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";

// Fires once when a Stripe checkout returns to a success URL (?success=1).
// Mirrors SignupVerifiedConversion, but for an actual PAID purchase, so a real
// sale is finally visible in Vercel Analytics and (once the label below is set)
// in Google Ads. Records the money as a conversion; the Stripe webhook still
// remains the source of truth for the account upgrade itself.

// "Purchase" conversion action created in Google Ads 2 Jul 2026 (Goals >
// Conversions), Primary action, count = Every, value = different per conversion.
const PURCHASE_CONVERSION_LABEL = "AWeqCPXjxskcELCllNlD";
const GADS_ID = "AW-18172154544";

// Approximate order value per plan (GBP), used for the conversion value only.
const PLAN_VALUE_GBP: Record<string, number> = {
  scanner: 149,
  enterprise: 1200,
  sentinel: 5000,
  audit: 199,
  program: 497,
};

export function PurchaseConversion() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("success") !== "1") return;

    const sessionId = params.get("session_id");
    // Dedup: fire only once per Stripe checkout session, even on refresh.
    const flagKey = `rfa_purchase_fired_${sessionId ?? "nosession"}`;
    if (sessionId && window.localStorage.getItem(flagKey)) return;

    const plan = params.get("plan") ?? "audit";
    const region = params.get("region") ?? undefined;
    const value = PLAN_VALUE_GBP[plan];

    track("purchase", {
      plan,
      ...(value ? { value } : {}),
      ...(region ? { region } : {}),
    });

    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (gtag && PURCHASE_CONVERSION_LABEL) {
      gtag("event", "conversion", {
        send_to: `${GADS_ID}/${PURCHASE_CONVERSION_LABEL}`,
        ...(value ? { value, currency: "GBP" } : {}),
        ...(sessionId ? { transaction_id: sessionId } : {}),
      });
    }

    if (sessionId) window.localStorage.setItem(flagKey, "1");
  }, [params]);

  return null;
}
