interface ScoreGaugeProps {
  score: number;
  size?: number;
}

function scoreColor(score: number) {
  if (score >= 70) return { stroke: "#16a34a", text: "text-green-600", label: "Low Risk" };
  if (score >= 40) return { stroke: "#d97706", text: "text-amber-600", label: "Medium Risk" };
  return { stroke: "#dc2626", text: "text-red-600", label: "High Risk" };
}

export function ScoreGauge({ score, size = 160 }: ScoreGaugeProps) {
  const { stroke, text, label } = scoreColor(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // Only fill the top half (semicircle), map score 0-100 to 0-π*r arc
  const arcLength = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          {/* Score arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${text}`}>{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${text}`}>{label}</span>
    </div>
  );
}
