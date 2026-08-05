import { NextResponse } from "next/server";
import { ApiError } from "@/core/errors/api-error";
import { clearAuthCookiesOnResponse } from "@/domains/auth/infrastructure/cookies/response-cookies";
import { logoutWithNest } from "@/domains/auth/infrastructure/server-auth.service";

export async function POST() {
  try {
    await logoutWithNest();
    const response = NextResponse.json({ message: "Logout successful" });
    clearAuthCookiesOnResponse(response);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      error instanceof ApiError
        ? {
            statusCode: error.statusCode,
            message:
              error.messages.length === 1 ? error.messages[0] : error.messages,
          }
        : { statusCode: 500, message: "Internal server error" },
      { status: error instanceof ApiError ? error.statusCode : 500 },
    );
    clearAuthCookiesOnResponse(response);
    return response;
  }
}
