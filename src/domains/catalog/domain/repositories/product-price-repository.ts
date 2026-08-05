import type { ProductPrice } from "@/domains/catalog/domain/entities/product-price";

export type CreateProductPriceInput = {
  tenantId: string;
  salePriceCents: number;
};

export type UpdateProductPriceInput = {
  salePriceCents: number;
};

export interface ProductPriceRepository {
  findAllByProduct(productId: string): Promise<ProductPrice[]>;
  create(
    productId: string,
    unitId: string,
    input: CreateProductPriceInput,
  ): Promise<ProductPrice>;
  update(
    productId: string,
    unitId: string,
    input: UpdateProductPriceInput,
  ): Promise<ProductPrice>;
}
