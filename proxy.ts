import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIES } from "@/domains/auth/infrastructure/cookies/auth-cookies";

const PUBLIC_PATHS = new Set(["/login"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const hasSession =
    request.cookies.has(AUTH_COOKIES.accessToken) ||
    request.cookies.has(AUTH_COOKIES.refreshToken);

  const isPublicPath = PUBLIC_PATHS.has(pathname);

  // /login sempre acessível: cookies podem estar expirados/inválidos
  // e redirecionar para o dashboard criava um loop de "não autorizado".
  if (!hasSession && !isPublicPath && pathname !== "/") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!hasSession && pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
