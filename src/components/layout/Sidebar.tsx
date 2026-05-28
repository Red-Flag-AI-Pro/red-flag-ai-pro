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
  { href: "/team", label: "Team", icon: "⬡" },
  { href: "/billing", label: "Billing", icon: "◈" },
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
                ? "bg-red-50 text-red-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/redflag-logo.png"
            alt="Red Flag AI Pro"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-sm font-bold text-gray-900">
            Red Flag AI <span className="text-red-600">Pro</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
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
          <div className="relative flex h-full w-64 flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center border-b border-gray-200 px-4">
              <span className="text-sm font-bold text-gray-900">Menu</span>
            </div>
            <nav className="flex-1 space-y-0.5 p-3">
              {navLinks}
            </nav>
            <div className="border-t border-gray-200 p-3">
              <button
                onClick={() => { setMobileOpen(false); handleSignOut(); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <span>→</span>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex h-full w-56 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/redflag-logo.png"
              alt="Red Flag AI Pro"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="text-sm font-bold text-gray-900">
              Red Flag AI <span className="text-red-600">Pro</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {navLinks}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span>→</span>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
