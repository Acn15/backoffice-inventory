export type SupplierStatus = "ACTIVE" | "INACTIVE";

export type Supplier = {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  status: SupplierStatus;
  createdAt: string;
  updatedAt: string;
};
