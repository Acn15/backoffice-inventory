export type AuthUser = {
  id: string;
  tenantId: string | null;
  name?: string;
  email: string;
  status?: string;
};
