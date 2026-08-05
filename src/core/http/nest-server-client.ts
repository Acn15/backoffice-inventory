import { env } from "@/core/config/env";
import { ApiError, type ApiErrorBody } from "@/core/errors/api-error";
import type { HttpMethod } from "@/core/http/types";
import {
  clearAuthCookies,
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from "@/domains/auth/infrastructure/cookies/cookie-store";

type NestRequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
  skipAuthRefresh?: boolean;
};

type NestTokensDto = {
  access_token: string;
  refresh_token: string;
};

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Cliente server-only para a Nest API.
 * Lê/grava tokens nos cookies httpOnly do Next (BFF).
 */
export async function nestServerRequest<T>(
  path: string,
  options: NestRequestOptions = {},
): Promise<T> {
  try {
    return await executeNestRequest<T>(path, options);
  } catch (error) {
    const shouldRefresh =
      error instanceof ApiError &&
      error.isUnauthorized &&
      options.auth !== false &&
      options.skipAuthRefresh !== true;

    if (!shouldRefresh) {
      throw error;
    }

    const refreshed = await refreshAuthCookies();
    if (!refreshed) {
      throw error;
    }

    return executeNestRequest<T>(path, {
      ...options,
      skipAuthRefresh: true,
    });
  }
}

export async function nestServerLogin(
  email: string,
  password: string,
): Promise<NestTokensDto & { user: unknown }> {
  return executeNestRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
    skipAuthRefresh: true,
  });
}

export async function nestServerRefresh(
  refreshToken: string,
): Promise<NestTokensDto & { user: unknown }> {
  return executeNestRequest("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    auth: false,
    skipAuthRefresh: true,
  });
}

export async function nestServerLogout(): Promise<void> {
  await nestServerRequest<void>("/auth/logout", {
    method: "POST",
    skipAuthRefresh: true,
  });
}

export async function nestServerProfile(): Promise<{
  user: { userId: string; tenantId: string | null; email: string };
}> {
  return nestServerRequest("/auth/profile");
}

async function refreshAuthCookies(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = await getRefreshTokenFromCookies();
      if (!refreshToken) {
        await clearAuthCookies();
        return false;
      }

      try {
        const tokens = await nestServerRefresh(refreshToken);
        await setAuthCookies(tokens.access_token, tokens.refresh_token);
        return true;
      } catch {
        await clearAuthCookies();
        return false;
      }
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

async function executeNestRequest<T>(
  path: string,
  options: NestRequestOptions,
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = true,
  } = options;

  const headers = new Headers({
    Accept: "application/json",
  });

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const accessToken = await getAccessTokenFromCookies();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(normalizeErrorBody(payload, response));
  }

  return payload as T;
}

function normalizeErrorBody(
  payload: unknown,
  response: Response,
): ApiErrorBody {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "statusCode" in payload &&
    "message" in payload
  ) {
    return payload as ApiErrorBody;
  }

  return {
    statusCode: response.status,
    message: response.statusText || "Unexpected API error",
    path: new URL(response.url).pathname,
  };
}
