import type {
  Stock,
  StockStatus,
  StockType,
  StockWithItems,
} from "@/domains/inventory/domain/entities/stock";

export type CreateStockInput = {
  tenantId: string;
  unitId?: string;
  name: string;
  description?: string;
  type: StockType;
  status?: StockStatus;
};

export interface StockRepository {
  findAll(): Promise<Stock[]>;
  findById(id: string): Promise<Stock>;
  findInventoryByTenant(tenantId: string): Promise<StockWithItems[]>;
  create(input: CreateStockInput): Promise<Stock>;
}
