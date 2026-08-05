import { LoginUseCase } from "@/domains/auth/application/use-cases/login.use-case";
import { LogoutUseCase } from "@/domains/auth/application/use-cases/logout.use-case";
import { RestoreSessionUseCase } from "@/domains/auth/application/use-cases/restore-session.use-case";
import { BffAuthRepository } from "@/domains/auth/infrastructure/bff-auth.repository";

const authRepository = new BffAuthRepository();

/** Container do browser — só fala com o BFF Next (`/api/auth/*`). */
export const authContainer = {
  authRepository,
  loginUseCase: new LoginUseCase(authRepository),
  logoutUseCase: new LogoutUseCase(authRepository),
  restoreSessionUseCase: new RestoreSessionUseCase(authRepository),
} as const;
