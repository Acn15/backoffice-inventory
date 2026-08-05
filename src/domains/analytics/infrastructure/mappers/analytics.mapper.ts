import type {
  AbcCurveAnalytics,
  AverageTicketAnalytics,
  RevenueAnalytics,
  TopProductsAnalytics,
} from "@/domains/analytics/domain/entities/analytics";

export type RevenueResponseDto = {
  tenantId: string;
  scope: RevenueAnalytics["scope"];
  from: string;
  to: string;
  grain: RevenueAnalytics["grain"];
  totalRevenueCents: number;
  totalQuantitySold: number;
  periods: Array<{
    periodStart: string;
    revenueCents: number;
    quantitySold: number;
  }>;
};

export type TopProductsResponseDto = {
  tenantId: string;
  scope: TopProductsAnalytics["scope"];
  from: string;
  to: string;
  sortBy: TopProductsAnalytics["sortBy"];
  limit: number;
  products: Array<{
    rank: number;
    productId: string;
    productName: string;
    productSku?: string | null;
    productUnit: string;
    categoryId: string;
    categoryName: string;
    quantitySold: number;
    revenueCents: number;
  }>;
};

export type AbcCurveResponseDto = {
  tenantId: string;
  scope: AbcCurveAnalytics["scope"];
  from: string;
  to: string;
  totalRevenueCents: number;
  summary: AbcCurveAnalytics["summary"];
  products: Array<{
    rank: number;
    abcClass: "A" | "B" | "C";
    productId: string;
    productName: string;
    productSku?: string | null;
    productUnit: string;
    categoryId: string;
    categoryName: string;
    quantitySold: number;
    revenueCents: number;
    revenueSharePercent: number;
    cumulativeRevenueSharePercent: number;
  }>;
};

export type AverageTicketResponseDto = {
  tenantId: string;
  scope: AverageTicketAnalytics["scope"];
  from: string;
  to: string;
  totalRevenueCents: number;
  saleCount: number;
  averageTicketCents: number | null;
  reliabilityNote: string;
};

export function mapRevenue(dto: RevenueResponseDto): RevenueAnalytics {
  return {
    tenantId: dto.tenantId,
    scope: dto.scope,
    from: dto.from,
    to: dto.to,
    grain: dto.grain,
    totalRevenueCents: dto.totalRevenueCents,
    totalQuantitySold: dto.totalQuantitySold,
    periods: dto.periods.map((period) => ({
      periodStart: String(period.periodStart).slice(0, 10),
      revenueCents: Number(period.revenueCents),
      quantitySold: Number(period.quantitySold),
    })),
  };
}

export function mapTopProducts(dto: TopProductsResponseDto): TopProductsAnalytics {
  return {
    tenantId: dto.tenantId,
    scope: dto.scope,
    from: dto.from,
    to: dto.to,
    sortBy: dto.sortBy,
    limit: dto.limit,
    products: dto.products.map((product) => ({
      rank: product.rank,
      productId: product.productId,
      productName: product.productName,
      productSku: product.productSku ?? undefined,
      productUnit: product.productUnit,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      quantitySold: Number(product.quantitySold),
      revenueCents: Number(product.revenueCents),
    })),
  };
}

export function mapAbcCurve(dto: AbcCurveResponseDto): AbcCurveAnalytics {
  return {
    tenantId: dto.tenantId,
    scope: dto.scope,
    from: dto.from,
    to: dto.to,
    totalRevenueCents: Number(dto.totalRevenueCents),
    summary: dto.summary,
    products: dto.products.map((product) => ({
      ...product,
      productSku: product.productSku ?? undefined,
      quantitySold: Number(product.quantitySold),
      revenueCents: Number(product.revenueCents),
      revenueSharePercent: Number(product.revenueSharePercent),
      cumulativeRevenueSharePercent: Number(
        product.cumulativeRevenueSharePercent,
      ),
    })),
  };
}

export function mapAverageTicket(
  dto: AverageTicketResponseDto,
): AverageTicketAnalytics {
  return {
    tenantId: dto.tenantId,
    scope: dto.scope,
    from: dto.from,
    to: dto.to,
    totalRevenueCents: Number(dto.totalRevenueCents),
    saleCount: dto.saleCount,
    averageTicketCents:
      dto.averageTicketCents === null ? null : Number(dto.averageTicketCents),
    reliabilityNote: dto.reliabilityNote,
  };
}
