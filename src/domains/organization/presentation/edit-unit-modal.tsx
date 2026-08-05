"use client";

import { useState } from "react";
import type { Unit } from "@/domains/organization/domain/entities/unit";
import { UnitForm } from "@/domains/organization/presentation/unit-form";
import { Button, Modal } from "@/shared/ui";

type EditUnitModalProps = {
  unit: Unit;
};

export function EditUnitModal({ unit }: EditUnitModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Editar dados
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Editar loja"
        description="Atualize os dados cadastrais desta filial."
      >
        <UnitForm
          tenantId={unit.tenantId}
          mode="edit"
          initial={unit}
          showIntro={false}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
