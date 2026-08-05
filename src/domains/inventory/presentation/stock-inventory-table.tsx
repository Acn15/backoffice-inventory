import { formatDate } from "@/core/utils/format-date";
import type { StockInventoryItem } from "@/domains/inventory/domain/entities/stock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@/shared/ui";

type StockInventoryTableProps = {
  items: StockInventoryItem[];
};

export function StockInventoryTable({ items }: StockInventoryTableProps) {
  if (items.length === 0) {
    return (
      <Text variant="muted">
        Este estoque ainda não possui saldos. Crie e confirme uma entrada.
      </Text>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Lote</TableHead>
          <TableHead>Validade</TableHead>
          <TableHead>Quantidade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.product.name}</TableCell>
            <TableCell>{item.product.sku ?? "—"}</TableCell>
            <TableCell>{item.batch.batchCode}</TableCell>
            <TableCell>
              {item.batch.expirationDate
                ? formatDate(item.batch.expirationDate)
                : "—"}
            </TableCell>
            <TableCell>
              {item.quantity} {item.product.unit}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
