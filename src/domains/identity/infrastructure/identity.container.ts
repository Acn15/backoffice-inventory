import { CreateUserUseCase } from "@/domains/identity/application/use-cases/create-user.use-case";
import { ListUsersUseCase } from "@/domains/identity/application/use-cases/list-users.use-case";
import { NestUserRepository } from "@/domains/identity/infrastructure/nest-user.repository";

const userRepository = new NestUserRepository();

/** Container server-side do domínio identity. */
export const identityContainer = {
  userRepository,
  listUsersUseCase: new ListUsersUseCase(userRepository),
  createUserUseCase: new CreateUserUseCase(userRepository),
} as const;
