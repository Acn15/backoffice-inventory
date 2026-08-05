import Link from "next/link";
import type { Stock } from "@/domains/inventory/domain/entities/stock";
import {
  stockStatusLabels,
  stockTypeLabels,
} from "@/domains/inventory/presentation/labels";
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

type StocksTableProps = {
  stocks: Stock[];
};

export function StocksTable({ stocks }: StocksTableProps) {
  if (stocks.length === 0) {
    return <Text variant="muted">Nenhum estoque cadastrado ainda.</Text>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Loja</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => (
          <TableRow key={stock.id}>
            <TableCell className="font-medium">{stock.name}</TableCell>
            <TableCell>{stockTypeLabels[stock.type]}</TableCell>
            <TableCell>
              {stock.unitId ? (
                <Badge variant="info">Vinculada</Badge>
              ) : (
                <Badge>Sem loja</Badge>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={stock.status === "ACTIVE" ? "success" : "default"}>
                {stockStatusLabels[stock.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <Link
                href={`/stocks/${stock.id}`}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Ver produtos
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
