import { RequireAuth } from "@/domains/auth/presentation/require-auth";
import { AppShell } from "@/shared/presentation/app-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
