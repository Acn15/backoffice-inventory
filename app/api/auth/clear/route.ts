import { NextResponse } from "next/server";
import { clearAuthCookiesOnResponse } from "@/domains/auth/infrastructure/cookies/response-cookies";
import { clearAuthCookies } from "@/domains/auth/infrastructure/cookies/cookie-store";

/**
 * Limpa cookies de sessão sem depender da Nest.
 * Útil quando o token está inválido e o usuário fica preso.
 */
export async function POST() {
  await clearAuthCookies();
  const response = NextResponse.json({ message: "Cookies cleared" });
  clearAuthCookiesOnResponse(response);
  return response;
}
