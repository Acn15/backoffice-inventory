"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { StockStatus, StockType } from "@/domains/inventory/domain/entities/stock";
import { createStockAction } from "@/domains/inventory/presentation/actions/create-stock.action";
import type { UnitOption } from "@/domains/inventory/infrastructure/inventory-lookups";
import {
  Alert,
  Button,
  Field,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@/shared/ui";

type CreateStockFormProps = {
  tenantId: string;
  units: UnitOption[];
};

export function CreateStockForm({ tenantId, units }: CreateStockFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unitId, setUnitId] = useState("");
  const [type, setType] = useState<StockType>("WAREHOUSE");
  const [status, setStatus] = useState<StockStatus>("ACTIVE");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await createStockAction({
        tenantId,
        name,
        description: description || undefined,
        unitId: unitId || undefined,
        type,
        status,
      });

      setOk(result.ok);
      setMessage(result.message);

      if (result.ok) {
        setName("");
        setDescription("");
        setUnitId("");
        setType("WAREHOUSE");
        setStatus("ACTIVE");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text as="h3" variant="h3">
          Novo estoque
        </Text>

        {message ? (
          <Alert variant={ok ? "success" : "danger"}>{message}</Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome" htmlFor="stock-name" required>
            <Input
              id="stock-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
            />
          </Field>

          <Field label="Unidade" htmlFor="stock-unit">
            <Select
              id="stock-unit"
              value={unitId}
              onChange={(event) => setUnitId(event.target.value)}
            >
              <option value="">Sem unidade</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Tipo" htmlFor="stock-type" required>
            <Select
              id="stock-type"
              value={type}
              onChange={(event) => setType(event.target.value as StockType)}
            >
              <option value="WAREHOUSE">Depósito</option>
              <option value="MAIN_WAREHOUSE">Depósito principal</option>
              <option value="DISTRIBUTION_CENTER">Centro de distribuição</option>
            </Select>
          </Field>

          <Field label="Status" htmlFor="stock-status">
            <Select
              id="stock-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as StockStatus)}
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </Select>
          </Field>

          <Field
            label="Descrição"
            htmlFor="stock-description"
            className="md:col-span-2"
          >
            <Textarea
              id="stock-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
        </div>

        <div>
          <Button type="submit" loading={isPending}>
            Criar estoque
          </Button>
        </div>
      </Stack>
    </form>
  );
}
