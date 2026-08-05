"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Product, ProductStatus, ProductUnit } from "@/domains/catalog/domain/entities/product";
import type { ProductCategory } from "@/domains/catalog/domain/entities/product-category";
import { updateProductAction } from "@/domains/catalog/presentation/actions/catalog.actions";
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

type UpdateProductFormProps = {
  product: Product;
  categories: ProductCategory[];
};

export function UpdateProductForm({
  product,
  categories,
}: UpdateProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [name, setName] = useState(product.name);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [unit, setUnit] = useState<ProductUnit>(product.unit);
  const [sku, setSku] = useState(product.sku ?? "");
  const [barcode, setBarcode] = useState(product.barcode ?? "");
  const [description, setDescription] = useState(product.description ?? "");
  const [status, setStatus] = useState<ProductStatus>(product.status);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await updateProductAction({
        id: product.id,
        name,
        categoryId,
        unit,
        sku: sku || undefined,
        barcode: barcode || undefined,
        description: description || undefined,
        status,
      });
      setOk(result.ok);
      setMessage(result.message);
      if (result.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text as="h3" variant="h3">
          Editar produto
        </Text>
        {message ? (
          <Alert variant={ok ? "success" : "danger"}>{message}</Alert>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome" htmlFor="edit-product-name" required>
            <Input
              id="edit-product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
          <Field label="Categoria" htmlFor="edit-product-category" required>
            <Select
              id="edit-product-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Unidade" htmlFor="edit-product-unit">
            <Select
              id="edit-product-unit"
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
          <Field label="Status" htmlFor="edit-product-status">
            <Select
              id="edit-product-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </Select>
          </Field>
          <Field label="SKU" htmlFor="edit-product-sku">
            <Input id="edit-product-sku" value={sku} onChange={(e) => setSku(e.target.value)} />
          </Field>
          <Field label="Código de barras" htmlFor="edit-product-barcode">
            <Input
              id="edit-product-barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
          </Field>
          <Field label="Descrição" htmlFor="edit-product-description" className="md:col-span-2">
            <Textarea
              id="edit-product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>
        <div>
          <Button type="submit" loading={isPending}>
            Salvar alterações
          </Button>
        </div>
      </Stack>
    </form>
  );
}
