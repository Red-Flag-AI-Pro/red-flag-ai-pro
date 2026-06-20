"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "▤" },
  { href: "/scans/new", label: "New Scan", icon: "+" },
  { href: "/history", label: "Scan History", icon: "☰" },
  { href: "/bulk", label: "Site Audit", icon: "▦" },
  { href: "/clients", label: "Clients", icon: "▢" },
  { href: "/monitor", label: "Monitoring", icon: "◉" },
  { href: "/team", label: "Team", icon: "⬡" },
  { href: "/billing", label: "Billing", icon: "◈" },
  { href: "/dashboard/tools", label: "Toolkit", icon: "▣" },
  { href: "/referrals", label: "Referrals", icon: "⇄" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const navLinks = (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/scans/new"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-[rgba(229,72,77,0.1)] text-[#ff9b9e]"
                : "text-[rgba(244,241,234,0.6)] hover:bg-white/5 hover:text-[#F4F1EA]",
            ].join(" ")}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#102943] px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/redflag-logo-full.png"
            alt="Red Flag AI Pro"
            width={44}
            height={35}
            className="object-contain"
          />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-[rgba(244,241,234,0.6)] hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            // X icon
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile slide-out drawer ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="relative flex h-full w-64 flex-col bg-[#102943] shadow-xl">
            <div className="flex h-14 items-center border-b border-white/10 px-4">
              <span className="text-sm font-bold text-[#F4F1EA]">Menu</span>
            </div>
            <nav className="flex-1 space-y-0.5 p-3">
              {navLinks}
            </nav>
            <div className="border-t border-white/10 p-3">
              <button
                onClick={() => { setMobileOpen(false); handleSignOut(); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[rgba(244,241,234,0.5)] hover:bg-white/5 hover:text-[#F4F1EA] transition-colors"
              >
                <span>→</span>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex h-full w-56 flex-col border-r border-white/10 bg-[#102943]">
        <div className="flex h-14 items-center border-b border-white/10 px-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/redflag-logo-full.png"
              alt="Red Flag AI Pro"
              width={48}
              height={38}
              className="object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {navLinks}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[rgba(244,241,234,0.5)] hover:bg-white/5 hover:text-[#F4F1EA] transition-colors"
          >
            <span>→</span>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
