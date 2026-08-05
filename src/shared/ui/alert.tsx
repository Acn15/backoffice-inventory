import { cn } from "@/core/utils/cn";

const alertVariants = {
  info: "border-[var(--color-info)] bg-[var(--color-info-soft)] text-[var(--color-info)]",
  success:
    "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success)]",
  warning:
    "border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  danger:
    "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
} as const;

export type AlertVariant = keyof typeof alertVariants;

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: string;
};

export function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-[var(--radius-md)] border px-4 py-3 text-sm",
        alertVariants[variant],
        className,
      )}
      {...props}
    >
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      {children}
    </div>
  );
}
