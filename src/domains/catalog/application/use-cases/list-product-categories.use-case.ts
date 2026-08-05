import type { ProductCategoryRepository } from "@/domains/catalog/domain/repositories/product-category-repository";

export class ListProductCategoriesUseCase {
  constructor(
    private readonly categoryRepository: ProductCategoryRepository,
  ) {}

  async execute(tenantId?: string | null) {
    const categories = await this.categoryRepository.findAll();
    if (!tenantId) return categories;
    return categories.filter((category) => category.tenantId === tenantId);
  }
}
