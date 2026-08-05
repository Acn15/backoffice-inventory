import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { catalogContainer } from "@/domains/catalog/infrastructure/catalog.container";
import { ProductBatchesPanel } from "@/domains/catalog/presentation/product-batches-panel";
import { ProductPricesPanel } from "@/domains/catalog/presentation/product-prices-panel";
import { UpdateProductForm } from "@/domains/catalog/presentation/update-product-form";
import { listUnitsByTenant } from "@/domains/inventory/infrastructure/inventory-lookups";
import {
  Alert,
  Container,
  Panel,
  Separator,
  Stack,
  Text,
} from "@/shared/ui";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  try {
    const profile = await nestServerProfile();
    const tenantId = profile.user.tenantId;
    const product = await catalogContainer.getProductUseCase.execute(id);

    if (tenantId && product.tenantId !== tenantId) {
      notFound();
    }

    const [categories, batches, prices, units] = await Promise.all([
      catalogContainer.listProductCategoriesUseCase.execute(
        tenantId ?? product.tenantId,
      ),
      catalogContainer.listProductBatchesUseCase.execute(product.id),
      catalogContainer.listProductPricesUseCase.execute(product.id),
      listUnitsByTenant(tenantId ?? product.tenantId),
    ]);

    return (
      <main className="py-8">
        <Container>
          <Stack gap="lg">
            <Stack gap="sm">
              <Link
                href="/products"
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                ← Voltar para produtos
              </Link>
              <Text as="h2" variant="h2">
                {product.name}
              </Text>
              <Text variant="muted">
                {product.sku ? `SKU ${product.sku}` : "Sem SKU"} ·{" "}
                {product.description || "Sem descrição"}
              </Text>
            </Stack>

            <Panel>
              <Stack gap="sm">
                <Text variant="muted">1 · Dados do produto</Text>
                <UpdateProductForm product={product} categories={categories} />
              </Stack>
            </Panel>

            <Separator />

            <Panel>
              <Stack gap="sm">
                <Text variant="muted">2 · Lotes (consulta)</Text>
                <ProductBatchesPanel
                  productId={product.id}
                  tenantId={product.tenantId}
                  batches={batches}
                />
              </Stack>
            </Panel>

            <Panel>
              <Stack gap="sm">
                <Text variant="muted">3 · Preços por loja</Text>
                <ProductPricesPanel
                  productId={product.id}
                  tenantId={product.tenantId}
                  prices={prices}
                  units={units}
                />
              </Stack>
            </Panel>
          </Stack>
        </Container>
      </main>
    );
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) {
      notFound();
    }

    return (
      <main className="py-8">
        <Container>
          <Alert variant="danger" title="Erro ao carregar">
            {error instanceof ApiError
              ? error.messages.join(" ")
              : "Não foi possível carregar o produto."}
          </Alert>
        </Container>
      </main>
    );
  }
}
