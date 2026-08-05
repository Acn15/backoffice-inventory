import { formatMoneyFromCents } from "@/core/utils/format-money";
import type { DashboardAnalytics } from "@/domains/analytics/domain/entities/analytics";
import { Panel, Stack, Text } from "@/shared/ui";

type DashboardKpisProps = {
  analytics: DashboardAnalytics;
};

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Panel>
      <Stack gap="sm">
        <Text variant="muted">{label}</Text>
        <Text as="h3" variant="h3">
          {value}
        </Text>
        {hint ? <Text variant="muted">{hint}</Text> : null}
      </Stack>
    </Panel>
  );
}

export function DashboardKpis({ analytics }: DashboardKpisProps) {
  const { revenue, averageTicket, abcCurve } = analytics;
  const scopeLabel = revenue.scope === "unit" ? "loja filtrada" : "todas as lojas";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Faturamento"
        value={formatMoneyFromCents(revenue.totalRevenueCents)}
        hint={`${scopeLabel} · vendas confirmadas`}
      />
      <KpiCard
        label="Quantidade vendida"
        value={String(revenue.totalQuantitySold)}
        hint="Soma das unidades em SALE confirmadas"
      />
      <KpiCard
        label="Ticket médio"
        value={formatMoneyFromCents(averageTicket.averageTicketCents)}
        hint={`${averageTicket.saleCount} venda(s) confirmada(s)`}
      />
      <KpiCard
        label="Produtos na curva ABC"
        value={String(abcCurve.products.length)}
        hint={`Faturamento ABC ${formatMoneyFromCents(abcCurve.totalRevenueCents)}`}
      />
    </div>
  );
}
