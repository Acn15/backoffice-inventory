import type { AuthRepository } from "@/domains/auth/domain/repositories/auth-repository";

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
