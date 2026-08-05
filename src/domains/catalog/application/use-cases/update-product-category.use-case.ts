import type {
  ProductCategoryRepository,
  UpdateProductCategoryInput,
} from "@/domains/catalog/domain/repositories/product-category-repository";

export class UpdateProductCategoryUseCase {
  constructor(
    private readonly categoryRepository: ProductCategoryRepository,
  ) {}

  execute(id: string, input: UpdateProductCategoryInput) {
    return this.categoryRepository.update(id, {
      ...input,
      name: input.name?.trim(),
      description: input.description?.trim() || undefined,
    });
  }
}
