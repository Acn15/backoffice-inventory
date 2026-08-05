import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { getCatalogSalePriceCents } from "@/domains/inventory/infrastructure/inventory-lookups";
import { inventoryContainer } from "@/domains/inventory/infrastructure/inventory.container";
import { organizationContainer } from "@/domains/organization/infrastructure/organization.container";
import { EditUnitModal } from "@/domains/organization/presentation/edit-unit-modal";
import {
  UnitProductsTable,
  type UnitProductRow,
} from "@/domains/organization/presentation/unit-products-table";
import { Alert, Container, Panel, Stack, Text } from "@/shared/ui";

type UnitDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { id } = await params;

  try {
    const profile = await nestServerProfile();
    const tenantId = profile.user.tenantId;
    const unit = await organizationContainer.getUnitUseCase.execute(id);

    if (tenantId && unit.tenantId !== tenantId) {
      notFound();
    }

    const balancesResult = tenantId
      ? await inventoryContainer.getUnitProductBalancesUseCase.execute(
          tenantId,
          unit.id,
        )
      : { hasRelatedStocks: false, products: [] };

    const products: UnitProductRow[] = await Promise.all(
      balancesResult.products.map(async (balance) => ({
        ...balance,
        salePriceCents: await getCatalogSalePriceCents(
          balance.productId,
          unit.id,
        ),
      })),
    );

    return (
      <main className="py-8">
        <Container>
          <Stack gap="lg">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <Stack gap="sm">
                <Link
                  href="/units"
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  ← Voltar para lojas
                </Link>
                <Text as="h2" variant="h2">
                  {unit.name}
                </Text>
                <Text variant="muted">
                  {unit.city ?? "—"}
                  {unit.state ? `/${unit.state}` : ""} · {unit.cnpj ?? "Sem CNPJ"}
                </Text>
              </Stack>
              <EditUnitModal unit={unit} />
            </div>

            <Panel>
              <Stack gap="md">
                <Text as="h3" variant="h3">
                  Produtos ({products.length})
                </Text>
                <Text variant="muted">
                  Quantidade agregada dos estoques ativos vinculados a esta loja
                  e preço de venda do catálogo.
                </Text>
                {!balancesResult.hasRelatedStocks ? (
                  <Alert variant="warning" title="Nenhum estoque vinculado">
                    Esta loja ainda não possui estoque relacionado. Cadastre ou
                    vincule um estoque a ela em{" "}
                    <Link
                      href="/stocks"
                      className="font-medium text-[var(--color-primary)] hover:underline"
                    >
                      Estoques
                    </Link>{" "}
                    para visualizar produtos, quantidade e preços.
                  </Alert>
                ) : (
                  <UnitProductsTable products={products} />
                )}
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
              : "Não foi possível carregar a loja."}
          </Alert>
        </Container>
      </main>
    );
  }
}
