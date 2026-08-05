import { formatMoneyFromCents } from "@/core/utils/format-money";
import type { TopProductsAnalytics } from "@/domains/analytics/domain/entities/analytics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@/shared/ui";

type TopProductsTableProps = {
  topProducts: TopProductsAnalytics;
};

export function TopProductsTable({ topProducts }: TopProductsTableProps) {
  if (topProducts.products.length === 0) {
    return (
      <Text variant="muted">Nenhum produto vendido no período filtrado.</Text>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Qtd</TableHead>
          <TableHead>Faturamento</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topProducts.products.map((product) => (
          <TableRow key={product.productId}>
            <TableCell>{product.rank}</TableCell>
            <TableCell className="font-medium">
              {product.productName}
              {product.productSku ? (
                <span className="block text-xs font-normal text-[var(--color-muted-foreground)]">
                  {product.productSku}
                </span>
              ) : null}
            </TableCell>
            <TableCell>{product.categoryName}</TableCell>
            <TableCell>{product.quantitySold}</TableCell>
            <TableCell>
              {formatMoneyFromCents(product.revenueCents)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
