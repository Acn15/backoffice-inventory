export type UserStatus = "ACTIVE" | "INACTIVE";

export type User = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};
