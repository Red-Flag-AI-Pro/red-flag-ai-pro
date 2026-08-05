"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export function ProgramRetryButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRetry() {
    setRetrying(true);
    setError(null);
    try {
      const res = await fetch("/api/program/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Retry failed. Email support@redflagaipro.com if this keeps happening.");
        setRetrying(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again in a moment.");
      setRetrying(false);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={handleRetry}
        disabled={retrying}
        style={{
          background: retrying ? "rgba(229,72,77,0.5)" : "#E5484D",
          color: "white",
          ...syne,
          fontSize: "0.9rem",
          fontWeight: 700,
          padding: "13px 30px",
          borderRadius: "9999px",
          border: "none",
          cursor: retrying ? "not-allowed" : "pointer",
          letterSpacing: "0.02em",
        }}
      >
        {retrying ? "Retrying…" : "Try again"}
      </button>
      {error && <p style={{ ...syne, fontSize: "12px", color: "#f87171", marginTop: "0.75rem" }}>{error}</p>}
    </div>
  );
}
