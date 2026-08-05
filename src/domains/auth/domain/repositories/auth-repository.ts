import type { AuthUser } from "@/domains/auth/domain/entities/auth-user";

export type LoginInput = {
  email: string;
  password: string;
};

/** Contrato do cliente (browser → BFF Next). Tokens nunca passam por aqui. */
export interface AuthRepository {
  login(input: LoginInput): Promise<AuthUser>;
  logout(): Promise<void>;
  getSession(): Promise<AuthUser | null>;
}
