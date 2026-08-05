import type {
  ProductRepository,
  UpdateProductInput,
} from "@/domains/catalog/domain/repositories/product-repository";

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(id: string, input: UpdateProductInput) {
    return this.productRepository.update(id, {
      ...input,
      name: input.name?.trim(),
      description: input.description?.trim() || undefined,
      sku: input.sku?.trim() || undefined,
      barcode: input.barcode?.trim() || undefined,
    });
  }
}
