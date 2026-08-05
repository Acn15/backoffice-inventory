import type { UnitRepository } from "@/domains/organization/domain/repositories/unit-repository";

export class ListUnitsUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(tenantId?: string | null) {
    const units = await this.unitRepository.findAll();
    if (!tenantId) return units;
    return units.filter((unit) => unit.tenantId === tenantId);
  }
}
