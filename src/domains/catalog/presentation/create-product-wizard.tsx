"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  ProductStatus,
  ProductUnit,
} from "@/domains/catalog/domain/entities/product";
import type { ProductCategory } from "@/domains/catalog/domain/entities/product-category";
import { createProductAction } from "@/domains/catalog/presentation/actions/catalog.actions";
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

type CreateProductWizardProps = {
  tenantId: string;
  categories: ProductCategory[];
};

/** Cadastro de produto. Lotes são criados na movimentação de entrada. */
export function CreateProductWizard({
  tenantId,
  categories,
}: CreateProductWizardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [unit, setUnit] = useState<ProductUnit>("UNIT");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProductStatus>("ACTIVE");

  function handleCreateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await createProductAction({
        tenantId,
        categoryId,
        name,
        unit,
        sku: sku || undefined,
        barcode: barcode || undefined,
        description: description || undefined,
        status,
      });
      setOk(result.ok);
      setMessage(result.message);
      if (result.ok) {
        setName("");
        setSku("");
        setBarcode("");
        setDescription("");
        setUnit("UNIT");
        setStatus("ACTIVE");
        setCategoryId(categories[0]?.id ?? "");
        if (result.data?.productId) {
          router.push(`/products/${result.data.productId}`);
        }
        router.refresh();
      }
    });
  }

  if (categories.length === 0) {
    return (
      <Alert variant="warning" title="Sem categorias">
        Crie uma categoria em Produtos → Categorias antes de cadastrar
        produtos.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleCreateProduct}>
      <Stack gap="md">
        <Stack gap="sm">
          <Text as="h3" variant="h3">
            Novo produto
          </Text>
          <Text variant="muted">
            Cadastre o produto no catálogo. O lote é criado na entrada do
            estoque, junto com a quantidade.
          </Text>
        </Stack>

        {message ? (
          <Alert variant={ok ? "success" : "danger"}>{message}</Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome" htmlFor="product-name" required>
            <Input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </Field>
          <Field label="Categoria" htmlFor="product-category" required>
            <Select
              id="product-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Unidade de medida" htmlFor="product-unit" required>
            <Select
              id="product-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as ProductUnit)}
            >
              <option value="UNIT">Unidade</option>
              <option value="KG">Kg</option>
              <option value="G">g</option>
              <option value="L">L</option>
              <option value="ML">ml</option>
              <option value="BOX">Caixa</option>
              <option value="PACKAGE">Pacote</option>
              <option value="M">m</option>
              <option value="CM">cm</option>
            </Select>
          </Field>
          <Field label="Status" htmlFor="product-status">
            <Select
              id="product-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </Select>
          </Field>
          <Field label="SKU" htmlFor="product-sku">
            <Input
              id="product-sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </Field>
          <Field label="Código de barras" htmlFor="product-barcode">
            <Input
              id="product-barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
          </Field>
          <Field
            label="Descrição"
            htmlFor="product-description"
            className="md:col-span-2"
          >
            <Textarea
              id="product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>
        <div>
          <Button type="submit" loading={isPending}>
            Criar produto
          </Button>
        </div>
      </Stack>
    </form>
  );
}
