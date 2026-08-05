import { GetDashboardAnalyticsUseCase } from "@/domains/analytics/application/use-cases/get-dashboard-analytics.use-case";
import { NestAnalyticsRepository } from "@/domains/analytics/infrastructure/nest-analytics.repository";

const analyticsRepository = new NestAnalyticsRepository();

export const analyticsContainer = {
  analyticsRepository,
  getDashboardAnalyticsUseCase: new GetDashboardAnalyticsUseCase(
    analyticsRepository,
  ),
} as const;
