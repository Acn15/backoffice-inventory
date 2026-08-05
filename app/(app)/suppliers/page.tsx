import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { suppliersContainer } from "@/domains/suppliers/infrastructure/suppliers.container";
import { SupplierForm } from "@/domains/suppliers/presentation/supplier-form";
import { SuppliersTable } from "@/domains/suppliers/presentation/suppliers-table";
import {
  Alert,
  Container,
  Panel,
  Separator,
  Stack,
  Text,
} from "@/shared/ui";

export default async function SuppliersPage() {
  let tenantId: string | null = null;
  let loadError: string | null = null;
  let suppliers: Awaited<
    ReturnType<typeof suppliersContainer.listSuppliersUseCase.execute>
  > = [];

  try {
    const profile = await nestServerProfile();
    tenantId = profile.user.tenantId;
    suppliers = await suppliersContainer.listSuppliersUseCase.execute(tenantId);
  } catch (error) {
    loadError =
      error instanceof ApiError
        ? error.messages.join(" ")
        : "Não foi possível carregar os fornecedores.";
  }

  return (
    <main className="py-8">
      <Container>
        <Stack gap="lg">
          <Stack gap="sm">
            <Text as="h2" variant="h2">
              Fornecedores
            </Text>
            <Text variant="muted">
              Cadastre os fornecedores do tenant. Eles são obrigatórios nas
              entradas de estoque.
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
                <SupplierForm tenantId={tenantId} mode="create" />
              </Panel>
              <Separator />
              <Panel>
                <Stack gap="md">
                  <Text as="h3" variant="h3">
                    Lista ({suppliers.length})
                  </Text>
                  <SuppliersTable suppliers={suppliers} />
                </Stack>
              </Panel>
            </>
          )}
        </Stack>
      </Container>
    </main>
  );
}
