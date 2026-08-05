import type { StockRepository } from "@/domains/inventory/domain/repositories/stock-repository";

export class GetStockInventoryUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  execute(tenantId: string) {
    return this.stockRepository.findInventoryByTenant(tenantId);
  }
}
