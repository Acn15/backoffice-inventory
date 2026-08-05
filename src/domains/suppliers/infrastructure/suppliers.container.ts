import { CreateSupplierUseCase } from "@/domains/suppliers/application/use-cases/create-supplier.use-case";
import { GetSupplierUseCase } from "@/domains/suppliers/application/use-cases/get-supplier.use-case";
import { ListSuppliersUseCase } from "@/domains/suppliers/application/use-cases/list-suppliers.use-case";
import { UpdateSupplierUseCase } from "@/domains/suppliers/application/use-cases/update-supplier.use-case";
import { NestSupplierRepository } from "@/domains/suppliers/infrastructure/nest-supplier.repository";

const supplierRepository = new NestSupplierRepository();

export const suppliersContainer = {
  supplierRepository,
  listSuppliersUseCase: new ListSuppliersUseCase(supplierRepository),
  getSupplierUseCase: new GetSupplierUseCase(supplierRepository),
  createSupplierUseCase: new CreateSupplierUseCase(supplierRepository),
  updateSupplierUseCase: new UpdateSupplierUseCase(supplierRepository),
} as const;
