function requireEnv(name: "API_URL"): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value.replace(/\/$/, "");
}

/** Variáveis server-only. O browser nunca fala com a Nest diretamente. */
export const env = {
  get apiUrl(): string {
    return requireEnv("API_URL");
  },
  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  },
} as const;
