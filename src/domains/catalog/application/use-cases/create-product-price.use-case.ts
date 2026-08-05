import type {
  CreateProductPriceInput,
  ProductPriceRepository,
} from "@/domains/catalog/domain/repositories/product-price-repository";

export class CreateProductPriceUseCase {
  constructor(private readonly priceRepository: ProductPriceRepository) {}

  execute(
    productId: string,
    unitId: string,
    input: CreateProductPriceInput,
  ) {
    if (input.salePriceCents < 0) {
      throw new Error("Sale price must be zero or greater");
    }
    return this.priceRepository.create(productId, unitId, input);
  }
}
