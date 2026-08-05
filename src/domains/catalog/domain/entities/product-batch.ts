export type ProductBatchStatus =
  | "AVAILABLE"
  | "BLOCKED"
  | "QUARANTINED"
  | "DISCARDED";

export type ProductBatch = {
  id: string;
  tenantId: string;
  productId: string;
  batchCode: string;
  manufactureDate?: string;
  expirationDate: string;
  status: ProductBatchStatus;
  createdAt: string;
  updatedAt: string;
};
