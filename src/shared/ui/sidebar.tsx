"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/core/utils/cn";

export type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  open?: boolean;
  onClose?: () => void;
};

export function Sidebar({
  className,
  open = false,
  onClose,
  children,
  ...props
}: SidebarProps) {
  return (
    <>
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-200 md:static md:z-0 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-3 py-4", className)} {...props} />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-t border-[var(--color-border)] px-4 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      aria-label="Principal"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

export type SidebarNavItem = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

export type SidebarNavLinkProps = {
  item: SidebarNavItem;
  items?: SidebarNavItem[];
  onNavigate?: () => void;
};

export function SidebarNavLink({
  item,
  items = [],
  onNavigate,
}: SidebarNavLinkProps) {
  const pathname = usePathname();
  const matchesExact = pathname === item.href;
  const matchesPrefix = pathname.startsWith(`${item.href}/`);
  const hasMoreSpecificMatch = items.some(
    (other) =>
      other.href !== item.href &&
      (other.href === item.href || other.href.startsWith(`${item.href}/`)) &&
      (pathname === other.href || pathname.startsWith(`${other.href}/`)),
  );
  const isActive =
    matchesExact || (matchesPrefix && !hasMoreSpecificMatch);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          : "text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {item.icon ? (
        <span className="inline-flex size-5 shrink-0 items-center justify-center">
          {item.icon}
        </span>
      ) : null}
      <span>{item.label}</span>
    </Link>
  );
}
