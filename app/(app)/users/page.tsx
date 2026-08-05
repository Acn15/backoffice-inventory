import { ApiError } from "@/core/errors/api-error";
import { nestServerProfile } from "@/core/http/nest-server-client";
import { CreateUserForm } from "@/domains/identity/presentation/create-user-form";
import { UsersTable } from "@/domains/identity/presentation/users-table";
import { identityContainer } from "@/domains/identity/infrastructure/identity.container";
import {
  Alert,
  Container,
  Panel,
  Separator,
  Stack,
  Text,
} from "@/shared/ui";

export default async function UsersPage() {
  let tenantId: string | null = null;
  let loadError: string | null = null;
  let users: Awaited<
    ReturnType<typeof identityContainer.listUsersUseCase.execute>
  > = [];

  try {
    const profile = await nestServerProfile();
    tenantId = profile.user.tenantId;

    const allUsers = await identityContainer.listUsersUseCase.execute();
    users = tenantId
      ? allUsers.filter((user) => user.tenantId === tenantId)
      : allUsers;
  } catch (error) {
    if (error instanceof ApiError) {
      loadError = error.messages.join(" ");
    } else {
      loadError = "Não foi possível carregar os usuários.";
    }
  }

  return (
    <main className="py-8">
      <Container>
        <Stack gap="lg">
          <Stack gap="sm">
            <Text as="h2" variant="h2">
              Usuários
            </Text>
            <Text variant="muted">
              Liste e cadastre usuários do seu tenant.
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
                  <CreateUserForm tenantId={tenantId} />
                ) : (
                  <Alert variant="warning" title="Tenant não encontrado">
                    Seu usuário não está vinculado a um tenant. Não é possível
                    criar novos usuários.
                  </Alert>
                )}
              </Panel>

              <Separator />

              <Panel>
                <Stack gap="md">
                  <Text as="h3" variant="h3">
                    Lista ({users.length})
                  </Text>
                  <UsersTable users={users} />
                </Stack>
              </Panel>
            </>
          )}
        </Stack>
      </Container>
    </main>
  );
}
