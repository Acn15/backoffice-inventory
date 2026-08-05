"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createUserAction,
  type CreateUserActionState,
} from "@/domains/identity/presentation/actions/create-user.action";
import type { UserStatus } from "@/domains/identity/domain/entities/user";
import {
  Alert,
  Button,
  Field,
  Input,
  Select,
  Stack,
  Text,
} from "@/shared/ui";

type CreateUserFormProps = {
  tenantId: string;
};

const initialState: CreateUserActionState = {
  ok: false,
  message: null,
};

export function CreateUserForm({ tenantId }: CreateUserFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<CreateUserActionState>(initialState);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState(initialState);

    startTransition(async () => {
      const result = await createUserAction({
        tenantId,
        name,
        email,
        password,
        phone: phone || undefined,
        status,
      });

      setState(result);

      if (result.ok) {
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setStatus("ACTIVE");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text as="h3" variant="h3">
          Novo usuário
        </Text>

        {state.message ? (
          <Alert variant={state.ok ? "success" : "danger"}>
            {state.message}
          </Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Nome"
            htmlFor="user-name"
            required
            error={state.fieldErrors?.name}
          >
            <Input
              id="user-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Field>

          <Field
            label="E-mail"
            htmlFor="user-email"
            required
            error={state.fieldErrors?.email}
          >
            <Input
              id="user-email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>

          <Field
            label="Senha"
            htmlFor="user-password"
            required
            error={state.fieldErrors?.password}
            hint="Mínimo de 6 caracteres"
          >
            <Input
              id="user-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </Field>

          <Field
            label="Telefone"
            htmlFor="user-phone"
            error={state.fieldErrors?.phone}
          >
            <Input
              id="user-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="11999999999"
            />
          </Field>

          <Field label="Status" htmlFor="user-status">
            <Select
              id="user-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as UserStatus)
              }
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </Select>
          </Field>
        </div>

        <div>
          <Button type="submit" loading={isPending}>
            Criar usuário
          </Button>
        </div>
      </Stack>
    </form>
  );
}
