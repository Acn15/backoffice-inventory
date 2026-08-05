import { NextResponse } from "next/server";
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
} from "@/domains/auth/infrastructure/cookies/cookie-store";
import {
  applyAuthCookies,
  clearAuthCookiesOnResponse,
} from "@/domains/auth/infrastructure/cookies/response-cookies";
import { resolveSessionFromCookies } from "@/domains/auth/infrastructure/server-auth.service";

export async function GET() {
  const accessBefore = await getAccessTokenFromCookies();
  const refreshBefore = await getRefreshTokenFromCookies();

  const user = await resolveSessionFromCookies();

  if (!user) {
    const response = NextResponse.json(
      { statusCode: 401, message: "Unauthenticated" },
      { status: 401 },
    );
    clearAuthCookiesOnResponse(response);
    return response;
  }

  const response = NextResponse.json({ user });

  // Se o nest client rotacionou tokens via cookies(), espelha no response.
  const accessAfter = await getAccessTokenFromCookies();
  const refreshAfter = await getRefreshTokenFromCookies();

  if (
    accessAfter &&
    refreshAfter &&
    (accessAfter !== accessBefore || refreshAfter !== refreshBefore)
  ) {
    applyAuthCookies(response, accessAfter, refreshAfter);
  }

  return response;
}
