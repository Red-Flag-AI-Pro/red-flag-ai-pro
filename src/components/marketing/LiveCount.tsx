"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * A figure that counts up the first time it scrolls into view and, if given a
 * `pollUrl`, keeps itself current from a public endpoint. The server renders
 * the real value, so the number is right with scripts off. Visitors who ask
 * for reduced motion get the value with no animation.
 *
 * `pollUrl` must return JSON with a numeric `count`. Used with
 * /api/witness/tip so the homepage shows a new record within a minute of the
 * chain sealing one.
 */
export function LiveCount({ value, pollUrl, pollSeconds = 60 }: { value: number; pollUrl?: string; pollSeconds?: number }) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(value);
  const frame = useRef<number | null>(null);
  const settle = useRef<number | null>(null);

  const animateTo = (target: number, from: number, ms: number) => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (settle.current !== null) window.clearTimeout(settle.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || ms <= 0 || from === target) {
      current.current = target;
      setShown(target);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(from + (target - from) * eased);
      setShown(v);
      if (t < 1) {
        frame.current = requestAnimationFrame(step);
      } else {
        current.current = target;
        frame.current = null;
      }
    };
    frame.current = requestAnimationFrame(step);
    // Browsers pause animation frames in a background tab. This timer still
    // fires there, so the figure always ends on the true value and can never
    // be left showing a half counted number.
    settle.current = window.setTimeout(() => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      current.current = target;
      setShown(target);
    }, ms + 300);
  };

  // Count up once, the first time the figure is actually seen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;
    setShown(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          animateTo(current.current, 0, 1400);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stay current.
  useEffect(() => {
    if (!pollUrl) return;
    let stopped = false;
    const poll = async () => {
      try {
        const res = await fetch(pollUrl, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const next = Number(data?.count);
        if (!stopped && Number.isFinite(next) && next > current.current) {
          const from = current.current;
          current.current = next;
          animateTo(next, from, 900);
        }
      } catch {
        // Keep showing the last known figure.
      }
    };
    const id = window.setInterval(poll, pollSeconds * 1000);
    return () => {
      stopped = true;
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollUrl, pollSeconds]);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      if (settle.current !== null) window.clearTimeout(settle.current);
    },
    []
  );

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {shown.toLocaleString("en-GB")}
    </span>
  );
}
