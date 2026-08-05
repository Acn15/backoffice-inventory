import { nestServerRequest } from "@/core/http/nest-server-client";
import type { User } from "@/domains/identity/domain/entities/user";
import type {
  CreateUserInput,
  UserRepository,
} from "@/domains/identity/domain/repositories/user-repository";
import {
  mapUserResponseToUser,
  type UserResponseDto,
} from "@/domains/identity/infrastructure/mappers/user.mapper";

export class NestUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const response = await nestServerRequest<UserResponseDto[]>("/users");
    return response.map(mapUserResponseToUser);
  }

  async create(input: CreateUserInput): Promise<User> {
    const response = await nestServerRequest<UserResponseDto>("/users", {
      method: "POST",
      body: input,
    });
    return mapUserResponseToUser(response);
  }
}
