"use client";

import { useEffect } from "react";

export function GoogleConversion() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-18172154544/1F0dCKvqqa8cELCllNlD',
        'value': 49.0,
        'currency': 'GBP',
        'transaction_id': '',
      });
    }
  }, []);

  return null;
}
