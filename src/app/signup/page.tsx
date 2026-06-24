"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const prefillEmail = searchParams.get("email") ?? "";
  const fromDemo = !!prefillEmail;
  const planLabel = plan === "pro" ? "Pro" : plan === "enterprise" ? "Growth" : null;
  const [name, setName] = useState("");
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    setError(null);
    const appUrl = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${appUrl}/api/auth/callback?next=${plan ? `/billing?plan=${plan}` : "/dashboard?welcome=1"}`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // On success, the browser redirects to Google — no further action needed here.
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const appUrl = window.location.origin;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${appUrl}/api/auth/callback?next=${plan ? `/billing?plan=${plan}` : "/dashboard?welcome=1"}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If email confirmation is required, signUp() doesn't return a session —
    // pushing to /dashboard would just bounce off the auth middleware.
    if (!data.session) {
      setLoading(false);
      setSuccess(true);
      return;
    }

    router.push("/dashboard?welcome=1");
    router.refresh();
  }

  if (success) {
    return (
      <div className="text-center">
        <p className="text-4xl"></p>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Check your email</h2>
        <p className="mt-2 text-sm text-gray-600">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account.
        </p>
        <Link
          href="/login"
          className="mt-6 block text-sm font-medium text-red-600 hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fromDemo && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Picking up where you left off. Create your account to unlock your full scan results and the compliant rewrites.
        </div>
      )}
      {planLabel ? (
        <div className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-gray-300">
          Next: you will land on a checkout page for {planLabel}, no charge until you confirm there.
        </div>
      ) : (
        <div className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-gray-300">
          Next: you will land on your dashboard, where you can paste your first piece of copy to scan, or start your free governance assessment.
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={googleLoading}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-700" />
        <span className="text-xs uppercase tracking-wide text-gray-500">or sign up with email</span>
        <div className="h-px flex-1 bg-gray-700" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full name
        </label>
        <input
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        <p className="mt-1 text-xs text-gray-400">Minimum 8 characters</p>
      </div>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Create account
      </Button>

      <p className="text-center text-xs text-gray-400">
        By signing up you agree to our{" "}
        <a href="/terms" className="underline hover:text-gray-200">Terms of Service</a>
        {" "}and{" "}
        <a href="/privacy" className="underline hover:text-gray-200">Privacy Policy</a>.
      </p>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-red-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image
              src="/redflag-logo-transparent.png"
              alt="Red Flag AI Pro"
              width={160}
              height={160}
              className="object-contain"
              priority
            />
          </Link>
          <h1
            className="mt-4 text-2xl font-bold"
            style={{ background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            No credit card required · Cancel anytime
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-sm">
          <Suspense>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
