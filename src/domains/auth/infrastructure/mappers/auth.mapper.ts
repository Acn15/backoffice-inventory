import type { AuthProfile } from "@/domains/auth/domain/entities/auth-profile";
import type { AuthUser } from "@/domains/auth/domain/entities/auth-user";

type LoginUserDto = {
  id: string;
  tenantId: string | null;
  name: string;
  email: string;
  status?: string;
};

type ProfileResponseDto = {
  user: {
    userId: string;
    tenantId: string | null;
    email: string;
  };
};

export function mapLoginUserToAuthUser(user: LoginUserDto): AuthUser {
  return {
    id: user.id,
    tenantId: user.tenantId,
    name: user.name,
    email: user.email,
    status: user.status,
  };
}

export function mapProfileResponseToAuthProfile(
  dto: ProfileResponseDto,
): AuthProfile {
  return {
    userId: dto.user.userId,
    tenantId: dto.user.tenantId,
    email: dto.user.email,
  };
}

export function mapAuthProfileToAuthUser(profile: AuthProfile): AuthUser {
  return {
    id: profile.userId,
    tenantId: profile.tenantId,
    email: profile.email,
  };
}
