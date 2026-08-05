"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Unit, UnitStatus } from "@/domains/organization/domain/entities/unit";
import {
  createUnitAction,
  updateUnitAction,
} from "@/domains/organization/presentation/actions/unit.actions";
import {
  Alert,
  Button,
  Field,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@/shared/ui";

type UnitFormProps = {
  tenantId: string;
  mode: "create" | "edit";
  initial?: Unit;
  onSuccess?: () => void;
  showIntro?: boolean;
};

export function UnitForm({
  tenantId,
  mode,
  initial,
  onSuccess,
  showIntro = true,
}: UnitFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [cnpj, setCnpj] = useState(initial?.cnpj ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [state, setState] = useState(initial?.state ?? "");
  const [zipCode, setZipCode] = useState(initial?.zipCode ?? "");
  const [status, setStatus] = useState<UnitStatus>(initial?.status ?? "ACTIVE");
  const [contractEndDate, setContractEndDate] = useState(
    initial?.contractEndDate ?? "",
  );
  const [contractStartDate, setContractStartDate] = useState(
    initial?.contractStartDate ?? "",
  );
  const [contract, setContract] = useState(initial?.contract ?? "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const payload = {
        name,
        description: description || undefined,
        cnpj,
        address,
        city,
        state,
        zipCode,
        status,
        contractEndDate,
        contractStartDate: contractStartDate || undefined,
        contract: contract || undefined,
      };

      const result =
        mode === "create"
          ? await createUnitAction({ tenantId, ...payload })
          : await updateUnitAction({ id: initial!.id, ...payload });

      setOk(result.ok);
      setMessage(result.message);

      if (result.ok) {
        if (mode === "create") {
          setName("");
          setDescription("");
          setCnpj("");
          setAddress("");
          setCity("");
          setState("");
          setZipCode("");
          setStatus("ACTIVE");
          setContractEndDate("");
          setContractStartDate("");
          setContract("");
        }
        onSuccess?.();
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {showIntro ? (
          <>
            <Text as="h3" variant="h3">
              {mode === "create" ? "Nova loja" : "Editar loja"}
            </Text>
            <Text variant="muted">
              A loja (`Unit`) é a filial usada no preço de catálogo e pode ser
              vinculada a um estoque.
            </Text>
          </>
        ) : null}

        {message ? (
          <Alert variant={ok ? "success" : "danger"}>{message}</Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome" htmlFor="unit-name" required>
            <Input
              id="unit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </Field>
          <Field label="Status" htmlFor="unit-status">
            <Select
              id="unit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as UnitStatus)}
            >
              <option value="ACTIVE">Ativa</option>
              <option value="INACTIVE">Inativa</option>
            </Select>
          </Field>
          <Field label="CNPJ" htmlFor="unit-cnpj" required>
            <Input
              id="unit-cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
              minLength={14}
              placeholder="12345678000190"
            />
          </Field>
          <Field label="CEP" htmlFor="unit-zip" required>
            <Input
              id="unit-zip"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              minLength={8}
              placeholder="01310100"
            />
          </Field>
          <Field label="Endereço" htmlFor="unit-address" required className="md:col-span-2">
            <Input
              id="unit-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Field>
          <Field label="Cidade" htmlFor="unit-city" required>
            <Input
              id="unit-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Field>
          <Field label="UF" htmlFor="unit-state" required>
            <Input
              id="unit-state"
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              required
              maxLength={2}
              placeholder="SP"
            />
          </Field>
          <Field label="Início do contrato" htmlFor="unit-contract-start">
            <Input
              id="unit-contract-start"
              type="date"
              value={contractStartDate}
              onChange={(e) => setContractStartDate(e.target.value)}
            />
          </Field>
          <Field label="Fim do contrato" htmlFor="unit-contract-end" required>
            <Input
              id="unit-contract-end"
              type="date"
              value={contractEndDate}
              onChange={(e) => setContractEndDate(e.target.value)}
              required
            />
          </Field>
          <Field label="URL do contrato" htmlFor="unit-contract" className="md:col-span-2">
            <Input
              id="unit-contract"
              type="url"
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Descrição" htmlFor="unit-description" className="md:col-span-2">
            <Textarea
              id="unit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>

        <div>
          <Button type="submit" loading={isPending}>
            {mode === "create" ? "Criar loja" : "Salvar alterações"}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
