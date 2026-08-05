import type {
  AbcCurveAnalytics,
  AverageTicketAnalytics,
  DashboardAnalytics,
  RevenueAnalytics,
  RevenueGrain,
  TopProductsAnalytics,
  TopProductsSortBy,
} from "@/domains/analytics/domain/entities/analytics";
import type { AnalyticsRepository } from "@/domains/analytics/domain/repositories/analytics-repository";

export type GetDashboardAnalyticsInput = {
  tenantId: string;
  from: string;
  to: string;
  unitId?: string;
  grain: RevenueGrain;
  sortBy: TopProductsSortBy;
  limit?: number;
};

export type DashboardAnalyticsResult = {
  analytics: DashboardAnalytics;
  errors: string[];
};

function emptyRevenue(
  input: GetDashboardAnalyticsInput,
): RevenueAnalytics {
  return {
    tenantId: input.tenantId,
    scope: input.unitId ? "unit" : "tenant",
    from: input.from,
    to: input.to,
    grain: input.grain,
    totalRevenueCents: 0,
    totalQuantitySold: 0,
    periods: [],
  };
}

function emptyTopProducts(
  input: GetDashboardAnalyticsInput,
): TopProductsAnalytics {
  return {
    tenantId: input.tenantId,
    scope: input.unitId ? "unit" : "tenant",
    from: input.from,
    to: input.to,
    sortBy: input.sortBy,
    limit: input.limit ?? 10,
    products: [],
  };
}

function emptyAbcCurve(input: GetDashboardAnalyticsInput): AbcCurveAnalytics {
  return {
    tenantId: input.tenantId,
    scope: input.unitId ? "unit" : "tenant",
    from: input.from,
    to: input.to,
    totalRevenueCents: 0,
    summary: {
      A: { productCount: 0, revenueCents: 0, revenueSharePercent: 0 },
      B: { productCount: 0, revenueCents: 0, revenueSharePercent: 0 },
      C: { productCount: 0, revenueCents: 0, revenueSharePercent: 0 },
    },
    products: [],
  };
}

function emptyAverageTicket(
  input: GetDashboardAnalyticsInput,
): AverageTicketAnalytics {
  return {
    tenantId: input.tenantId,
    scope: input.unitId ? "unit" : "tenant",
    from: input.from,
    to: input.to,
    totalRevenueCents: 0,
    saleCount: 0,
    averageTicketCents: null,
    reliabilityNote:
      "Each confirmed SALE movement is treated as one customer purchase.",
  };
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Falha ao carregar indicador.";
}

export class GetDashboardAnalyticsUseCase {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(
    input: GetDashboardAnalyticsInput,
  ): Promise<DashboardAnalyticsResult> {
    const base = {
      tenantId: input.tenantId,
      from: input.from,
      to: input.to,
      unitId: input.unitId,
    };

    const [revenueResult, topResult, abcResult, ticketResult] =
      await Promise.allSettled([
        this.analyticsRepository.getRevenue({
          ...base,
          grain: input.grain,
        }),
        this.analyticsRepository.getTopProducts({
          ...base,
          sortBy: input.sortBy,
          limit: input.limit ?? 10,
        }),
        this.analyticsRepository.getAbcCurve(base),
        this.analyticsRepository.getAverageTicket(base),
      ]);

    const errors: string[] = [];

    const revenue =
      revenueResult.status === "fulfilled"
        ? revenueResult.value
        : (errors.push(`Faturamento: ${errorMessage(revenueResult.reason)}`),
          emptyRevenue(input));

    const topProducts =
      topResult.status === "fulfilled"
        ? topResult.value
        : (errors.push(`Top produtos: ${errorMessage(topResult.reason)}`),
          emptyTopProducts(input));

    const abcCurve =
      abcResult.status === "fulfilled"
        ? abcResult.value
        : (errors.push(`Curva ABC: ${errorMessage(abcResult.reason)}`),
          emptyAbcCurve(input));

    const averageTicket =
      ticketResult.status === "fulfilled"
        ? ticketResult.value
        : (errors.push(`Ticket médio: ${errorMessage(ticketResult.reason)}`),
          emptyAverageTicket(input));

    return {
      analytics: { revenue, topProducts, abcCurve, averageTicket },
      errors,
    };
  }
}
