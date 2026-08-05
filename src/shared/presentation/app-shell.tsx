"use client";

import { useState } from "react";
import { AppSidebar } from "@/shared/presentation/app-sidebar";
import { Button, Text } from "@/shared/ui";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-1">
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            Menu
          </Button>
          <Text as="h1" variant="h3">
            Automotive Parts
          </Text>
        </header>

        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
