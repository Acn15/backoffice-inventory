import type { UnitStatus } from "@/domains/organization/domain/entities/unit";

export const unitStatusLabels: Record<UnitStatus, string> = {
  ACTIVE: "Ativa",
  INACTIVE: "Inativa",
};
