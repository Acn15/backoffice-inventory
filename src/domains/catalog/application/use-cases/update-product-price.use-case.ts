import type {
  ProductPriceRepository,
  UpdateProductPriceInput,
} from "@/domains/catalog/domain/repositories/product-price-repository";

export class UpdateProductPriceUseCase {
  constructor(private readonly priceRepository: ProductPriceRepository) {}

  execute(
    productId: string,
    unitId: string,
    input: UpdateProductPriceInput,
  ) {
    if (input.salePriceCents < 0) {
      throw new Error("Sale price must be zero or greater");
    }
    return this.priceRepository.update(productId, unitId, input);
  }
}
