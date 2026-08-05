import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { catalogContainer } from "@/domains/catalog/infrastructure/catalog.container";
import { CreateProductWizard } from "@/domains/catalog/presentation/create-product-wizard";
import { ProductsTable } from "@/domains/catalog/presentation/products-table";
import {
  Alert,
  Container,
  Panel,
  Separator,
  Stack,
  Text,
} from "@/shared/ui";

export default async function ProductsPage() {
  let tenantId: string | null = null;
  let loadError: string | null = null;
  let products: Awaited<
    ReturnType<typeof catalogContainer.listProductsUseCase.execute>
  > = [];
  let categories: Awaited<
    ReturnType<typeof catalogContainer.listProductCategoriesUseCase.execute>
  > = [];

  try {
    const profile = await nestServerProfile();
    tenantId = profile.user.tenantId;

    if (tenantId) {
      [products, categories] = await Promise.all([
        catalogContainer.listProductsUseCase.execute(tenantId),
        catalogContainer.listProductCategoriesUseCase.execute(tenantId),
      ]);
    }
  } catch (error) {
    loadError =
      error instanceof ApiError
        ? error.messages.join(" ")
        : "Não foi possível carregar os produtos.";
  }

  const categoriesById = Object.fromEntries(
    categories.map((category) => [category.id, category]),
  );

  return (
    <main className="py-8">
      <Container>
        <Stack gap="lg">
          <Stack gap="sm">
            <Text as="h2" variant="h2">
              Produtos
            </Text>
            <Text variant="muted">
              Cadastre o produto no catálogo. Lotes e quantidade entram nas
              movimentações de estoque.
            </Text>
          </Stack>

          {loadError ? (
            <Alert variant="danger" title="Erro ao carregar">
              {loadError}
            </Alert>
          ) : !tenantId ? (
            <Alert variant="warning" title="Tenant não encontrado">
              Seu usuário não está vinculado a um tenant.
            </Alert>
          ) : (
            <>
              <Panel>
                <CreateProductWizard
                  tenantId={tenantId}
                  categories={categories.filter((c) => c.status === "ACTIVE")}
                />
              </Panel>
              <Separator />
              <Panel>
                <Stack gap="md">
                  <Text as="h3" variant="h3">
                    Lista ({products.length})
                  </Text>
                  <ProductsTable
                    products={products}
                    categoriesById={categoriesById}
                  />
                </Stack>
              </Panel>
            </>
          )}
        </Stack>
      </Container>
    </main>
  );
}
