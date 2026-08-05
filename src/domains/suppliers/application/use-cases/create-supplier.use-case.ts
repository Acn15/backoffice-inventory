import type {
  CreateSupplierInput,
  SupplierRepository,
} from "@/domains/suppliers/domain/repositories/supplier-repository";

function normalizeOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export class CreateSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  execute(input: CreateSupplierInput) {
    const name = input.name.trim();
    if (name.length < 2) {
      throw new Error("Supplier name must have at least 2 characters");
    }

    const cnpj = input.cnpj?.replace(/\D/g, "");
    const state = input.state?.trim().toUpperCase();

    if (cnpj && cnpj.length < 14) {
      throw new Error("CNPJ must have 14 digits");
    }
    if (state && state.length !== 2) {
      throw new Error("State must have 2 characters");
    }

    return this.supplierRepository.create({
      ...input,
      name,
      cnpj: cnpj || undefined,
      state: state || undefined,
      description: normalizeOptional(input.description),
      address: normalizeOptional(input.address),
      city: normalizeOptional(input.city),
      phone: normalizeOptional(input.phone),
      email: normalizeOptional(input.email),
    });
  }
}
