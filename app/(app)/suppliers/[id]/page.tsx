import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { suppliersContainer } from "@/domains/suppliers/infrastructure/suppliers.container";
import { SupplierForm } from "@/domains/suppliers/presentation/supplier-form";
import { Alert, Container, Panel, Stack, Text } from "@/shared/ui";

type SupplierDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SupplierDetailPage({
  params,
}: SupplierDetailPageProps) {
  const { id } = await params;

  try {
    const profile = await nestServerProfile();
    const tenantId = profile.user.tenantId;
    const supplier = await suppliersContainer.getSupplierUseCase.execute(id);

    if (tenantId && supplier.tenantId !== tenantId) {
      notFound();
    }

    return (
      <main className="py-8">
        <Container>
          <Stack gap="lg">
            <Stack gap="sm">
              <Link
                href="/suppliers"
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                ← Voltar para fornecedores
              </Link>
              <Text as="h2" variant="h2">
                {supplier.name}
              </Text>
              <Text variant="muted">
                {supplier.city ?? "—"}
                {supplier.state ? `/${supplier.state}` : ""} ·{" "}
                {supplier.cnpj ?? "Sem CNPJ"}
              </Text>
            </Stack>

            <Panel>
              <SupplierForm
                tenantId={supplier.tenantId}
                mode="edit"
                initial={supplier}
              />
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
              : "Não foi possível carregar o fornecedor."}
          </Alert>
        </Container>
      </main>
    );
  }
}
