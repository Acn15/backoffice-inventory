import type { ProductRepository } from "@/domains/catalog/domain/repositories/product-repository";

export class GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(id: string) {
    return this.productRepository.findById(id);
  }
}
