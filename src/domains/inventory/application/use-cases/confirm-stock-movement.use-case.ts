import type { StockMovementRepository } from "@/domains/inventory/domain/repositories/stock-movement-repository";

export class ConfirmStockMovementUseCase {
  constructor(
    private readonly stockMovementRepository: StockMovementRepository,
  ) {}

  execute(movementId: string, confirmedById: string) {
    return this.stockMovementRepository.confirm(movementId, confirmedById);
  }
}
