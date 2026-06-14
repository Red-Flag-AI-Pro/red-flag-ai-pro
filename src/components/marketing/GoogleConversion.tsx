"use client";

import { useEffect } from "react";

const FIRED_FLAG = "rfa_signup_conversion_fired";

export function GoogleConversion({ email }: { email?: string | null }) {
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).gtag) return;
    if (window.localStorage.getItem(FIRED_FLAG)) return;

    const gtag = (window as any).gtag;

    if (email) {
      gtag("set", "user_data", { email });
    }

    gtag("event", "conversion", {
      send_to: "AW-18172154544/1F0dCKvqqa8cELCllNlD",
      value: 49.0,
      currency: "GBP",
      transaction_id: "",
    });

    window.localStorage.setItem(FIRED_FLAG, "1");
  }, [email]);

  return null;
}
