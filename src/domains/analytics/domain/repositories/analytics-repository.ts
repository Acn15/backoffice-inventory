import type {
  AbcCurveAnalytics,
  AnalyticsBaseFilters,
  AverageTicketAnalytics,
  RevenueAnalytics,
  RevenueGrain,
  TopProductsAnalytics,
  TopProductsSortBy,
} from "@/domains/analytics/domain/entities/analytics";

export type FindRevenueQuery = AnalyticsBaseFilters & {
  grain: RevenueGrain;
};

export type FindTopProductsQuery = AnalyticsBaseFilters & {
  sortBy: TopProductsSortBy;
  limit?: number;
};

export type FindAbcCurveQuery = AnalyticsBaseFilters;

export type FindAverageTicketQuery = AnalyticsBaseFilters;

export interface AnalyticsRepository {
  getRevenue(query: FindRevenueQuery): Promise<RevenueAnalytics>;
  getTopProducts(query: FindTopProductsQuery): Promise<TopProductsAnalytics>;
  getAbcCurve(query: FindAbcCurveQuery): Promise<AbcCurveAnalytics>;
  getAverageTicket(
    query: FindAverageTicketQuery,
  ): Promise<AverageTicketAnalytics>;
}
