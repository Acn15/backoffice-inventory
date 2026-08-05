import { cn } from "@/core/utils/cn";

export type PanelProps = React.HTMLAttributes<HTMLDivElement>;

/** Superfície para agrupar interação (formulários, filtros). Não usar como card decorativo. */
export function Panel({ className, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6",
        className,
      )}
      {...props}
    />
  );
}
