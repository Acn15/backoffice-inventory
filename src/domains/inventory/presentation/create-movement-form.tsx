"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { Stock } from "@/domains/inventory/domain/entities/stock";
import type { StockMovementType } from "@/domains/inventory/domain/entities/stock-movement";
import type {
  BatchOption,
  ProductOption,
  SupplierOption,
} from "@/domains/inventory/infrastructure/inventory-lookups";
import {
  checkCatalogPriceForStockAction,
  createStockMovementAction,
  listProductBatchesAction,
  type CatalogPriceCheck,
} from "@/domains/inventory/presentation/actions/stock-movement.actions";
import { createBatchAction } from "@/domains/catalog/presentation/actions/catalog.actions";
import { toCents } from "@/core/utils/format-money";
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

type CreateMovementFormProps = {
  tenantId: string;
  userId: string;
  stocks: Stock[];
  products: ProductOption[];
  suppliers: SupplierOption[];
};

function stockFieldsForType(type: StockMovementType): {
  showFrom: boolean;
  showTo: boolean;
  fromRequired: boolean;
  toRequired: boolean;
  showSupplier: boolean;
  showPurchasePrice: boolean;
  showSalePrice: boolean;
  purchaseRequired: boolean;
  saleRequired: boolean;
} {
  switch (type) {
    case "ENTRY":
      return {
        showFrom: false,
        showTo: true,
        fromRequired: false,
        toRequired: true,
        showSupplier: true,
        showPurchasePrice: true,
        showSalePrice: false,
        purchaseRequired: true,
        saleRequired: false,
      };
    case "RETURN":
      return {
        showFrom: false,
        showTo: true,
        fromRequired: false,
        toRequired: true,
        showSupplier: false,
        showPurchasePrice: false,
        showSalePrice: false,
        purchaseRequired: false,
        saleRequired: false,
      };
    case "SALE":
      return {
        showFrom: true,
        showTo: false,
        fromRequired: true,
        toRequired: false,
        showSupplier: false,
        showPurchasePrice: false,
        showSalePrice: true,
        purchaseRequired: false,
        saleRequired: true,
      };
    case "LOSS":
      return {
        showFrom: true,
        showTo: false,
        fromRequired: true,
        toRequired: false,
        showSupplier: false,
        showPurchasePrice: false,
        showSalePrice: false,
        purchaseRequired: false,
        saleRequired: false,
      };
    case "TRANSFER":
      return {
        showFrom: true,
        showTo: true,
        fromRequired: true,
        toRequired: true,
        showSupplier: false,
        showPurchasePrice: false,
        showSalePrice: false,
        purchaseRequired: false,
        saleRequired: false,
      };
    case "ADJUSTMENT":
      return {
        showFrom: true,
        showTo: true,
        fromRequired: false,
        toRequired: false,
        showSupplier: false,
        showPurchasePrice: false,
        showSalePrice: false,
        purchaseRequired: false,
        saleRequired: false,
      };
    default:
      return {
        showFrom: true,
        showTo: true,
        fromRequired: false,
        toRequired: false,
        showSupplier: false,
        showPurchasePrice: false,
        showSalePrice: false,
        purchaseRequired: false,
        saleRequired: false,
      };
  }
}

