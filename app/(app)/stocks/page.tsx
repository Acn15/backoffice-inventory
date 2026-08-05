import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { CreateStockForm } from "@/domains/inventory/presentation/create-stock-form";
import { StocksTable } from "@/domains/inventory/presentation/stocks-table";
import { inventoryContainer } from "@/domains/inventory/infrastructure/inventory.container";
import { listUnitsByTenant } from "@/domains/inventory/infrastructure/inventory-lookups";
import {
  Alert,
  Container,
  Panel,
  Separator,
  Stack,
  Text,
} from "@/shared/ui";

export default async function StocksPage() {
  let tenantId: string | null = null;
  let loadError: string | null = null;
  let stocks: Awaited<
    ReturnType<typeof inventoryContainer.listStocksUseCase.execute>
  > = [];
  let units: Awaited<ReturnType<typeof listUnitsByTenant>> = [];

  try {
    const profile = await nestServerProfile();
    tenantId = profile.user.tenantId;
    stocks = await inventoryContainer.listStocksUseCase.execute(tenantId);

    if (tenantId) {
      units = await listUnitsByTenant(tenantId);
    }
  } catch (error) {
    loadError =
      error instanceof ApiError
        ? error.messages.join(" ")
        : "Não foi possível carregar os estoques.";
  }

  return (
    <main className="py-8">
      <Container>
        <Stack gap="lg">
          <Stack gap="sm">
            <Text as="h2" variant="h2">
              Estoques
            </Text>
            <Text variant="muted">
              Cadastre depósitos e acompanhe os locais de armazenamento.
            </Text>
          </Stack>

          {loadError ? (
            <Alert variant="danger" title="Erro ao carregar">
              {loadError}
            </Alert>
          ) : (
            <>
              <Panel>
                {tenantId ? (
                  <CreateStockForm tenantId={tenantId} units={units} />
                ) : (
                  <Alert variant="warning" title="Tenant não encontrado">
                    Seu usuário não está vinculado a um tenant.
                  </Alert>
                )}
              </Panel>

              <Separator />

              <Panel>
                <Stack gap="md">
                  <Text as="h3" variant="h3">
                    Lista ({stocks.length})
                  </Text>
                  <StocksTable stocks={stocks} />
                </Stack>
              </Panel>
            </>
          )}
        </Stack>
      </Container>
    </main>
  );
}
