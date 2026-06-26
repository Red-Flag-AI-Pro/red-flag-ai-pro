"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function ExitIntent() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !dismissed) {
        setShow(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [dismissed]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-gray-950 border border-red-500/40 p-8 text-center shadow-2xl">
        {/* Close */}
        <button
          onClick={() => { setShow(false); setDismissed(true); }}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-300 text-xl"
        >
          ✕
        </button>

        <p className="text-4xl"></p>
        <h2 className="mt-4 text-2xl font-extrabold text-white">
          Wait. Is Your Copy Actually Legal?
        </h2>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          Most marketers have no idea their copy breaks FTC, ASA or GDPR rules.
          Find out in 60 seconds. Completely free.
        </p>

        <Link
          href="/signup"
          onClick={() => setDismissed(true)}
          className="mt-6 block w-full rounded-xl bg-red-600 py-3.5 text-base font-bold text-white hover:bg-red-500 transition-colors"
        >
          Check my copy free →
        </Link>

        <button
          onClick={() => { setShow(false); setDismissed(true); }}
          className="mt-3 block w-full text-sm text-gray-600 hover:text-gray-400 transition-colors"
        >
          No thanks, I&apos;ll risk it
        </button>
      </div>
    </div>
  );
}
