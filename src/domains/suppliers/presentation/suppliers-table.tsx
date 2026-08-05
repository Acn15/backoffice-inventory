import Link from "next/link";
import type { Supplier } from "@/domains/suppliers/domain/entities/supplier";
import { supplierStatusLabels } from "@/domains/suppliers/presentation/labels";
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

type SuppliersTableProps = {
  suppliers: Supplier[];
};

export function SuppliersTable({ suppliers }: SuppliersTableProps) {
  if (suppliers.length === 0) {
    return <Text variant="muted">Nenhum fornecedor cadastrado ainda.</Text>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Cidade</TableHead>
          <TableHead>CNPJ</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell className="font-medium">{supplier.name}</TableCell>
            <TableCell>
              {supplier.city ?? "—"}
              {supplier.state ? `/${supplier.state}` : ""}
            </TableCell>
            <TableCell>{supplier.cnpj ?? "—"}</TableCell>
            <TableCell>{supplier.phone ?? supplier.email ?? "—"}</TableCell>
            <TableCell>
              <Badge
                variant={supplier.status === "ACTIVE" ? "success" : "default"}
              >
                {supplierStatusLabels[supplier.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <Link
                href={`/suppliers/${supplier.id}`}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Editar
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
