"use client";

import { useEffect } from "react";

const FIRED_FLAG = "rfa_signup_verified_conversion_fired";

// Fires only on /dashboard?welcome=1, the unique URL that's reached exactly
// once, immediately after a genuine new signup (see signup/page.tsx). This is
// the "Sign-up (verified)" conversion action set up in Google Ads, separate
// from the older page-load-on-/signup rule it's meant to replace.
export function SignupVerifiedConversion() {
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).gtag) return;
    if (window.localStorage.getItem(FIRED_FLAG)) return;

    const gtag = (window as any).gtag;
    gtag("event", "conversion", {
      send_to: "AW-18172154544/il2LCN7w6MQcELCllNlD",
    });

    window.localStorage.setItem(FIRED_FLAG, "1");
  }, []);

  return null;
}
