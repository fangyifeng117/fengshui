import { payPalToCents } from "@/lib/paypal/money";

const DROP_KEYS = new Set([
  "payer",
  "payment_source",
  "shipping",
  "email_address",
  "phone",
  "phone_number",
  "national_number",
  "address",
  "account_id",
]);

export function redactPayPalPayload(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => redactPayPalPayload(item));
  if (!value || typeof value !== "object") return value;
  const output: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (DROP_KEYS.has(key)) continue;
    output[key] = redactPayPalPayload(child);
  }
  return output;
}

export type ParsedAmount = {
  amountCents: number | null;
  currency: string | null;
  customId: string | null;
  paypalOrderId: string | null;
  captureId: string | null;
  captureStatus: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readMoney(value: unknown): { amountCents: number | null; currency: string | null } {
  const record = asRecord(value);
  if (!record) return { amountCents: null, currency: null };
  const currency = typeof record.currency_code === "string" ? record.currency_code.toUpperCase() : null;
  return { amountCents: payPalToCents(record.value), currency };
}

function firstPurchaseUnit(resource: Record<string, unknown>): Record<string, unknown> | null {
  const units = resource.purchase_units;
  if (!Array.isArray(units) || units.length === 0) return null;
  return asRecord(units[0]);
}

export function parseWebhookEvent(event: unknown): {
  id: string;
  eventType: string;
  resource: Record<string, unknown>;
} | null {
  const record = asRecord(event);
  if (!record) return null;
  if (typeof record.id !== "string" || record.id.trim() === "") return null;
  if (typeof record.event_type !== "string" || record.event_type.trim() === "") return null;
  const resource = asRecord(record.resource);
  if (!resource) return null;
  return { id: record.id, eventType: record.event_type, resource };
}

export function parseApprovedResource(resource: Record<string, unknown>): ParsedAmount & {
  paypalOrderId: string | null;
} {
  const unit = firstPurchaseUnit(resource);
  const money = readMoney(unit?.amount);
  const customId =
    (typeof unit?.custom_id === "string" && unit.custom_id) ||
    (typeof unit?.invoice_id === "string" && unit.invoice_id) ||
    null;
  const paypalOrderId = typeof resource.id === "string" ? resource.id : null;
  return {
    amountCents: money.amountCents,
    currency: money.currency,
    customId,
    paypalOrderId,
    captureId: null,
    captureStatus: null,
  };
}

export function parseCaptureResource(resource: Record<string, unknown>): ParsedAmount {
  const directMoney = readMoney(resource.amount);
  const customFromResource = typeof resource.custom_id === "string" ? resource.custom_id : null;
  const captureId = typeof resource.id === "string" ? resource.id : null;
  const captureStatus = typeof resource.status === "string" ? resource.status.toUpperCase() : null;
  const supplementary = asRecord(resource.supplementary_data);
  const related = supplementary ? asRecord(supplementary.related_ids) : null;
  const paypalOrderId = related && typeof related.order_id === "string" ? related.order_id : null;
  if (directMoney.amountCents != null || customFromResource) {
    return {
      amountCents: directMoney.amountCents,
      currency: directMoney.currency,
      customId: customFromResource,
      paypalOrderId,
      captureId,
      captureStatus,
    };
  }
  const unit = firstPurchaseUnit(resource);
  const captures = unit ? asRecord(unit.payments)?.captures : undefined;
  const firstCapture = Array.isArray(captures) ? asRecord(captures[0]) : null;
  const nestedMoney = readMoney(firstCapture?.amount ?? unit?.amount);
  const customId =
    (typeof firstCapture?.custom_id === "string" && firstCapture.custom_id) ||
    (typeof unit?.custom_id === "string" && unit.custom_id) ||
    (typeof unit?.invoice_id === "string" && unit.invoice_id) ||
    null;
  return {
    amountCents: nestedMoney.amountCents,
    currency: nestedMoney.currency,
    customId,
    paypalOrderId: paypalOrderId ?? (typeof resource.id === "string" ? resource.id : null),
    captureId: typeof firstCapture?.id === "string" ? firstCapture.id : captureId,
    captureStatus:
      typeof firstCapture?.status === "string" ? firstCapture.status.toUpperCase() : captureStatus,
  };
}
