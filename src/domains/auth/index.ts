export type { AuthProfile } from "@/domains/auth/domain/entities/auth-profile";
export type { AuthUser } from "@/domains/auth/domain/entities/auth-user";
export type {
  AuthRepository,
  LoginInput,
} from "@/domains/auth/domain/repositories/auth-repository";
export { Email } from "@/domains/auth/domain/value-objects/email";
export {
  LoginUseCase,
  type LoginCredentials,
} from "@/domains/auth/application/use-cases/login.use-case";
export { LogoutUseCase } from "@/domains/auth/application/use-cases/logout.use-case";
export { RestoreSessionUseCase } from "@/domains/auth/application/use-cases/restore-session.use-case";
export { authContainer } from "@/domains/auth/infrastructure/auth.container";
export {
  AuthProvider,
  useAuth,
  LoginForm,
  RequireAuth,
} from "@/domains/auth/presentation";
