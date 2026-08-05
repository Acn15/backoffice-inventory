import { nestServerRequest } from "@/core/http/nest-server-client";
import type { Supplier } from "@/domains/suppliers/domain/entities/supplier";
import type {
  CreateSupplierInput,
  SupplierRepository,
  UpdateSupplierInput,
} from "@/domains/suppliers/domain/repositories/supplier-repository";
import {
  mapSupplier,
  type SupplierResponseDto,
} from "@/domains/suppliers/infrastructure/mappers/supplier.mapper";

export class NestSupplierRepository implements SupplierRepository {
  async findAll(): Promise<Supplier[]> {
    const response = await nestServerRequest<SupplierResponseDto[]>("/suppliers");
    return response.map(mapSupplier);
  }

  async findById(id: string): Promise<Supplier> {
    const response = await nestServerRequest<SupplierResponseDto>(
      `/suppliers/${id}`,
    );
    return mapSupplier(response);
  }

  async create(input: CreateSupplierInput): Promise<Supplier> {
    const response = await nestServerRequest<SupplierResponseDto>("/suppliers", {
      method: "POST",
      body: input,
    });
    return mapSupplier(response);
  }

  async update(id: string, input: UpdateSupplierInput): Promise<Supplier> {
    const response = await nestServerRequest<SupplierResponseDto>(
      `/suppliers/${id}`,
      {
        method: "PATCH",
        body: input,
      },
    );
    return mapSupplier(response);
  }
}
