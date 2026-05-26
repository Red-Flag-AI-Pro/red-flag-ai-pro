"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950 backdrop-blur-sm">
      <div className="mx-auto flex h-32 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/redflag-logo.png"
            alt="Red Flag AI Pro"
            width={110}
            height={110}
            className="object-contain"
            priority
          />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors hidden sm:block"
              >
                Dashboard
              </Link>
              <Link
                href="/scans/new"
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 transition-colors"
              >
                New Scan
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors hidden sm:block"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/blog"
                className="rounded-md px-2 py-1.5 text-xs sm:text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors hidden sm:block"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="rounded-md px-2 py-1.5 text-xs sm:text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="rounded-md px-2 py-1.5 text-xs sm:text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="rounded-md px-2 py-1.5 text-xs sm:text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-red-500 transition-colors"
              >
                Start free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
