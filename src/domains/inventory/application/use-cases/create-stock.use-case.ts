import type {
  CreateStockInput,
  StockRepository,
} from "@/domains/inventory/domain/repositories/stock-repository";

export class CreateStockUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  execute(input: CreateStockInput) {
    const name = input.name.trim();

    if (name.length < 2) {
      throw new Error("Stock name must have at least 2 characters");
    }

    return this.stockRepository.create({
      ...input,
      name,
      description: input.description?.trim() || undefined,
      unitId: input.unitId || undefined,
    });
  }
}
