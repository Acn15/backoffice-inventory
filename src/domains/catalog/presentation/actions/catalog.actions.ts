"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/core/errors/api-error";
import type { ProductStatus, ProductUnit } from "@/domains/catalog/domain/entities/product";
import type { ProductBatchStatus } from "@/domains/catalog/domain/entities/product-batch";
import type { ProductCategoryStatus } from "@/domains/catalog/domain/entities/product-category";
import { catalogContainer } from "@/domains/catalog/infrastructure/catalog.container";

export type ActionResult<T = undefined> = {
  ok: boolean;
  message: string | null;
  data?: T;
};

function toActionError<T = undefined>(
  error: unknown,
  fallback: string,
): ActionResult<T> {
  if (error instanceof ApiError) {
    return { ok: false, message: error.messages.join(" ") };
  }
  if (error instanceof Error) {
    return { ok: false, message: error.message };
  }
  return { ok: false, message: fallback };
}

export async function createProductAction(input: {
  tenantId: string;
  categoryId: string;
  name: string;
  description?: string;
  unit: ProductUnit;
  sku?: string;
  barcode?: string;
  status?: ProductStatus;
}): Promise<ActionResult<{ productId: string }>> {
  try {
    const product = await catalogContainer.createProductUseCase.execute(input);
    revalidatePath("/products");
    return {
      ok: true,
      message: "Produto criado com sucesso.",
      data: { productId: product.id },
    };
  } catch (error) {
    return toActionError(error, "Não foi possível criar o produto.");
  }
}

export async function updateProductAction(input: {
  id: string;
  categoryId?: string;
  name?: string;
  description?: string;
  unit?: ProductUnit;
  sku?: string;
  barcode?: string;
  status?: ProductStatus;
}): Promise<ActionResult> {
  try {
    const { id, ...data } = input;
    await catalogContainer.updateProductUseCase.execute(id, data);
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return { ok: true, message: "Produto atualizado." };
  } catch (error) {
    return toActionError(error, "Não foi possível atualizar o produto.");
  }
}

export async function createCategoryAction(input: {
  tenantId: string;
  name: string;
  description?: string;
  status?: ProductCategoryStatus;
}): Promise<ActionResult> {
  try {
    await catalogContainer.createProductCategoryUseCase.execute(input);
    revalidatePath("/products");
    revalidatePath("/products/categories");
    return { ok: true, message: "Categoria criada com sucesso." };
  } catch (error) {
    return toActionError(error, "Não foi possível criar a categoria.");
  }
}

export async function updateCategoryAction(input: {
  id: string;
  name?: string;
  description?: string;
  status?: ProductCategoryStatus;
}): Promise<ActionResult> {
  try {
    const { id, ...data } = input;
    await catalogContainer.updateProductCategoryUseCase.execute(id, data);
    revalidatePath("/products");
    revalidatePath("/products/categories");
    return { ok: true, message: "Categoria atualizada." };
  } catch (error) {
    return toActionError(error, "Não foi possível atualizar a categoria.");
  }
}

export async function createBatchAction(input: {
  productId: string;
  tenantId: string;
  batchCode: string;
  manufactureDate?: string;
  expirationDate: string;
  status?: ProductBatchStatus;
  supplierId?: string;
}): Promise<ActionResult<{ batchId: string }>> {
  try {
    const { productId, ...data } = input;
    const batch = await catalogContainer.createProductBatchUseCase.execute(
      productId,
      data,
    );
    revalidatePath(`/products/${productId}`);
    revalidatePath("/stocks/movements");
    return {
      ok: true,
      message: "Lote criado com sucesso.",
      data: { batchId: batch.id },
    };
  } catch (error) {
    return toActionError(error, "Não foi possível criar o lote.");
  }
}

export async function updateBatchAction(input: {
  productId: string;
  batchId: string;
  batchCode?: string;
  manufactureDate?: string;
  expirationDate?: string;
  status?: ProductBatchStatus;
}): Promise<ActionResult> {
  try {
    const { productId, batchId, ...data } = input;
    await catalogContainer.updateProductBatchUseCase.execute(
      productId,
      batchId,
      data,
    );
    revalidatePath(`/products/${productId}`);
    return { ok: true, message: "Lote atualizado." };
  } catch (error) {
    return toActionError(error, "Não foi possível atualizar o lote.");
  }
}

export async function createPriceAction(input: {
  productId: string;
  unitId: string;
  tenantId: string;
  salePriceCents: number;
}): Promise<ActionResult> {
  try {
    const { productId, unitId, ...data } = input;
    await catalogContainer.createProductPriceUseCase.execute(
      productId,
      unitId,
      data,
    );
    revalidatePath(`/products/${productId}`);
    return { ok: true, message: "Preço cadastrado." };
  } catch (error) {
    return toActionError(error, "Não foi possível cadastrar o preço.");
  }
}

export async function updatePriceAction(input: {
  productId: string;
  unitId: string;
  salePriceCents: number;
}): Promise<ActionResult> {
  try {
    const { productId, unitId, salePriceCents } = input;
    await catalogContainer.updateProductPriceUseCase.execute(
      productId,
      unitId,
      { salePriceCents },
    );
    revalidatePath(`/products/${productId}`);
    return { ok: true, message: "Preço atualizado." };
  } catch (error) {
    return toActionError(error, "Não foi possível atualizar o preço.");
  }
}
