import type { SealLevel } from "@/lib/seal";

const levelConfig: Record<
  SealLevel,
  { label: string; color: string; bg: string }
> = {
  0: { label: "SEAL-0", color: "text-white", bg: "bg-seal-0" },
  1: { label: "SEAL-1", color: "text-white", bg: "bg-seal-1" },
  2: { label: "SEAL-2", color: "text-white", bg: "bg-seal-2" },
  3: { label: "SEAL-3", color: "text-white", bg: "bg-seal-3" },
  4: { label: "SEAL-4", color: "text-white", bg: "bg-seal-4" },
};

interface SealBadgeProps {
  level: SealLevel;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base",
};

export function SealBadge({ level, size = "md" }: SealBadgeProps) {
  const config = levelConfig[level];
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${config.bg} ${config.color} ${sizeStyles[size]}`}
    >
      {config.label}
    </span>
  );
}
