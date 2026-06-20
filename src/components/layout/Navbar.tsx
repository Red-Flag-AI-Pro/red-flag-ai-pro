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
    <header className="sticky top-0 z-40 border-b border-white/10" style={{background: "rgba(10,22,40,0.85)", backdropFilter: "saturate(140%) blur(12px)", WebkitBackdropFilter: "saturate(140%) blur(12px)"}}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <Image
            src="/redflag-logo-full.png"
            alt="Red Flag AI Pro"
            width={62}
            height={49}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="nav-link px-3 py-1.5 text-sm">Dashboard</Link>
              <Link href="/scans/new" className="btn-primary !py-2 !px-4 !text-xs">New Scan</Link>
              <button onClick={handleSignOut} className="nav-link px-3 py-1.5 text-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/governance-audit" className="nav-link px-3 py-1.5 text-sm">Assessment</Link>
              <Link href="/sentinel" className="nav-link px-3 py-1.5 text-sm">Sentinel</Link>
              <Link href="/pricing" className="nav-link px-3 py-1.5 text-sm">Pricing</Link>
              <Link href="/tools" className="nav-link px-3 py-1.5 text-sm">Tools</Link>
              <Link href="/case-study" className="nav-link px-3 py-1.5 text-sm">Case Study</Link>
              <Link href="/about" className="nav-link px-3 py-1.5 text-sm">About</Link>
              <Link href="/blog" className="nav-link px-3 py-1.5 text-sm">Insights</Link>
              <Link href="/affiliates" className="nav-link px-3 py-1.5 text-sm flex items-center gap-1.5">Partners <span style={{fontSize:"9px", border:"1px solid rgba(201,166,107,0.5)", color:"#C9A66B", borderRadius:"4px", padding:"1px 5px", fontWeight:600, letterSpacing:"0.08em"}}>EARN</span></Link>
              <Link href="/login" className="nav-link px-3 py-1.5 text-sm">Log in</Link>
              <Link href="/governance-audit" className="btn-primary !py-2 !px-4 !text-xs">Free assessment</Link>
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
        <div className="sm:hidden border-t border-white/10" style={{background: "#0A1628"}}>
          <nav className="flex flex-col px-4 py-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Dashboard</Link>
                <button onClick={() => { setMenuOpen(false); handleSignOut(); }} className="text-left rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/governance-audit" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-white hover:bg-white/5 transition-colors">Free assessment</Link>
                <Link href="/sentinel" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Sentinel — managed governance</Link>
                <Link href="/pricing" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Pricing</Link>
                <Link href="/tools" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Free tools</Link>
                <Link href="/case-study" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Case Study</Link>
                <Link href="/about" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">About</Link>
                <Link href="/blog" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Insights</Link>
                <Link href="/affiliates" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 transition-colors flex items-center gap-2">Partners <span style={{fontSize:"9px", border:"1px solid rgba(201,166,107,0.5)", color:"#C9A66B", borderRadius:"4px", padding:"1px 5px", fontWeight:600}}>EARN</span></Link>
                <div className="pt-2 border-t border-white/10">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="block rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Log in</Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
