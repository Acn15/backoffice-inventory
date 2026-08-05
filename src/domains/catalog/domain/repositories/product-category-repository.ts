import type {
  ProductCategory,
  ProductCategoryStatus,
} from "@/domains/catalog/domain/entities/product-category";

export type CreateProductCategoryInput = {
  tenantId: string;
  name: string;
  description?: string;
  status?: ProductCategoryStatus;
};

export type UpdateProductCategoryInput = {
  name?: string;
  description?: string;
  status?: ProductCategoryStatus;
};

export interface ProductCategoryRepository {
  findAll(): Promise<ProductCategory[]>;
  create(input: CreateProductCategoryInput): Promise<ProductCategory>;
  update(
    id: string,
    input: UpdateProductCategoryInput,
  ): Promise<ProductCategory>;
}
