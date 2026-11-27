import type { Metadata } from "next";

// The login page is a client component, so its metadata lives here.
// Kept working for existing accounts but out of search (27 Nov 2026).
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
