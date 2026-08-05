import type {
  UnitRepository,
  UpdateUnitInput,
} from "@/domains/organization/domain/repositories/unit-repository";

export class UpdateUnitUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  execute(id: string, input: UpdateUnitInput) {
    return this.unitRepository.update(id, {
      ...input,
      name: input.name?.trim(),
      cnpj: input.cnpj?.replace(/\D/g, ""),
      state: input.state?.trim().toUpperCase(),
      zipCode: input.zipCode?.replace(/\D/g, ""),
      address: input.address?.trim(),
      city: input.city?.trim(),
      description: input.description?.trim() || undefined,
      contract: input.contract?.trim() || undefined,
      contractStartDate: input.contractStartDate || undefined,
    });
  }
}
