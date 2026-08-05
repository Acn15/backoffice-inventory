export type {
  Stock,
  StockInventoryItem,
  StockStatus,
  StockType,
  StockWithItems,
} from "@/domains/inventory/domain/entities/stock";
export type {
  StockMovement,
  StockMovementItem,
  StockMovementStatus,
  StockMovementType,
} from "@/domains/inventory/domain/entities/stock-movement";
export { inventoryContainer } from "@/domains/inventory/infrastructure/inventory.container";
