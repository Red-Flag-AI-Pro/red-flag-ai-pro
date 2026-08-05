"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

// Polls the page itself (a server component re-fetches the order on every
// router.refresh()) every few seconds while generation is still running, so
// the customer sees their results the moment they're ready without having
// to manually reload.
export function ProgramGeneratingStatus() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    const poll = setInterval(() => router.refresh(), 4000);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [router]);

  return (
    <div style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid rgba(239,68,68,0.2)", borderTopColor: "#E5484D", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1.5rem" }} />
      <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
        Generating your six documents…
      </p>
      <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
        {seconds < 60 ? "This usually takes under a minute." : "Still working — this page refreshes on its own."}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
