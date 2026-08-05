import { Email } from "@/domains/auth";
import type { User } from "@/domains/identity/domain/entities/user";
import type {
  CreateUserInput,
  UserRepository,
} from "@/domains/identity/domain/repositories/user-repository";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const email = Email.create(input.email);
    const name = input.name.trim();

    if (!name) {
      throw new Error("Name is required");
    }

    if (!input.tenantId.trim()) {
      throw new Error("Tenant is required");
    }

    if (input.password.trim().length < 6) {
      throw new Error("Password must have at least 6 characters");
    }

    return this.userRepository.create({
      ...input,
      name,
      email: email.value,
      phone: input.phone?.trim() || undefined,
    });
  }
}
