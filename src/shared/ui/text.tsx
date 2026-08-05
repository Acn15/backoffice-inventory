import { cn } from "@/core/utils/cn";

const textVariants = {
  h1: "text-3xl font-semibold tracking-tight text-[var(--color-foreground)]",
  h2: "text-2xl font-semibold tracking-tight text-[var(--color-foreground)]",
  h3: "text-xl font-semibold text-[var(--color-foreground)]",
  body: "text-base text-[var(--color-foreground)]",
  muted: "text-sm text-[var(--color-muted-foreground)]",
  label: "text-sm font-medium text-[var(--color-foreground)]",
} as const;

export type TextVariant = keyof typeof textVariants;

export type TextProps = React.HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "div";
  variant?: TextVariant;
};

export function Text({
  as: Component = "p",
  variant = "body",
  className,
  ...props
}: TextProps) {
  return (
    <Component className={cn(textVariants[variant], className)} {...props} />
  );
}
