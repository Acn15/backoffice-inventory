import type { AuthUser } from "@/domains/auth/domain/entities/auth-user";
import type { AuthRepository } from "@/domains/auth/domain/repositories/auth-repository";

export class RestoreSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<AuthUser | null> {
    return this.authRepository.getSession();
  }
}
