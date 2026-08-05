import type { ProductBatchRepository } from "@/domains/catalog/domain/repositories/product-batch-repository";

export class ListProductBatchesUseCase {
  constructor(private readonly batchRepository: ProductBatchRepository) {}

  execute(productId: string) {
    return this.batchRepository.findAllByProduct(productId);
  }
}
