"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/core/errors/api-error";
import type { UserStatus } from "@/domains/identity/domain/entities/user";
import { identityContainer } from "@/domains/identity/infrastructure/identity.container";

export type CreateUserActionState = {
  ok: boolean;
  message: string | null;
  fieldErrors?: Partial<
    Record<"name" | "email" | "password" | "phone" | "status", string>
  >;
};

export type CreateUserActionInput = {
  tenantId: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  status?: UserStatus;
};

export async function createUserAction(
  input: CreateUserActionInput,
): Promise<CreateUserActionState> {
  try {
    await identityContainer.createUserUseCase.execute({
      tenantId: input.tenantId,
      name: input.name,
      email: input.email,
      password: input.password,
      phone: input.phone || undefined,
      status: input.status,
    });

    revalidatePath("/users");

    return { ok: true, message: "Usuário criado com sucesso." };
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid email") {
      return {
        ok: false,
        message: null,
        fieldErrors: { email: "Informe um e-mail válido." },
      };
    }

    if (error instanceof Error && error.message === "Name is required") {
      return {
        ok: false,
        message: null,
        fieldErrors: { name: "Informe o nome." },
      };
    }

    if (
      error instanceof Error &&
      error.message === "Password must have at least 6 characters"
    ) {
      return {
        ok: false,
        message: null,
        fieldErrors: { password: "A senha deve ter no mínimo 6 caracteres." },
      };
    }

    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.messages.join(" "),
      };
    }

    return {
      ok: false,
      message: "Não foi possível criar o usuário.",
    };
  }
}
