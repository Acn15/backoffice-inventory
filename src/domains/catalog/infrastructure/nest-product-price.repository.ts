import { nestServerRequest } from "@/core/http/nest-server-client";
import type { ProductPrice } from "@/domains/catalog/domain/entities/product-price";
import type {
  CreateProductPriceInput,
  ProductPriceRepository,
  UpdateProductPriceInput,
} from "@/domains/catalog/domain/repositories/product-price-repository";
import {
  mapPrice,
  type ProductPriceResponseDto,
} from "@/domains/catalog/infrastructure/mappers/catalog.mapper";

export class NestProductPriceRepository implements ProductPriceRepository {
  async findAllByProduct(productId: string): Promise<ProductPrice[]> {
    const response = await nestServerRequest<ProductPriceResponseDto[]>(
      `/products/${productId}/prices`,
    );
    return response.map(mapPrice);
  }

  async create(
    productId: string,
    unitId: string,
    input: CreateProductPriceInput,
  ): Promise<ProductPrice> {
    const response = await nestServerRequest<ProductPriceResponseDto>(
      `/products/${productId}/prices/${unitId}`,
      { method: "POST", body: input },
    );
    return mapPrice(response);
  }

  async update(
    productId: string,
    unitId: string,
    input: UpdateProductPriceInput,
  ): Promise<ProductPrice> {
    const response = await nestServerRequest<ProductPriceResponseDto>(
      `/products/${productId}/prices/${unitId}`,
      { method: "PATCH", body: input },
    );
    return mapPrice(response);
  }
}
