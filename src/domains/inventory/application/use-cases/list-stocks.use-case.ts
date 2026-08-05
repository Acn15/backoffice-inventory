import type { StockRepository } from "@/domains/inventory/domain/repositories/stock-repository";

export class ListStocksUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(tenantId?: string | null) {
    const stocks = await this.stockRepository.findAll();
    if (!tenantId) {
      return stocks;
    }
    return stocks.filter((stock) => stock.tenantId === tenantId);
  }
}
