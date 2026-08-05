export type UnitStatus = "ACTIVE" | "INACTIVE";

export type Unit = {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status: UnitStatus;
  contractEndDate: string;
  contractStartDate?: string;
  contract?: string;
  createdAt: string;
  updatedAt: string;
};
