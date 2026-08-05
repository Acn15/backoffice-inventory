"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/domains/auth/presentation/auth-provider";
import { Spinner, Stack, Text } from "@/shared/ui";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
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
