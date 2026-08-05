"use client";

import { useState } from "react";
import { UnitForm } from "@/domains/organization/presentation/unit-form";
import { Button, Modal } from "@/shared/ui";

type CreateUnitModalProps = {
  tenantId: string;
};

export function CreateUnitModal({ tenantId }: CreateUnitModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Nova loja</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova loja"
        description="Cadastre uma filial para preço de catálogo e vínculo com estoques."
      >
        <UnitForm
          tenantId={tenantId}
          mode="create"
          showIntro={false}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
