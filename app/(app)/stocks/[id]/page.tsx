import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { inventoryContainer } from "@/domains/inventory/infrastructure/inventory.container";
import { StockInventoryTable } from "@/domains/inventory/presentation/stock-inventory-table";
import {
  aggregateStockProducts,
  StockProductsTable,
} from "@/domains/inventory/presentation/stock-products-table";
import {
  stockStatusLabels,
  stockTypeLabels,
} from "@/domains/inventory/presentation/labels";
import {
  Alert,
  Badge,
  Container,
  Panel,
  Stack,
  Text,
} from "@/shared/ui";

type StockDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StockDetailPage({
  params,
}: StockDetailPageProps) {
  const { id } = await params;

  try {
    const profile = await nestServerProfile();
    const tenantId = profile.user.tenantId;
    const stock = await inventoryContainer.getStockUseCase.execute(id);

    if (tenantId && stock.tenantId !== tenantId) {
      notFound();
    }

    const inventory = tenantId
      ? await inventoryContainer.getStockInventoryUseCase.execute(tenantId)
      : [];
    const stockInventory = inventory.find((item) => item.id === stock.id);
    const items = stockInventory?.items ?? [];
    const products = aggregateStockProducts(items);
    const hasUnit = Boolean(stock.unitId);

    return (
      <main className="py-8">
        <Container>
          <Stack gap="lg">
            <Stack gap="sm">
              <Link
                href="/stocks"
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                ← Voltar para estoques
              </Link>
              <Text as="h2" variant="h2">
                {stock.name}
              </Text>
              <Text variant="muted">
                {stock.description || "Sem descrição"}
              </Text>
              <div className="flex flex-wrap gap-2">
                <Badge>{stockTypeLabels[stock.type]}</Badge>
                <Badge
                  variant={stock.status === "ACTIVE" ? "success" : "default"}
                >
                  {stockStatusLabels[stock.status]}
                </Badge>
                {hasUnit ? (
                  <Badge variant="info">
                    <Link
                      href={`/units/${stock.unitId}`}
                      className="hover:underline"
                    >
                      Loja vinculada
                    </Link>
                  </Badge>
                ) : (
                  <Badge>Sem loja vinculada</Badge>
                )}
              </div>
            </Stack>

            {!hasUnit ? (
              <Alert variant="info" title="Estoque sem loja">
                Este estoque não está vinculado a uma loja. Mesmo assim os
                produtos e saldos ficam listados abaixo.
              </Alert>
            ) : null}

            <Panel>
              <Stack gap="md">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Text as="h3" variant="h3">
                    Produtos ({products.length})
                  </Text>
                  <Link
                    href="/stocks/movements"
                    className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Ir para movimentações
                  </Link>
                </div>
                <Text variant="muted">
                  Quantidade agregada por produto neste estoque
                  {hasUnit ? "." : " (sem loja vinculada)."}
                </Text>
                <StockProductsTable products={products} />
              </Stack>
            </Panel>

            <Panel>
              <Stack gap="md">
                <Text as="h3" variant="h3">
                  Saldos por lote ({items.length})
                </Text>
                <StockInventoryTable items={items} />
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
              : "Não foi possível carregar o estoque."}
          </Alert>
        </Container>
      </main>
    );
  }
}
