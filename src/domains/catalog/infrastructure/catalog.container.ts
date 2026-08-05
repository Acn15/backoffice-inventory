import { CreateProductBatchUseCase } from "@/domains/catalog/application/use-cases/create-product-batch.use-case";
import { CreateProductCategoryUseCase } from "@/domains/catalog/application/use-cases/create-product-category.use-case";
import { CreateProductPriceUseCase } from "@/domains/catalog/application/use-cases/create-product-price.use-case";
import { CreateProductUseCase } from "@/domains/catalog/application/use-cases/create-product.use-case";
import { GetProductUseCase } from "@/domains/catalog/application/use-cases/get-product.use-case";
import { ListProductBatchesUseCase } from "@/domains/catalog/application/use-cases/list-product-batches.use-case";
import { ListProductCategoriesUseCase } from "@/domains/catalog/application/use-cases/list-product-categories.use-case";
import { ListProductPricesUseCase } from "@/domains/catalog/application/use-cases/list-product-prices.use-case";
import { ListProductsUseCase } from "@/domains/catalog/application/use-cases/list-products.use-case";
import { UpdateProductBatchUseCase } from "@/domains/catalog/application/use-cases/update-product-batch.use-case";
import { UpdateProductCategoryUseCase } from "@/domains/catalog/application/use-cases/update-product-category.use-case";
import { UpdateProductPriceUseCase } from "@/domains/catalog/application/use-cases/update-product-price.use-case";
import { UpdateProductUseCase } from "@/domains/catalog/application/use-cases/update-product.use-case";
import { NestProductBatchRepository } from "@/domains/catalog/infrastructure/nest-product-batch.repository";
import { NestProductCategoryRepository } from "@/domains/catalog/infrastructure/nest-product-category.repository";
import { NestProductPriceRepository } from "@/domains/catalog/infrastructure/nest-product-price.repository";
import { NestProductRepository } from "@/domains/catalog/infrastructure/nest-product.repository";

const productRepository = new NestProductRepository();
const categoryRepository = new NestProductCategoryRepository();
const batchRepository = new NestProductBatchRepository();
const priceRepository = new NestProductPriceRepository();

export const catalogContainer = {
  productRepository,
  categoryRepository,
  batchRepository,
  priceRepository,
  listProductsUseCase: new ListProductsUseCase(productRepository),
  getProductUseCase: new GetProductUseCase(productRepository),
  createProductUseCase: new CreateProductUseCase(productRepository),
  updateProductUseCase: new UpdateProductUseCase(productRepository),
  listProductCategoriesUseCase: new ListProductCategoriesUseCase(
    categoryRepository,
  ),
  createProductCategoryUseCase: new CreateProductCategoryUseCase(
    categoryRepository,
  ),
  updateProductCategoryUseCase: new UpdateProductCategoryUseCase(
    categoryRepository,
  ),
  listProductBatchesUseCase: new ListProductBatchesUseCase(batchRepository),
  createProductBatchUseCase: new CreateProductBatchUseCase(batchRepository),
  updateProductBatchUseCase: new UpdateProductBatchUseCase(batchRepository),
  listProductPricesUseCase: new ListProductPricesUseCase(priceRepository),
  createProductPriceUseCase: new CreateProductPriceUseCase(priceRepository),
  updateProductPriceUseCase: new UpdateProductPriceUseCase(priceRepository),
} as const;
