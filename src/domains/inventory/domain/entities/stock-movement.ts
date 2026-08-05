export type StockMovementType =
  | "ENTRY"
  | "TRANSFER"
  | "SALE"
  | "ADJUSTMENT"
  | "LOSS"
  | "RETURN";

export type StockMovementStatus = "PENDING" | "CONFIRMED" | "CANCELED";

export type StockMovementItem = {
  id: string;
  tenantId: string;
  movementId: string;
  productId: string;
  batchId: string;
  quantity: number;
  purchaseUnitPriceCents: number | null;
  saleUnitPriceCents: number | null;
  note: string | null;
  product?: {
    id: string;
    name: string;
    unit: string;
    sku?: string;
  };
  batch?: {
    id: string;
    batchCode: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type StockMovement = {
  id: string;
  tenantId: string;
  fromStockId?: string;
  toStockId?: string;
  type: StockMovementType;
  status: StockMovementStatus;
  description?: string;
  note?: string;
  createdById: string;
  confirmedById?: string;
  canceledById?: string;
  confirmedAt?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
  items?: StockMovementItem[];
};
