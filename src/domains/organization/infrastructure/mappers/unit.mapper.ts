import type { Unit } from "@/domains/organization/domain/entities/unit";

export type UnitResponseDto = {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  cnpj?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  status: Unit["status"];
  contractEndDate: string;
  contractStartDate?: string | null;
  contract?: string | null;
  createdAt: string;
  updatedAt: string;
};

export function mapUnit(dto: UnitResponseDto): Unit {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    name: dto.name,
    description: dto.description ?? undefined,
    cnpj: dto.cnpj ?? undefined,
    address: dto.address ?? undefined,
    city: dto.city ?? undefined,
    state: dto.state ?? undefined,
    zipCode: dto.zipCode ?? undefined,
    status: dto.status,
    contractEndDate: String(dto.contractEndDate).slice(0, 10),
    contractStartDate: dto.contractStartDate
      ? String(dto.contractStartDate).slice(0, 10)
      : undefined,
    contract: dto.contract ?? undefined,
    createdAt: String(dto.createdAt),
    updatedAt: String(dto.updatedAt),
  };
}
