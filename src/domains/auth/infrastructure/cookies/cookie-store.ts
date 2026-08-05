import { cookies } from "next/headers";
import { env } from "@/core/config/env";
import {
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  AUTH_COOKIES,
  getAuthCookieOptions,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/domains/auth/infrastructure/cookies/auth-cookies";

export async function getAccessTokenFromCookies(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(AUTH_COOKIES.accessToken)?.value;
}

export async function getRefreshTokenFromCookies(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(AUTH_COOKIES.refreshToken)?.value;
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const jar = await cookies();
  const isProduction = env.isProduction;

  jar.set(
    AUTH_COOKIES.accessToken,
    accessToken,
    getAuthCookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS, isProduction),
  );
  jar.set(
    AUTH_COOKIES.refreshToken,
    refreshToken,
    getAuthCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS, isProduction),
  );
}

export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(AUTH_COOKIES.accessToken);
  jar.delete(AUTH_COOKIES.refreshToken);
}
