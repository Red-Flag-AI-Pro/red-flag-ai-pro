"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <Image
            src="/redflag-logo.png"
            alt="Red Flag AI Pro"
            width={72}
            height={72}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/scans/new" className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 transition-colors">New Scan</Link>
              <button onClick={handleSignOut} className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/case-study" className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Case Study</Link>
              <Link href="/compare" className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Compare</Link>
              <Link href="/blog" className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Blog</Link>
              <Link href="/about" className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">About</Link>
              <Link href="/pricing" className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Pricing</Link>
              <Link href="/sentinel" className="rounded-md px-2 py-1.5 text-sm font-semibold text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors">Sentinel</Link>
              <Link href="/docs" className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">API</Link>
              <Link href="/login" className="rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Log in</Link>
              <Link href="/signup" className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 transition-colors">Start free</Link>
            </>
          )}
        </nav>

        {/* Mobile: CTA + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {!isAuthenticated && (
            <Link href="/signup" className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 transition-colors">
              Start free
            </Link>
          )}
          {isAuthenticated && (
            <Link href="/scans/new" className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 transition-colors">
              New Scan
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-800 bg-gray-950">
          <nav className="flex flex-col px-4 py-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Dashboard</Link>
                <button onClick={() => { setMenuOpen(false); handleSignOut(); }} className="text-left rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/pricing" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Pricing</Link>
                <Link href="/sentinel" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-semibold text-red-400 hover:bg-gray-800 transition-colors">Sentinel — for agencies</Link>
                <Link href="/case-study" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Case Study</Link>
                <Link href="/compare" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Compare</Link>
                <Link href="/docs" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">API docs</Link>
                <Link href="/blog" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Blog</Link>
                <Link href="/about" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">About</Link>
                <div className="pt-2 border-t border-gray-800">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="block rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Log in</Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
