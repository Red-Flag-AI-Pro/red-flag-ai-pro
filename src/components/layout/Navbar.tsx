"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Loaded on demand, not bundled into every page view: Navbar renders on
  // every route including anonymous lead-gen pages, where almost nobody is
  // signed in and this handler never runs. Statically importing the
  // Supabase client here shipped the whole SDK to every visitor just in
  // case, found via a real RES investigation, /governance-audit alone
  // carried a 212KB chunk that was this client, unused by 100% of the
  // anonymous traffic it was served to.
  async function handleSignOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10" style={{background: "rgba(10,22,40,0.85)", backdropFilter: "saturate(140%) blur(12px)", WebkitBackdropFilter: "saturate(140%) blur(12px)"}}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center shrink-0" onClick={() => setMenuOpen(false)}>
          <Image
            src="/redflag-logo-full.png"
            alt="Red Flag AI Pro"
            width={62}
            height={49}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav. 26 Nov 2026: no public "Log in" link any more; the
            offer is done for you, so visitors are not asked to sign in.
            /login still works for James and any earlier account holders. */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="nav-link px-2.5 py-1.5 text-sm">Dashboard</Link>
              <Link href="/scans/new" className="btn-primary !py-2 !px-4 !text-xs ml-2">New Check</Link>
              <button onClick={handleSignOut} className="nav-link px-2.5 py-1.5 text-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/get-checked" className="nav-link px-2.5 py-1.5 text-sm whitespace-nowrap">Get Checked</Link>
              <Link href="/audit" className="nav-link px-2.5 py-1.5 text-sm whitespace-nowrap">Full Audit</Link>
              <Link href="/sentinel" className="nav-link px-2.5 py-1.5 text-sm">Sentinel</Link>
              <Link href="/witness-network" className="nav-link px-2.5 py-1.5 text-sm whitespace-nowrap">Witness Network</Link>
              <Link href="/pricing" className="nav-link px-2.5 py-1.5 text-sm">Pricing</Link>

              <div
                className="relative"
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                <button className="nav-link px-2.5 py-1.5 text-sm flex items-center gap-1">
                  Resources
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {resourcesOpen && (
                  <div
                    className="absolute left-0 top-full pt-1 w-44"
                    style={{ zIndex: 50 }}
                  >
                    {/* Split into what the product is (how it works) and what
                        there is to read or use. Everything used to sit in one
                        eleven item list, which meant the proof layer pages read
                        as filing rather than as capability. */}
                    {/* 26 Nov 2026: cut to the pages that fit the done for you offer.
                        Technical and enterprise pages (Real-Time Gate, Ruleset
                        Integrity, Who When Whether, law firms, PI brokers,
                        installations) stay live but are no longer in the menu. */}
                    <div className="rounded-lg border border-white/10 py-1.5" style={{ background: "#0D1B2E" }}>
                      <Link href="/about" className="block px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">About</Link>
                      <Link href="/what-where-whether" className="block px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">What, Where, Whether</Link>
                      <Link href="/who-when-whether" className="block px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Who, When, Whether</Link>
                      <Link href="/governance-audit" className="block px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Governance assessment, free</Link>
                      <Link href="/reports/state-of-uk-marketing-compliance" className="block px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">State of UK Marketing Compliance</Link>
                      <Link href="/reports/mystery-of-ai-governance" className="block px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">The Mystery of AI Governance</Link>
                      <Link href="/tools" className="block px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Free Tools</Link>
                      <Link href="/blog" className="block px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Insights</Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/get-checked" className="btn-primary !py-2 !px-4 !text-xs ml-2 whitespace-nowrap">Check my site</Link>
            </>
          )}
        </nav>

        {/* Tablet: hamburger fallback between sm and lg */}
        <div className="hidden sm:flex lg:hidden items-center gap-2">
          {!isAuthenticated ? (
            <Link href="/get-checked" className="btn-primary !py-2 !px-4 !text-xs whitespace-nowrap">Check my site</Link>
          ) : (
            <Link href="/scans/new" className="btn-primary !py-2 !px-4 !text-xs">New Check</Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {!isAuthenticated && (
            <Link href="/get-checked" className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 transition-colors">
              Check my site
            </Link>
          )}
          {isAuthenticated && (
            <Link href="/scans/new" className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 transition-colors">
              New Check
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
                {/* Task #279, site simplification audit 9 Aug 2026: this was a
                    flat 25 item list while desktop tucked the same depth
                    behind a structured Resources dropdown. Grouped into the
                    same three sections (How it works / Who it's for / Read
                    and use) desktop already uses, so mobile isn't a worse
                    experience for carrying the same content. */}
                <Link href="/get-checked" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-white hover:bg-white/5 transition-colors">Get your site checked</Link>
                <Link href="/audit" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Full audit</Link>
                <Link href="/sentinel" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Sentinel: kept clear every month</Link>
                <Link href="/witness-network" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Witness network</Link>
                <Link href="/pricing" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Pricing</Link>

                <p className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30 border-t border-white/10 mt-2">Resources</p>
                <Link href="/about" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">About</Link>
                <Link href="/what-where-whether" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">What, Where, Whether</Link>
                <Link href="/who-when-whether" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Who, When, Whether</Link>
                <Link href="/governance-audit" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Governance assessment, free</Link>
                <Link href="/reports/state-of-uk-marketing-compliance" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">State of UK Marketing Compliance</Link>
                <Link href="/reports/mystery-of-ai-governance" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">The Mystery of AI Governance</Link>
                <Link href="/tools" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Free Tools</Link>
                <Link href="/blog" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">Insights</Link>

              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
