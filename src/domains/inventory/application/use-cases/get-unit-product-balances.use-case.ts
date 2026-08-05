import type { StockRepository } from "@/domains/inventory/domain/repositories/stock-repository";

export type UnitProductBalance = {
  productId: string;
  name: string;
  sku?: string;
  unit: string;
  quantity: number;
};

export type UnitProductBalancesResult = {
  hasRelatedStocks: boolean;
  products: UnitProductBalance[];
};

export class GetUnitProductBalancesUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(
    tenantId: string,
    unitId: string,
  ): Promise<UnitProductBalancesResult> {
    const inventory = await this.stockRepository.findInventoryByTenant(tenantId);
    const unitStocks = inventory.filter(
      (stock) => stock.unitId === unitId && stock.status === "ACTIVE",
    );

    if (unitStocks.length === 0) {
      return { hasRelatedStocks: false, products: [] };
    }

    const byProduct = new Map<string, UnitProductBalance>();

    for (const stock of unitStocks) {
      for (const item of stock.items) {
        const existing = byProduct.get(item.productId);
        if (existing) {
          existing.quantity += item.quantity;
          continue;
        }

        byProduct.set(item.productId, {
          productId: item.productId,
          name: item.product.name,
          sku: item.product.sku,
          unit: item.product.unit,
          quantity: item.quantity,
        });
      }
    }

    const products = Array.from(byProduct.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR"),
    );

    return { hasRelatedStocks: true, products };
  }
}
