import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark";
}

export function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const base =
    variant === "dark"
      ? "bg-mxi-dark-secondary text-white"
      : "bg-white text-foreground";

  return (
    <div
      className={`rounded-xl border border-gray-200 shadow-sm p-6 ${base} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
