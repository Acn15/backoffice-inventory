import type { SupplierStatus } from "@/domains/suppliers/domain/entities/supplier";

export const supplierStatusLabels: Record<SupplierStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};
