import Link from "next/link";

/**
 * Task #196: improvement between checks was only ever visible by manually
 * opening the compare page and picking two scans. Surfaces it automatically,
 * right on the result, against whichever scan this user ran immediately
 * before this one. Renders nothing on a first scan, there is nothing to
 * compare against yet.
 */
export function ScoreDelta({
  currentScore,
  currentScanId,
  previousScore,
  previousScanId,
}: {
  currentScore: number;
  currentScanId: string;
  previousScore: number;
  previousScanId: string;
}) {
  const delta = currentScore - previousScore;

  const tone =
    delta > 0
      ? { color: "#4ADE80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)" }
      : delta < 0
      ? { color: "#E5484D", bg: "rgba(229,72,77,0.08)", border: "rgba(229,72,77,0.25)" }
      : { color: "rgba(244,241,234,0.6)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)" };

  const message =
    delta > 0
      ? `Up ${delta} point${delta === 1 ? "" : "s"} since your last check`
      : delta < 0
      ? `Down ${Math.abs(delta)} point${Math.abs(delta) === 1 ? "" : "s"} since your last check`
      : "Same score as your last check";

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-5 py-4"
      style={{ borderColor: tone.border, background: tone.bg }}
    >
      <p className="text-sm font-semibold" style={{ color: tone.color }}>
        {message}
      </p>
      <Link
        href={`/compare/${previousScanId}/${currentScanId}`}
        className="shrink-0 text-sm font-medium text-[rgba(244,241,234,0.6)] hover:text-[rgba(244,241,234,0.9)] hover:underline"
      >
        Compare in detail →
      </Link>
    </div>
  );
}
