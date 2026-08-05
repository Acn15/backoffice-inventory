export type { Product, ProductStatus, ProductUnit } from "@/domains/catalog/domain/entities/product";
export type {
  ProductBatch,
  ProductBatchStatus,
} from "@/domains/catalog/domain/entities/product-batch";
export type {
  ProductCategory,
  ProductCategoryStatus,
} from "@/domains/catalog/domain/entities/product-category";
export type { ProductPrice } from "@/domains/catalog/domain/entities/product-price";
export { catalogContainer } from "@/domains/catalog/infrastructure/catalog.container";
