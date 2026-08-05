import type { Unit, UnitStatus } from "@/domains/organization/domain/entities/unit";

export type CreateUnitInput = {
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
};

export type UpdateUnitInput = {
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
};

export interface UnitRepository {
  findAll(): Promise<Unit[]>;
  findById(id: string): Promise<Unit>;
  create(input: CreateUnitInput): Promise<Unit>;
  update(id: string, input: UpdateUnitInput): Promise<Unit>;
}
