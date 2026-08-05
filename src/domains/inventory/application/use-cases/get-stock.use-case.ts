import type { StockRepository } from "@/domains/inventory/domain/repositories/stock-repository";

export class GetStockUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  execute(id: string) {
    return this.stockRepository.findById(id);
  }
}
