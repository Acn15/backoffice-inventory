import type {
  FindStockMovementsQuery,
  StockMovementRepository,
} from "@/domains/inventory/domain/repositories/stock-movement-repository";

export class ListStockMovementsUseCase {
  constructor(
    private readonly stockMovementRepository: StockMovementRepository,
  ) {}

  execute(query: FindStockMovementsQuery) {
    return this.stockMovementRepository.findAll(query);
  }
}
