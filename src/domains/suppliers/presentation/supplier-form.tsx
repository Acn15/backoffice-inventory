"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  Supplier,
  SupplierStatus,
} from "@/domains/suppliers/domain/entities/supplier";
import {
  createSupplierAction,
  updateSupplierAction,
} from "@/domains/suppliers/presentation/actions/supplier.actions";
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

type SupplierFormProps = {
  tenantId: string;
  mode: "create" | "edit";
  initial?: Supplier;
};

export function SupplierForm({ tenantId, mode, initial }: SupplierFormProps) {
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
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [status, setStatus] = useState<SupplierStatus>(
    initial?.status ?? "ACTIVE",
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const payload = {
        name,
        description: description || undefined,
        cnpj: cnpj || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        phone: phone || undefined,
        email: email || undefined,
        status,
      };

      const result =
        mode === "create"
          ? await createSupplierAction({ tenantId, ...payload })
          : await updateSupplierAction({ id: initial!.id, ...payload });

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
          setPhone("");
          setEmail("");
          setStatus("ACTIVE");
        }
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text as="h3" variant="h3">
          {mode === "create" ? "Novo fornecedor" : "Editar fornecedor"}
        </Text>
        <Text variant="muted">
          Fornecedores são usados nas entradas de estoque e no preço de custo
          planejado por produto.
        </Text>

        {message ? (
          <Alert variant={ok ? "success" : "danger"}>{message}</Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome" htmlFor="supplier-name" required>
            <Input
              id="supplier-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </Field>
          <Field label="Status" htmlFor="supplier-status">
            <Select
              id="supplier-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as SupplierStatus)}
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </Select>
          </Field>
          <Field label="CNPJ" htmlFor="supplier-cnpj">
            <Input
              id="supplier-cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              minLength={14}
              placeholder="12345678000190"
            />
          </Field>
          <Field label="Telefone" htmlFor="supplier-phone">
            <Input
              id="supplier-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </Field>
          <Field label="E-mail" htmlFor="supplier-email">
            <Input
              id="supplier-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="UF" htmlFor="supplier-state">
            <Input
              id="supplier-state"
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              maxLength={2}
              placeholder="SP"
            />
          </Field>
          <Field label="Cidade" htmlFor="supplier-city">
            <Input
              id="supplier-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Field>
          <Field
            label="Endereço"
            htmlFor="supplier-address"
            className="md:col-span-2"
          >
            <Input
              id="supplier-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Field>
          <Field
            label="Descrição"
            htmlFor="supplier-description"
            className="md:col-span-2"
          >
            <Textarea
              id="supplier-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>

        <div>
          <Button type="submit" loading={isPending}>
            {mode === "create" ? "Criar fornecedor" : "Salvar alterações"}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
