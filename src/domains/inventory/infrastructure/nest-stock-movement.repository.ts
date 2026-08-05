import { nestServerRequest } from "@/core/http/nest-server-client";
import type { StockMovement } from "@/domains/inventory/domain/entities/stock-movement";
import type {
  CreateStockMovementInput,
  FindStockMovementsQuery,
  StockMovementRepository,
} from "@/domains/inventory/domain/repositories/stock-movement-repository";
import {
  mapStockMovementResponse,
  type StockMovementResponseDto,
} from "@/domains/inventory/infrastructure/mappers/inventory.mapper";

export class NestStockMovementRepository implements StockMovementRepository {
  async findAll(query: FindStockMovementsQuery): Promise<StockMovement[]> {
    const params = new URLSearchParams({ tenantId: query.tenantId });

    if (query.type) params.set("type", query.type);
    if (query.status) params.set("status", query.status);
    if (query.fromStockId) params.set("fromStockId", query.fromStockId);
    if (query.toStockId) params.set("toStockId", query.toStockId);

    const response = await nestServerRequest<StockMovementResponseDto[]>(
      `/stocks/movements?${params.toString()}`,
    );

    return response.map(mapStockMovementResponse);
  }

  async create(input: CreateStockMovementInput): Promise<StockMovement> {
    const response = await nestServerRequest<StockMovementResponseDto>(
      "/stocks/movements",
      { method: "POST", body: input },
    );
    return mapStockMovementResponse(response);
  }

  async confirm(
    movementId: string,
    confirmedById: string,
  ): Promise<StockMovement> {
    const response = await nestServerRequest<StockMovementResponseDto>(
      `/stocks/movements/${movementId}/confirmar`,
      { method: "PATCH", body: { confirmedById } },
    );
    return mapStockMovementResponse(response);
  }

  async cancel(
    movementId: string,
    canceledById: string,
  ): Promise<StockMovement> {
    const response = await nestServerRequest<StockMovementResponseDto>(
      `/stocks/movements/${movementId}/cancelar`,
      { method: "PATCH", body: { canceledById } },
    );
    return mapStockMovementResponse(response);
  }
}
