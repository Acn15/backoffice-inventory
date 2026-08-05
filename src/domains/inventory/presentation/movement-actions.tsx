"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  cancelStockMovementAction,
  confirmStockMovementAction,
} from "@/domains/inventory/presentation/actions/stock-movement.actions";
import { Alert, Button, Stack } from "@/shared/ui";

type MovementActionsProps = {
  movementId: string;
  userId: string;
};

export function MovementActions({
  movementId,
  userId,
}: MovementActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(
    action: typeof confirmStockMovementAction | typeof cancelStockMovementAction,
    payload: { movementId: string; confirmedById?: string; canceledById?: string },
  ) {
    setError(null);
    startTransition(async () => {
      const result =
        action === confirmStockMovementAction
          ? await confirmStockMovementAction({
              movementId: payload.movementId,
              confirmedById: userId,
            })
          : await cancelStockMovementAction({
              movementId: payload.movementId,
              canceledById: userId,
            });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <Stack gap="sm">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          loading={isPending}
          onClick={() =>
            run(confirmStockMovementAction, {
              movementId,
              confirmedById: userId,
            })
          }
        >
          Confirmar
        </Button>
        <Button
          size="sm"
          variant="outline"
          loading={isPending}
          onClick={() =>
            run(cancelStockMovementAction, {
              movementId,
              canceledById: userId,
            })
          }
        >
          Cancelar
        </Button>
      </div>
    </Stack>
  );
}
