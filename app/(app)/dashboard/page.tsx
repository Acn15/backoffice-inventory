import { ApiError } from "@/core/errors/api-error";
import { formatMoneyFromCents } from "@/core/utils/format-money";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { analyticsContainer } from "@/domains/analytics/infrastructure/analytics.container";
import type {
  RevenueGrain,
  TopProductsSortBy,
} from "@/domains/analytics/domain/entities/analytics";
import { AbcCurvePanel } from "@/domains/analytics/presentation/abc-curve-panel";
import { DashboardFilters } from "@/domains/analytics/presentation/dashboard-filters";
import { DashboardKpis } from "@/domains/analytics/presentation/dashboard-kpis";
import { RevenuePeriodsPanel } from "@/domains/analytics/presentation/revenue-periods-panel";
import { TopProductsTable } from "@/domains/analytics/presentation/top-products-table";
import { listUnitsByTenant } from "@/domains/inventory/infrastructure/inventory-lookups";
import {
  Alert,
  Container,
  Panel,
  Stack,
  Text,
} from "@/shared/ui";

type DashboardPageProps = {
  searchParams: Promise<{
    from?: string;
    to?: string;
    unitId?: string;
    grain?: string;
    sortBy?: string;
  }>;
};

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function defaultFrom(): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 29);
  return toDateInputValue(date);
}

function isRevenueGrain(value: string | undefined): value is RevenueGrain {
  return (
    value === "day" ||
    value === "week" ||
    value === "month" ||
    value === "year"
  );
}

function isTopProductsSortBy(
  value: string | undefined,
): value is TopProductsSortBy {
  return value === "quantity" || value === "revenue";
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const from = params.from || defaultFrom();
  const to = params.to || toDateInputValue(new Date());
  const unitId = params.unitId || "";
  const grain: RevenueGrain = isRevenueGrain(params.grain)
    ? params.grain
    : "day";
  const sortBy: TopProductsSortBy = isTopProductsSortBy(params.sortBy)
    ? params.sortBy
    : "revenue";

  let loadError: string | null = null;
  let tenantId: string | null = null;
  let units: Awaited<ReturnType<typeof listUnitsByTenant>> = [];
  let analytics: Awaited<
    ReturnType<typeof analyticsContainer.getDashboardAnalyticsUseCase.execute>
  >["analytics"] | null = null;
  let partialErrors: string[] = [];

  try {
    const profile = await nestServerProfile();
    tenantId = profile.user.tenantId;

    if (tenantId) {
      const [unitsResult, dashboardResult] = await Promise.all([
        listUnitsByTenant(tenantId),
        analyticsContainer.getDashboardAnalyticsUseCase.execute({
          tenantId,
          from,
          to,
          unitId: unitId || undefined,
          grain,
          sortBy,
          limit: 10,
        }),
      ]);
      units = unitsResult;
      analytics = dashboardResult.analytics;
      partialErrors = dashboardResult.errors;
    }
  } catch (error) {
    loadError =
      error instanceof ApiError
        ? error.messages.join(" ")
        : "Não foi possível carregar o analytics.";
  }

  return (
    <main className="py-8">
      <Container>
        <Stack gap="lg">
          <Stack gap="sm">
            <Text as="h2" variant="h2">
              Dashboard
            </Text>
            <Text variant="muted">
              Indicadores de vendas confirmadas (SALE). Use os filtros para
              alterar período, loja e granularidade.
            </Text>
          </Stack>

          {loadError ? (
            <Alert variant="danger" title="Erro ao carregar">
              {loadError}
            </Alert>
          ) : !tenantId ? (
            <Alert variant="warning" title="Tenant não encontrado">
              Seu usuário não está vinculado a um tenant.
            </Alert>
          ) : (
            <>
              <Panel>
                <DashboardFilters
                  initial={{ from, to, unitId, grain, sortBy }}
                  units={units}
                />
              </Panel>

              {partialErrors.length > 0 ? (
                <Alert variant="warning" title="Alguns indicadores falharam">
                  {partialErrors.join(" · ")}
                </Alert>
              ) : null}

              {analytics ? (
                <>
                  <DashboardKpis analytics={analytics} />

                  <Panel>
                    <Stack gap="md">
                      <Text as="h3" variant="h3">
                        Ticket médio
                      </Text>
                      <Text as="h3" variant="h3">
                        {formatMoneyFromCents(
                          analytics.averageTicket.averageTicketCents,
                        )}
                      </Text>
                      <Text variant="muted">
                        {analytics.averageTicket.saleCount} venda(s) ·
                        faturamento{" "}
                        {formatMoneyFromCents(
                          analytics.averageTicket.totalRevenueCents,
                        )}
                      </Text>
                      <Text variant="muted">
                        {analytics.averageTicket.reliabilityNote}
                      </Text>
                    </Stack>
                  </Panel>

                  <div className="grid gap-4 xl:grid-cols-2">
                    <Panel>
                      <Stack gap="md">
                        <Text as="h3" variant="h3">
                          Faturamento por período
                        </Text>
                        <RevenuePeriodsPanel revenue={analytics.revenue} />
                      </Stack>
                    </Panel>

                    <Panel>
                      <Stack gap="md">
                        <Text as="h3" variant="h3">
                          Produtos mais vendidos
                        </Text>
                        <TopProductsTable
                          topProducts={analytics.topProducts}
                        />
                      </Stack>
                    </Panel>
                  </div>

                  <Panel>
                    <Stack gap="md">
                      <Stack gap="sm">
                        <Text as="h3" variant="h3">
                          Curva ABC
                        </Text>
                        <Text variant="muted">
                          A ≤ 80% do faturamento acumulado · B ≤ 95% · demais C
                        </Text>
                      </Stack>
                      <AbcCurvePanel abcCurve={analytics.abcCurve} />
                    </Stack>
                  </Panel>
                </>
              ) : null}
            </>
          )}
        </Stack>
      </Container>
    </main>
  );
}
