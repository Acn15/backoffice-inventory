import Link from "next/link";
import type { Product } from "@/domains/catalog/domain/entities/product";
import type { ProductCategory } from "@/domains/catalog/domain/entities/product-category";
import {
  productStatusLabels,
  productUnitLabels,
} from "@/domains/catalog/presentation/labels";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@/shared/ui";

type ProductsTableProps = {
  products: Product[];
  categoriesById: Record<string, ProductCategory>;
};

export function ProductsTable({
  products,
  categoriesById,
}: ProductsTableProps) {
  if (products.length === 0) {
    return <Text variant="muted">Nenhum produto cadastrado ainda.</Text>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.sku ?? "—"}</TableCell>
            <TableCell>
              {categoriesById[product.categoryId]?.name ?? product.categoryId}
            </TableCell>
            <TableCell>{productUnitLabels[product.unit]}</TableCell>
            <TableCell>
              <Badge
                variant={product.status === "ACTIVE" ? "success" : "default"}
              >
                {productStatusLabels[product.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <Link
                href={`/products/${product.id}`}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Gerenciar
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
