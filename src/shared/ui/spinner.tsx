import { cn } from "@/core/utils/cn";

export type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
};

const sizes = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-[3px]",
} as const;

export function Spinner({
  className,
  size = "md",
  label = "Carregando",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-[var(--color-border)] border-t-[var(--color-primary)]",
        sizes[size],
        className,
      )}
    />
  );
}
