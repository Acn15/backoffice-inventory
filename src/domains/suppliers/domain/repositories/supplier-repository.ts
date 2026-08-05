import type {
  Supplier,
  SupplierStatus,
} from "@/domains/suppliers/domain/entities/supplier";

export type CreateSupplierInput = {
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
};

export type UpdateSupplierInput = {
  name?: string;
  description?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  status?: SupplierStatus;
};

export interface SupplierRepository {
  findAll(): Promise<Supplier[]>;
  findById(id: string): Promise<Supplier>;
  create(input: CreateSupplierInput): Promise<Supplier>;
  update(id: string, input: UpdateSupplierInput): Promise<Supplier>;
}
