"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/core/errors/api-error";
import { useAuth } from "@/domains/auth/presentation/auth-provider";
import {
  Alert,
  Button,
  Field,
  Input,
  Panel,
  Stack,
  Text,
} from "@/shared/ui";

export function LoginForm() {
  const router = useRouter();
  const { login, status } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.messages.join(" "));
      } else if (err instanceof Error) {
        setError(mapClientError(err.message));
      } else {
        setError("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading" || status === "authenticated") {
    return (
      <Panel className="w-full max-w-md">
        <Text variant="muted">Carregando sessão...</Text>
      </Panel>
    );
  }

  return (
    <Panel className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <Stack gap="sm">
            <Text as="h1" variant="h2">
              Entrar
            </Text>
            <Text variant="muted">
              Sessão gerenciada pelo Next.js (BFF) com cookies httpOnly. O
              browser nunca recebe os tokens.
            </Text>
          </Stack>

          {error ? (
            <Alert variant="danger" title="Falha no login">
              {error}
            </Alert>
          ) : null}

          <Field label="E-mail" htmlFor="email" required>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>

          <Field label="Senha" htmlFor="password" required>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </Field>

          <Button type="submit" fullWidth loading={submitting}>
            Entrar
          </Button>
        </Stack>
      </form>
    </Panel>
  );
}

function mapClientError(message: string): string {
  if (message === "Invalid email") {
    return "Informe um e-mail válido.";
  }

  if (message === "Password must have at least 6 characters") {
    return "A senha deve ter no mínimo 6 caracteres.";
  }

  return message;
}
