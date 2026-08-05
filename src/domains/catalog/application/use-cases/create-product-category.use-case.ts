import type {
  CreateProductCategoryInput,
  ProductCategoryRepository,
} from "@/domains/catalog/domain/repositories/product-category-repository";

export class CreateProductCategoryUseCase {
  constructor(
    private readonly categoryRepository: ProductCategoryRepository,
  ) {}

  execute(input: CreateProductCategoryInput) {
    const name = input.name.trim();
    if (name.length < 2) {
      throw new Error("Category name must have at least 2 characters");
    }
    return this.categoryRepository.create({
      ...input,
      name,
      description: input.description?.trim() || undefined,
    });
  }
}
