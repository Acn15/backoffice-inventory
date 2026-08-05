import { CancelStockMovementUseCase } from "@/domains/inventory/application/use-cases/cancel-stock-movement.use-case";
import { ConfirmStockMovementUseCase } from "@/domains/inventory/application/use-cases/confirm-stock-movement.use-case";
import { CreateStockMovementUseCase } from "@/domains/inventory/application/use-cases/create-stock-movement.use-case";
import { CreateStockUseCase } from "@/domains/inventory/application/use-cases/create-stock.use-case";
import { GetStockInventoryUseCase } from "@/domains/inventory/application/use-cases/get-stock-inventory.use-case";
import { GetStockUseCase } from "@/domains/inventory/application/use-cases/get-stock.use-case";
import { GetUnitProductBalancesUseCase } from "@/domains/inventory/application/use-cases/get-unit-product-balances.use-case";
import { ListStockMovementsUseCase } from "@/domains/inventory/application/use-cases/list-stock-movements.use-case";
import { ListStocksUseCase } from "@/domains/inventory/application/use-cases/list-stocks.use-case";
import { NestStockMovementRepository } from "@/domains/inventory/infrastructure/nest-stock-movement.repository";
import { NestStockRepository } from "@/domains/inventory/infrastructure/nest-stock.repository";

const stockRepository = new NestStockRepository();
const stockMovementRepository = new NestStockMovementRepository();

export const inventoryContainer = {
  stockRepository,
  stockMovementRepository,
  listStocksUseCase: new ListStocksUseCase(stockRepository),
  getStockUseCase: new GetStockUseCase(stockRepository),
  getStockInventoryUseCase: new GetStockInventoryUseCase(stockRepository),
  getUnitProductBalancesUseCase: new GetUnitProductBalancesUseCase(
    stockRepository,
  ),
  createStockUseCase: new CreateStockUseCase(stockRepository),
  listStockMovementsUseCase: new ListStockMovementsUseCase(
    stockMovementRepository,
  ),
  createStockMovementUseCase: new CreateStockMovementUseCase(
    stockMovementRepository,
  ),
  confirmStockMovementUseCase: new ConfirmStockMovementUseCase(
    stockMovementRepository,
  ),
  cancelStockMovementUseCase: new CancelStockMovementUseCase(
    stockMovementRepository,
  ),
} as const;
