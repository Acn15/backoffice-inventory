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

export type StockProductRow = {
  productId: string;
  name: string;
  sku?: string;
  unit: string;
  quantity: number;
};

export function aggregateStockProducts(
  items: StockInventoryItem[],
): StockProductRow[] {
  const byProduct = new Map<string, StockProductRow>();

  for (const item of items) {
    const existing = byProduct.get(item.productId);
    if (existing) {
      existing.quantity += item.quantity;
      continue;
    }

    byProduct.set(item.productId, {
      productId: item.productId,
      name: item.product.name,
      sku: item.product.sku,
      unit: item.product.unit,
      quantity: item.quantity,
    });
  }

  return Array.from(byProduct.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );
}

type StockProductsTableProps = {
  products: StockProductRow[];
};

export function StockProductsTable({ products }: StockProductsTableProps) {
  if (products.length === 0) {
    return (
      <Text variant="muted">
        Este estoque ainda não possui produtos. Crie e confirme uma entrada.
      </Text>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Quantidade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.productId}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.sku ?? "—"}</TableCell>
            <TableCell>{product.unit}</TableCell>
            <TableCell>{product.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
