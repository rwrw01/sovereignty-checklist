import type { SraLevel } from "@/lib/sra/types";

const levelConfig: Record<
  SraLevel,
  { label: string; color: string; bg: string }
> = {
  0: { label: "SRA-0", color: "text-white", bg: "bg-seal-0" },
  1: { label: "SRA-1", color: "text-white", bg: "bg-seal-1" },
  2: { label: "SRA-2", color: "text-white", bg: "bg-seal-2" },
  3: { label: "SRA-3", color: "text-white", bg: "bg-seal-3" },
  4: { label: "SRA-4", color: "text-white", bg: "bg-seal-4" },
};

interface SraBadgeProps {
  level: SraLevel;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base",
};

export function SraBadge({ level, size = "md" }: SraBadgeProps) {
  const config = levelConfig[level];
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${config.bg} ${config.color} ${sizeStyles[size]}`}
    >
      {config.label}
    </span>
  );
}
