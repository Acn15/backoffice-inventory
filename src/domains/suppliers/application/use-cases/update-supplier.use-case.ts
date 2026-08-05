import type {
  SupplierRepository,
  UpdateSupplierInput,
} from "@/domains/suppliers/domain/repositories/supplier-repository";

function normalizeOptional(value?: string): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export class UpdateSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  execute(id: string, input: UpdateSupplierInput) {
    const name = input.name?.trim();
    const cnpj = input.cnpj?.replace(/\D/g, "");
    const state = input.state?.trim().toUpperCase();

    if (name !== undefined && name.length < 2) {
      throw new Error("Supplier name must have at least 2 characters");
    }
    if (cnpj !== undefined && cnpj.length > 0 && cnpj.length < 14) {
      throw new Error("CNPJ must have 14 digits");
    }
    if (state !== undefined && state.length > 0 && state.length !== 2) {
      throw new Error("State must have 2 characters");
    }

    return this.supplierRepository.update(id, {
      ...input,
      name,
      cnpj: cnpj === undefined ? undefined : cnpj || undefined,
      state: state === undefined ? undefined : state || undefined,
      description: normalizeOptional(input.description),
      address: normalizeOptional(input.address),
      city: normalizeOptional(input.city),
      phone: normalizeOptional(input.phone),
      email: normalizeOptional(input.email),
    });
  }
}
