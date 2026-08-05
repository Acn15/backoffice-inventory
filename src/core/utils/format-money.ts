/** Converte centavos (number da API) para BRL formatado. */
export function formatMoneyFromCents(
  cents: number | null | undefined,
  locale = "pt-BR",
  currency = "BRL",
): string {
  if (cents === null || cents === undefined) {
    return "—";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/** Converte string/number em reais para centavos inteiros. */
export function toCents(value: string | number): number {
  if (typeof value === "number") {
    return Math.round(value * 100);
  }

  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);

  if (Number.isNaN(parsed)) {
    throw new Error("Invalid money value");
  }

  return Math.round(parsed * 100);
}
