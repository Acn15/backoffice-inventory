import type {
  CreateProductBatchInput,
  ProductBatchRepository,
} from "@/domains/catalog/domain/repositories/product-batch-repository";

export class CreateProductBatchUseCase {
  constructor(private readonly batchRepository: ProductBatchRepository) {}

  execute(productId: string, input: CreateProductBatchInput) {
    const batchCode = input.batchCode.trim();
    if (!batchCode) {
      throw new Error("Batch code is required");
    }
    return this.batchRepository.create(productId, {
      ...input,
      batchCode,
    });
  }
}
