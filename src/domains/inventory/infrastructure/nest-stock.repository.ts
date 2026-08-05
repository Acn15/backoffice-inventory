import { nestServerRequest } from "@/core/http/nest-server-client";
import type { Stock, StockWithItems } from "@/domains/inventory/domain/entities/stock";
import type {
  CreateStockInput,
  StockRepository,
} from "@/domains/inventory/domain/repositories/stock-repository";
import {
  mapStockResponseToStock,
  mapStockWithItemsResponse,
  type StockResponseDto,
  type StockWithItemsResponseDto,
} from "@/domains/inventory/infrastructure/mappers/inventory.mapper";

export class NestStockRepository implements StockRepository {
  async findAll(): Promise<Stock[]> {
    const response = await nestServerRequest<StockResponseDto[]>("/stocks");
    return response.map(mapStockResponseToStock);
  }

  async findById(id: string): Promise<Stock> {
    const response = await nestServerRequest<StockResponseDto>(`/stocks/${id}`);
    return mapStockResponseToStock(response);
  }

  async findInventoryByTenant(tenantId: string): Promise<StockWithItems[]> {
    const response = await nestServerRequest<StockWithItemsResponseDto[]>(
      `/stocks/inventory?tenantId=${encodeURIComponent(tenantId)}`,
    );
    return response.map(mapStockWithItemsResponse);
  }

  async create(input: CreateStockInput): Promise<Stock> {
    const response = await nestServerRequest<StockResponseDto>("/stocks", {
      method: "POST",
      body: input,
    });
    return mapStockResponseToStock(response);
  }
}
