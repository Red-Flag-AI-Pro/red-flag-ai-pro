"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950/95 backdrop-blur-sm px-4 py-3">
      <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">
        <div className="hidden sm:block">
          <p className="text-sm font-bold text-white">Are you a Builder? Are you a Buyer?</p>
          <p className="text-xs text-gray-400">26 risk categories. 8 jurisdictions. 60 seconds. Free.</p>
        </div>
        <p className="sm:hidden text-sm font-bold text-white">Scan it before it&apos;s too late!</p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="/#demo"
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-500 transition-colors"
          >
            Try free →
          </a>
          <Link
            href="/signup"
            className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors hidden sm:block"
          >
            Sign up
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
