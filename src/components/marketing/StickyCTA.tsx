"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible((prev) => {
          const next = window.scrollY > 600;
          return prev === next ? prev : next;
        });
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950/98 px-4 py-3">
      <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">
        <div className="hidden sm:block">
          <p className="text-sm font-bold text-white">Catch what you said. Prove what you did.</p>
          <p className="text-xs text-gray-400">We check your site for you and send the worst thing we find. Free.</p>
        </div>
        <p className="sm:hidden text-sm font-bold text-white">We check your site. Free.</p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="/get-checked"
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-500 transition-colors"
          >
            Check my site →
          </a>
          <Link
            href="/audit"
            className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors hidden sm:block"
          >
            Full audit
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-600 hover:text-gray-400 text-lg leading-none"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
