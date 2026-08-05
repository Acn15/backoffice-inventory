"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/core/errors/api-error";
import type { SupplierStatus } from "@/domains/suppliers/domain/entities/supplier";
import { suppliersContainer } from "@/domains/suppliers/infrastructure/suppliers.container";

export type ActionResult = {
  ok: boolean;
  message: string | null;
};

function toActionError(error: unknown, fallback: string): ActionResult {
  if (error instanceof ApiError) {
    return { ok: false, message: error.messages.join(" ") };
  }
  if (error instanceof Error) {
    return { ok: false, message: error.message };
  }
  return { ok: false, message: fallback };
}

export async function createSupplierAction(input: {
  tenantId: string;
  name: string;
  description?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  status?: SupplierStatus;
}): Promise<ActionResult> {
  try {
    await suppliersContainer.createSupplierUseCase.execute(input);
    revalidatePath("/suppliers");
    return { ok: true, message: "Fornecedor criado com sucesso." };
  } catch (error) {
    return toActionError(error, "Não foi possível criar o fornecedor.");
  }
}

export async function updateSupplierAction(input: {
  id: string;
  name?: string;
  description?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  status?: SupplierStatus;
}): Promise<ActionResult> {
  try {
    const { id, ...data } = input;
    await suppliersContainer.updateSupplierUseCase.execute(id, data);
    revalidatePath("/suppliers");
    revalidatePath(`/suppliers/${id}`);
    return { ok: true, message: "Fornecedor atualizado." };
  } catch (error) {
    return toActionError(error, "Não foi possível atualizar o fornecedor.");
  }
}
