import type { NextResponse } from "next/server";
import { env } from "@/core/config/env";
import {
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  AUTH_COOKIES,
  getAuthCookieOptions,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/domains/auth/infrastructure/cookies/auth-cookies";

export function applyAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
): void {
  const isProduction = env.isProduction;

  response.cookies.set(
    AUTH_COOKIES.accessToken,
    accessToken,
    getAuthCookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS, isProduction),
  );
  response.cookies.set(
    AUTH_COOKIES.refreshToken,
    refreshToken,
    getAuthCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS, isProduction),
  );
}

export function clearAuthCookiesOnResponse(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIES.accessToken, "", {
    ...getAuthCookieOptions(0, env.isProduction),
    maxAge: 0,
  });
  response.cookies.set(AUTH_COOKIES.refreshToken, "", {
    ...getAuthCookieOptions(0, env.isProduction),
    maxAge: 0,
  });
}
