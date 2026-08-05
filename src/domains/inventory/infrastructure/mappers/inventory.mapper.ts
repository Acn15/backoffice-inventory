import type {
  Stock,
  StockInventoryItem,
  StockWithItems,
} from "@/domains/inventory/domain/entities/stock";
import type {
  StockMovement,
  StockMovementItem,
} from "@/domains/inventory/domain/entities/stock-movement";

export type StockResponseDto = {
  id: string;
  tenantId: string;
  unitId?: string | null;
  name: string;
  description?: string | null;
  type: Stock["type"];
  status: Stock["status"];
  createdAt: string;
  updatedAt: string;
};

export type StockInventoryItemResponseDto = {
  id: string;
  productBatchId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    unit: string;
    sku?: string | null;
  };
  batch: {
    id: string;
    batchCode: string;
    expirationDate?: string | null;
  };
};

export type StockWithItemsResponseDto = StockResponseDto & {
  itemsCount: number;
  items: StockInventoryItemResponseDto[];
};

export type StockMovementItemResponseDto = {
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
    sku?: string | null;
  };
  batch?: {
    id: string;
    batchCode: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type StockMovementResponseDto = {
  id: string;
  tenantId: string;
  fromStockId?: string | null;
  toStockId?: string | null;
  type: StockMovement["type"];
  status: StockMovement["status"];
  description?: string | null;
  note?: string | null;
  createdById: string;
  confirmedById?: string | null;
  canceledById?: string | null;
  confirmedAt?: string | null;
  canceledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: StockMovementItemResponseDto[];
};

export function mapStockResponseToStock(dto: StockResponseDto): Stock {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    unitId: dto.unitId ?? undefined,
    name: dto.name,
    description: dto.description ?? undefined,
    type: dto.type,
    status: dto.status,
    createdAt: String(dto.createdAt),
    updatedAt: String(dto.updatedAt),
  };
}

export function mapStockInventoryItem(
  dto: StockInventoryItemResponseDto,
): StockInventoryItem {
  return {
    id: dto.id,
    productBatchId: dto.productBatchId,
    productId: dto.productId,
    quantity: dto.quantity,
    product: {
      id: dto.product.id,
      name: dto.product.name,
      unit: dto.product.unit,
      sku: dto.product.sku ?? undefined,
    },
    batch: {
      id: dto.batch.id,
      batchCode: dto.batch.batchCode,
      expirationDate: dto.batch.expirationDate
        ? String(dto.batch.expirationDate)
        : undefined,
    },
  };
}

export function mapStockWithItemsResponse(
  dto: StockWithItemsResponseDto,
): StockWithItems {
  return {
    ...mapStockResponseToStock(dto),
    itemsCount: dto.itemsCount,
    items: dto.items.map(mapStockInventoryItem),
  };
}

export function mapStockMovementItem(
  dto: StockMovementItemResponseDto,
): StockMovementItem {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    movementId: dto.movementId,
    productId: dto.productId,
    batchId: dto.batchId,
    quantity: dto.quantity,
    purchaseUnitPriceCents: dto.purchaseUnitPriceCents,
    saleUnitPriceCents: dto.saleUnitPriceCents,
    note: dto.note,
    product: dto.product
      ? {
          id: dto.product.id,
          name: dto.product.name,
          unit: dto.product.unit,
          sku: dto.product.sku ?? undefined,
        }
      : undefined,
    batch: dto.batch
      ? {
          id: dto.batch.id,
          batchCode: dto.batch.batchCode,
        }
      : undefined,
    createdAt: String(dto.createdAt),
    updatedAt: String(dto.updatedAt),
  };
}

export function mapStockMovementResponse(
  dto: StockMovementResponseDto,
): StockMovement {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    fromStockId: dto.fromStockId ?? undefined,
    toStockId: dto.toStockId ?? undefined,
    type: dto.type,
    status: dto.status,
    description: dto.description ?? undefined,
    note: dto.note ?? undefined,
    createdById: dto.createdById,
    confirmedById: dto.confirmedById ?? undefined,
    canceledById: dto.canceledById ?? undefined,
    confirmedAt: dto.confirmedAt ? String(dto.confirmedAt) : undefined,
    canceledAt: dto.canceledAt ? String(dto.canceledAt) : undefined,
    createdAt: String(dto.createdAt),
    updatedAt: String(dto.updatedAt),
    items: dto.items?.map(mapStockMovementItem),
  };
}
