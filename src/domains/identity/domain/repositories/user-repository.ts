import type { User, UserStatus } from "@/domains/identity/domain/entities/user";

export type CreateUserInput = {
  tenantId: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  status?: UserStatus;
};

export interface UserRepository {
  findAll(): Promise<User[]>;
  create(input: CreateUserInput): Promise<User>;
}
