import { nestServerRequest } from "@/core/http/nest-server-client";
import type { Unit } from "@/domains/organization/domain/entities/unit";
import type {
  CreateUnitInput,
  UnitRepository,
  UpdateUnitInput,
} from "@/domains/organization/domain/repositories/unit-repository";
import {
  mapUnit,
  type UnitResponseDto,
} from "@/domains/organization/infrastructure/mappers/unit.mapper";

export class NestUnitRepository implements UnitRepository {
  async findAll(): Promise<Unit[]> {
    const response = await nestServerRequest<UnitResponseDto[]>("/units");
    return response.map(mapUnit);
  }

  async findById(id: string): Promise<Unit> {
    const response = await nestServerRequest<UnitResponseDto>(`/units/${id}`);
    return mapUnit(response);
  }

  async create(input: CreateUnitInput): Promise<Unit> {
    const response = await nestServerRequest<UnitResponseDto>("/units", {
      method: "POST",
      body: input,
    });
    return mapUnit(response);
  }

  async update(id: string, input: UpdateUnitInput): Promise<Unit> {
    const response = await nestServerRequest<UnitResponseDto>(`/units/${id}`, {
      method: "PATCH",
      body: input,
    });
    return mapUnit(response);
  }
}
