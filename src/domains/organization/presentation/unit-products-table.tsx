import { formatMoneyFromCents } from "@/core/utils/format-money";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@/shared/ui";

export type UnitProductRow = {
  productId: string;
  name: string;
  sku?: string;
  unit: string;
  quantity: number;
  salePriceCents: number | null;
};

type UnitProductsTableProps = {
  products: UnitProductRow[];
};

export function UnitProductsTable({ products }: UnitProductsTableProps) {
  if (products.length === 0) {
    return (
      <Text variant="muted">
        Há estoque vinculado, mas ainda não há produtos com saldo nesta loja.
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
          <TableHead>Preço de venda</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.productId}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.sku ?? "—"}</TableCell>
            <TableCell>{product.unit}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>
              {product.salePriceCents === null
                ? "Sem preço"
                : formatMoneyFromCents(product.salePriceCents)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
