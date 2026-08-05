export type ProductUnit =
  | "UNIT"
  | "KG"
  | "G"
  | "L"
  | "ML"
  | "M"
  | "CM"
  | "BOX"
  | "PACKAGE";

export type ProductStatus = "ACTIVE" | "INACTIVE";

export type Product = {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description?: string;
  unit: ProductUnit;
  sku?: string;
  barcode?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};
