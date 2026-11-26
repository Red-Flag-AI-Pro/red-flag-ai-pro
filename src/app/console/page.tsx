import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/console";
import { SalesConsole } from "@/components/console/SalesConsole";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sales console",
  robots: { index: false, follow: false },
};

// James's own working screen: website requests waiting for a reply, prospects
// with their red flag, and what to do today. Admin login only.
export default async function ConsolePage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?next=/console");
  return <SalesConsole />;
}
