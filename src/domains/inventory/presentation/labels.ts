import type { StockStatus, StockType } from "@/domains/inventory/domain/entities/stock";
import type {
  StockMovementStatus,
  StockMovementType,
} from "@/domains/inventory/domain/entities/stock-movement";

export const stockTypeLabels: Record<StockType, string> = {
  WAREHOUSE: "Depósito",
  MAIN_WAREHOUSE: "Depósito principal",
  DISTRIBUTION_CENTER: "Centro de distribuição",
};

export const stockStatusLabels: Record<StockStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

export const movementTypeLabels: Record<StockMovementType, string> = {
  ENTRY: "Entrada",
  TRANSFER: "Transferência",
  SALE: "Venda",
  ADJUSTMENT: "Ajuste",
  LOSS: "Perda",
  RETURN: "Devolução",
};

export const movementStatusLabels: Record<StockMovementStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELED: "Cancelada",
};
