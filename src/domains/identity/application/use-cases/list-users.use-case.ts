import type { User } from "@/domains/identity/domain/entities/user";
import type {
  CreateUserInput,
  UserRepository,
} from "@/domains/identity/domain/repositories/user-repository";

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
