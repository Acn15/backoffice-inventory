"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  RevenueGrain,
  TopProductsSortBy,
} from "@/domains/analytics/domain/entities/analytics";
import { Button, Field, Input, Select, Stack } from "@/shared/ui";

export type DashboardFilterValues = {
  from: string;
  to: string;
  unitId: string;
  grain: RevenueGrain;
  sortBy: TopProductsSortBy;
};

type UnitOption = {
  id: string;
  name: string;
};

type DashboardFiltersProps = {
  initial: DashboardFilterValues;
  units: UnitOption[];
};

export function DashboardFilters({ initial, units }: DashboardFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [unitId, setUnitId] = useState(initial.unitId);
  const [grain, setGrain] = useState<RevenueGrain>(initial.grain);
  const [sortBy, setSortBy] = useState<TopProductsSortBy>(initial.sortBy);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({
      from,
      to,
      grain,
      sortBy,
    });
    if (unitId) {
      params.set("unitId", unitId);
    }

    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Field label="De" htmlFor="analytics-from" required>
            <Input
              id="analytics-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </Field>
          <Field label="Até" htmlFor="analytics-to" required>
            <Input
              id="analytics-to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </Field>
          <Field label="Loja" htmlFor="analytics-unit">
            <Select
              id="analytics-unit"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
            >
              <option value="">Todas as lojas</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Granularidade" htmlFor="analytics-grain">
            <Select
              id="analytics-grain"
              value={grain}
              onChange={(e) => setGrain(e.target.value as RevenueGrain)}
            >
              <option value="day">Dia</option>
              <option value="week">Semana</option>
              <option value="month">Mês</option>
              <option value="year">Ano</option>
            </Select>
          </Field>
          <Field label="Top produtos por" htmlFor="analytics-sort">
            <Select
              id="analytics-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as TopProductsSortBy)}
            >
              <option value="revenue">Faturamento</option>
              <option value="quantity">Quantidade</option>
            </Select>
          </Field>
        </div>
        <div>
          <Button type="submit" loading={isPending}>
            Atualizar dashboard
          </Button>
        </div>
      </Stack>
    </form>
  );
}
