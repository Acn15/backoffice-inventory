import type { ProductRepository } from "@/domains/catalog/domain/repositories/product-repository";

export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(tenantId: string) {
    return this.productRepository.findAllByTenant(tenantId);
  }
}
