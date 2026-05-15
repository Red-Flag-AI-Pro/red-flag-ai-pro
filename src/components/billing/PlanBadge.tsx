import type { Plan } from "@/types";

const CONFIG: Record<Plan, { label: string; className: string }> = {
  free: { label: "Free", className: "bg-gray-100 text-gray-600" },
  pro: { label: "Pro", className: "bg-red-100 text-red-700" },
  enterprise: { label: "Enterprise", className: "bg-purple-100 text-purple-700" },
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
