"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PlanBadge } from "@/components/billing/PlanBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Plan, Profile } from "@/types";
import { createClient } from "@/lib/supabase/client";

const PLANS = [
  {
    key: "pro" as const,
    name: "Pro",
    price: "£350/mo",
    features: ["20 scans per month", "Monthly reassessment", "Vendor tracking", "Dashboard", "Gap detection", "Evidence package", "Email support"],
  },
  {
    key: "enterprise" as const,
    name: "Sentinel",
    price: "£5000+/mo",
    features: ["Unlimited scans", "Managed implementation", "Automated audit logging", "Output drift detection", "Financial impact modeling", "Governance enforcement", "Board reporting", "Certification", "APIs", "Dedicated advisor"],
  },
];

function BillingNotice() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  if (success) {
    return (
      <div className="rounded-lg border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] px-4 py-3 text-sm text-green-300">
        ✅ Your subscription has been activated. Welcome to the next plan!
      </div>
    );
  }
  if (canceled) {
    return (
      <div className="rounded-lg border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.1)] px-4 py-3 text-sm text-amber-300">
        Checkout was canceled. No charge was made.
      </div>
    );
  }
  return null;
}

export default function BillingPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(data as Profile);
    })();
  }, [supabase]);

  const plan: Plan = (profile?.plan as Plan) ?? "free";

  async function handleCheckout(planKey: "pro" | "enterprise" | "sentinel") {
    setLoading(planKey);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planKey }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(null);
  }

  async function handlePortal() {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F4F1EA]">Billing</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)]">Manage your plan and subscription</p>
      </div>

      <Suspense>
        <BillingNotice />
      </Suspense>

      {/* Current plan */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[rgba(244,241,234,0.5)]">Current plan</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl font-bold capitalize text-[#F4F1EA]">
                {plan}
              </span>
              <PlanBadge plan={plan} />
            </div>
          </div>
          {plan !== "free" && profile?.stripe_customer_id && (
            <Button
              variant="secondary"
              onClick={handlePortal}
              loading={loading === "portal"}
            >
              Manage subscription
            </Button>
          )}
        </div>
      </Card>

      {/* Upgrade options */}
      {plan === "free" && (
        <div>
          <h2 className="mb-4 text-sm font-semibold text-[rgba(244,241,234,0.8)] uppercase tracking-wide">
            Upgrade your plan
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((p) => (
              <Card key={p.key}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[#F4F1EA]">{p.name}</h3>
                    <p className="mt-0.5 text-xl font-bold text-[#F4F1EA]">
                      {p.price}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCheckout(p.key)}
                    loading={loading === p.key}
                  >
                    Upgrade
                  </Button>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-[rgba(244,241,234,0.6)]"
                    >
                      <span className="text-green-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Usage */}
      <Card>
        <h2 className="mb-4 text-sm font-semibold text-[#F4F1EA]">
          Plan details
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[rgba(244,241,234,0.5)]">Scans per month</dt>
            <dd className="font-medium text-[#F4F1EA]">
              {plan === "free" ? "1" : plan === "pro" ? "20" : "Unlimited"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[rgba(244,241,234,0.5)]">Risk categories</dt>
            <dd className="font-medium text-[#F4F1EA]">
              {plan === "sentinel" ? "21" : "16"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[rgba(244,241,234,0.5)]">PDF reports</dt>
            <dd className="font-medium text-[#F4F1EA]">
              {plan === "pro" || plan === "free" ? "No" : "Yes"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[rgba(244,241,234,0.5)]">Scan history</dt>
            <dd className="font-medium text-[#F4F1EA]">Yes</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
