import { cn } from "@/core/utils/cn";

export type StackProps = React.HTMLAttributes<HTMLDivElement> & {
  gap?: "sm" | "md" | "lg";
  direction?: "vertical" | "horizontal";
};

const gaps = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
} as const;

export function Stack({
  className,
  gap = "md",
  direction = "vertical",
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row items-center",
        gaps[gap],
        className,
      )}
      {...props}
    />
  );
}
