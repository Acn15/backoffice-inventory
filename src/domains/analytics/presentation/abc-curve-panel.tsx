import { formatMoneyFromCents } from "@/core/utils/format-money";
import type {
  AbcClass,
  AbcCurveAnalytics,
} from "@/domains/analytics/domain/entities/analytics";
import {
  Badge,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@/shared/ui";

type AbcCurvePanelProps = {
  abcCurve: AbcCurveAnalytics;
};

const abcBadgeVariant: Record<
  AbcClass,
  "success" | "warning" | "default"
> = {
  A: "success",
  B: "warning",
  C: "default",
};

export function AbcCurvePanel({ abcCurve }: AbcCurvePanelProps) {
  const classes: AbcClass[] = ["A", "B", "C"];

  return (
    <Stack gap="lg">
      <div className="grid gap-4 md:grid-cols-3">
        {classes.map((abcClass) => {
          const summary = abcCurve.summary[abcClass] ?? {
            productCount: 0,
            revenueCents: 0,
            revenueSharePercent: 0,
          };
          return (
            <div
              key={abcClass}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4"
            >
              <Stack gap="sm">
                <div className="flex items-center justify-between gap-2">
                  <Text as="h3" variant="h3">
                    Classe {abcClass}
                  </Text>
                  <Badge variant={abcBadgeVariant[abcClass]}>{abcClass}</Badge>
                </div>
                <Text variant="muted">
                  {summary.productCount} produto(s) ·{" "}
                  {summary.revenueSharePercent.toFixed(1)}% do faturamento
                </Text>
                <Text className="font-medium">
                  {formatMoneyFromCents(summary.revenueCents)}
                </Text>
              </Stack>
            </div>
          );
        })}
      </div>

      {abcCurve.products.length === 0 ? (
        <Text variant="muted">Sem dados para montar a curva ABC.</Text>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Faturamento</TableHead>
              <TableHead>% </TableHead>
              <TableHead>% acum.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {abcCurve.products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.rank}</TableCell>
                <TableCell>
                  <Badge variant={abcBadgeVariant[product.abcClass]}>
                    {product.abcClass}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {product.productName}
                </TableCell>
                <TableCell>
                  {formatMoneyFromCents(product.revenueCents)}
                </TableCell>
                <TableCell>
                  {product.revenueSharePercent.toFixed(1)}%
                </TableCell>
                <TableCell>
                  {product.cumulativeRevenueSharePercent.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Stack>
  );
}
