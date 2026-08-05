import type { AuthUser } from "@/domains/auth/domain/entities/auth-user";
import {
  nestServerLogin,
  nestServerLogout,
  nestServerProfile,
} from "@/core/http/nest-server-client";
import { clearAuthCookies } from "@/domains/auth/infrastructure/cookies/cookie-store";
import { mapLoginUserToAuthUser } from "@/domains/auth/infrastructure/mappers/auth.mapper";

type NestLoginUser = {
  id: string;
  tenantId: string | null;
  name: string;
  email: string;
  status?: string;
};

export type AuthSessionResult = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export async function loginWithNest(
  email: string,
  password: string,
): Promise<AuthSessionResult> {
  const bundle = await nestServerLogin(email, password);

  return {
    user: mapLoginUserToAuthUser(bundle.user as NestLoginUser),
    accessToken: bundle.access_token,
    refreshToken: bundle.refresh_token,
  };
}

export async function logoutWithNest(): Promise<void> {
  try {
    await nestServerLogout();
  } finally {
    await clearAuthCookies();
  }
}

export async function resolveSessionFromCookies(): Promise<AuthUser | null> {
  try {
    const profile = await nestServerProfile();
    return {
      id: profile.user.userId,
      tenantId: profile.user.tenantId,
      email: profile.user.email,
    };
  } catch {
    await clearAuthCookies();
    return null;
  }
}
