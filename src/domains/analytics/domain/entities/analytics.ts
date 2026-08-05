export type AnalyticsScope = "tenant" | "unit";
export type RevenueGrain = "day" | "week" | "month" | "year";
export type TopProductsSortBy = "quantity" | "revenue";
export type AbcClass = "A" | "B" | "C";

export type AnalyticsBaseFilters = {
  tenantId: string;
  from: string;
  to: string;
  unitId?: string;
  stockId?: string;
  categoryId?: string;
  productId?: string;
};

export type RevenuePeriod = {
  periodStart: string;
  revenueCents: number;
  quantitySold: number;
};

export type RevenueAnalytics = {
  tenantId: string;
  scope: AnalyticsScope;
  from: string;
  to: string;
  grain: RevenueGrain;
  totalRevenueCents: number;
  totalQuantitySold: number;
  periods: RevenuePeriod[];
};

export type TopProductItem = {
  rank: number;
  productId: string;
  productName: string;
  productSku?: string;
  productUnit: string;
  categoryId: string;
  categoryName: string;
  quantitySold: number;
  revenueCents: number;
};

export type TopProductsAnalytics = {
  tenantId: string;
  scope: AnalyticsScope;
  from: string;
  to: string;
  sortBy: TopProductsSortBy;
  limit: number;
  products: TopProductItem[];
};

export type AbcClassSummary = {
  productCount: number;
  revenueCents: number;
  revenueSharePercent: number;
};

export type AbcCurveProduct = {
  rank: number;
  abcClass: AbcClass;
  productId: string;
  productName: string;
  productSku?: string;
  productUnit: string;
  categoryId: string;
  categoryName: string;
  quantitySold: number;
  revenueCents: number;
  revenueSharePercent: number;
  cumulativeRevenueSharePercent: number;
};

export type AbcCurveAnalytics = {
  tenantId: string;
  scope: AnalyticsScope;
  from: string;
  to: string;
  totalRevenueCents: number;
  summary: Record<AbcClass, AbcClassSummary>;
  products: AbcCurveProduct[];
};

export type AverageTicketAnalytics = {
  tenantId: string;
  scope: AnalyticsScope;
  from: string;
  to: string;
  totalRevenueCents: number;
  saleCount: number;
  averageTicketCents: number | null;
  reliabilityNote: string;
};

export type DashboardAnalytics = {
  revenue: RevenueAnalytics;
  topProducts: TopProductsAnalytics;
  abcCurve: AbcCurveAnalytics;
  averageTicket: AverageTicketAnalytics;
};