export function CreateMovementForm({
  tenantId,
  userId,
  stocks,
  products,
  suppliers,
}: CreateMovementFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [catalogCheck, setCatalogCheck] = useState<CatalogPriceCheck | null>(
    null,
  );

  const [type, setType] = useState<StockMovementType>("ENTRY");
  const [fromStockId, setFromStockId] = useState("");
  const [toStockId, setToStockId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [productId, setProductId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [showNewBatch, setShowNewBatch] = useState(false);
  const [newBatchCode, setNewBatchCode] = useState("");
  const [newManufactureDate, setNewManufactureDate] = useState("");
  const [newExpirationDate, setNewExpirationDate] = useState("");
  const [batchMessage, setBatchMessage] = useState<string | null>(null);
  const [batchOk, setBatchOk] = useState(false);

  const fields = stockFieldsForType(type);
  const stocksById = useMemo(
    () => Object.fromEntries(stocks.map((stock) => [stock.id, stock])),
    [stocks],
  );

  useEffect(() => {
    let active = true;

    async function loadBatches() {
      if (!productId) {
        setBatches([]);
        setBatchId("");
        setShowNewBatch(false);
        setBatchMessage(null);
        return;
      }

      setLoadingBatches(true);
      try {
        const result = await listProductBatchesAction(productId);
        if (!active) return;
        const available = result.filter((batch) => batch.status === "AVAILABLE");
        setBatches(available.length > 0 ? available : result);
        setBatchId("");
        setShowNewBatch(false);
        setBatchMessage(null);
      } catch {
        if (!active) return;
        setBatches([]);
        setBatchId("");
      } finally {
        if (active) setLoadingBatches(false);
      }
    }

    void loadBatches();
    return () => {
      active = false;
    };
  }, [productId]);

  async function reloadBatches(selectBatchId?: string) {
    if (!productId) return;
    setLoadingBatches(true);
    try {
      const result = await listProductBatchesAction(productId);
      const available = result.filter((batch) => batch.status === "AVAILABLE");
      const next = available.length > 0 ? available : result;
      setBatches(next);
      if (selectBatchId) {
        setBatchId(selectBatchId);
      }
    } catch {
      setBatches([]);
    } finally {
      setLoadingBatches(false);
    }
  }

  function handleCreateBatch() {
    if (!productId) return;
    setBatchMessage(null);

    if (!newBatchCode.trim() || !newExpirationDate) {
      setBatchOk(false);
      setBatchMessage("Informe o código e a validade do lote.");
      return;
    }

    startTransition(async () => {
      const result = await createBatchAction({
        productId,
        tenantId,
        batchCode: newBatchCode,
        manufactureDate: newManufactureDate || undefined,
        expirationDate: newExpirationDate,
        status: "AVAILABLE",
        supplierId:
          type === "ENTRY" && supplierId ? supplierId : undefined,
      });

      setBatchOk(result.ok);
      setBatchMessage(result.message);

      if (result.ok && result.data?.batchId) {
        setNewBatchCode("");
        setNewManufactureDate("");
        setNewExpirationDate("");
        setShowNewBatch(false);
        await reloadBatches(result.data.batchId);
      }
    });
  }

  useEffect(() => {
    let active = true;

    async function validateCatalogPrice() {
      if (!productId) {
        setCatalogCheck(null);
        return;
      }

      const relevantStockId =
        type === "SALE"
          ? fromStockId
          : type === "ENTRY"
            ? toStockId
            : "";

      if (!relevantStockId || (type !== "SALE" && type !== "ENTRY")) {
        setCatalogCheck(null);
        return;
      }

      const stock = stocksById[relevantStockId];
      const result = await checkCatalogPriceForStockAction({
        productId,
        stockUnitId: stock?.unitId,
        context: type,
      });

      if (!active) return;

      setCatalogCheck(result);
      if (type === "SALE" && result.salePriceReais) {
        setSalePrice(result.salePriceReais);
      }
    }

    void validateCatalogPrice();
    return () => {
      active = false;
    };
  }, [type, productId, fromStockId, toStockId, stocksById]);

  const catalogBlocked =
    Boolean(catalogCheck?.stockHasUnit) &&
    catalogCheck?.hasCatalogPrice === false &&
    (type === "SALE" || type === "ENTRY");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      setOk(false);
      setMessage("Informe uma quantidade válida.");
      return;
    }

    if (fields.showSupplier && !supplierId) {
      setOk(false);
      setMessage("Fornecedor é obrigatório na entrada (ENTRY).");
      return;
    }

    let purchaseUnitPriceCents: string | undefined;
    let saleUnitPriceCents: string | undefined;

    try {
      if (fields.showPurchasePrice && purchasePrice.trim()) {
        purchaseUnitPriceCents = String(toCents(purchasePrice));
      }
      if (fields.showSalePrice && salePrice.trim()) {
        saleUnitPriceCents = String(toCents(salePrice));
      }
    } catch {
      setOk(false);
      setMessage("Preço inválido. Use formato como 3,50.");
      return;
    }

    if (fields.purchaseRequired && !purchaseUnitPriceCents) {
      setOk(false);
      setMessage("Informe o custo unitário da compra.");
      return;
    }

    if (fields.saleRequired && !saleUnitPriceCents) {
      setOk(false);
      setMessage("Informe o preço de venda desta operação.");
      return;
    }

    if (catalogBlocked) {
      setOk(false);
      setMessage(
        "Cadastre o preço deste produto na loja do estoque antes de continuar.",
      );
      return;
    }

    startTransition(async () => {
      const result = await createStockMovementAction({
        tenantId,
        createdById: userId,
        type,
        fromStockId: fields.showFrom ? fromStockId || undefined : undefined,
        toStockId: fields.showTo ? toStockId || undefined : undefined,
        supplierId: fields.showSupplier ? supplierId || undefined : undefined,
        description: description || undefined,
        note: note || undefined,
        items: [
          {
            productId,
            batchId,
            quantity: qty,
            purchaseUnitPriceCents,
            saleUnitPriceCents,
          },
        ],
      });

      setOk(result.ok);
      setMessage(result.message);

      if (result.ok) {
        setDescription("");
        setNote("");
        setQuantity("1");
        setPurchasePrice("");
        setSalePrice("");
        setProductId("");
        setBatchId("");
        setFromStockId("");
        setToStockId("");
        setSupplierId("");
        setType("ENTRY");
        setCatalogCheck(null);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Stack gap="sm">
          <Text as="h3" variant="h3">
            Nova movimentação
          </Text>
          <Text variant="muted">
            Na entrada: escolha o produto, o <strong>lote do produto</strong> e
            a quantidade que entra no estoque. O lote é cadastrado no produto;
            a movimentação só referencia esse lote.
          </Text>
        </Stack>

        {message ? (
          <Alert variant={ok ? "success" : "danger"}>{message}</Alert>
        ) : null}

        {catalogCheck?.message ? (
          <Alert
            variant={catalogCheck.severity ?? "info"}
            title={
              catalogBlocked
                ? "Preço do produto na loja obrigatório"
                : undefined
            }
          >
            <Stack gap="sm">
              <Text variant="muted" className="text-inherit">
                {catalogCheck.message}
              </Text>
              {catalogBlocked && productId ? (
                <Link
                  href={`/products/${productId}`}
                  className="text-sm font-medium underline"
                >
                  Abrir produto e cadastrar preço por loja
                </Link>
              ) : null}
            </Stack>
          </Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tipo" htmlFor="movement-type" required>
            <Select
              id="movement-type"
              value={type}
              onChange={(event) => {
                setType(event.target.value as StockMovementType);
                setPurchasePrice("");
                setSalePrice("");
                setCatalogCheck(null);
              }}
            >
              <option value="ENTRY">Entrada (compra)</option>
              <option value="SALE">Venda</option>
              <option value="TRANSFER">Transferência</option>
              <option value="ADJUSTMENT">Ajuste</option>
              <option value="LOSS">Perda</option>
              <option value="RETURN">Devolução</option>
            </Select>
          </Field>

          <Field label="Descrição" htmlFor="movement-description">
            <Input
              id="movement-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>

          {fields.showSupplier ? (
            <Field label="Fornecedor" htmlFor="movement-supplier" required>
              <Select
                id="movement-supplier"
                value={supplierId}
                onChange={(event) => setSupplierId(event.target.value)}
                required
              >
                <option value="">Selecione</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}

          {fields.showFrom ? (
            <Field
              label="Estoque de origem (onde sai)"
              htmlFor="movement-from"
              required={fields.fromRequired}
              hint={
                type === "SALE"
                  ? "A loja vinculada a este estoque define o preço sugerido do catálogo."
                  : undefined
              }
            >
              <Select
                id="movement-from"
                value={fromStockId}
                onChange={(event) => setFromStockId(event.target.value)}
                required={fields.fromRequired}
              >
                <option value="">Selecione</option>
                {stocks.map((stock) => (
                  <option key={stock.id} value={stock.id}>
                    {stock.name}
                    {stock.unitId ? "" : " (sem loja vinculada)"}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}

          {fields.showTo ? (
            <Field
              label="Estoque destino (onde entra)"
              htmlFor="movement-to"
              required={fields.toRequired}
            >
              <Select
                id="movement-to"
                value={toStockId}
                onChange={(event) => setToStockId(event.target.value)}
                required={fields.toRequired}
              >
                <option value="">Selecione</option>
                {stocks.map((stock) => (
                  <option key={stock.id} value={stock.id}>
                    {stock.name}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}

          <Field label="Produto" htmlFor="movement-product" required>
            <Select
              id="movement-product"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              required
            >
              <option value="">Selecione</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                  {product.sku ? ` (${product.sku})` : ""}
                </option>
              ))}
            </Select>
          </Field>

          <div className="md:col-span-2">
            <Stack gap="md">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Lote do produto"
                  htmlFor="movement-batch"
                  required
                  hint={
                    loadingBatches
                      ? "Carregando lotes do produto..."
                      : productId
                        ? "Selecione um lote existente ou crie um novo abaixo."
                        : "Selecione o produto para listar os lotes dele."
                  }
                >
                  <Select
                    id="movement-batch"
                    value={batchId}
                    onChange={(event) => setBatchId(event.target.value)}
                    required
                    disabled={!productId || loadingBatches}
                  >
                    <option value="">
                      {!productId
                        ? "Selecione um produto"
                        : loadingBatches
                          ? "Carregando..."
                          : batches.length === 0
                            ? "Nenhum lote — crie um novo"
                            : "Selecione o lote"}
                    </option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.batchCode}
                        {batch.expirationDate
                          ? ` · val. ${String(batch.expirationDate).slice(0, 10)}`
                          : ""}
                      </option>
                    ))}
                  </Select>
                </Field>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!productId || isPending}
                    onClick={() => {
                      setShowNewBatch((current) => !current);
                      setBatchMessage(null);
                    }}
                  >
                    {showNewBatch ? "Cancelar novo lote" : "Novo lote"}
                  </Button>
                </div>
              </div>

              {showNewBatch ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
                  <Stack gap="md">
                    <Text as="h3" variant="h3">
                      Novo lote do produto
                    </Text>
                    <Text variant="muted">
                      O lote fica cadastrado no produto e já fica selecionado
                      nesta movimentação.
                    </Text>
                    {batchMessage ? (
                      <Alert variant={batchOk ? "success" : "danger"}>
                        {batchMessage}
                      </Alert>
                    ) : null}
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field
                        label="Código do lote"
                        htmlFor="new-batch-code"
                        required
                      >
                        <Input
                          id="new-batch-code"
                          value={newBatchCode}
                          onChange={(e) => setNewBatchCode(e.target.value)}
                          required
                        />
                      </Field>
                      <Field label="Fabricação" htmlFor="new-batch-mfg">
                        <Input
                          id="new-batch-mfg"
                          type="date"
                          value={newManufactureDate}
                          onChange={(e) =>
                            setNewManufactureDate(e.target.value)
                          }
                        />
                      </Field>
                      <Field
                        label="Validade"
                        htmlFor="new-batch-exp"
                        required
                      >
                        <Input
                          id="new-batch-exp"
                          type="date"
                          value={newExpirationDate}
                          onChange={(e) => setNewExpirationDate(e.target.value)}
                          required
                        />
                      </Field>
                    </div>
                    <div>
                      <Button
                        type="button"
                        loading={isPending}
                        disabled={!productId}
                        onClick={handleCreateBatch}
                      >
                        Criar lote e selecionar
                      </Button>
                    </div>
                  </Stack>
                </div>
              ) : null}
            </Stack>
          </div>

          <Field
            label="Quantidade"
            htmlFor="movement-qty"
            required
            hint={
              type === "ENTRY"
                ? "Quantidade deste produto que entra no estoque neste lote."
                : undefined
            }
          >
            <Input
              id="movement-qty"
              type="number"
              min="0.001"
              step="0.001"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
          </Field>

          {fields.showPurchasePrice ? (
            <Field
              label="Custo unitário da compra (R$)"
              htmlFor="movement-purchase"
              required={fields.purchaseRequired}
              hint="Valor real pago nesta entrada — fica no histórico do item."
            >
              <Input
                id="movement-purchase"
                value={purchasePrice}
                onChange={(event) => setPurchasePrice(event.target.value)}
                placeholder="3,50"
                required={fields.purchaseRequired}
              />
            </Field>
          ) : null}

          {fields.showSalePrice ? (
            <Field
              label="Preço de venda desta operação (R$)"
              htmlFor="movement-sale"
              required={fields.saleRequired}
              hint="Pode diferir do preço planejado do catálogo."
            >
              <Input
                id="movement-sale"
                value={salePrice}
                onChange={(event) => setSalePrice(event.target.value)}
                placeholder="5,99"
                required={fields.saleRequired}
              />
            </Field>
          ) : null}

          <Field label="Observação" htmlFor="movement-note" className="md:col-span-2">
            <Textarea
              id="movement-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
        </div>

        {type === "ENTRY" && suppliers.length === 0 ? (
          <Alert variant="warning" title="Sem fornecedores">
            Cadastre um fornecedor antes de lançar entradas.
          </Alert>
        ) : null}

        {products.length === 0 ? (
          <Alert variant="warning" title="Sem produtos">
            Cadastre produtos no catálogo antes de movimentar.
          </Alert>
        ) : null}

        <div>
          <Button
            type="submit"
            loading={isPending}
            disabled={
              products.length === 0 ||
              stocks.length === 0 ||
              catalogBlocked ||
              !batchId
            }
          >
            Criar movimentação
          </Button>
        </div>
      </Stack>
    </form>
  );
}
