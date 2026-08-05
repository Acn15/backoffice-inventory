export type ProductCategoryStatus = "ACTIVE" | "INACTIVE";

export type ProductCategory = {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  status: ProductCategoryStatus;
  createdAt: string;
  updatedAt: string;
};
