import type { Metadata } from "next";

// Orphaned near-duplicate of /governance-audit, not linked from anywhere on
// the site. Keep it out of the index so it never competes with the real
// page as duplicate content.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function GovernanceAuditGatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
