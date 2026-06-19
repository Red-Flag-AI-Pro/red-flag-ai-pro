import type { Plan } from "@/types";

const CONFIG: Record<Plan, { label: string; className: string }> = {
  free: { label: "Starter", className: "bg-white/5 text-[rgba(244,241,234,0.6)]" },
  pro: { label: "Pro", className: "bg-red-100 text-[#ff9b9e]" },
  enterprise: { label: "Growth", className: "bg-purple-100 text-purple-700" },
  sentinel: { label: "Sentinel", className: "bg-gray-900 text-red-400 border border-red-500/30" },
};

export function PlanBadge({ plan }: { plan: Plan }) {
  const { label, className } = CONFIG[plan];
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
