import Link from "next/link";
import type { Unit } from "@/domains/organization/domain/entities/unit";
import { unitStatusLabels } from "@/domains/organization/presentation/labels";
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

type UnitsTableProps = {
  units: Unit[];
};

export function UnitsTable({ units }: UnitsTableProps) {
  if (units.length === 0) {
    return <Text variant="muted">Nenhuma loja cadastrada ainda.</Text>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Cidade</TableHead>
          <TableHead>CNPJ</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {units.map((unit) => (
          <TableRow key={unit.id}>
            <TableCell className="font-medium">{unit.name}</TableCell>
            <TableCell>
              {unit.city ?? "—"}
              {unit.state ? `/${unit.state}` : ""}
            </TableCell>
            <TableCell>{unit.cnpj ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={unit.status === "ACTIVE" ? "success" : "default"}>
                {unitStatusLabels[unit.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <Link
                href={`/units/${unit.id}`}
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
