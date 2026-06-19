import type { Severity } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Severity | "neutral" | "info";
  className?: string;
}

const variantClasses = {
  high: "bg-[rgba(229,72,77,0.15)] text-[#ff9b9e] border border-[rgba(229,72,77,0.35)]",
  medium: "bg-[rgba(245,158,11,0.15)] text-amber-300 border border-[rgba(245,158,11,0.35)]",
  low: "bg-[rgba(34,197,94,0.15)] text-green-300 border border-[rgba(34,197,94,0.35)]",
  neutral: "bg-white/5 text-[rgba(244,241,234,0.6)] border border-white/10",
  info: "bg-[rgba(59,130,246,0.15)] text-blue-300 border border-[rgba(59,130,246,0.35)]",
};

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
