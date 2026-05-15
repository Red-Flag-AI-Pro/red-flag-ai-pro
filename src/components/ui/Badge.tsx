import type { Severity } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Severity | "neutral" | "info";
  className?: string;
}

const variantClasses = {
  high: "bg-red-100 text-red-700 border border-red-200",
  medium: "bg-amber-100 text-amber-700 border border-amber-200",
  low: "bg-green-100 text-green-700 border border-green-200",
  neutral: "bg-gray-100 text-gray-600 border border-gray-200",
  info: "bg-blue-100 text-blue-700 border border-blue-200",
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
