import type {
  CreateUnitInput,
  UnitRepository,
} from "@/domains/organization/domain/repositories/unit-repository";

export class CreateUnitUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  execute(input: CreateUnitInput) {
    const name = input.name.trim();
    const cnpj = input.cnpj.replace(/\D/g, "");
    const state = input.state.trim().toUpperCase();
    const zipCode = input.zipCode.replace(/\D/g, "");

    if (name.length < 2) {
      throw new Error("Unit name must have at least 2 characters");
    }
    if (cnpj.length < 14) {
      throw new Error("CNPJ must have 14 digits");
    }
    if (state.length !== 2) {
      throw new Error("State must have 2 characters");
    }
    if (zipCode.length < 8) {
      throw new Error("ZIP code must have at least 8 digits");
    }

    return this.unitRepository.create({
      ...input,
      name,
      cnpj,
      state,
      zipCode,
      address: input.address.trim(),
      city: input.city.trim(),
      description: input.description?.trim() || undefined,
      contract: input.contract?.trim() || undefined,
      contractStartDate: input.contractStartDate || undefined,
    });
  }
}
