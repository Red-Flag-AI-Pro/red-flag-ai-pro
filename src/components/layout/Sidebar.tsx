"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "▤" },
  { href: "/scans/new", label: "New Scan", icon: "+" },
  { href: "/history", label: "Scan History", icon: "☰" },
  { href: "/billing", label: "Billing", icon: "◈" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-56 flex-col border-r border-gray-200 bg-white">
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
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/scans/new"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}
