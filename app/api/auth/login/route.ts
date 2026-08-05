import { NextResponse } from "next/server";
import { ApiError } from "@/core/errors/api-error";
import { Email } from "@/domains/auth/domain/value-objects/email";
import { applyAuthCookies } from "@/domains/auth/infrastructure/cookies/response-cookies";
import { loginWithNest } from "@/domains/auth/infrastructure/server-auth.service";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const emailRaw = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    const email = Email.create(emailRaw);

    if (password.trim().length < 6) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Password must have at least 6 characters",
        },
        { status: 400 },
      );
    }

    const session = await loginWithNest(email.value, password);
    const response = NextResponse.json({ user: session.user });
    applyAuthCookies(response, session.accessToken, session.refreshToken);
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid email") {
      return NextResponse.json(
        { statusCode: 400, message: "Invalid email" },
        { status: 400 },
      );
    }

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          statusCode: error.statusCode,
          message: error.messages.length === 1 ? error.messages[0] : error.messages,
          error: error.errorName,
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { statusCode: 500, message: "Internal server error" },
      { status: 500 },
    );
  }
}
