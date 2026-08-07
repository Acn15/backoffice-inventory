"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/domains/auth/presentation/auth-provider";
import { Spinner, Stack, Text } from "@/shared/ui";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status !== "unauthenticated") {
      return;
    }

    // Garante limpeza de cookie inválido antes de ir ao login.
    void fetch("/api/auth/clear", {
      method: "POST",
      credentials: "same-origin",
    }).finally(() => {
      router.replace("/login");
      router.refresh();
    });
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Stack direction="horizontal" gap="sm">
          <Spinner />
          <Text variant="muted">Validando sessão...</Text>
        </Stack>
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return children;
}
