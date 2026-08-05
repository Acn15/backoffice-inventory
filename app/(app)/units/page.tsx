import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { organizationContainer } from "@/domains/organization/infrastructure/organization.container";
import { CreateUnitModal } from "@/domains/organization/presentation/create-unit-modal";
import { UnitsTable } from "@/domains/organization/presentation/units-table";
import { Alert, Container, Panel, Stack, Text } from "@/shared/ui";

export default async function UnitsPage() {
  let tenantId: string | null = null;
  let loadError: string | null = null;
  let units: Awaited<
    ReturnType<typeof organizationContainer.listUnitsUseCase.execute>
  > = [];

  try {
    const profile = await nestServerProfile();
    tenantId = profile.user.tenantId;
    units = await organizationContainer.listUnitsUseCase.execute(tenantId);
  } catch (error) {
    loadError =
      error instanceof ApiError
        ? error.messages.join(" ")
        : "Não foi possível carregar as lojas.";
  }

  return (
    <main className="py-8">
      <Container>
        <Stack gap="lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <Stack gap="sm">
              <Text as="h2" variant="h2">
                Lojas
              </Text>
              <Text variant="muted">
                Liste as filiais do tenant e abra uma loja para ver produtos com
                preço e quantidade em estoque.
              </Text>
            </Stack>
            {tenantId && !loadError ? (
              <CreateUnitModal tenantId={tenantId} />
            ) : null}
          </div>

          {loadError ? (
            <Alert variant="danger" title="Erro ao carregar">
              {loadError}
            </Alert>
          ) : !tenantId ? (
            <Alert variant="warning" title="Tenant não encontrado">
              Seu usuário não está vinculado a um tenant.
            </Alert>
          ) : (
            <Panel>
              <Stack gap="md">
                <Text as="h3" variant="h3">
                  Lista ({units.length})
                </Text>
                <UnitsTable units={units} />
              </Stack>
            </Panel>
          )}
        </Stack>
      </Container>
    </main>
  );
}
