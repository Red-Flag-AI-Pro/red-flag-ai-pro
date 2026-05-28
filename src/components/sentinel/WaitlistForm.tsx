"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/sentinel/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, role }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-gray-900 p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-white mb-2">You&apos;re on the list</h3>
        <p className="text-gray-400 text-sm">
          We&apos;ll be in touch before Sentinel launches in Q3 2026. You&apos;ll get early access and founding pricing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-700 bg-gray-900 p-8 space-y-4">
      <div>
        <label htmlFor="sentinel-email" className="block text-sm font-medium text-gray-300 mb-1.5">
          Work email <span className="text-red-400">*</span>
        </label>
        <input
          id="sentinel-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@agency.com"
          className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <div>
        <label htmlFor="sentinel-company" className="block text-sm font-medium text-gray-300 mb-1.5">
          Company
        </label>
        <input
          id="sentinel-company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Agency or firm name"
          className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <div>
        <label htmlFor="sentinel-role" className="block text-sm font-medium text-gray-300 mb-1.5">
          Your role
        </label>
        <select
          id="sentinel-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <option value="">Select role</option>
          <option value="agency_owner">Agency owner</option>
          <option value="compliance_manager">Compliance manager</option>
          <option value="legal_counsel">Legal counsel</option>
          <option value="marketing_director">Marketing director</option>
          <option value="copywriter">Copywriter / content lead</option>
          <option value="other">Other</option>
        </select>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Email us at support@redflagaipro.com</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Joining..." : "Join the Sentinel waitlist →"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        No spam. Early access pricing locked in for waitlist members.
      </p>
    </form>
  );
}
