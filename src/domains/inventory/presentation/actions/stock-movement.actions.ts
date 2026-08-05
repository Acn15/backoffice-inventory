"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/core/errors/api-error";
import type { StockMovementType } from "@/domains/inventory/domain/entities/stock-movement";
import type { CreateStockMovementItemInput } from "@/domains/inventory/domain/repositories/stock-movement-repository";
import { inventoryContainer } from "@/domains/inventory/infrastructure/inventory.container";
import {
  getCatalogSalePriceCents,
  listBatchesByProduct,
} from "@/domains/inventory/infrastructure/inventory-lookups";

export type ActionResult = {
  ok: boolean;
  message: string | null;
};

export async function createStockMovementAction(input: {
  tenantId: string;
  createdById: string;
  type: StockMovementType;
  fromStockId?: string;
  toStockId?: string;
  supplierId?: string;
  description?: string;
  note?: string;
  items: CreateStockMovementItemInput[];
}): Promise<ActionResult> {
  try {
    await inventoryContainer.createStockMovementUseCase.execute(input);
    revalidatePath("/stocks");
    revalidatePath("/stocks/movements");
    return { ok: true, message: "Movimentação criada como pendente." };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.messages.join(" ") };
    }
    if (error instanceof Error) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "Não foi possível criar a movimentação." };
  }
}

export async function confirmStockMovementAction(input: {
  movementId: string;
  confirmedById: string;
}): Promise<ActionResult> {
  try {
    await inventoryContainer.confirmStockMovementUseCase.execute(
      input.movementId,
      input.confirmedById,
    );
    revalidatePath("/stocks");
    revalidatePath("/stocks/movements");
    return { ok: true, message: "Movimentação confirmada." };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.messages.join(" ") };
    }
    return { ok: false, message: "Não foi possível confirmar a movimentação." };
  }
}

export async function cancelStockMovementAction(input: {
  movementId: string;
  canceledById: string;
}): Promise<ActionResult> {
  try {
    await inventoryContainer.cancelStockMovementUseCase.execute(
      input.movementId,
      input.canceledById,
    );
    revalidatePath("/stocks");
    revalidatePath("/stocks/movements");
    return { ok: true, message: "Movimentação cancelada." };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.messages.join(" ") };
    }
    return { ok: false, message: "Não foi possível cancelar a movimentação." };
  }
}

export async function listProductBatchesAction(productId: string) {
  return listBatchesByProduct(productId);
}

export type CatalogPriceCheck = {
  stockHasUnit: boolean;
  hasCatalogPrice: boolean;
  salePriceReais: string | null;
  message: string | null;
  severity: "info" | "warning" | "danger" | null;
};

/**
 * Verifica preço de catálogo (ProductPrice) do produto na loja do estoque.
 * Mesmo productId pode ter preço diferente por unitId.
 */
export async function checkCatalogPriceForStockAction(input: {
  productId: string;
  stockUnitId?: string;
  context: "ENTRY" | "SALE";
}): Promise<CatalogPriceCheck> {
  if (!input.stockUnitId) {
    return {
      stockHasUnit: false,
      hasCatalogPrice: false,
      salePriceReais: null,
      message:
        input.context === "SALE"
          ? "Este estoque não tem loja vinculada. Você pode informar o preço da venda manualmente."
          : "Este estoque não tem loja vinculada. O preço de catálogo por loja não se aplica.",
      severity: "info",
    };
  }

  const cents = await getCatalogSalePriceCents(
    input.productId,
    input.stockUnitId,
  );

  if (cents === null) {
    return {
      stockHasUnit: true,
      hasCatalogPrice: false,
      salePriceReais: null,
      message:
        input.context === "SALE"
          ? "Cadastre o preço de venda deste produto nesta loja antes de vender. O mesmo produto pode ter preço diferente em cada loja."
          : "Este estoque pertence a uma loja. Cadastre o preço de venda do produto nessa loja no catálogo antes de movimentar.",
      severity: "danger",
    };
  }

  return {
    stockHasUnit: true,
    hasCatalogPrice: true,
    salePriceReais: (cents / 100).toFixed(2).replace(".", ","),
    message:
      input.context === "SALE"
        ? "Preço de catálogo encontrado para este produto nesta loja (pode ajustar na operação)."
        : "Preço de catálogo já cadastrado para este produto nesta loja.",
    severity: "info",
  };
}

/** @deprecated use checkCatalogPriceForStockAction */
export async function suggestSalePriceAction(input: {
  productId: string;
  stockUnitId?: string;
}): Promise<{ salePriceReais: string | null; message: string | null }> {
  const result = await checkCatalogPriceForStockAction({
    ...input,
    context: "SALE",
  });
  return {
    salePriceReais: result.salePriceReais,
    message: result.message,
  };
}
