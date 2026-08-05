import type { UnitRepository } from "@/domains/organization/domain/repositories/unit-repository";

export class GetUnitUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  execute(id: string) {
    return this.unitRepository.findById(id);
  }
}
