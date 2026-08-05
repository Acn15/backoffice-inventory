import type { SupplierRepository } from "@/domains/suppliers/domain/repositories/supplier-repository";

export class GetSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  execute(id: string) {
    return this.supplierRepository.findById(id);
  }
}
