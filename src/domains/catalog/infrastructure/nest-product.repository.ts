import { nestServerRequest } from "@/core/http/nest-server-client";
import type { Product } from "@/domains/catalog/domain/entities/product";
import type {
  CreateProductInput,
  ProductRepository,
  UpdateProductInput,
} from "@/domains/catalog/domain/repositories/product-repository";
import {
  mapProduct,
  type ProductResponseDto,
} from "@/domains/catalog/infrastructure/mappers/catalog.mapper";

export class NestProductRepository implements ProductRepository {
  async findAllByTenant(tenantId: string): Promise<Product[]> {
    const response = await nestServerRequest<ProductResponseDto[]>(
      `/products?tenantId=${encodeURIComponent(tenantId)}`,
    );
    return response.map(mapProduct);
  }

  async findById(id: string): Promise<Product> {
    const response = await nestServerRequest<ProductResponseDto>(
      `/products/${id}`,
    );
    return mapProduct(response);
  }

  async create(input: CreateProductInput): Promise<Product> {
    const response = await nestServerRequest<ProductResponseDto>("/products", {
      method: "POST",
      body: input,
    });
    return mapProduct(response);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const response = await nestServerRequest<ProductResponseDto>(
      `/products/${id}`,
      { method: "PATCH", body: input },
    );
    return mapProduct(response);
  }
}
