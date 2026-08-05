"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/core/errors/api-error";
import type { StockStatus, StockType } from "@/domains/inventory/domain/entities/stock";
import { inventoryContainer } from "@/domains/inventory/infrastructure/inventory.container";

export type ActionResult = {
  ok: boolean;
  message: string | null;
};

export async function createStockAction(input: {
  tenantId: string;
  unitId?: string;
  name: string;
  description?: string;
  type: StockType;
  status?: StockStatus;
}): Promise<ActionResult> {
  try {
    await inventoryContainer.createStockUseCase.execute(input);
    revalidatePath("/stocks");
    return { ok: true, message: "Estoque criado com sucesso." };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Stock name")) {
      return { ok: false, message: "Informe um nome com pelo menos 2 caracteres." };
    }
    if (error instanceof ApiError) {
      return { ok: false, message: error.messages.join(" ") };
    }
    return { ok: false, message: "Não foi possível criar o estoque." };
  }
}
