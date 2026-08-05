import { cn } from "@/core/utils/cn";

export type SeparatorProps = React.HTMLAttributes<HTMLHRElement>;

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <hr
      className={cn("border-0 border-t border-[var(--color-border)]", className)}
      {...props}
    />
  );
}
