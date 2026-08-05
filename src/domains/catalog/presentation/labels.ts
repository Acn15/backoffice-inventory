import type { ProductStatus, ProductUnit } from "@/domains/catalog/domain/entities/product";
import type { ProductBatchStatus } from "@/domains/catalog/domain/entities/product-batch";
import type { ProductCategoryStatus } from "@/domains/catalog/domain/entities/product-category";

export const productUnitLabels: Record<ProductUnit, string> = {
  UNIT: "Unidade",
  KG: "Kg",
  G: "g",
  L: "L",
  ML: "ml",
  M: "m",
  CM: "cm",
  BOX: "Caixa",
  PACKAGE: "Pacote",
};

export const productStatusLabels: Record<ProductStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

export const categoryStatusLabels: Record<ProductCategoryStatus, string> = {
  ACTIVE: "Ativa",
  INACTIVE: "Inativa",
};

export const batchStatusLabels: Record<ProductBatchStatus, string> = {
  AVAILABLE: "Disponível",
  BLOCKED: "Bloqueado",
  QUARANTINED: "Quarentena",
  DISCARDED: "Descartado",
};
