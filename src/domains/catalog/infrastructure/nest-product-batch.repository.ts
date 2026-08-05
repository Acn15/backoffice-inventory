import { nestServerRequest } from "@/core/http/nest-server-client";
import type { ProductBatch } from "@/domains/catalog/domain/entities/product-batch";
import type {
  CreateProductBatchInput,
  ProductBatchRepository,
  UpdateProductBatchInput,
} from "@/domains/catalog/domain/repositories/product-batch-repository";
import {
  mapBatch,
  type ProductBatchResponseDto,
} from "@/domains/catalog/infrastructure/mappers/catalog.mapper";

export class NestProductBatchRepository implements ProductBatchRepository {
  async findAllByProduct(productId: string): Promise<ProductBatch[]> {
    const response = await nestServerRequest<ProductBatchResponseDto[]>(
      `/products/${productId}/batches`,
    );
    return response.map(mapBatch);
  }

  async create(
    productId: string,
    input: CreateProductBatchInput,
  ): Promise<ProductBatch> {
    const response = await nestServerRequest<ProductBatchResponseDto>(
      `/products/${productId}/batches`,
      { method: "POST", body: input },
    );
    return mapBatch(response);
  }

  async update(
    productId: string,
    batchId: string,
    input: UpdateProductBatchInput,
  ): Promise<ProductBatch> {
    const response = await nestServerRequest<ProductBatchResponseDto>(
      `/products/${productId}/batches/${batchId}`,
      { method: "PATCH", body: input },
    );
    return mapBatch(response);
  }
}
