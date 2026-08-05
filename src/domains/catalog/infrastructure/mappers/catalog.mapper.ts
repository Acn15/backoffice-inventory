import type { Product } from "@/domains/catalog/domain/entities/product";
import type { ProductBatch } from "@/domains/catalog/domain/entities/product-batch";
import type { ProductCategory } from "@/domains/catalog/domain/entities/product-category";
import type { ProductPrice } from "@/domains/catalog/domain/entities/product-price";

export type ProductResponseDto = {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  unit: Product["unit"];
  sku?: string | null;
  barcode?: string | null;
  status: Product["status"];
  createdAt: string;
  updatedAt: string;
};

export type ProductCategoryResponseDto = {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  status: ProductCategory["status"];
  createdAt: string;
  updatedAt: string;
};

export type ProductBatchResponseDto = {
  id: string;
  tenantId: string;
  productId: string;
  batchCode: string;
  manufactureDate?: string | null;
  expirationDate: string;
  status: ProductBatch["status"];
  createdAt: string;
  updatedAt: string;
};

export type ProductPriceResponseDto = {
  id: string;
  tenantId: string;
  productId: string;
  unitId: string;
  salePriceCents: number;
  createdAt: string;
  updatedAt: string;
};

export function mapProduct(dto: ProductResponseDto): Product {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    categoryId: dto.categoryId,
    name: dto.name,
    description: dto.description ?? undefined,
    unit: dto.unit,
    sku: dto.sku ?? undefined,
    barcode: dto.barcode ?? undefined,
    status: dto.status,
    createdAt: String(dto.createdAt),
    updatedAt: String(dto.updatedAt),
  };
}

export function mapCategory(dto: ProductCategoryResponseDto): ProductCategory {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    name: dto.name,
    description: dto.description ?? undefined,
    status: dto.status,
    createdAt: String(dto.createdAt),
    updatedAt: String(dto.updatedAt),
  };
}

export function mapBatch(dto: ProductBatchResponseDto): ProductBatch {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    productId: dto.productId,
    batchCode: dto.batchCode,
    manufactureDate: dto.manufactureDate
      ? String(dto.manufactureDate).slice(0, 10)
      : undefined,
    expirationDate: String(dto.expirationDate).slice(0, 10),
    status: dto.status,
    createdAt: String(dto.createdAt),
    updatedAt: String(dto.updatedAt),
  };
}

export function mapPrice(dto: ProductPriceResponseDto): ProductPrice {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    productId: dto.productId,
    unitId: dto.unitId,
    salePriceCents: dto.salePriceCents,
    createdAt: String(dto.createdAt),
    updatedAt: String(dto.updatedAt),
  };
}
