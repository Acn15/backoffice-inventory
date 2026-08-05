import type { ProductPriceRepository } from "@/domains/catalog/domain/repositories/product-price-repository";

export class ListProductPricesUseCase {
  constructor(private readonly priceRepository: ProductPriceRepository) {}

  execute(productId: string) {
    return this.priceRepository.findAllByProduct(productId);
  }
}
