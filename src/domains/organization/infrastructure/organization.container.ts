import { CreateUnitUseCase } from "@/domains/organization/application/use-cases/create-unit.use-case";
import { GetUnitUseCase } from "@/domains/organization/application/use-cases/get-unit.use-case";
import { ListUnitsUseCase } from "@/domains/organization/application/use-cases/list-units.use-case";
import { UpdateUnitUseCase } from "@/domains/organization/application/use-cases/update-unit.use-case";
import { NestUnitRepository } from "@/domains/organization/infrastructure/nest-unit.repository";

const unitRepository = new NestUnitRepository();

export const organizationContainer = {
  unitRepository,
  listUnitsUseCase: new ListUnitsUseCase(unitRepository),
  getUnitUseCase: new GetUnitUseCase(unitRepository),
  createUnitUseCase: new CreateUnitUseCase(unitRepository),
  updateUnitUseCase: new UpdateUnitUseCase(unitRepository),
} as const;
