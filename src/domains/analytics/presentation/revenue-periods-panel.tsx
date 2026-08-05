import { formatMoneyFromCents } from "@/core/utils/format-money";
import type { RevenueAnalytics } from "@/domains/analytics/domain/entities/analytics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@/shared/ui";

type RevenuePeriodsPanelProps = {
  revenue: RevenueAnalytics;
};

export function RevenuePeriodsPanel({ revenue }: RevenuePeriodsPanelProps) {
  if (revenue.periods.length === 0) {
    return (
      <Text variant="muted">
        Sem faturamento no período. Confirme vendas (SALE) para popular o
        gráfico.
      </Text>
    );
  }

  const maxRevenue = Math.max(
    ...revenue.periods.map((period) => period.revenueCents),
    1,
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {revenue.periods.map((period) => {
          const width = Math.max(
            4,
            Math.round((period.revenueCents / maxRevenue) * 100),
          );
          return (
            <div key={period.periodStart} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--color-muted-foreground)]">
                  {period.periodStart}
                </span>
                <span className="font-medium">
                  {formatMoneyFromCents(period.revenueCents)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--color-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Período</TableHead>
            <TableHead>Faturamento</TableHead>
            <TableHead>Quantidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {revenue.periods.map((period) => (
            <TableRow key={`row-${period.periodStart}`}>
              <TableCell>{period.periodStart}</TableCell>
              <TableCell>
                {formatMoneyFromCents(period.revenueCents)}
              </TableCell>
              <TableCell>{period.quantitySold}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
