import type {
  Product,
  ProductStatus,
  ProductUnit,
} from "@/domains/catalog/domain/entities/product";

export type CreateProductInput = {
  tenantId: string;
  categoryId: string;
  name: string;
  description?: string;
  unit: ProductUnit;
  sku?: string;
  barcode?: string;
  status?: ProductStatus;
};

export type UpdateProductInput = {
  categoryId?: string;
  name?: string;
  description?: string;
  unit?: ProductUnit;
  sku?: string;
  barcode?: string;
  status?: ProductStatus;
};

export interface ProductRepository {
  findAllByTenant(tenantId: string): Promise<Product[]>;
  findById(id: string): Promise<Product>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product>;
}
