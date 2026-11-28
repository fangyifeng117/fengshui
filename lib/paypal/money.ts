export function centsToPayPal(cents: number): string {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error("invalid_cents");
  }
  const dollars = Math.floor(cents / 100);
  const remainder = cents % 100;
  return `${dollars}.${remainder.toString().padStart(2, "0")}`;
}

export function payPalToCents(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d+\.\d{2}$/.test(value)) return null;
  const [dollars, cents] = value.split(".");
  if (!dollars || cents == null) return null;
  const amount = Number(dollars) * 100 + Number(cents);
  if (!Number.isSafeInteger(amount)) return null;
  return amount;
}
