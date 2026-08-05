import type {
  ProductBatchRepository,
  UpdateProductBatchInput,
} from "@/domains/catalog/domain/repositories/product-batch-repository";

export class UpdateProductBatchUseCase {
  constructor(private readonly batchRepository: ProductBatchRepository) {}

  execute(
    productId: string,
    batchId: string,
    input: UpdateProductBatchInput,
  ) {
    return this.batchRepository.update(productId, batchId, {
      ...input,
      batchCode: input.batchCode?.trim(),
    });
  }
}
