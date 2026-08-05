import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { catalogContainer } from "@/domains/catalog/infrastructure/catalog.container";
import { CreateCategoryForm } from "@/domains/catalog/presentation/create-category-form";
import { CategoriesTable } from "@/domains/catalog/presentation/categories-table";
import {
  Alert,
  Container,
  Panel,
  Separator,
  Stack,
  Text,
} from "@/shared/ui";

export default async function ProductCategoriesPage() {
  let tenantId: string | null = null;
  let loadError: string | null = null;
  let categories: Awaited<
    ReturnType<typeof catalogContainer.listProductCategoriesUseCase.execute>
  > = [];

  try {
    const profile = await nestServerProfile();
    tenantId = profile.user.tenantId;
    categories =
      await catalogContainer.listProductCategoriesUseCase.execute(tenantId);
  } catch (error) {
    loadError =
      error instanceof ApiError
        ? error.messages.join(" ")
        : "Não foi possível carregar as categorias.";
  }

  return (
    <main className="py-8">
      <Container>
        <Stack gap="lg">
          <Stack gap="sm">
            <Text as="h2" variant="h2">
              Categorias
            </Text>
            <Text variant="muted">
              Organize o catálogo por categorias de produto.
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
                <CreateCategoryForm tenantId={tenantId} />
              </Panel>
              <Separator />
              <Panel>
                <Stack gap="md">
                  <Text as="h3" variant="h3">
                    Lista ({categories.length})
                  </Text>
                  <CategoriesTable categories={categories} />
                </Stack>
              </Panel>
            </>
          )}
        </Stack>
      </Container>
    </main>
  );
}
