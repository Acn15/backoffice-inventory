import type { User, UserStatus } from "@/domains/identity/domain/entities/user";

export type UserResponseDto = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export function mapUserResponseToUser(dto: UserResponseDto): User {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    name: dto.name,
    email: dto.email,
    phone: dto.phone ?? undefined,
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
