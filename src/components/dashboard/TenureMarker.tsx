function monthsSince(date: string): number {
  const start = new Date(date);
  const now = new Date();
  return Math.max(
    0,
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  );
}

/**
 * The dashboard's other stats are usage numbers, forgettable by design. This
 * one is deliberately not: it reframes accumulated history as an asset, the
 * same reason a credit history compounds. The retention lever isn't hiding
 * an exit, it's making the thing being walked away from legible.
 */
export function TenureMarker({
  memberSince,
  totalChecks,
  sealedEvents,
}: {
  memberSince: string;
  totalChecks: number;
  sealedEvents: number;
}) {
  const months = monthsSince(memberSince);
  const monthsLabel = months === 0 ? "Just started" : months === 1 ? "1 month" : `${months} months`;

  return (
    <div className="rounded-xl border border-[rgba(201,166,107,0.3)] bg-gradient-to-r from-[rgba(201,166,107,0.08)] to-[#102943] px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A66B]">
            Continuous governance history
          </p>
          <p className="mt-1 text-2xl font-bold text-[#F4F1EA]">{monthsLabel}</p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-lg font-bold text-[#F4F1EA]">{totalChecks}</p>
            <p className="text-xs text-[rgba(244,241,234,0.5)]">checks, all time</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[#F4F1EA]">{sealedEvents}</p>
            <p className="text-xs text-[rgba(244,241,234,0.5)]">sealed events</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-[rgba(244,241,234,0.4)]">
        This record grows with every check. It only stays continuous for as long as you do.
      </p>
    </div>
  );
}
