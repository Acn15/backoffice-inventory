import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { inventoryContainer } from "@/domains/inventory/infrastructure/inventory.container";
import {
  listProductsByTenant,
  listSuppliersByTenant,
} from "@/domains/inventory/infrastructure/inventory-lookups";
import { CreateMovementForm } from "@/domains/inventory/presentation/create-movement-form";
import { MovementsTable } from "@/domains/inventory/presentation/movements-table";
import type { Stock } from "@/domains/inventory/domain/entities/stock";
import {
  Alert,
  Container,
  Panel,
  Separator,
  Stack,
  Text,
} from "@/shared/ui";

export default async function StockMovementsPage() {
  let tenantId: string | null = null;
  let userId: string | null = null;
  let loadError: string | null = null;
  let stocks: Stock[] = [];
  let movements: Awaited<
    ReturnType<typeof inventoryContainer.listStockMovementsUseCase.execute>
  > = [];
  let products: Awaited<ReturnType<typeof listProductsByTenant>> = [];
  let suppliers: Awaited<ReturnType<typeof listSuppliersByTenant>> = [];

  try {
    const profile = await nestServerProfile();
    tenantId = profile.user.tenantId;
    userId = profile.user.userId;

    stocks = await inventoryContainer.listStocksUseCase.execute(tenantId);

    if (tenantId) {
      [movements, products, suppliers] = await Promise.all([
        inventoryContainer.listStockMovementsUseCase.execute({ tenantId }),
        listProductsByTenant(tenantId),
        listSuppliersByTenant(tenantId),
      ]);
    }
  } catch (error) {
    loadError =
      error instanceof ApiError
        ? error.messages.join(" ")
        : "Não foi possível carregar as movimentações.";
  }

  const stocksById = Object.fromEntries(
    stocks.map((stock) => [stock.id, stock]),
  );

  return (
    <main className="py-8">
      <Container>
        <Stack gap="lg">
          <Stack gap="sm">
            <Text as="h2" variant="h2">
              Movimentações
            </Text>
            <Text variant="muted">
              Entrada = custo real da compra. Venda = preço cobrado no estoque
              de origem (sugerido pelo catálogo da loja). Confirme para
              atualizar o saldo.
            </Text>
          </Stack>

          {loadError ? (
            <Alert variant="danger" title="Erro ao carregar">
              {loadError}
            </Alert>
          ) : !tenantId || !userId ? (
            <Alert variant="warning" title="Sessão incompleta">
              Não foi possível identificar tenant ou usuário da sessão.
            </Alert>
          ) : (
            <>
              <Panel>
                <CreateMovementForm
                  tenantId={tenantId}
                  userId={userId}
                  stocks={stocks}
                  products={products}
                  suppliers={suppliers}
                />
              </Panel>

              <Separator />

              <Panel>
                <Stack gap="md">
                  <Text as="h3" variant="h3">
                    Histórico ({movements.length})
                  </Text>
                  <MovementsTable
                    movements={movements}
                    stocksById={stocksById}
                    userId={userId}
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
