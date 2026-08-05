export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpRequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  /** When false, skips Authorization header injection. Default: true */
  auth?: boolean;
  /** When false, skips credentials include. Default: true */
  credentials?: boolean;
  /** When true, does not attempt refresh+retry on 401. Default: false */
  skipAuthRefresh?: boolean;
};

export type TokenProvider = {
  getAccessToken: () => string | null | Promise<string | null>;
};

/** Return true when a new access token is available. */
export type UnauthorizedHandler = () => Promise<boolean>;
