"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  ProductCategory,
  ProductCategoryStatus,
} from "@/domains/catalog/domain/entities/product-category";
import { updateCategoryAction } from "@/domains/catalog/presentation/actions/catalog.actions";
import { categoryStatusLabels } from "@/domains/catalog/presentation/labels";
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

type CategoriesTableProps = {
  categories: ProductCategory[];
};

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleStatusChange(id: string, status: ProductCategoryStatus) {
    setError(null);
    startTransition(async () => {
      const result = await updateCategoryAction({ id, status });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  }

  if (categories.length === 0) {
    return <Text variant="muted">Nenhuma categoria cadastrada.</Text>;
  }

  return (
    <Stack gap="md">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Alterar status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.description ?? "—"}</TableCell>
              <TableCell>
                <Badge
                  variant={category.status === "ACTIVE" ? "success" : "default"}
                >
                  {categoryStatusLabels[category.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  value={category.status}
                  disabled={isPending}
                  onChange={(e) =>
                    handleStatusChange(
                      category.id,
                      e.target.value as ProductCategoryStatus,
                    )
                  }
                >
                  <option value="ACTIVE">Ativa</option>
                  <option value="INACTIVE">Inativa</option>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
