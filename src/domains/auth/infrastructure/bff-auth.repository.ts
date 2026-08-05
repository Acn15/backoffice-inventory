import { ApiError } from "@/core/errors/api-error";
import type { AuthUser } from "@/domains/auth/domain/entities/auth-user";
import type {
  AuthRepository,
  LoginInput,
} from "@/domains/auth/domain/repositories/auth-repository";

type SessionResponse = {
  user: AuthUser;
};

type ErrorBody = {
  message?: string | string[];
  statusCode?: number;
};

/**
 * Cliente browser que fala só com as Route Handlers do Next (BFF).
 * Nunca recebe nem armazena JWT.
 */
export class BffAuthRepository implements AuthRepository {
  async login(input: LoginInput): Promise<AuthUser> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "same-origin",
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      throw toApiError(payload, response.status);
    }

    return (payload as SessionResponse).user;
  }

  async logout(): Promise<void> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });

    if (!response.ok && response.status !== 401) {
      const payload: unknown = await response.json().catch(() => null);
      throw toApiError(payload, response.status);
    }
  }

  async getSession(): Promise<AuthUser | null> {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });

    if (response.status === 401) {
      return null;
    }

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      throw toApiError(payload, response.status);
    }

    return (payload as SessionResponse).user;
  }
}

function toApiError(payload: unknown, statusCode: number): ApiError {
  const body = payload as ErrorBody | null;

  return new ApiError({
    statusCode: body?.statusCode ?? statusCode,
    message: body?.message ?? "Unexpected API error",
  });
}
