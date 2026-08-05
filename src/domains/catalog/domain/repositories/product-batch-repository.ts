import type {
  ProductBatch,
  ProductBatchStatus,
} from "@/domains/catalog/domain/entities/product-batch";

export type CreateProductBatchInput = {
  tenantId: string;
  batchCode: string;
  manufactureDate?: string;
  expirationDate: string;
  status?: ProductBatchStatus;
  supplierId?: string;
};

export type UpdateProductBatchInput = {
  batchCode?: string;
  manufactureDate?: string;
  expirationDate?: string;
  status?: ProductBatchStatus;
};

export interface ProductBatchRepository {
  findAllByProduct(productId: string): Promise<ProductBatch[]>;
  create(
    productId: string,
    input: CreateProductBatchInput,
  ): Promise<ProductBatch>;
  update(
    productId: string,
    batchId: string,
    input: UpdateProductBatchInput,
  ): Promise<ProductBatch>;
}
