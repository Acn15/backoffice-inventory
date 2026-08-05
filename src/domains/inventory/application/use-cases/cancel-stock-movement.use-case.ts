import type { StockMovementRepository } from "@/domains/inventory/domain/repositories/stock-movement-repository";

export class CancelStockMovementUseCase {
  constructor(
    private readonly stockMovementRepository: StockMovementRepository,
  ) {}

  execute(movementId: string, canceledById: string) {
    return this.stockMovementRepository.cancel(movementId, canceledById);
  }
}
