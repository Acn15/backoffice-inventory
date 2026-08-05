import { nestServerRequest } from "@/core/http/nest-server-client";

export type UnitOption = {
  id: string;
  tenantId: string;
  name: string;
};

export type ProductOption = {
  id: string;
  tenantId: string;
  name: string;
  sku?: string;
};

export type BatchOption = {
  id: string;
  productId: string;
  batchCode: string;
  status: string;
  expirationDate?: string;
};

export type SupplierOption = {
  id: string;
  tenantId: string;
  name: string;
};

export async function listUnitsByTenant(
  tenantId: string,
): Promise<UnitOption[]> {
  const units = await nestServerRequest<UnitOption[]>("/units");
  return units.filter((unit) => unit.tenantId === tenantId);
}

export async function listProductsByTenant(
  tenantId: string,
): Promise<ProductOption[]> {
  return nestServerRequest<ProductOption[]>(
    `/products?tenantId=${encodeURIComponent(tenantId)}`,
  );
}

export async function listBatchesByProduct(
  productId: string,
): Promise<BatchOption[]> {
  return nestServerRequest<BatchOption[]>(`/products/${productId}/batches`);
}

export async function listSuppliersByTenant(
  tenantId: string,
): Promise<SupplierOption[]> {
  const suppliers = await nestServerRequest<SupplierOption[]>("/suppliers");
  return suppliers.filter((supplier) => supplier.tenantId === tenantId);
}

/** Preço de venda planejado do catálogo (ProductPrice) para a loja/filial. */
export async function getCatalogSalePriceCents(
  productId: string,
  unitId: string,
): Promise<number | null> {
  try {
    const price = await nestServerRequest<{ salePriceCents: number }>(
      `/products/${productId}/prices/${unitId}`,
    );
    return price.salePriceCents;
  } catch {
    return null;
  }
}
