import { cn } from "@/core/utils/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-[var(--color-foreground)]",
        className,
      )}
      {...props}
    />
  );
}
