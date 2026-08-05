import { nestServerRequest } from "@/core/http/nest-server-client";
import type { ProductCategory } from "@/domains/catalog/domain/entities/product-category";
import type {
  CreateProductCategoryInput,
  ProductCategoryRepository,
  UpdateProductCategoryInput,
} from "@/domains/catalog/domain/repositories/product-category-repository";
import {
  mapCategory,
  type ProductCategoryResponseDto,
} from "@/domains/catalog/infrastructure/mappers/catalog.mapper";

export class NestProductCategoryRepository
  implements ProductCategoryRepository
{
  async findAll(): Promise<ProductCategory[]> {
    const response = await nestServerRequest<ProductCategoryResponseDto[]>(
      "/products/categories",
    );
    return response.map(mapCategory);
  }

  async create(input: CreateProductCategoryInput): Promise<ProductCategory> {
    const response = await nestServerRequest<ProductCategoryResponseDto>(
      "/products/categories",
      { method: "POST", body: input },
    );
    return mapCategory(response);
  }

  async update(
    id: string,
    input: UpdateProductCategoryInput,
  ): Promise<ProductCategory> {
    const response = await nestServerRequest<ProductCategoryResponseDto>(
      `/products/categories/${id}`,
      { method: "PATCH", body: input },
    );
    return mapCategory(response);
  }
}
