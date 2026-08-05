import { env } from "@/core/config/env";
import { ApiError, type ApiErrorBody } from "@/core/errors/api-error";
import type {
  HttpRequestOptions,
  TokenProvider,
  UnauthorizedHandler,
} from "@/core/http/types";

export class HttpClient {
  private unauthorizedHandler?: UnauthorizedHandler;

  constructor(
    private readonly baseUrl: string = env.apiUrl,
    private readonly tokenProvider?: TokenProvider,
    unauthorizedHandler?: UnauthorizedHandler,
  ) {
    this.unauthorizedHandler = unauthorizedHandler;
  }

  setUnauthorizedHandler(handler: UnauthorizedHandler): void {
    this.unauthorizedHandler = handler;
  }

  async request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    try {
      return await this.execute<T>(path, options);
    } catch (error) {
      const shouldRefresh =
        error instanceof ApiError &&
        error.isUnauthorized &&
        options.auth !== false &&
        options.skipAuthRefresh !== true &&
        Boolean(this.unauthorizedHandler);

      if (!shouldRefresh || !this.unauthorizedHandler) {
        throw error;
      }

      const refreshed = await this.unauthorizedHandler();
      if (!refreshed) {
        throw error;
      }

      return this.execute<T>(path, { ...options, skipAuthRefresh: true });
    }
  }

  get<T>(path: string, options?: Omit<HttpRequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<HttpRequestOptions, "method" | "body">,
  ) {
    return this.request<T>(path, { ...options, method: "POST", body });
  }

  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<HttpRequestOptions, "method" | "body">,
  ) {
    return this.request<T>(path, { ...options, method: "PUT", body });
  }

  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<HttpRequestOptions, "method" | "body">,
  ) {
    return this.request<T>(path, { ...options, method: "PATCH", body });
  }

  delete<T>(path: string, options?: Omit<HttpRequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }

  private async execute<T>(
    path: string,
    options: HttpRequestOptions,
  ): Promise<T> {
    const {
      method = "GET",
      body,
      headers,
      signal,
      auth = true,
      credentials = true,
    } = options;

    const requestHeaders = new Headers(headers);

    if (body !== undefined && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }

    if (auth && this.tokenProvider) {
      const accessToken = await this.tokenProvider.getAccessToken();
      if (accessToken) {
        requestHeaders.set("Authorization", `Bearer ${accessToken}`);
      }
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: credentials ? "include" : "same-origin",
      signal,
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
}

function normalizeErrorBody(
  payload: unknown,
  response: Response,
): ApiErrorBody {
  if (isApiErrorBody(payload)) {
    return payload;
  }

  return {
    statusCode: response.status,
    message: response.statusText || "Unexpected API error",
    path: new URL(response.url).pathname,
    method: undefined,
  };
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<ApiErrorBody>;
  return (
    typeof candidate.statusCode === "number" &&
    (typeof candidate.message === "string" || Array.isArray(candidate.message))
  );
}
