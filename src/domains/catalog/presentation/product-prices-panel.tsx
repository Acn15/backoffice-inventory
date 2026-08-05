"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ProductPrice } from "@/domains/catalog/domain/entities/product-price";
import {
  createPriceAction,
  updatePriceAction,
} from "@/domains/catalog/presentation/actions/catalog.actions";
import { formatMoneyFromCents, toCents } from "@/core/utils/format-money";
import {
  Alert,
  Button,
  Field,
  Input,
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

type UnitOption = {
  id: string;
  name: string;
};

type ProductPricesPanelProps = {
  productId: string;
  tenantId: string;
  prices: ProductPrice[];
  units: UnitOption[];
};

export function ProductPricesPanel({
  productId,
  tenantId,
  prices,
  units,
}: ProductPricesPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [unitId, setUnitId] = useState(units[0]?.id ?? "");
  const [salePrice, setSalePrice] = useState("");
  const [editingPrices, setEditingPrices] = useState<Record<string, string>>(
    {},
  );

  const unitsById = Object.fromEntries(units.map((unit) => [unit.id, unit]));
  const pricedUnitIds = new Set(prices.map((price) => price.unitId));
  const availableUnits = units.filter((unit) => !pricedUnitIds.has(unit.id));

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    try {
      const salePriceCents = toCents(salePrice);
      startTransition(async () => {
        const result = await createPriceAction({
          productId,
          unitId,
          tenantId,
          salePriceCents,
        });
        setOk(result.ok);
        setMessage(result.message);
        if (result.ok) {
          setSalePrice("");
          setUnitId(availableUnits.find((u) => u.id !== unitId)?.id ?? "");
          router.refresh();
        }
      });
    } catch {
      setOk(false);
      setMessage("Preço inválido. Use formato como 5,99.");
    }
  }

  function handleUpdate(unitIdToUpdate: string) {
    setMessage(null);
    const raw =
      editingPrices[unitIdToUpdate] ??
      String(
        (prices.find((p) => p.unitId === unitIdToUpdate)?.salePriceCents ?? 0) /
          100,
      ).replace(".", ",");

    try {
      const salePriceCents = toCents(raw);
      startTransition(async () => {
        const result = await updatePriceAction({
          productId,
          unitId: unitIdToUpdate,
          salePriceCents,
        });
        setOk(result.ok);
        setMessage(result.message);
        if (result.ok) router.refresh();
      });
    } catch {
      setOk(false);
      setMessage("Preço inválido. Use formato como 5,99.");
    }
  }

  return (
    <Stack gap="lg">
      <form onSubmit={handleCreate}>
        <Stack gap="md">
          <Text as="h3" variant="h3">
            Novo preço por unidade
          </Text>
          {message ? (
            <Alert variant={ok ? "success" : "danger"}>{message}</Alert>
          ) : null}
          {availableUnits.length === 0 ? (
            <Alert variant="info">
              Todas as unidades já possuem preço para este produto, ou não há
              unidades no tenant.
            </Alert>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Unidade (loja)" htmlFor="price-unit" required>
                  <Select
                    id="price-unit"
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    required
                  >
                    {availableUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Preço de venda (R$)" htmlFor="price-sale" required>
                  <Input
                    id="price-sale"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="5,99"
                    required
                  />
                </Field>
              </div>
              <div>
                <Button type="submit" loading={isPending}>
                  Cadastrar preço
                </Button>
              </div>
            </>
          )}
        </Stack>
      </form>

      <Stack gap="md">
        <Text as="h3" variant="h3">
          Preços ({prices.length})
        </Text>
        {prices.length === 0 ? (
          <Text variant="muted">Nenhum preço cadastrado.</Text>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unidade</TableHead>
                <TableHead>Preço atual</TableHead>
                <TableHead>Novo valor</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((price) => (
                <TableRow key={price.id}>
                  <TableCell className="font-medium">
                    {unitsById[price.unitId]?.name ?? price.unitId}
                  </TableCell>
                  <TableCell>
                    {formatMoneyFromCents(price.salePriceCents)}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={
                        editingPrices[price.unitId] ??
                        (price.salePriceCents / 100).toFixed(2).replace(".", ",")
                      }
                      onChange={(e) =>
                        setEditingPrices((current) => ({
                          ...current,
                          [price.unitId]: e.target.value,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      loading={isPending}
                      onClick={() => handleUpdate(price.unitId)}
                    >
                      Atualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Stack>
    </Stack>
  );
}
