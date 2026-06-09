"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuditCheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function startCheckout() {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: "audit" }),
        });

        if (res.status === 401) {
          // Not logged in — send to signup with redirect back
          router.push("/signup?redirect=/audit/checkout");
          return;
        }

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          router.push("/audit?error=1");
        }
      } catch {
        router.push("/audit?error=1");
      }
    }

    startCheckout();
  }, [router]);

  return (
    <div style={{ background: "#050505", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(239,68,68,0.2)", borderTopColor: "#ef4444", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1.5rem" }} />
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Taking you to checkout…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
