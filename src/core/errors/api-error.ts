export type ApiErrorBody = {
  statusCode: number;
  timestamp?: string;
  path?: string;
  method?: string;
  message: string | string[];
  error?: string;
};

export class ApiError extends Error {
  readonly statusCode: number;
  readonly path?: string;
  readonly method?: string;
  readonly messages: string[];
  readonly errorName?: string;

  constructor(body: ApiErrorBody) {
    const messages = Array.isArray(body.message)
      ? body.message
      : [body.message];

    super(messages[0] ?? "Unexpected API error");
    this.name = "ApiError";
    this.statusCode = body.statusCode;
    this.path = body.path;
    this.method = body.method;
    this.messages = messages;
    this.errorName = body.error;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isConflict(): boolean {
    return this.statusCode === 409;
  }
}
