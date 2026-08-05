"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  ProductBatch,
  ProductBatchStatus,
} from "@/domains/catalog/domain/entities/product-batch";
import { updateBatchAction } from "@/domains/catalog/presentation/actions/catalog.actions";
import { batchStatusLabels } from "@/domains/catalog/presentation/labels";
import { formatDate } from "@/core/utils/format-date";
import {
  Alert,
  Badge,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@/shared/ui";

type ProductBatchesPanelProps = {
  productId: string;
  tenantId: string;
  batches: ProductBatch[];
};

export function ProductBatchesPanel({
  productId,
  batches,
}: ProductBatchesPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function handleStatusChange(batchId: string, nextStatus: ProductBatchStatus) {
    setMessage(null);
    startTransition(async () => {
      const result = await updateBatchAction({
        productId,
        batchId,
        status: nextStatus,
      });
      setOk(result.ok);
      setMessage(result.message);
      if (result.ok) router.refresh();
    });
  }

  return (
    <Stack gap="md">
      <Stack gap="sm">
        <Text as="h3" variant="h3">
          Lotes deste produto ({batches.length})
        </Text>
        <Text variant="muted">
          Novos lotes são criados na tela de movimentações (entrada). Aqui você
          consulta e altera o status.
        </Text>
      </Stack>

      {message ? (
        <Alert variant={ok ? "success" : "danger"}>{message}</Alert>
      ) : null}

      {batches.length === 0 ? (
        <Text variant="muted">
          Nenhum lote ainda. Crie um lote ao registrar uma entrada em
          Movimentações.
        </Text>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Fabricação</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Alterar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell className="font-medium">{batch.batchCode}</TableCell>
                <TableCell>
                  {batch.manufactureDate
                    ? formatDate(batch.manufactureDate)
                    : "—"}
                </TableCell>
                <TableCell>{formatDate(batch.expirationDate)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      batch.status === "AVAILABLE" ? "success" : "warning"
                    }
                  >
                    {batchStatusLabels[batch.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={batch.status}
                    disabled={isPending}
                    onChange={(e) =>
                      handleStatusChange(
                        batch.id,
                        e.target.value as ProductBatchStatus,
                      )
                    }
                  >
                    <option value="AVAILABLE">Disponível</option>
                    <option value="BLOCKED">Bloqueado</option>
                    <option value="QUARANTINED">Quarentena</option>
                    <option value="DISCARDED">Descartado</option>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Stack>
  );
}
