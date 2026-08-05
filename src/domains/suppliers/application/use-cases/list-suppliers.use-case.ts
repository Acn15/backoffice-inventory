import type { SupplierRepository } from "@/domains/suppliers/domain/repositories/supplier-repository";

export class ListSuppliersUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(tenantId?: string | null) {
    const suppliers = await this.supplierRepository.findAll();
    if (!tenantId) return suppliers;
    return suppliers.filter((supplier) => supplier.tenantId === tenantId);
  }
}
