import type {
  CreateStockMovementInput,
  StockMovementRepository,
} from "@/domains/inventory/domain/repositories/stock-movement-repository";

export class CreateStockMovementUseCase {
  constructor(
    private readonly stockMovementRepository: StockMovementRepository,
  ) {}

  execute(input: CreateStockMovementInput) {
    if (input.items.length === 0) {
      throw new Error("Movement must have at least one item");
    }

    for (const item of input.items) {
      if (item.quantity <= 0) {
        throw new Error("Item quantity must be greater than zero");
      }
    }

    return this.stockMovementRepository.create({
      ...input,
      description: input.description?.trim() || undefined,
      note: input.note?.trim() || undefined,
      fromStockId: input.fromStockId || undefined,
      toStockId: input.toStockId || undefined,
      supplierId: input.supplierId || undefined,
    });
  }
}
