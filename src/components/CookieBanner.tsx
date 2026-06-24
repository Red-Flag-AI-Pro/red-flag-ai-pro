"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie-consent", "declined");
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner fixed bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-gray-800 px-6 py-4">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400 text-center sm:text-left">
          We use cookies for analytics to improve your experience. We do not sell your data.{" "}
          <a href="/privacy" className="underline text-gray-300 hover:text-white">
            Privacy Policy
          </a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
