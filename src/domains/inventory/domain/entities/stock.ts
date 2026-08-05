export type StockType =
  | "WAREHOUSE"
  | "MAIN_WAREHOUSE"
  | "DISTRIBUTION_CENTER";

export type StockStatus = "ACTIVE" | "INACTIVE";

export type Stock = {
  id: string;
  tenantId: string;
  unitId?: string;
  name: string;
  description?: string;
  type: StockType;
  status: StockStatus;
  createdAt: string;
  updatedAt: string;
};

export type StockInventoryItem = {
  id: string;
  productBatchId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    unit: string;
    sku?: string;
  };
  batch: {
    id: string;
    batchCode: string;
    expirationDate?: string;
  };
};

export type StockWithItems = Stock & {
  itemsCount: number;
  items: StockInventoryItem[];
};
