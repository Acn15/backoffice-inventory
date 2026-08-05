import { nestServerRequest } from "@/core/http/nest-server-client";
import type {
  AbcCurveAnalytics,
  AverageTicketAnalytics,
  RevenueAnalytics,
  TopProductsAnalytics,
} from "@/domains/analytics/domain/entities/analytics";
import type {
  AnalyticsRepository,
  FindAbcCurveQuery,
  FindAverageTicketQuery,
  FindRevenueQuery,
  FindTopProductsQuery,
} from "@/domains/analytics/domain/repositories/analytics-repository";
import {
  mapAbcCurve,
  mapAverageTicket,
  mapRevenue,
  mapTopProducts,
  type AbcCurveResponseDto,
  type AverageTicketResponseDto,
  type RevenueResponseDto,
  type TopProductsResponseDto,
} from "@/domains/analytics/infrastructure/mappers/analytics.mapper";

function appendOptional(
  params: URLSearchParams,
  key: string,
  value?: string,
): void {
  if (value) {
    params.set(key, value);
  }
}

function baseParams(query: {
  tenantId: string;
  from: string;
  to: string;
  unitId?: string;
  stockId?: string;
  categoryId?: string;
  productId?: string;
}): URLSearchParams {
  const params = new URLSearchParams({
    tenantId: query.tenantId,
    from: query.from,
    to: query.to,
  });
  appendOptional(params, "unitId", query.unitId);
  appendOptional(params, "stockId", query.stockId);
  appendOptional(params, "categoryId", query.categoryId);
  appendOptional(params, "productId", query.productId);
  return params;
}

export class NestAnalyticsRepository implements AnalyticsRepository {
  async getRevenue(query: FindRevenueQuery): Promise<RevenueAnalytics> {
    const params = baseParams(query);
    params.set("grain", query.grain);
    const response = await nestServerRequest<RevenueResponseDto>(
      `/analytics/faturamento?${params.toString()}`,
    );
    return mapRevenue(response);
  }

  async getTopProducts(
    query: FindTopProductsQuery,
  ): Promise<TopProductsAnalytics> {
    const params = baseParams(query);
    params.set("sortBy", query.sortBy);
    params.set("limit", String(query.limit ?? 10));
    const response = await nestServerRequest<TopProductsResponseDto>(
      `/analytics/produtos-mais-vendidos?${params.toString()}`,
    );
    return mapTopProducts(response);
  }

  async getAbcCurve(query: FindAbcCurveQuery): Promise<AbcCurveAnalytics> {
    const params = baseParams(query);
    const response = await nestServerRequest<AbcCurveResponseDto>(
      `/analytics/curva-abc?${params.toString()}`,
    );
    return mapAbcCurve(response);
  }

  async getAverageTicket(
    query: FindAverageTicketQuery,
  ): Promise<AverageTicketAnalytics> {
    const params = baseParams(query);
    const response = await nestServerRequest<AverageTicketResponseDto>(
      `/analytics/ticket-medio?${params.toString()}`,
    );
    return mapAverageTicket(response);
  }
}
