import type { Supplier } from "@/domains/suppliers/domain/entities/supplier";

export type SupplierResponseDto = {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  cnpj?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  email?: string | null;
  status: Supplier["status"];
  createdAt: string;
  updatedAt: string;
};

export function mapSupplier(dto: SupplierResponseDto): Supplier {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    name: dto.name,
    description: dto.description ?? undefined,
    cnpj: dto.cnpj ?? undefined,
    address: dto.address ?? undefined,
    city: dto.city ?? undefined,
    state: dto.state ?? undefined,
    phone: dto.phone ?? undefined,
    email: dto.email ?? undefined,
    status: dto.status,
    createdAt: String(dto.createdAt),
    updatedAt: String(dto.updatedAt),
  };
}
