import type { Stock } from "@/domains/inventory/domain/entities/stock";
import type { StockMovement } from "@/domains/inventory/domain/entities/stock-movement";
import {
  movementStatusLabels,
  movementTypeLabels,
} from "@/domains/inventory/presentation/labels";
import { formatDateTime } from "@/core/utils/format-date";
import { formatMoneyFromCents } from "@/core/utils/format-money";
import { MovementActions } from "@/domains/inventory/presentation/movement-actions";
import {
  Badge,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@/shared/ui";

type MovementsTableProps = {
  movements: StockMovement[];
  stocksById: Record<string, Stock>;
  userId: string;
};

function statusVariant(status: StockMovement["status"]) {
  if (status === "CONFIRMED") return "success" as const;
  if (status === "CANCELED") return "danger" as const;
  return "warning" as const;
}

export function MovementsTable({
  movements,
  stocksById,
  userId,
}: MovementsTableProps) {
  if (movements.length === 0) {
    return <Text variant="muted">Nenhuma movimentação encontrada.</Text>;
  }

  return (
    <Stack gap="lg">
      {movements.map((movement) => (
        <div
          key={movement.id}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4"
        >
          <Stack gap="md">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <Stack gap="sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Text className="font-semibold">
                    {movementTypeLabels[movement.type]}
                  </Text>
                  <Badge variant={statusVariant(movement.status)}>
                    {movementStatusLabels[movement.status]}
                  </Badge>
                </div>
                <Text variant="muted">
                  {movement.description || "Sem descrição"} ·{" "}
                  {formatDateTime(movement.createdAt)}
                </Text>
                <Text variant="muted">
                  Origem:{" "}
                  {movement.fromStockId
                    ? stocksById[movement.fromStockId]?.name ??
                      movement.fromStockId
                    : "—"}{" "}
                  → Destino:{" "}
                  {movement.toStockId
                    ? stocksById[movement.toStockId]?.name ?? movement.toStockId
                    : "—"}
                </Text>
              </Stack>

              {movement.status === "PENDING" ? (
                <MovementActions movementId={movement.id} userId={userId} />
              ) : null}
            </div>

            {movement.items && movement.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Custo</TableHead>
                    <TableHead>Venda</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movement.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.product?.name ?? item.productId}
                      </TableCell>
                      <TableCell>
                        {item.batch?.batchCode ?? item.batchId}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {formatMoneyFromCents(item.purchaseUnitPriceCents)}
                      </TableCell>
                      <TableCell>
                        {formatMoneyFromCents(item.saleUnitPriceCents)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Text variant="muted">Sem itens.</Text>
            )}
          </Stack>
        </div>
      ))}
    </Stack>
  );
}
