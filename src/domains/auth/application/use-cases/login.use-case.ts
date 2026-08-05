import type { AuthRepository } from "@/domains/auth/domain/repositories/auth-repository";
import type { AuthUser } from "@/domains/auth/domain/entities/auth-user";
import { Email } from "@/domains/auth/domain/value-objects/email";

export type LoginCredentials = {
  email: string;
  password: string;
};

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(input: LoginCredentials): Promise<AuthUser> {
    const email = Email.create(input.email);

    if (input.password.trim().length < 6) {
      throw new Error("Password must have at least 6 characters");
    }

    return this.authRepository.login({
      email: email.value,
      password: input.password,
    });
  }
}
