import type {
  StockMovement,
  StockMovementStatus,
  StockMovementType,
} from "@/domains/inventory/domain/entities/stock-movement";

export type CreateStockMovementItemInput = {
  productId: string;
  batchId: string;
  quantity: number;
  purchaseUnitPriceCents?: string;
  saleUnitPriceCents?: string;
  note?: string;
};

export type CreateStockMovementInput = {
  tenantId: string;
  createdById: string;
  type: StockMovementType;
  fromStockId?: string;
  toStockId?: string;
  supplierId?: string;
  description?: string;
  note?: string;
  items: CreateStockMovementItemInput[];
};

export type FindStockMovementsQuery = {
  tenantId: string;
  type?: StockMovementType;
  status?: StockMovementStatus;
  fromStockId?: string;
  toStockId?: string;
};

export interface StockMovementRepository {
  findAll(query: FindStockMovementsQuery): Promise<StockMovement[]>;
  create(input: CreateStockMovementInput): Promise<StockMovement>;
  confirm(movementId: string, confirmedById: string): Promise<StockMovement>;
  cancel(movementId: string, canceledById: string): Promise<StockMovement>;
}
