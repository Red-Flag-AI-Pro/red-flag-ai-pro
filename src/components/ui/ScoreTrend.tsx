"use client";

interface Props {
  scores: number[];       // ordered oldest → newest
  width?: number;
  height?: number;
  className?: string;
}

export function ScoreTrend({ scores, width = 120, height = 36, className = "" }: Props) {
  if (scores.length < 2) return null;

  const min = 0;
  const max = 100;
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = scores.map((s, i) => {
    const x = pad + (i / (scores.length - 1)) * w;
    const y = pad + h - ((s - min) / (max - min)) * h;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");

  // Fill polygon (close at bottom)
  const first = points[0].split(",");
  const last = points[points.length - 1].split(",");
  const fill = [
    ...points,
    `${last[0]},${pad + h}`,
    `${first[0]},${pad + h}`,
  ].join(" ");

  const latest = scores[scores.length - 1];
  const prev = scores[scores.length - 2];
  const trend = latest >= prev ? "up" : "down";
  const strokeColor = trend === "up" ? "#16a34a" : "#dc2626";
  const fillColor = trend === "up" ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
    >
      <polygon points={fill} fill={fillColor} />
      <polyline
        points={polyline}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Latest dot */}
      <circle
        cx={last[0]}
        cy={last[1]}
        r="2.5"
        fill={strokeColor}
      />
    </svg>
  );
}
