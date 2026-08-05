import type {
  CreateProductInput,
  ProductRepository,
} from "@/domains/catalog/domain/repositories/product-repository";

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(input: CreateProductInput) {
    const name = input.name.trim();
    if (name.length < 2) {
      throw new Error("Product name must have at least 2 characters");
    }
    return this.productRepository.create({
      ...input,
      name,
      description: input.description?.trim() || undefined,
      sku: input.sku?.trim() || undefined,
      barcode: input.barcode?.trim() || undefined,
    });
  }
}
