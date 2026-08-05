"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ProductCategoryStatus } from "@/domains/catalog/domain/entities/product-category";
import { createCategoryAction } from "@/domains/catalog/presentation/actions/catalog.actions";
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

type CreateCategoryFormProps = {
  tenantId: string;
};

export function CreateCategoryForm({ tenantId }: CreateCategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProductCategoryStatus>("ACTIVE");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await createCategoryAction({
        tenantId,
        name,
        description: description || undefined,
        status,
      });
      setOk(result.ok);
      setMessage(result.message);
      if (result.ok) {
        setName("");
        setDescription("");
        setStatus("ACTIVE");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text as="h3" variant="h3">
          Nova categoria
        </Text>
        {message ? (
          <Alert variant={ok ? "success" : "danger"}>{message}</Alert>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome" htmlFor="category-name" required>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </Field>
          <Field label="Status" htmlFor="category-status">
            <Select
              id="category-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as ProductCategoryStatus)
              }
            >
              <option value="ACTIVE">Ativa</option>
              <option value="INACTIVE">Inativa</option>
            </Select>
          </Field>
          <Field
            label="Descrição"
            htmlFor="category-description"
            className="md:col-span-2"
          >
            <Textarea
              id="category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>
        <div>
          <Button type="submit" loading={isPending}>
            Criar categoria
          </Button>
        </div>
      </Stack>
    </form>
  );
}
