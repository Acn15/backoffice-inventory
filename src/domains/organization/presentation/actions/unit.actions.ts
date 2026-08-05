"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/core/errors/api-error";
import type { UnitStatus } from "@/domains/organization/domain/entities/unit";
import { organizationContainer } from "@/domains/organization/infrastructure/organization.container";

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

export async function createUnitAction(input: {
  tenantId: string;
  name: string;
  description?: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status?: UnitStatus;
  contractEndDate: string;
  contractStartDate?: string;
  contract?: string;
}): Promise<ActionResult> {
  try {
    await organizationContainer.createUnitUseCase.execute(input);
    revalidatePath("/units");
    return { ok: true, message: "Loja criada com sucesso." };
  } catch (error) {
    return toActionError(error, "Não foi possível criar a loja.");
  }
}

export async function updateUnitAction(input: {
  id: string;
  name?: string;
  description?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status?: UnitStatus;
  contractEndDate?: string;
  contractStartDate?: string;
  contract?: string;
}): Promise<ActionResult> {
  try {
    const { id, ...data } = input;
    await organizationContainer.updateUnitUseCase.execute(id, data);
    revalidatePath("/units");
    revalidatePath(`/units/${id}`);
    return { ok: true, message: "Loja atualizada." };
  } catch (error) {
    return toActionError(error, "Não foi possível atualizar a loja.");
  }
}
